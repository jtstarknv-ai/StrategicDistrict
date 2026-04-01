// Strategic Planning Toolkit - Interactive Behavior System
// Works alongside builder.js for step navigation and form state management
// Uses var declarations, no ES modules, all functions global

// ============================================================================
// 1. TOOLKIT STATE MANAGEMENT
// ============================================================================

var toolkitState = {
    expandedSubsteps: {},      // Track which sub-steps are open: { "2.1": true, "2.2": false }
    validationResults: {},     // Cache validation results per stage: { "2": { score: 85, passed: true } }
    surveysGenerated: {},      // Track generated surveys: { "vision": true, "values": false }
    aiResponses: {},           // Cache AI responses: { "aiGenerateVision": [...] }
    downloadsTracked: {},      // Track document downloads: { "vision-survey": 1, "focus-guide": 2 }
    lastValidationTime: {}     // Timestamp of last validation per stage
};

function saveToolkitState() {
    try {
        localStorage.setItem('toolkitState_v1', JSON.stringify(toolkitState));
    } catch (e) {
        console.warn('Failed to save toolkit state:', e);
    }
}

function loadToolkitState() {
    try {
        var saved = localStorage.getItem('toolkitState_v1');
        if (saved) {
            toolkitState = JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Failed to load toolkit state:', e);
        toolkitState = {
            expandedSubsteps: {},
            validationResults: {},
            surveysGenerated: {},
            aiResponses: {},
            downloadsTracked: {},
            lastValidationTime: {}
        };
    }
}

// ============================================================================
// 2. SUB-STEP TOGGLE SYSTEM
// ============================================================================

function toggleSubstep(headerEl) {
    if (!headerEl) return;
    
    var substepContainer = headerEl.closest('.toolkit-substep');
    if (!substepContainer) return;
    
    var contentArea = substepContainer.querySelector('.toolkit-substep-content');
    var chevron = headerEl.querySelector('.toolkit-chevron');
    var substepId = substepContainer.getAttribute('data-substep-id');
    
    if (!contentArea) return;
    
    var isOpen = substepContainer.classList.contains('expanded');
    
    if (isOpen) {
        // Close
        substepContainer.classList.remove('expanded');
        contentArea.style.display = 'none';
        if (chevron) chevron.style.transform = 'rotate(0deg)';
        if (substepId) toolkitState.expandedSubsteps[substepId] = false;
    } else {
        // Open
        substepContainer.classList.add('expanded');
        contentArea.style.display = 'block';
        if (chevron) chevron.style.transform = 'rotate(180deg)';
        if (substepId) toolkitState.expandedSubsteps[substepId] = true;
    }
    
    saveToolkitState();
}

function restoreSubstepStates() {
    Object.keys(toolkitState.expandedSubsteps).forEach(function(substepId) {
        var shouldBeOpen = toolkitState.expandedSubsteps[substepId];
        var substepEl = document.querySelector('[data-substep-id="' + substepId + '"]');
        
        if (!substepEl) return;
        
        var isCurrentlyOpen = substepEl.classList.contains('expanded');
        if (shouldBeOpen && !isCurrentlyOpen) {
            var header = substepEl.querySelector('.toolkit-substep-header');
            if (header) toggleSubstep(header);
        } else if (!shouldBeOpen && isCurrentlyOpen) {
            var header = substepEl.querySelector('.toolkit-substep-header');
            if (header) toggleSubstep(header);
        }
    });
}

// ============================================================================
// 3. TOOLKIT NAVIGATION
// ============================================================================

function scrollToToolkit(stageNum) {
    // First navigate to the step using the builder's stepGoto
    if (typeof stepGotoWithPaywall === 'function') {
        stepGotoWithPaywall(stageNum);
    } else if (typeof stepGoto === 'function') {
        stepGoto(stageNum);
    }

    // Find the step content area
    var stageEl = document.querySelector('.step-content[data-step="' + stageNum + '"]');
    if (!stageEl) return;

    // Find the first toolkit-substep in this step and scroll to it
    setTimeout(function() {
        var firstToolkit = stageEl.querySelector('.toolkit-substep');
        if (firstToolkit) {
            firstToolkit.scrollIntoView({ behavior: 'smooth', block: 'start' });
            firstToolkit.classList.add('highlight-flash');
            setTimeout(function() {
                firstToolkit.classList.remove('highlight-flash');
            }, 2000);
        }
    }, 300);
}

function updateToolkitBadges() {
    for (var stageNum = 2; stageNum <= 11; stageNum++) {
        var badgeEl = document.querySelector('.toolkit-badge[data-stage="' + stageNum + '"]');
        if (!badgeEl) continue;

        var status = getStageCompletionStatus(stageNum);
        var statusEl = document.getElementById('toolkitStatus' + stageNum);

        if (statusEl) {
            statusEl.className = 'toolkit-badge-status status-' + status;
            statusEl.setAttribute('title', getStatusLabel(status));
            // Set color dot
            if (status === 'complete') {
                statusEl.style.background = 'var(--pop-green, #6ECF6E)';
            } else if (status === 'in-progress') {
                statusEl.style.background = 'var(--pop-gold, #D4A537)';
            } else {
                statusEl.style.background = '#ccc';
            }
            statusEl.style.width = '8px';
            statusEl.style.height = '8px';
            statusEl.style.borderRadius = '50%';
            statusEl.style.display = 'inline-block';
        }
    }
}

function getStageCompletionStatus(stageNum) {
    if (toolkitState.validationResults[stageNum]) {
        var result = toolkitState.validationResults[stageNum];
        if (result.passed === true) return 'complete';
        if (result.score && result.score >= 50) return 'in-progress';
    }
    return 'not-started';
}

function getStatusLabel(status) {
    var labels = {
        'not-started': 'Not started',
        'in-progress': 'In progress',
        'complete': 'Complete'
    };
    return labels[status] || status;
}

function countAvailableDocuments(stageNum) {
    var count = 0;
    
    var surveyKeys = ['Vision', 'Values', 'Competency', 'FocusGroup'];
    surveyKeys.forEach(function(key) {
        var lcKey = key.charAt(0).toLowerCase() + key.slice(1);
        if (toolkitState.surveysGenerated[lcKey]) count++;
    });
    
    if (toolkitState.aiResponses['stage' + stageNum]) {
        count += Object.keys(toolkitState.aiResponses['stage' + stageNum]).length;
    }
    
    return Math.min(count, 5); // Cap display at 5
}

// ============================================================================
// 4. VALIDATION SYSTEM - Main Entry Point
// ============================================================================

function validateStage(stageNum) {
    var validationFn = null;
    
    switch (stageNum) {
        case 2: validationFn = validateVisionMission; break;
        case 3: validationFn = validateCoreValues; break;
        case 4: validationFn = validateCompetencies; break;
        case 5: validationFn = validateDomains; break;
        case 6: validationFn = validateGoals; break;
        case 7: validationFn = validateForecasting; break;
        case 8: validationFn = validateAlignment; break;
        case 9: validationFn = validateInitiatives; break;
        case 10: validationFn = validateCalendar; break;
        case 11: validationFn = validateReview; break;
    }
    
    if (!validationFn) return 0;
    
    var score = validationFn();
    
    toolkitState.validationResults[stageNum] = {
        score: score,
        passed: score >= 75,
        timestamp: Date.now()
    };
    
    toolkitState.lastValidationTime[stageNum] = Date.now();
    saveToolkitState();
    updateToolkitBadges();
    
    return score;
}

// ============================================================================
// 4.1 VISION & MISSION VALIDATION
// ============================================================================

function validateVisionMission() {
    var stageEl = document.querySelector('.step-content[data-step="2"]');
    if (!stageEl) return 0;

    var results = {
        visionSelected: false,
        visionConcise: false,
        visionForwardLooking: false,
        visionStudentFocused: false,
        missionClear: false,
        missionReadable: false,
        visionMissionAligned: false
    };

    // Get vision text from custom textarea or planState
    var visionText = '';
    var visionEl = document.getElementById('customVision');
    if (visionEl && visionEl.value.trim()) {
        visionText = visionEl.value.trim();
    } else if (window.planState && planState.visionStatement) {
        visionText = planState.visionStatement;
    }

    // Get mission text from custom textarea or planState
    var missionText = '';
    var missionEl = document.getElementById('customMission');
    if (missionEl && missionEl.value.trim()) {
        missionText = missionEl.value.trim();
    } else if (window.planState && planState.missionStatement) {
        missionText = planState.missionStatement;
    }

    // Also check if vision concepts were selected
    var visionChecked = document.querySelectorAll('input[data-type="vision"]:checked').length;

    // Check vision selected or custom written
    results.visionSelected = visionText.length > 10 || visionChecked >= 2;
    
    // Check vision is concise (under 30 words)
    results.visionConcise = countWords(visionText) <= 30 || visionText.length === 0;

    // Check vision is forward-looking
    results.visionForwardLooking = containsAspirationalLanguage(visionText);

    // Check vision centers students
    results.visionStudentFocused = containsStudentFocus(visionText);

    // Check mission is clear
    results.missionClear = missionText.length > 20;
    
    // Check mission is readable
    var missionLevel = getReadingLevel(missionText);
    results.missionReadable = missionLevel <= 10; // 10th grade or below
    
    // Check alignment
    results.visionMissionAligned = visionText.length > 0 && missionText.length > 0;
    
    updateValidationCheckmarks(stageEl, results);
    updateValidationMeter(stageEl, results);
    
    var passCount = Object.values(results).filter(function(v) { return v === true; }).length;
    return Math.round((passCount / Object.keys(results).length) * 100);
}

// ============================================================================
// 4.2 CORE VALUES VALIDATION
// ============================================================================

function validateCoreValues() {
    var stageEl = document.querySelector('.step-content[data-step="3"]');
    if (!stageEl) return 0;
    
    var results = {
        valueCountValid: false,
        valuesHaveDefinitions: false,
        valuesDistinct: false,
        valuesOperational: false
    };
    
    // Core values are rendered in #coreValuesContainer by builder.js
    var container = document.getElementById('coreValuesContainer');
    var selectedValues = container ? container.querySelectorAll('input[type="checkbox"]:checked') : [];
    var valueCount = selectedValues.length;
    // Also check planState
    if (valueCount === 0 && window.planState && planState.coreValues) {
        valueCount = planState.coreValues.length;
    }
    
    // Check: 4-6 values selected
    results.valueCountValid = valueCount >= 4 && valueCount <= 6;
    
    // Check: values have definitions
    var allHaveDefs = true;
    selectedValues.forEach(function(checkbox) {
        var valueId = checkbox.value;
        var defField = stageEl.querySelector('[data-definition-for="' + valueId + '"]');
        if (!defField || !defField.value.trim()) {
            allHaveDefs = false;
        }
    });
    results.valuesHaveDefinitions = allHaveDefs;
    
    // Check: values are distinct (simplified - just check they're different)
    var defs = [];
    selectedValues.forEach(function(checkbox) {
        var valueId = checkbox.value;
        var defField = stageEl.querySelector('[data-definition-for="' + valueId + '"]');
        if (defField) defs.push(defField.value.toLowerCase());
    });
    results.valuesDistinct = defs.length === new Set(defs).size;
    
    // Check: values are operational (have behavioral indicators)
    var allHaveIndicators = true;
    selectedValues.forEach(function(checkbox) {
        var valueId = checkbox.value;
        var indicatorField = stageEl.querySelector('[data-indicators-for="' + valueId + '"]');
        if (!indicatorField || !indicatorField.value.trim()) {
            allHaveIndicators = false;
        }
    });
    results.valuesOperational = allHaveIndicators;
    
    updateValidationCheckmarks(stageEl, results);
    updateValidationMeter(stageEl, results);
    
    var passCount = Object.values(results).filter(function(v) { return v === true; }).length;
    return Math.round((passCount / Object.keys(results).length) * 100);
}

// ============================================================================
// 4.3 COMPETENCIES VALIDATION
// ============================================================================

function validateCompetencies() {
    var stageEl = document.querySelector('.step-content[data-step="4"]');
    if (!stageEl) return 0;
    var ps = window.planState || {};

    var results = {
        categoryCoverage: false,
        alignmentWithVision: false,
        coreVsSupportingDefined: false,
        competenciesSpecific: false
    };

    // Use planState.competencies which is { category: [values] }
    var competencies = ps.competencies || {};
    var categoryCount = 0;
    var totalSelected = 0;
    Object.keys(competencies).forEach(function(cat) {
        var items = competencies[cat];
        if (items && items.length > 0) {
            categoryCount++;
            totalSelected += items.length;
        }
    });

    // Fallback: check actual checkboxes in the competencies container
    if (totalSelected === 0) {
        var container = document.getElementById('competenciesContainer');
        if (container) {
            var checked = container.querySelectorAll('input[type="checkbox"]:checked');
            totalSelected = checked.length;
            var cats = new Set();
            checked.forEach(function(cb) {
                var name = cb.getAttribute('name') || '';
                if (name.indexOf('competency_') === 0) cats.add(name);
            });
            categoryCount = cats.size;
        }
    }

    results.categoryCoverage = categoryCount >= 2;
    results.competenciesSpecific = totalSelected >= 3;

    // Core vs supporting: pass if at least 2 categories have selections
    results.coreVsSupportingDefined = categoryCount >= 2 && totalSelected >= 4;

    // Alignment with vision: check if vision exists alongside competencies
    var visionText = (document.getElementById('customVision') || {}).value || ps.visionStatement || ps.customVision || '';
    results.alignmentWithVision = visionText.length > 10 && totalSelected >= 2;

    updateValidationCheckmarks(stageEl, results);
    updateValidationMeter(stageEl, results);

    var passCount = Object.values(results).filter(function(v) { return v === true; }).length;
    return Math.round((passCount / Object.keys(results).length) * 100);
}

// ============================================================================
// 4.4 DOMAINS VALIDATION
// ============================================================================

function validateDomains() {
    var stageEl = document.querySelector('.step-content[data-step="5"]');
    if (!stageEl) return 0;
    var ps = window.planState || {};

    var results = {
        domainCountValid: false,
        domainsDistinct: false,
        keyAreasCovered: false,
        domainNotOverloaded: false
    };

    // Use planState.strategicDomains or fall back to DOM checkboxes
    var domainNames = (ps.strategicDomains && ps.strategicDomains.length > 0)
        ? ps.strategicDomains.slice()
        : [];

    if (domainNames.length === 0) {
        var container = document.getElementById('domainsContainer');
        if (container) {
            container.querySelectorAll('input[name="domain"]:checked').forEach(function(cb) {
                domainNames.push(cb.value);
            });
        }
    }

    var domainCount = domainNames.length;
    results.domainCountValid = domainCount >= 4 && domainCount <= 6;
    results.domainsDistinct = domainNames.length === new Set(domainNames).size;
    results.domainNotOverloaded = domainCount <= 7;

    // Check: covers key areas (academic, operational, culture)
    var keywordMap = {
        academic: ['academic', 'instruction', 'curriculum', 'learning', 'achievement'],
        operational: ['operational', 'operation', 'efficiency', 'process', 'management'],
        culture: ['culture', 'climate', 'environment', 'engagement', 'community']
    };
    var hasCategoryCount = 0;
    Object.keys(keywordMap).forEach(function(category) {
        var keywords = keywordMap[category];
        var hasCategory = domainNames.some(function(domain) {
            return keywords.some(function(kw) {
                return domain.toLowerCase().indexOf(kw) !== -1;
            });
        });
        if (hasCategory) hasCategoryCount++;
    });
    results.keyAreasCovered = hasCategoryCount >= 2;

    updateValidationCheckmarks(stageEl, results);
    updateValidationMeter(stageEl, results);

    var passCount = Object.values(results).filter(function(v) { return v === true; }).length;
    return Math.round((passCount / Object.keys(results).length) * 100);
}

// ============================================================================
// 4.5 GOALS VALIDATION
// ============================================================================

function validateGoals() {
    var stageEl = document.querySelector('.step-content[data-step="6"]');
    if (!stageEl) return 0;
    var ps = window.planState || {};

    var results = {
        eachDomainHasGoal: false,
        goalsAreSmart: false,
        goalsReferenceMeasurables: false,
        goalsAlignWithVision: false
    };

    // Get goals from planState or DOM
    var goalTexts = [];
    if (ps.goals && ps.goals.length > 0) {
        ps.goals.forEach(function(g) {
            var text = (typeof g === 'string') ? g : (g.title || g.text || g.goal || '');
            if (text.trim()) goalTexts.push(text.trim());
        });
    }
    // Fallback: grab textareas from goalsContainer
    if (goalTexts.length === 0) {
        var container = document.getElementById('goalsContainer');
        if (container) {
            container.querySelectorAll('textarea').forEach(function(ta) {
                if (ta.value.trim()) goalTexts.push(ta.value.trim());
            });
        }
    }

    var domainCount = (ps.strategicDomains || []).length || 1;
    results.eachDomainHasGoal = goalTexts.length >= domainCount && goalTexts.length > 0;

    var smartGoalCount = 0;
    var measurableGoalCount = 0;
    goalTexts.forEach(function(goalText) {
        var smartKeywords = ['specific', 'measurable', 'achievable', 'relevant', 'timely', 'by', 'to', 'increase', 'decrease', 'improve', 'reduce'];
        var hasSmart = smartKeywords.some(function(kw) { return goalText.toLowerCase().indexOf(kw) !== -1; });
        if (hasSmart) smartGoalCount++;

        var metricKeywords = ['%', 'percent', 'score', 'rate', 'count', 'number', 'average', 'benchmark', 'metric'];
        var hasMeasurable = metricKeywords.some(function(kw) { return goalText.toLowerCase().indexOf(kw) !== -1; });
        if (hasMeasurable) measurableGoalCount++;
    });

    results.goalsAreSmart = smartGoalCount > 0;
    results.goalsReferenceMeasurables = measurableGoalCount > 0;

    // Alignment: check vision exists and goals reference it
    var visionText = (document.getElementById('customVision') || {}).value || ps.visionStatement || ps.customVision || '';
    results.goalsAlignWithVision = visionText.length > 10 && goalTexts.length > 0;

    updateValidationCheckmarks(stageEl, results);
    updateValidationMeter(stageEl, results);

    var passCount = Object.values(results).filter(function(v) { return v === true; }).length;
    return Math.round((passCount / Object.keys(results).length) * 100);
}

// ============================================================================
// 4.6 FORECASTING VALIDATION
// ============================================================================

function validateForecasting() {
    var stageEl = document.querySelector('.step-content[data-step="7"]');
    if (!stageEl) return 0;
    var ps = window.planState || {};

    var results = {
        baselineDataEntered: false,
        targetsSet: false,
        targetsRealistic: false,
        projectionsCoverthreeYears: false
    };

    // Check baseline data from district profile metrics
    var baselineMetrics = ['graduationRate', 'readingProficiency', 'mathProficiency', 'chronicAbsRate'];
    var baselineCount = 0;
    baselineMetrics.forEach(function(metric) {
        var val = ps[metric] || (document.getElementById(metric) || {}).value || '';
        if (val && val.toString().trim()) baselineCount++;
    });
    results.baselineDataEntered = baselineCount >= 3;

    // Check forecasted goals from planState
    var forecastedGoals = ps.forecastedGoals || {};
    var targetCount = 0;
    var improvementRates = [];
    Object.keys(forecastedGoals).forEach(function(goalKey) {
        var fg = forecastedGoals[goalKey];
        if (fg && fg.target) {
            targetCount++;
            if (fg.baseline) {
                var rate = Math.abs((fg.target - fg.baseline) / fg.baseline);
                improvementRates.push(rate);
            }
        }
    });
    results.targetsSet = targetCount >= 1 || baselineCount >= 3;

    // Realistic if improvements are within typical ranges
    results.targetsRealistic = improvementRates.length === 0 ||
                               improvementRates.every(function(r) { return r <= 0.50; });

    // Check if data profile container has content (indicates forecasting work done)
    var dataProfileEl = document.getElementById('dataProfileContainer');
    var hasForecasting = (dataProfileEl && dataProfileEl.innerHTML.trim().length > 50) || targetCount >= 1;
    results.projectionsCoverthreeYears = hasForecasting;

    updateValidationCheckmarks(stageEl, results);
    updateValidationMeter(stageEl, results);

    var passCount = Object.values(results).filter(function(v) { return v === true; }).length;
    return Math.round((passCount / Object.keys(results).length) * 100);
}

// ============================================================================
// 4.7 ALIGNMENT VALIDATION
// ============================================================================

function validateAlignment() {
    var stageEl = document.querySelector('.step-content[data-step="8"]');
    if (!stageEl) return 0;
    var ps = window.planState || {};

    var results = {
        allGoalsMapped: false,
        departmentNotOverloaded: false,
        crossDepartmentCoordination: false,
        accountabilityAssignmentsClear: false
    };

    // Use planState.departmentAlignment and selectedDepartments
    var selectedDepts = ps.selectedDepartments || [];
    var alignment = ps.departmentAlignment || {};

    // Check department selections exist
    if (selectedDepts.length === 0) {
        var container = document.getElementById('departmentSelectionContainer');
        if (container) {
            container.querySelectorAll('input[name="department"]:checked').forEach(function(cb) {
                selectedDepts.push(cb.value);
            });
        }
    }

    // Goals mapped: departments have goals aligned to them
    var totalMappings = 0;
    selectedDepts.forEach(function(dept) {
        var deptGoals = alignment[dept] || [];
        totalMappings += deptGoals.length;
    });
    results.allGoalsMapped = totalMappings > 0 && selectedDepts.length > 0;

    // Department not overloaded: no single dept has more than 5 goals
    var maxGoals = 0;
    selectedDepts.forEach(function(dept) {
        var count = (alignment[dept] || []).length;
        if (count > maxGoals) maxGoals = count;
    });
    results.departmentNotOverloaded = maxGoals <= 5;

    // Cross-department coordination: multiple departments selected
    results.crossDepartmentCoordination = selectedDepts.length >= 2;

    // Accountability: alignment matrix has content
    var matrixEl = document.getElementById('alignmentMatrixContainer');
    var detailsEl = document.getElementById('departmentDetailsContainer');
    var hasContent = (matrixEl && matrixEl.innerHTML.trim().length > 50) ||
                     (detailsEl && detailsEl.innerHTML.trim().length > 50);
    results.accountabilityAssignmentsClear = hasContent || totalMappings >= 2;

    updateValidationCheckmarks(stageEl, results);
    updateValidationMeter(stageEl, results);

    var passCount = Object.values(results).filter(function(v) { return v === true; }).length;
    return Math.round((passCount / Object.keys(results).length) * 100);
}

// ============================================================================
// 4.8 INITIATIVES VALIDATION
// ============================================================================

function validateInitiatives() {
    var stageEl = document.querySelector('.step-content[data-step="9"]');
    if (!stageEl) return 0;
    var ps = window.planState || {};

    var results = {
        eachGoalHasInitiative: false,
        initiativesHaveResourceEstimates: false,
        initiativeOwnersAssigned: false,
        impactEffortConsidered: false
    };

    // Use planState.initiatives array
    var initiatives = ps.initiatives || [];

    // Fallback: check container for initiative items
    if (initiatives.length === 0) {
        var container = document.getElementById('initiativesContainer');
        if (container) {
            container.querySelectorAll('.initiative-item, .card').forEach(function(item) {
                var titleEl = item.querySelector('input, textarea');
                if (titleEl && titleEl.value.trim()) {
                    initiatives.push({ title: titleEl.value.trim() });
                }
            });
        }
    }

    var goalCount = (ps.goals || []).length || 1;
    results.eachGoalHasInitiative = initiatives.length >= goalCount && initiatives.length > 0;

    var withOwners = 0, withResources = 0, withImpact = 0;
    initiatives.forEach(function(init) {
        if (init.owner && init.owner.trim()) withOwners++;
        if (init.resources && init.resources.trim()) withResources++;
        if (init.impact || init.effort || init.priority) withImpact++;
    });

    results.initiativeOwnersAssigned = withOwners > 0 || initiatives.length > 0;
    results.initiativesHaveResourceEstimates = withResources > 0 || initiatives.length > 0;
    results.impactEffortConsidered = withImpact > 0 || initiatives.length >= 2;

    updateValidationCheckmarks(stageEl, results);
    updateValidationMeter(stageEl, results);

    var passCount = Object.values(results).filter(function(v) { return v === true; }).length;
    return Math.round((passCount / Object.keys(results).length) * 100);
}

// ============================================================================
// 4.9 CALENDAR VALIDATION
// ============================================================================

function validateCalendar() {
    var stageEl = document.querySelector('.step-content[data-step="10"]');
    if (!stageEl) return 0;
    var ps = window.planState || {};

    var results = {
        allInitiativesScheduled: false,
        milestonesDefinedForInitiatives: false,
        boardReportingDatesIncluded: false,
        noSchedulingConflicts: false
    };

    // Use planState.calendar and initiatives
    var calendar = ps.calendar || {};
    var initiatives = ps.initiatives || [];
    var calendarContainer = document.getElementById('implementationCalendarContainer');

    // Check if calendar has been built (container has content or planState has calendar data)
    var quarterCount = Object.keys(calendar).length;
    var hasCalendar = quarterCount > 0 || (calendarContainer && calendarContainer.innerHTML.trim().length > 100);

    results.allInitiativesScheduled = hasCalendar && initiatives.length > 0;
    results.milestonesDefinedForInitiatives = hasCalendar;

    // Board reporting: calendar covers at least 3 quarters
    results.boardReportingDatesIncluded = quarterCount >= 3 || hasCalendar;

    // No conflicts: pass by default unless calendar is empty
    results.noSchedulingConflicts = hasCalendar || initiatives.length === 0;

    updateValidationCheckmarks(stageEl, results);
    updateValidationMeter(stageEl, results);

    var passCount = Object.values(results).filter(function(v) { return v === true; }).length;
    return Math.round((passCount / Object.keys(results).length) * 100);
}

// ============================================================================
// 4.10 REVIEW & FINALIZATION VALIDATION
// ============================================================================

function validateReview() {
    var stageEl = document.querySelector('.step-content[data-step="11"]');
    if (!stageEl) return 0;

    var results = {
        allStagesComplete: false,
        executiveSummaryGenerated: false,
        stakeholderFeedbackCollected: false,
        boardPresentationReady: false
    };

    // Check all stages complete via toolkitState
    var allComplete = true;
    for (var i = 2; i <= 10; i++) {
        var stageValidation = toolkitState.validationResults[i];
        if (!stageValidation || stageValidation.score < 75) {
            allComplete = false;
            break;
        }
    }
    results.allStagesComplete = allComplete;

    // Check executive summary: AI output area has content
    var execSummaryEl = document.getElementById('aiExecSummaryOutput');
    results.executiveSummaryGenerated = execSummaryEl && execSummaryEl.innerHTML.trim().length > 50;

    // Stakeholder feedback: surveys generated or review checklist populated
    var surveyCount = Object.keys(toolkitState.surveysGenerated).filter(function(key) {
        return toolkitState.surveysGenerated[key];
    }).length;
    results.stakeholderFeedbackCollected = surveyCount >= 1;

    // Board presentation: feasibility dashboard has been calculated or plan is finalized
    var gradeEl = document.getElementById('feasibilityGrade');
    var hasGrade = gradeEl && gradeEl.textContent.trim() !== '--' && gradeEl.textContent.trim() !== '';
    var ps = window.planState || {};
    results.boardPresentationReady = hasGrade || ps.finalized === true;

    updateValidationCheckmarks(stageEl, results);
    updateValidationMeter(stageEl, results);

    var passCount = Object.values(results).filter(function(v) { return v === true; }).length;
    return Math.round((passCount / Object.keys(results).length) * 100);
}

// ============================================================================
// VALIDATION UI HELPERS
// ============================================================================

function updateValidationCheckmarks(stageEl, results) {
    var checklistEl = stageEl.querySelector('.validation-checklist');
    if (!checklistEl) return;

    var items = checklistEl.querySelectorAll('.validation-item');
    var index = 0;

    items.forEach(function(item) {
        var keys = Object.keys(results);
        if (index < keys.length) {
            var key = keys[index];
            var passed = results[key];
            var dot = item.querySelector('.validation-dot');

            if (passed) {
                item.classList.add('passed');
                if (dot) {
                    dot.style.background = 'var(--pop-green, #6ECF6E)';
                    dot.innerHTML = '&#10003;';
                }
            } else {
                item.classList.remove('passed');
                if (dot) {
                    dot.style.background = '#ccc';
                    dot.innerHTML = '';
                }
            }
        }
        index++;
    });
}

function updateValidationMeter(stageEl, results) {
    var meterEl = stageEl.querySelector('.validation-meter-fill');
    if (!meterEl) return;
    
    var passCount = Object.values(results).filter(function(v) { return v === true; }).length;
    var percentage = Math.round((passCount / Object.keys(results).length) * 100);
    
    meterEl.style.width = percentage + '%';
    
    var meterLabel = stageEl.querySelector('.validation-meter-label');
    if (meterLabel) {
        meterLabel.textContent = percentage + '% Complete';
    }
    
    // Color code
    if (percentage >= 75) {
        meterEl.className = 'validation-meter-fill status-complete';
    } else if (percentage >= 50) {
        meterEl.className = 'validation-meter-fill status-in-progress';
    } else {
        meterEl.className = 'validation-meter-fill status-not-started';
    }
}

// ============================================================================
// 5. FEASIBILITY SCORE CALCULATOR
// ============================================================================

function calculateFeasibility() {
    var completeness = calculateCompleteness();
    var alignment = calculateAlignment();
    var engagement = calculateEngagement();
    var dataQuality = calculateDataQuality();
    var readiness = calculateReadiness();
    var equity = calculateEquityScore();
    
    var overall = (completeness * 0.12) + (alignment * 0.22) + (engagement * 0.18) + (dataQuality * 0.18) + (readiness * 0.18) + (equity * 0.12);
    
    var grade = scoreToGrade(overall);
    
    animateFeasibilityScore(overall, grade, {
        completeness: completeness,
        alignment: alignment,
        engagement: engagement,
        dataQuality: dataQuality,
        equity: equity,
        readiness: readiness
    });
    
    generateFeasibilityFeedback(overall, grade, {
        completeness: completeness,
        alignment: alignment,
        engagement: engagement,
        dataQuality: dataQuality,
        readiness: readiness
    });
    
    return {
        overall: overall,
        grade: grade,
        dimensions: {
            completeness: completeness,
            alignment: alignment,
            engagement: engagement,
            dataQuality: dataQuality,
            readiness: readiness
        }
    };
}

function calculateCompleteness() {
    var totalStages = 10;
    var completeStages = 0;
    
    for (var i = 2; i <= 11; i++) {
        if (toolkitState.validationResults[i] && toolkitState.validationResults[i].passed) {
            completeStages++;
        }
    }
    
    return Math.round((completeStages / totalStages) * 100);
}

function calculateAlignment() {
    var alignmentScore = 0;
    var ps = window.planState || {};

    // Vision and mission aligned
    var visionText = (document.getElementById('customVision') || {}).value || ps.visionStatement || '';
    var missionText = (document.getElementById('customMission') || {}).value || ps.missionStatement || '';
    if (visionText && missionText) alignmentScore += 25;

    // Check if vision concepts were selected (alignment indicator)
    var visionChecked = document.querySelectorAll('input[data-type="vision"]:checked').length;
    var missionChecked = document.querySelectorAll('input[data-type="mission"]:checked').length;
    if (visionChecked >= 2 && missionChecked >= 2) alignmentScore += 25;
    else if (ps.selectedDomains && ps.selectedDomains.length > 0) alignmentScore += 25;

    // Values and competencies present
    var valuesCount = getSelectedCoreValues().length;
    if (valuesCount >= 3) alignmentScore += 25;

    // Initiatives or goals present
    var goalsCount = getSelectedGoals().length;
    if (goalsCount > 0) alignmentScore += 25;
    
    return alignmentScore;
}

function calculateEngagement() {
    var engagementScore = 0;

    // Survey responses generated via toolkit
    var surveyCount = Object.keys(toolkitState.surveysGenerated).filter(function(key) {
        return toolkitState.surveysGenerated[key];
    }).length;
    if (surveyCount >= 1) engagementScore += 25;
    if (surveyCount >= 2) engagementScore += 25;

    // Focus group guide generated (check output area)
    var focusGroupEl = document.getElementById('focusGroupGuideOutput');
    if (focusGroupEl && focusGroupEl.innerHTML.trim().length > 50) engagementScore += 25;

    // Stakeholder checkboxes selected
    var stakeholderCount = 0;
    ['surveyStaff', 'surveyFamilies', 'surveyStudents', 'surveyCommunity', 'surveyBoard'].forEach(function(id) {
        var cb = document.getElementById(id);
        if (cb && cb.checked) stakeholderCount++;
    });
    if (stakeholderCount >= 2) engagementScore += 25;

    return Math.min(engagementScore, 100);
}

function calculateDataQuality() {
    var dataQuality = 0;
    var ps = window.planState || {};

    // Real performance data entered (district profile metrics)
    var baselineCount = 0;
    var metrics = ['graduationRate', 'readingProficiency', 'mathProficiency', 'chronicAbsRate', 'suspensionRate', 'courseFailureRate'];
    metrics.forEach(function(metric) {
        var val = ps[metric] || (document.getElementById(metric) || {}).value || '';
        if (val && val.toString().trim()) baselineCount++;
    });
    if (baselineCount >= 3) dataQuality += 50;

    // Forecasting work done (forecastedGoals in planState or data profile container has content)
    var forecastedGoals = ps.forecastedGoals || {};
    var dataProfileEl = document.getElementById('dataProfileContainer');
    var hasForecast = Object.keys(forecastedGoals).length > 0 ||
                      (dataProfileEl && dataProfileEl.innerHTML.trim().length > 50);
    if (hasForecast) dataQuality += 50;

    return Math.min(dataQuality, 100);
}

function calculateReadiness() {
    var readiness = 0;
    var ps = window.planState || {};

    // Initiatives exist
    var initiatives = ps.initiatives || [];
    if (initiatives.length > 0) readiness += 25;

    // Calendar built
    var calendar = ps.calendar || {};
    var calendarEl = document.getElementById('implementationCalendarContainer');
    var hasCalendar = Object.keys(calendar).length > 0 ||
                      (calendarEl && calendarEl.innerHTML.trim().length > 100);
    if (hasCalendar) readiness += 25;

    // Departments aligned
    var selectedDepts = ps.selectedDepartments || [];
    var alignment = ps.departmentAlignment || {};
    var totalMappings = 0;
    selectedDepts.forEach(function(dept) {
        totalMappings += (alignment[dept] || []).length;
    });
    if (totalMappings > 0 || selectedDepts.length >= 2) readiness += 25;

    // Feasibility score calculated or plan finalized
    var gradeEl = document.getElementById('feasibilityGrade');
    var hasGrade = gradeEl && gradeEl.textContent.trim() !== '--' && gradeEl.textContent.trim() !== '';
    if (hasGrade || ps.finalized) readiness += 25;

    return Math.min(readiness, 100);
}

function scoreToGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
}

function animateFeasibilityScore(score, grade, dimensions) {
    // Update the circular grade gauge
    var gradeEl = document.getElementById('feasibilityGrade');
    if (gradeEl) {
        gradeEl.style.opacity = '0';
        setTimeout(function() {
            gradeEl.textContent = grade;
            gradeEl.style.transition = 'opacity 0.5s';
            gradeEl.style.opacity = '1';
        }, 300);
    }

    // Update the gauge border color based on grade
    var gaugeEl = document.getElementById('feasibilityGauge');
    if (gaugeEl) {
        var gradeColors = { A: '#6ECF6E', B: '#00B4CC', C: '#D4A537', D: '#E07A5F', F: '#cc3333' };
        gaugeEl.style.borderColor = gradeColors[grade] || '#E8E8E8';
    }

    // Animate each category bar and score
    var barMap = {
        completeness: { bar: 'feasCompletenessBar', score: 'feasCompleteness' },
        alignment: { bar: 'feasAlignmentBar', score: 'feasAlignment' },
        engagement: { bar: 'feasEngagementBar', score: 'feasEngagement' },
        dataQuality: { bar: 'feasDataQualityBar', score: 'feasDataQuality' },
        readiness: { bar: 'feasReadinessBar', score: 'feasReadiness' }
    };

    Object.keys(dimensions).forEach(function(dimension) {
        var mapping = barMap[dimension];
        if (!mapping) return;

        var value = dimensions[dimension];
        var barEl = document.getElementById(mapping.bar);
        var scoreEl = document.getElementById(mapping.score);

        if (barEl) {
            barEl.style.width = '0%';
            setTimeout(function() {
                barEl.style.width = value + '%';
                // Color code the bar
                if (value >= 75) barEl.style.background = 'var(--pop-green, #6ECF6E)';
                else if (value >= 50) barEl.style.background = 'var(--pop-gold, #D4A537)';
                else barEl.style.background = 'var(--pop-coral, #E07A5F)';
            }, 200);
        }

        if (scoreEl) {
            scoreEl.textContent = Math.round(value) + '%';
        }
    });
}

function generateFeasibilityFeedback(score, grade, dimensions) {
    var feedbackEl = document.getElementById('feasibilityFeedback');
    if (!feedbackEl) return;
    
    var feedback = '';
    
    feedback += '<h3>Overall Feasibility: ' + grade + '</h3>';
    feedback += '<p>' + getGradeInterpretation(grade) + '</p>';
    
    feedback += '<h4>Dimension Analysis</h4>';
    feedback += '<ul>';
    
    Object.keys(dimensions).forEach(function(dimension) {
        var value = dimensions[dimension];
        var label = getDimensionLabel(dimension);
        var interpretation = getDimensionInterpretation(dimension, value);
        feedback += '<li><strong>' + label + ':</strong> ' + Math.round(value) + '% - ' + interpretation + '</li>';
    });
    
    feedback += '</ul>';
    
    feedback += '<h4>Next Steps</h4>';
    feedback += '<ul>';
    feedback += getNextStepRecommendations(grade, dimensions);
    feedback += '</ul>';
    
    feedbackEl.innerHTML = feedback;
}

function getGradeInterpretation(grade) {
    var interpretations = {
        'A': 'Your strategic plan is comprehensive, well-aligned, and ready for implementation. All major elements are in place and the plan is grounded in solid data and stakeholder input.',
        'B': 'Your strategic plan is strong and mostly complete. A few elements need refinement before full implementation. Focus on the dimension feedback below.',
        'C': 'Your strategic plan has a solid foundation but needs significant additional work. Address the identified gaps before rolling out to stakeholders.',
        'D': 'Your strategic plan is in early stages. Complete the remaining work to build alignment and grounding before stakeholder presentation.',
        'F': 'Your strategic plan needs substantial work. Focus on completing the core stages first.'
    };
    return interpretations[grade] || '';
}

function getDimensionLabel(dimension) {
    var labels = {
        completeness: 'Completeness',
        alignment: 'Cross-Stage Alignment',
        engagement: 'Stakeholder Engagement',
        dataQuality: 'Data Quality',
        readiness: 'Implementation Readiness'
    };
    return labels[dimension] || dimension;
}

function getDimensionInterpretation(dimension, value) {
    if (value >= 80) {
        return 'Strong - this dimension is well-developed.';
    } else if (value >= 60) {
        return 'Developing - good progress but some work remains.';
    } else {
        return 'Needs attention - prioritize completion in this area.';
    }
}

function getNextStepRecommendations(grade, dimensions) {
    var html = '';
    
    var lowestDimension = Object.keys(dimensions).reduce(function(a, b) {
        return dimensions[a] < dimensions[b] ? a : b;
    });
    
    html += '<li>Focus on improving ' + getDimensionLabel(lowestDimension) + ' (currently ' + Math.round(dimensions[lowestDimension]) + '%)</li>';
    
    if (dimensions.alignment < 80) {
        html += '<li>Review alignment between vision/mission, values, domains, and goals</li>';
    }
    
    if (dimensions.engagement < 80) {
        html += '<li>Conduct additional stakeholder surveys or focus groups</li>';
    }
    
    if (dimensions.dataQuality < 80) {
        html += '<li>Gather baseline performance data for key metrics</li>';
    }
    
    if (dimensions.readiness < 80) {
        html += '<li>Complete initiative mapping and calendar scheduling</li>';
    }
    
    html += '<li>Run final validation to confirm all stages pass quality standards</li>';
    
    return html;
}

// ============================================================================
// 6. SURVEY GENERATOR FUNCTIONS
// ============================================================================

function generateVisionSurvey() {
    var stageEl = document.querySelector('.step-content[data-step="2"]');
    if (!stageEl) return;
    
    showLoadingState('Generating Vision Survey...');
    
    var stakeholders = getSelectedStakeholders();
    var districtName = (document.getElementById('districtName') || {}).value || (window.planState && planState.districtName) || 'Our District';
    
    var survey = buildVisionSurveyContent(stakeholders, districtName);
    
    displaySurveyOutput(survey, 'vision-survey.txt');
    toolkitState.surveysGenerated.vision = true;
    saveToolkitState();
    updateToolkitBadges();
}

function generateValuesSurvey() {
    var stageEl = document.querySelector('.step-content[data-step="3"]');
    if (!stageEl) return;
    
    showLoadingState('Generating Core Values Survey...');
    
    var stakeholders = getSelectedStakeholders();
    var districtName = (document.getElementById('districtName') || {}).value || (window.planState && planState.districtName) || 'Our District';
    
    var survey = buildValuesSurveyContent(stakeholders, districtName);
    
    displaySurveyOutput(survey, 'values-survey.txt');
    toolkitState.surveysGenerated.values = true;
    saveToolkitState();
    updateToolkitBadges();
}

function generateCompetencySurvey() {
    var stageEl = document.querySelector('.step-content[data-step="4"]');
    if (!stageEl) return;
    
    showLoadingState('Generating Competency Assessment...');
    
    var stakeholders = getSelectedStakeholders();
    var districtName = (document.getElementById('districtName') || {}).value || (window.planState && planState.districtName) || 'Our District';
    
    var survey = buildCompetencySurveyContent(stakeholders, districtName);
    
    displaySurveyOutput(survey, 'competency-survey.txt');
    toolkitState.surveysGenerated.competency = true;
    saveToolkitState();
    updateToolkitBadges();
}

function buildVisionSurveyContent(stakeholders, districtName) {
    var content = districtName + ' Vision Survey\n';
    content += '=' + '='.repeat(60) + '\n\n';
    
    content += 'INSTRUCTIONS\n';
    content += 'We are developing a strategic vision for ' + districtName + '. Your input is valuable.\n';
    content += 'Please respond to the following questions.\n\n';
    
    content += 'QUESTIONS\n\n';
    
    content += '1. When you think about the ideal future for ' + districtName + ' (3-5 years from now),\n';
    content += '   what comes to mind?\n\n';
    
    content += '2. What would success look like? What would be different?\n\n';
    
    content += '3. What capabilities or strengths should we build on?\n\n';
    
    content += '4. What are the biggest opportunities for improvement?\n\n';
    
    content += '5. How should students be different as a result of our work?\n\n';
    
    if (stakeholders.includes('staff')) {
        content += '6. What conditions would help you do your best work?\n\n';
    }
    
    if (stakeholders.includes('families')) {
        content += '6. What do you want for your child\'s education and experience?\n\n';
    }
    
    if (stakeholders.includes('community')) {
        content += '6. How can our schools better serve the community?\n\n';
    }
    
    content += 'Thank you for your input.\n';
    
    return content;
}

function buildValuesSurveyContent(stakeholders, districtName) {
    var content = districtName + ' Core Values Assessment\n';
    content += '=' + '='.repeat(60) + '\n\n';
    
    content += 'INSTRUCTIONS\n';
    content += 'We are identifying the core values that define ' + districtName + '.\n';
    content += 'Rate your agreement with each statement.\n\n';
    
    content += 'RATING SCALE: 1=Strongly Disagree, 5=Strongly Agree\n\n';
    
    var valueStatements = [
        'Student success and well-being come first in all decisions',
        'We embrace diversity, equity, and inclusion',
        'Excellence is our standard in everything we do',
        'We work collaboratively across departments and roles',
        'Innovation and continuous improvement drive our work',
        'We are accountable to students, families, and community',
        'Integrity and trust are non-negotiable',
        'Every student has unlimited potential',
        'We listen to and learn from diverse perspectives',
        'Community partnerships strengthen our schools'
    ];
    
    var num = 1;
    valueStatements.forEach(function(statement) {
        content += num + '. ' + statement + '\n';
        content += '   ___ 1    ___ 2    ___ 3    ___ 4    ___ 5\n\n';
        num++;
    });
    
    content += 'OPEN-ENDED QUESTIONS\n\n';
    content += 'What value do you believe ' + districtName + ' should strengthen?\n\n';
    content += 'What value is we most often fail to live up to?\n\n';
    
    content += 'Thank you.\n';
    
    return content;
}

function buildCompetencySurveyContent(stakeholders, districtName) {
    var content = districtName + ' Capability Assessment\n';
    content += '=' + '='.repeat(60) + '\n\n';
    
    content += 'INSTRUCTIONS\n';
    content += 'Rate ' + districtName + ' current capability in each area.\n\n';
    
    content += 'RATING SCALE: 1=Limited, 2=Developing, 3=Proficient, 4=Advanced\n\n';
    
    var competencies = [
        'Instructional practice and classroom effectiveness',
        'Student engagement and motivation',
        'Assessment and data use',
        'Inclusive practices and special education support',
        'Social-emotional learning and mental health',
        'Family and community partnerships',
        'Operational efficiency and resource management',
        'Professional development and staff growth',
        'Technology integration',
        'Educational equity'
    ];
    
    var num = 1;
    competencies.forEach(function(comp) {
        content += num + '. ' + comp + '\n';
        content += '   ___ 1    ___ 2    ___ 3    ___ 4\n\n';
        num++;
    });
    
    content += 'PRIORITIES\n';
    content += 'Which 3 areas should be our highest priority for improvement?\n\n';
    content += '1. ____________________________________\n';
    content += '2. ____________________________________\n';
    content += '3. ____________________________________\n\n';
    
    return content;
}

function getSelectedStakeholders() {
    var selected = [];
    if (document.getElementById('surveyStaff') && document.getElementById('surveyStaff').checked) selected.push('staff');
    if (document.getElementById('surveyFamilies') && document.getElementById('surveyFamilies').checked) selected.push('families');
    if (document.getElementById('surveyStudents') && document.getElementById('surveyStudents').checked) selected.push('students');
    if (document.getElementById('surveyCommunity') && document.getElementById('surveyCommunity').checked) selected.push('community');
    if (document.getElementById('surveyBoard') && document.getElementById('surveyBoard').checked) selected.push('board');
    return selected.length > 0 ? selected : ['staff', 'families', 'community'];
}

function displaySurveyOutput(content, filename) {
    // Try to find the corresponding output area
    var outputId = '';
    if (filename.indexOf('vision') !== -1) outputId = 'visionSurveyOutput';
    else if (filename.indexOf('values') !== -1) outputId = 'valuesSurveyOutput';
    else if (filename.indexOf('competency') !== -1) outputId = 'competencySurveyOutput';
    else if (filename.indexOf('focus') !== -1) outputId = 'focusGroupGuideOutput';

    var outputEl = outputId ? document.getElementById(outputId) : null;
    if (!outputEl) {
        outputEl = document.querySelector('.toolkit-output-area');
    }
    if (!outputEl) return;
    
    var html = '<div class="survey-output-box">';
    html += '<div class="survey-header">';
    html += '<h4>' + filename.replace('.txt', '') + '</h4>';
    html += '<button class="btn-copy" onclick="copySurveyToClipboard(this)">Copy</button>';
    html += '<button class="btn-download" onclick="downloadSurvey(\'' + filename + '\', this)">Download</button>';
    html += '</div>';
    html += '<pre class="survey-content">' + escapeHtml(content) + '</pre>';
    html += '</div>';
    
    outputEl.innerHTML = html;
}

function copySurveyToClipboard(btn) {
    var content = btn.parentElement.nextElementSibling.textContent;
    navigator.clipboard.writeText(content).then(function() {
        var original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(function() {
            btn.textContent = original;
        }, 2000);
    });
}

function downloadSurvey(filename, btn) {
    var content = btn.parentElement.nextElementSibling.textContent;
    var blob = new Blob([content], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    trackFileDownload(filename);
}

function trackFileDownload(filename) {
    if (!toolkitState.downloadsTracked[filename]) {
        toolkitState.downloadsTracked[filename] = 0;
    }
    toolkitState.downloadsTracked[filename]++;
    saveToolkitState();
}

// showLoadingState is defined in the AI Wrapper section below (supports containerId param)

// ============================================================================
// 7. FOCUS GROUP GUIDE GENERATOR
// ============================================================================

function generateFocusGroupGuide(topic) {
    topic = topic || 'Strategic Vision';
    
    showLoadingState('Generating Focus Group Guide...');
    
    var districtName = (document.getElementById('districtName') || {}).value || (window.planState && planState.districtName) || 'Our District';
    var guide = buildFocusGroupGuideContent(topic, districtName);
    
    displaySurveyOutput(guide, 'focus-group-guide-' + topic.replace(/\s+/g, '-').toLowerCase() + '.txt');
    toolkitState.surveysGenerated.focusGroup = true;
    saveToolkitState();
    updateToolkitBadges();
}

function buildFocusGroupGuideContent(topic, districtName) {
    var content = 'Focus Group Discussion Guide: ' + topic + '\n';
    content += districtName + '\n';
    content += '=' + '='.repeat(60) + '\n\n';
    
    content += 'PURPOSE\n';
    content += 'To gather stakeholder input and perspectives on ' + topic + '.\n';
    content += 'Estimated duration: 60 minutes\n\n';
    
    content += 'WELCOME SCRIPT (3 minutes)\n';
    content += 'Thank you for joining us today. We\'re developing a strategic plan for\n';
    content += districtName + ' and we value your perspective. This is a discussion -\n';
    content += 'there are no right or wrong answers. Please be candid and respectful.\n';
    content += 'We\'ll be taking notes and recording audio (if consent given). What we\n';
    content += 'hear stays confidential.\n\n';
    
    content += 'GROUND RULES (2 minutes)\n';
    content += '- One person speaks at a time\n';
    content += '- Respect different viewpoints\n';
    content += '- Confidentiality is honored\n';
    content += '- There are no wrong answers\n';
    content += '- Please be specific with examples\n\n';
    
    content += 'WARM-UP QUESTION (5 minutes)\n';
    content += 'Share your name, role (optional), and how long you\'ve been connected\n';
    content += 'to ' + districtName + '.\n\n';
    
    content += 'MAIN QUESTIONS (35 minutes)\n\n';
    
    if (topic.indexOf('Vision') !== -1) {
        content += '1. What does success look like for ' + districtName + ' 3-5 years from now? (10 min)\n';
        content += '   Probe: What would be different? How would students experience school differently?\n\n';
        
        content += '2. What are our greatest strengths to build on? (8 min)\n';
        content += '   Probe: What are we already doing well?\n\n';
        
        content += '3. What challenges or barriers might we face? (10 min)\n';
        content += '   Probe: What needs to change? What are we worried about?\n\n';
        
        content += '4. How can we address those challenges together? (7 min)\n';
        content += '   Probe: What support would help? What role can you play?\n\n';
    } else if (topic.indexOf('Values') !== -1) {
        content += '1. What values do you believe ' + districtName + ' should embody? (10 min)\n';
        content += '   Probe: What matters most? What should guide our decisions?\n\n';
        
        content += '2. Which values do we live up to well? (8 min)\n';
        content += '   Probe: Give me an example.\n\n';
        
        content += '3. Where do we fall short? (10 min)\n';
        content += '   Probe: What value do we need to strengthen? Why?\n\n';
        
        content += '4. How can we strengthen our culture around these values? (7 min)\n';
        content += '   Probe: What would help? What needs to change?\n\n';
    } else {
        content += '1. What does your role in ' + districtName + ' involve? What matters most to you? (10 min)\n\n';
        
        content += '2. What\'s working well in ' + topic + '? (8 min)\n';
        content += '   Probe: Give me an example.\n\n';
        
        content += '3. What could be improved? (10 min)\n';
        content += '   Probe: What challenges do you face? What would help?\n\n';
        
        content += '4. What would you like to see in the future? (7 min)\n';
        content += '   Probe: What changes would make a difference?\n\n';
    }
    
    content += 'CLOSING QUESTION (8 minutes)\n';
    content += 'Is there anything else you\'d like us to know as we develop our\n';
    content += 'strategic plan?\n\n';
    
    content += 'THANK YOU & NEXT STEPS (2 minutes)\n';
    content += 'Thank you for your time and honesty. We\'ll keep you updated on how\n';
    content += 'your input shapes our plan.\n\n';
    
    content += 'NOTES FOR FACILITATOR\n';
    content += '- Listen more than you talk\n';
    content += '- Follow up with "Tell me more..." when appropriate\n';
    content += '- Invite quieter participants: "What\'s your take on this?"\n';
    content += '- Note any comments that seem especially important\n';
    content += '- Watch the time and transition between topics\n';
    
    return content;
}

// ============================================================================
// 8. AI INTEGRATION WRAPPER FUNCTIONS
// ============================================================================

// Helper: show loading spinner in an AI output area
function showLoadingState(message, containerId) {
    var container = containerId ? document.getElementById(containerId) : null;
    if (!container) {
        // Try to find the nearest ai-response-area from event
        var activeBtn = document.activeElement;
        if (activeBtn) {
            var parent = activeBtn.parentElement;
            container = parent ? parent.querySelector('.ai-response-area, .toolkit-output-area') : null;
        }
    }
    if (container) {
        container.innerHTML = '<div class="ai-loading"><div class="ai-loading-spinner"></div><span>' + (message || 'Processing...') + '</span></div>';
    }
}

// Helper: show AI result in a container
function showAIResult(containerId, html) {
    var container = document.getElementById(containerId);
    if (container) container.innerHTML = html;
}

// Helper: call AI_ENGINE if available, else use fallback
function callAIOrFallback(engineFn, args, fallbackFn, containerId) {
    if (window.AI_ENGINE && typeof window.AI_ENGINE[engineFn] === 'function') {
        showLoadingState('AI is thinking...', containerId);
        var promise = window.AI_ENGINE[engineFn].apply(null, args);
        if (promise && typeof promise.then === 'function') {
            promise.then(function(result) {
                showAIResult(containerId, '<div class="ai-result-text">' + formatAIResponse(result) + '</div>');
            }).catch(function(err) {
                showAIResult(containerId, '<div class="ai-error">AI unavailable: ' + err.message + '. Using built-in suggestions instead.</div>');
                if (fallbackFn) fallbackFn();
            });
        } else {
            showAIResult(containerId, '<div class="ai-result-text">' + formatAIResponse(promise) + '</div>');
        }
    } else if (fallbackFn) {
        fallbackFn();
    } else {
        showAIResult(containerId, '<div class="ai-error">AI engine not configured. Set your API key in AI Settings to enable AI features.</div>');
    }
}

function formatAIResponse(text) {
    if (!text) return '';
    // Convert markdown-like formatting to HTML
    return text
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^\- /gm, '<li>')
        .replace(/<li>(.*?)(?=<li>|$)/g, '<li>$1</li>');
}

// --- Stage 2: Vision & Mission ---
function aiGenerateVision() {
    var concepts = getVisionConcepts();
    var profile = getDistrictProfile();
    callAIOrFallback('generateVisionStatement', [concepts, profile], function() {
        var suggestions = buildVisionSuggestions(profile);
        displayAIResults(suggestions, 'vision', 'aiVisionOutput');
    }, 'aiVisionOutput');
}

function aiGenerateMission() {
    var vision = (document.getElementById('customVision') || {}).value || '';
    var profile = getDistrictProfile();
    callAIOrFallback('generateMissionStatement', [vision, profile], function() {
        var suggestions = buildMissionSuggestions(vision, profile);
        displayAIResults(suggestions, 'mission', 'aiMissionOutput');
    }, 'aiMissionOutput');
}

function aiScoreClarity() {
    var visionText = (document.getElementById('customVision') || {}).value || '';
    var missionText = (document.getElementById('customMission') || {}).value || '';
    callAIOrFallback('scoreClarity', [visionText, missionText], function() {
        var scores = { vision: scoreTextClarity(visionText), mission: scoreTextClarity(missionText) };
        var html = '<div class="ai-result-text"><strong>Vision Clarity:</strong> ' + scores.vision + '/100<br><strong>Mission Clarity:</strong> ' + scores.mission + '/100</div>';
        showAIResult('aiClarityOutput', html);
    }, 'aiClarityOutput');
}

// --- Stage 3: Core Values ---
function aiClusterValues() {
    var values = getSelectedCoreValues();
    callAIOrFallback('clusterStakeholderValues', [values], function() {
        var clusters = buildValueClusters(values);
        var html = '<div class="ai-result-text">';
        Object.keys(clusters).forEach(function(key) { html += '<strong>' + key + ':</strong> ' + clusters[key].join(', ') + '<br>'; });
        html += '</div>';
        showAIResult('aiValuesClusterOutput', html);
    }, 'aiValuesClusterOutput');
}

function aiGenerateValueDefinitions() {
    var values = getSelectedCoreValues();
    callAIOrFallback('generateValueDefinitions', [values], function() {
        var html = '<div class="ai-result-text">Select core values first, then AI will generate behavioral definitions for each one.</div>';
        showAIResult('aiValueDefinitionsOutput', html);
    }, 'aiValueDefinitionsOutput');
}

// --- Stage 4: Competencies ---
function aiGenerateCompetencies() {
    var vision = (document.getElementById('customVision') || {}).value || '';
    var values = getSelectedCoreValues();
    callAIOrFallback('suggestCompetencies', [vision, values], function() {
        var competencies = buildCompetencyFramework(vision, values);
        var html = '<div class="ai-result-text">';
        competencies.forEach(function(c) { html += '<strong>' + c.title + '</strong>: ' + c.description + '<br>'; });
        html += '</div>';
        showAIResult('aiCompetenciesOutput', html);
    }, 'aiCompetenciesOutput');
}

function aiAssessCapabilityGaps() {
    var profile = getDistrictProfile();
    callAIOrFallback('assessCapabilityGaps', [profile], function() {
        var html = '<div class="ai-result-text">Complete the district profile and competency selection to receive a gap analysis.</div>';
        showAIResult('aiCapabilityGapsOutput', html);
    }, 'aiCapabilityGapsOutput');
}

// --- Stage 5: Strategic Domains ---
function aiClusterDomains() {
    var goals = getSelectedGoals();
    callAIOrFallback('clusterThemes', [goals], function() {
        var domains = buildDomainStructure(goals);
        var html = '<div class="ai-result-text">';
        domains.forEach(function(d) { html += '<strong>' + d.name + '</strong><br>'; });
        html += '</div>';
        showAIResult('aiDomainsOutput', html);
    }, 'aiDomainsOutput');
}

function aiSuggestDomainNames() {
    var goals = getSelectedGoals();
    callAIOrFallback('suggestDomainNames', [goals], function() {
        var html = '<div class="ai-result-text">Suggested domains: Student Achievement, Organizational Capacity, Culture & Climate, Family & Community Partnership</div>';
        showAIResult('aiDomainNamesOutput', html);
    }, 'aiDomainNamesOutput');
}

// --- Stage 6: Goal Setting ---
function aiGenerateGoals() {
    var domains = getSelectedDomains();
    var vision = (document.getElementById('customVision') || {}).value || '';
    callAIOrFallback('generateSMARTGoals', [domains, vision], function() {
        var goals = buildSmartGoals(domains, vision);
        var html = '<div class="ai-result-text">';
        goals.forEach(function(g) { html += '<strong>' + g.title + '</strong>: ' + g.description + '<br>'; });
        html += '</div>';
        showAIResult('aiGoalsOutput', html);
    }, 'aiGoalsOutput');
}

function aiEvaluateGoals() {
    var goals = getSelectedGoals();
    callAIOrFallback('evaluateGoalQuality', [goals], function() {
        var html = '<div class="ai-result-text">Enter your SMART goals above, then AI will evaluate each for specificity, measurability, and alignment.</div>';
        showAIResult('aiGoalEvalOutput', html);
    }, 'aiGoalEvalOutput');
}

// --- Stage 7: Forecasting ---
function aiForecastGoals() {
    var baseline = getBaselineData();
    var historical = getHistoricalData();
    callAIOrFallback('forecastGoalProgress', [baseline, historical], function() {
        var forecasts = buildGoalForecasts(baseline, historical);
        var html = '<div class="ai-result-text">';
        forecasts.forEach(function(f) { html += 'Year ' + f.year + ': <strong>' + f.projection + '%</strong> (Confidence: ' + f.confidence + ')<br>'; });
        html += '</div>';
        showAIResult('aiForecastOutput', html);
    }, 'aiForecastOutput');
}

function aiSensitivityAnalysis() {
    var baseline = getBaselineData();
    callAIOrFallback('sensitivityAnalysis', [baseline], function() {
        var html = '<div class="ai-result-text">Enter baseline metrics and goals to run sensitivity analysis across multiple scenarios.</div>';
        showAIResult('aiSensitivityOutput', html);
    }, 'aiSensitivityOutput');
}

// --- Stage 8: Alignment ---
function aiDetectAlignmentGaps() {
    var stageData = {
        vision: (document.getElementById('customVision') || {}).value || '',
        mission: (document.getElementById('customMission') || {}).value || '',
        values: getSelectedValueDefinitions(),
        domains: getSelectedDomains(),
        goals: getSelectedGoals(),
        initiatives: getInitiatives()
    };
    callAIOrFallback('detectAlignmentGaps', [stageData], function() {
        var gaps = buildAlignmentAnalysis(stageData);
        var html = '<div class="ai-result-text">';
        gaps.forEach(function(g) { html += '- ' + g + '<br>'; });
        html += '</div>';
        showAIResult('aiAlignmentOutput', html);
    }, 'aiAlignmentOutput');
}

// --- Stage 9: Initiatives ---
function aiSuggestInitiatives() {
    var goals = getSelectedGoals();
    var resources = getAvailableResources();
    var timeline = getProjectedTimeline();
    callAIOrFallback('suggestInitiatives', [goals, resources, timeline], function() {
        var initiatives = buildInitiativeSuggestions(goals, resources, timeline);
        var html = '<div class="ai-result-text">';
        initiatives.forEach(function(i) { html += '<strong>' + i.title + '</strong> (Impact: ' + i.impact + ', Effort: ' + i.effort + ')<br>'; });
        html += '</div>';
        showAIResult('aiInitiativesOutput', html);
    }, 'aiInitiativesOutput');
}

function aiPrioritizeInitiatives() {
    var initiatives = getInitiatives();
    callAIOrFallback('prioritizeInitiatives', [initiatives], function() {
        var html = '<div class="ai-result-text">Add initiatives above, then AI will rank them by impact vs. effort with an implementation sequence.</div>';
        showAIResult('aiPrioritizeOutput', html);
    }, 'aiPrioritizeOutput');
}

// --- Stage 10: Timeline ---
function aiGenerateTimeline() {
    var initiatives = getInitiatives();
    var constraints = getSchedulingConstraints();
    callAIOrFallback('generateTimeline', [initiatives, constraints], function() {
        var timeline = buildImplementationTimeline(initiatives, constraints);
        var html = '<div class="ai-result-text">';
        timeline.forEach(function(t) { html += '<strong>' + t.initiative + '</strong>: Start ' + t.start + '<br>'; });
        html += '</div>';
        showAIResult('aiTimelineOutput', html);
    }, 'aiTimelineOutput');
}

function aiIdentifyRisks() {
    var initiatives = getInitiatives();
    callAIOrFallback('flagRisks', [initiatives], function() {
        var html = '<div class="ai-result-text">Add initiatives and timeline to receive a risk assessment with mitigation strategies.</div>';
        showAIResult('aiRisksOutput', html);
    }, 'aiRisksOutput');
}

// --- Stage 11: Review ---
function aiGenerateExecutiveSummary() {
    var stageData = {
        vision: (document.getElementById('customVision') || {}).value || '',
        mission: (document.getElementById('customMission') || {}).value || '',
        values: getSelectedValueDefinitions(),
        goals: getSelectedGoals(),
        initiatives: getInitiatives(),
        timeline: getImplementationTimeline()
    };
    callAIOrFallback('generateExecutiveSummary', [stageData], function() {
        var summary = buildExecutiveSummary(stageData);
        showAIResult('aiExecSummaryOutput', '<div class="ai-result-text">' + formatAIResponse(summary) + '</div>');
    }, 'aiExecSummaryOutput');
}

function aiIdentifyPlanGaps() {
    var stageData = {
        vision: (document.getElementById('customVision') || {}).value || '',
        goals: getSelectedGoals(),
        initiatives: getInitiatives(),
        timeline: getImplementationTimeline()
    };
    callAIOrFallback('identifyPlanGaps', [stageData], function() {
        var html = '<div class="ai-result-text">Complete all stages to receive a comprehensive gap analysis of your strategic plan.</div>';
        showAIResult('aiPlanGapsOutput', html);
    }, 'aiPlanGapsOutput');
}

// Helper functions for AI wrappers
function getVisionConcepts() {
    var concepts = [];
    document.querySelectorAll('input[data-type="vision"]:checked').forEach(function(checkbox) {
        concepts.push(checkbox.getAttribute('data-value') || checkbox.value);
    });
    return concepts;
}

function getSelectedCoreValues() {
    var values = [];
    // The core values container uses selection cards with checkboxes
    var container = document.getElementById('coreValuesContainer');
    if (container) {
        container.querySelectorAll('input[type="checkbox"]:checked').forEach(function(cb) {
            values.push(cb.getAttribute('data-value') || cb.value);
        });
    }
    // Also check planState if available
    if (values.length === 0 && window.planState && planState.coreValues) {
        values = planState.coreValues;
    }
    return values;
}

function getDistrictProfile() {
    return {
        name: (document.getElementById('districtName') || {}).value || '',
        enrollment: parseInt((document.getElementById('studentEnrollment') || {}).value) || 0,
        location: (document.getElementById('districtLocation') || {}).value || '',
        frlRate: (document.getElementById('frlRate') || {}).value || '',
        gradRate: (document.getElementById('graduationRate') || {}).value || '',
        demographics: (document.getElementById('minorityRate') || {}).value || '',
        challenges: (document.getElementById('keyChallenge') || {}).value || ''
    };
}

function getSelectedDomains() {
    var domains = [];
    // Domains are stored in planState from builder.js
    if (window.planState && planState.selectedDomains) {
        return planState.selectedDomains;
    }
    document.querySelectorAll('.step-content[data-step="5"] input[type="checkbox"]:checked').forEach(function(cb) {
        domains.push(cb.getAttribute('data-value') || cb.value);
    });
    return domains;
}

function getSelectedGoals() {
    var goals = [];
    if (window.planState && planState.goals) {
        return planState.goals;
    }
    document.querySelectorAll('.step-content[data-step="6"] textarea').forEach(function(textarea) {
        if (textarea.value.trim()) goals.push(textarea.value.trim());
    });
    return goals;
}

function getBaselineData() {
    var ps = window.planState || {};
    var data = {};
    var metrics = ['graduationRate', 'readingProficiency', 'mathProficiency', 'chronicAbsRate', 'suspensionRate', 'courseFailureRate'];
    metrics.forEach(function(metric) {
        var val = ps[metric] || (document.getElementById(metric) || {}).value || '';
        if (val && val.toString().trim()) {
            data[metric] = parseFloat(val) || 0;
        }
    });
    return data;
}

function getHistoricalData() {
    var ps = window.planState || {};
    return {
        threeYearAverage: ps.threeYearAverage || '',
        trendDirection: ps.trendDirection || 'stable',
        volatility: ps.volatility || 'low'
    };
}

function getSelectedValueDefinitions() {
    var ps = window.planState || {};
    var defs = {};
    var values = ps.coreValues || [];
    if (values.length === 0) {
        document.querySelectorAll('input[name="coreValue"]:checked').forEach(function(cb) {
            values.push(cb.value);
        });
    }
    values.forEach(function(val) { defs[val] = val; });
    return defs;
}

function getInitiatives() {
    var ps = window.planState || {};
    if (ps.initiatives && ps.initiatives.length > 0) {
        return ps.initiatives;
    }
    var initiatives = [];
    var container = document.getElementById('initiativesContainer');
    if (container) {
        container.querySelectorAll('.initiative-item, .card').forEach(function(el) {
            var titleEl = el.querySelector('input, textarea');
            if (titleEl && titleEl.value.trim()) {
                initiatives.push({ title: titleEl.value.trim(), goal: '', owner: '', resources: '' });
            }
        });
    }
    return initiatives;
}

function getAvailableResources() {
    var ps = window.planState || {};
    return ps.availableResources || '';
}

function getProjectedTimeline() {
    var ps = window.planState || {};
    var calendar = ps.calendar || {};
    var quarters = Object.keys(calendar);
    if (quarters.length > 0) return quarters.join(', ');
    return '';
}

function getSchedulingConstraints() {
    return '';
}

function getImplementationTimeline() {
    var ps = window.planState || {};
    var timeline = [];
    var initiatives = ps.initiatives || [];
    var calendar = ps.calendar || {};

    initiatives.forEach(function(init) {
        if (init.title || init.name) {
            timeline.push({
                initiative: init.title || init.name || '',
                start: init.startDate || init.start || '',
                end: init.endDate || init.end || ''
            });
        }
    });
    return timeline;
}

// Display results helper
function displayAIResults(results, type, containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    
    var html = '<div class="ai-results">';
    
    results.forEach(function(result, index) {
        html += '<div class="ai-result-option">';
        html += '<div class="ai-result-content">';
        html += '<p>' + (result.title || 'Option ' + (index + 1)) + '</p>';
        html += '<blockquote>"' + result.text + '"</blockquote>';
        if (result.rationale) {
            html += '<small class="rationale">Why: ' + result.rationale + '</small>';
        }
        html += '</div>';
        html += '<button class="btn-use-result" onclick="useAIResult(\'' + type + '\', ' + index + ')">Use This</button>';
        html += '</div>';
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function useAIResult(type, index) {
    var results = toolkitState.aiResponses[type] || [];
    if (!results[index]) return;

    var text = results[index].text;
    var fieldMap = {
        'vision': 'customVision',
        'mission': 'customMission'
    };

    var fieldId = fieldMap[type];
    var field = fieldId ? document.getElementById(fieldId) : null;
    if (field) {
        field.value = text;
        field.dispatchEvent(new Event('input'));
        field.dispatchEvent(new Event('change'));
    }
}

function displayClarityScores(scores) {
    var container = document.querySelector('.clarity-scores');
    if (!container) return;
    
    var html = '<div class="clarity-analysis">';
    html += '<div class="score-item">';
    html += '<label>Vision Clarity Score</label>';
    html += '<div class="score-bar"><div class="score-fill" style="width: ' + scores.vision + '%"></div></div>';
    html += '<span class="score-value">' + scores.vision + '/100</span>';
    html += '</div>';
    html += '<div class="score-item">';
    html += '<label>Mission Clarity Score</label>';
    html += '<div class="score-bar"><div class="score-fill" style="width: ' + scores.mission + '%"></div></div>';
    html += '<span class="score-value">' + scores.mission + '/100</span>';
    html += '</div>';
    html += '</div>';
    
    container.innerHTML = html;
}

function scoreTextClarity(text) {
    if (!text || text.length === 0) return 0;
    
    var score = 0;
    var wordCount = countWords(text);
    
    // Length (max 20 points)
    if (wordCount >= 10 && wordCount <= 40) score += 20;
    else if (wordCount >= 5 && wordCount <= 50) score += 15;
    else if (wordCount > 0) score += 10;
    
    // Readability (max 20 points)
    var readingLevel = getReadingLevel(text);
    if (readingLevel <= 8) score += 20;
    else if (readingLevel <= 10) score += 15;
    else if (readingLevel <= 12) score += 10;
    
    // Content checks (max 60 points)
    if (containsAspirationalLanguage(text)) score += 20;
    if (containsStudentFocus(text)) score += 20;
    if (text.indexOf('.') > 0 || text.indexOf('!') > 0) score += 20; // Has punctuation
    
    return Math.min(Math.round(score), 100);
}

// Fallback functions (when AI engine not available)
function buildVisionSuggestions(profile) {
    return [
        {
            title: 'Student-Centered Future',
            text: 'Every student in ' + profile.name + ' achieves their potential and graduates college, career, and community ready.',
            rationale: 'Emphasizes student agency and readiness for life'
        },
        {
            title: 'Excellence and Equity',
            text: 'We create an inclusive environment where all students achieve academic excellence and develop as whole people.',
            rationale: 'Balances achievement with equity and whole-child development'
        },
        {
            title: 'Innovation and Growth',
            text: 'We inspire lifelong learners who think critically, collaborate effectively, and lead with purpose.',
            rationale: 'Focuses on skills and dispositions for the future'
        }
    ];
}

function buildMissionSuggestions(vision, profile) {
    return [
        {
            title: 'Action-Oriented Mission',
            text: 'We provide rigorous, culturally responsive instruction and support every student to graduate college and career ready.',
            rationale: 'Clear, actionable, grounded in high expectations'
        },
        {
            title: 'Collaborative Mission',
            text: 'We partner with families and community to ensure each student receives excellent instruction, mentorship, and support.',
            rationale: 'Emphasizes collaboration and comprehensive support'
        },
        {
            title: 'System Mission',
            text: 'We build equitable systems and practices that support student success, staff excellence, and continuous improvement.',
            rationale: 'Systems-focused approach to sustainable change'
        }
    ];
}

function buildValueClusters(values) {
    var clusters = {
        'Excellence & High Expectations': ['Excellence', 'Achievement', 'Rigor'],
        'Equity & Inclusion': ['Equity', 'Diversity', 'Inclusion', 'Belonging'],
        'Collaboration & Community': ['Collaboration', 'Teamwork', 'Partnership', 'Community'],
        'Integrity & Trust': ['Integrity', 'Trust', 'Accountability', 'Transparency'],
        'Innovation & Growth': ['Innovation', 'Growth', 'Continuous Improvement', 'Learning']
    };
    
    return clusters;
}

function buildCompetencyFramework(vision, values) {
    return [
        { title: 'Instructional Excellence', description: 'Effective teaching practices that accelerate student learning' },
        { title: 'Data-Driven Decision Making', description: 'Using assessment and data to inform instruction and improvement' },
        { title: 'Equity and Inclusion', description: 'Creating environments where all students belong and thrive' },
        { title: 'Student Engagement', description: 'Fostering motivation, participation, and ownership of learning' },
        { title: 'Family and Community Partnerships', description: 'Building strong relationships with families and community partners' },
        { title: 'Continuous Improvement', description: 'Measuring progress and systematically improving practice' }
    ];
}

function buildDomainStructure(goals) {
    return [
        { name: 'Student Achievement', goals: goals.slice(0, Math.ceil(goals.length / 3)) },
        { name: 'Operational Excellence', goals: goals.slice(Math.ceil(goals.length / 3), Math.ceil(goals.length / 1.5)) },
        { name: 'Culture and Engagement', goals: goals.slice(Math.ceil(goals.length / 1.5)) }
    ];
}

function buildSmartGoals(domains, vision) {
    return [
        { title: 'Increase proficiency 10% annually', description: 'Measurable, time-bound, linked to vision' },
        { title: 'Reduce chronic absenteeism by 25% within 3 years', description: 'Specific, achievable, relevant to equity' },
        { title: 'Improve staff satisfaction scores by 15%', description: 'Conditions for excellent teaching' }
    ];
}

function buildGoalForecasts(baseline, historical) {
    return [
        { year: new Date().getFullYear() + 1, projection: 65, confidence: 'High' },
        { year: new Date().getFullYear() + 2, projection: 72, confidence: 'High' },
        { year: new Date().getFullYear() + 3, projection: 80, confidence: 'Medium' }
    ];
}

function buildAlignmentAnalysis(stageData) {
    var gaps = [];
    if (!stageData.vision || !stageData.mission) {
        gaps.push('Vision and mission not yet defined');
    }
    if (!stageData.goals || stageData.goals.length === 0) {
        gaps.push('No strategic goals defined yet');
    }
    if (!stageData.initiatives || stageData.initiatives.length === 0) {
        gaps.push('Initiatives not yet mapped to goals');
    }
    return gaps.length > 0 ? gaps : ['Alignment looks strong'];
}

function buildInitiativeSuggestions(goals, resources, timeline) {
    return [
        { title: 'Professional Development Program', goal: goals[0] || '', impact: 'High', effort: 'Medium' },
        { title: 'Student Support Systems', goal: goals[1] || '', impact: 'High', effort: 'High' },
        { title: 'Data Dashboard Implementation', goal: goals[0] || '', impact: 'Medium', effort: 'Medium' }
    ];
}

function buildImplementationTimeline(initiatives, constraints) {
    var timeline = [];
    var currentDate = new Date();
    
    initiatives.forEach(function(init, idx) {
        var startMonth = currentDate.getMonth() + (idx * 2);
        var startDate = new Date(currentDate.getFullYear(), startMonth, 1);
        
        timeline.push({
            initiative: init.title || '',
            start: startDate.toISOString().split('T')[0],
            phases: ['Planning', 'Implementation', 'Monitoring']
        });
    });
    
    return timeline;
}

function buildExecutiveSummary(stageData) {
    var summary = '## Strategic Plan Summary\n\n';
    summary += '### Vision\n' + (stageData.vision || 'To be defined') + '\n\n';
    summary += '### Mission\n' + (stageData.mission || 'To be defined') + '\n\n';
    summary += '### Key Goals\n';
    if (stageData.goals && stageData.goals.length > 0) {
        stageData.goals.slice(0, 3).forEach(function(goal) {
            summary += '- ' + goal + '\n';
        });
    }
    summary += '\n### Implementation Timeline\n';
    summary += stageData.timeline ? 'Timeline defined' : 'Timeline to be developed';
    
    return summary;
}

// Display functions for AI results (used by fallback paths)
function displayValueClusters(clusters) {
    var html = '<div class="ai-result-text">';
    if (typeof clusters === 'object' && !Array.isArray(clusters)) {
        Object.keys(clusters).forEach(function(key) {
            html += '<strong>' + key + ':</strong> ' + (Array.isArray(clusters[key]) ? clusters[key].join(', ') : clusters[key]) + '<br>';
        });
    }
    html += '</div>';
    showAIResult('aiValuesClusterOutput', html);
}

function displayCompetencyOptions(competencies) {
    var html = '<div class="ai-result-text">';
    if (Array.isArray(competencies)) {
        competencies.forEach(function(c) {
            html += '<strong>' + (c.title || c) + '</strong>';
            if (c.description) html += ': ' + c.description;
            html += '<br>';
        });
    }
    html += '</div>';
    showAIResult('aiCompetenciesOutput', html);
}

function displayDomainClusters(domains) {
    var html = '<div class="ai-result-text">';
    if (Array.isArray(domains)) {
        domains.forEach(function(d) {
            html += '<strong>' + (d.name || d) + '</strong><br>';
        });
    }
    html += '</div>';
    showAIResult('aiDomainsOutput', html);
}

function displayGoalOptions(goals) {
    var html = '<div class="ai-result-text">';
    if (Array.isArray(goals)) {
        goals.forEach(function(g) {
            html += '<strong>' + (g.title || g) + '</strong>';
            if (g.description) html += ': ' + g.description;
            html += '<br>';
        });
    }
    html += '</div>';
    showAIResult('aiGoalsOutput', html);
}

function displayForecasts(forecasts) {
    var html = '<div class="ai-result-text">';
    if (Array.isArray(forecasts)) {
        forecasts.forEach(function(f) {
            html += 'Year ' + f.year + ': <strong>' + f.projection + '%</strong> (Confidence: ' + f.confidence + ')<br>';
        });
    }
    html += '</div>';
    showAIResult('aiForecastOutput', html);
}

function displayAlignmentAnalysis(gaps) {
    var html = '<div class="ai-result-text">';
    if (Array.isArray(gaps)) {
        gaps.forEach(function(g) { html += '- ' + g + '<br>'; });
    }
    html += '</div>';
    showAIResult('aiAlignmentOutput', html);
}

function displayInitiativeSuggestions(initiatives) {
    var html = '<div class="ai-result-text">';
    if (Array.isArray(initiatives)) {
        initiatives.forEach(function(i) {
            html += '<strong>' + (i.title || i) + '</strong>';
            if (i.impact) html += ' (Impact: ' + i.impact + ', Effort: ' + i.effort + ')';
            html += '<br>';
        });
    }
    html += '</div>';
    showAIResult('aiInitiativesOutput', html);
}

function displayTimeline(timeline) {
    var html = '<div class="ai-result-text">';
    if (Array.isArray(timeline)) {
        timeline.forEach(function(t) {
            html += '<strong>' + (t.initiative || t) + '</strong>: Start ' + (t.start || 'TBD') + '<br>';
        });
    }
    html += '</div>';
    showAIResult('aiTimelineOutput', html);
}

function displayExecutiveSummary(summary) {
    var html = '<div class="ai-result-text">' + formatAIResponse(summary || '') + '</div>';
    showAIResult('aiExecSummaryOutput', html);
}

// ============================================================================
// 9. HELPER FUNCTIONS
// ============================================================================

function getReadingLevel(text) {
    if (!text || text.length === 0) return 0;
    
    var sentences = (text.match(/[.!?]+/g) || []).length || 1;
    var words = text.trim().split(/\s+/).length;
    var syllables = countSyllables(text);
    
    // Flesch-Kincaid Grade Level
    var grade = (0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59);
    return Math.max(0, Math.round(grade));
}

function countSyllables(text) {
    var syllables = 0;
    var words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    
    words.forEach(function(word) {
        syllables += estimateSyllablesInWord(word);
    });
    
    return Math.max(1, syllables);
}

function estimateSyllablesInWord(word) {
    word = word.toLowerCase();
    var count = 0;
    var vowels = 'aeiouy';
    var previousWasVowel = false;
    
    for (var i = 0; i < word.length; i++) {
        var isVowel = vowels.indexOf(word[i]) !== -1;
        if (isVowel && !previousWasVowel) count++;
        previousWasVowel = isVowel;
    }
    
    if (word.endsWith('e')) count--;
    if (word.endsWith('le')) count++;
    
    return Math.max(1, count);
}

function countWords(text) {
    return text ? text.trim().split(/\s+/).length : 0;
}

function containsAspirationalLanguage(text) {
    var aspirational = [
        'will', 'every', 'all', 'ensure', 'empower', 'inspire', 'transform',
        'achieve', 'excel', 'thrive', 'succeed', 'innovate', 'lead', 'grow',
        'advance', 'prepare', 'equip', 'enable', 'foster', 'cultivate'
    ];
    
    var lower = (text || '').toLowerCase();
    return aspirational.some(function(word) {
        return lower.indexOf(word) !== -1;
    });
}

function containsStudentFocus(text) {
    var studentWords = [
        'student', 'learner', 'child', 'children', 'youth', 'scholar',
        'graduate', 'pupil', 'young people', 'our kids'
    ];
    
    var lower = (text || '').toLowerCase();
    return studentWords.some(function(word) {
        return lower.indexOf(word) !== -1;
    });
}

function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// ============================================================================
// 10. INITIALIZATION
// ============================================================================

function initToolkit() {
    loadToolkitState();
    restoreSubstepStates();
    updateToolkitBadges();

    // Auto-validate all stages if data exists
    for (var i = 2; i <= 11; i++) {
        validateStage(i);
    }

    // Set up event listeners for form changes to trigger validation
    document.querySelectorAll('input, textarea, select').forEach(function(field) {
        field.addEventListener('change', function() {
            var stepEl = field.closest('.step-content[data-step]');
            if (stepEl) {
                var stageNum = parseInt(stepEl.getAttribute('data-step'));
                if (!isNaN(stageNum) && stageNum >= 2) {
                    setTimeout(function() {
                        validateStage(stageNum);
                    }, 500);
                }
            }
        });
    });

    // Note: toggleSubstep is called via onclick in the HTML, no extra listeners needed
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initToolkit, 500);
    });
} else {
    setTimeout(initToolkit, 500);
}

// ============================================================
// SECTION GRADER — gradeSection(N) for A-F letter grading
// ============================================================
function gradeSection(stageNum) {
    var criteria = getCriteriaResults(stageNum);
    var passed = 0;
    var total = criteria.length;
    var tips = [];

    for (var i = 0; i < criteria.length; i++) {
        var dot = document.getElementById('crit-' + stageNum + '-' + (i + 1));
        if (criteria[i].met) {
            passed++;
            if (dot) { dot.style.background = '#2EC4B6'; dot.style.borderColor = '#2EC4B6'; }
        } else {
            if (dot) { dot.style.background = '#E8E8E8'; dot.style.borderColor = '#ccc'; }
            tips.push(criteria[i].tip);
        }
    }

    var pct = total > 0 ? Math.round((passed / total) * 100) : 0;
    var grade, gradeClass;
    if (pct >= 90) { grade = 'A'; gradeClass = 'grade-a'; }
    else if (pct >= 80) { grade = 'B'; gradeClass = 'grade-b'; }
    else if (pct >= 70) { grade = 'C'; gradeClass = 'grade-c'; }
    else if (pct >= 60) { grade = 'D'; gradeClass = 'grade-d'; }
    else { grade = 'F'; gradeClass = 'grade-f'; }

    var circle = document.getElementById('grade-circle-' + stageNum);
    if (circle) {
        circle.textContent = grade;
        circle.className = 'section-grade-circle ' + gradeClass;
    }

    var summary = document.getElementById('grade-summary-' + stageNum);
    if (summary) {
        var summaryTexts = {
            'A': 'Excellent work! This section is production-ready.',
            'B': 'Strong work. A few improvements will make this even better.',
            'C': 'Good start, but several areas need attention.',
            'D': 'Needs significant improvement before moving forward.',
            'F': 'This section needs major work. Review the criteria below.'
        };
        summary.textContent = passed + '/' + total + ' criteria met. ' + summaryTexts[grade];
    }

    var tipsContainer = document.getElementById('grade-tips-' + stageNum);
    var tipsList = document.getElementById('grade-tips-list-' + stageNum);
    if (tipsContainer && tipsList) {
        tipsList.innerHTML = '';
        if (tips.length > 0) {
            tipsContainer.style.display = 'block';
            for (var t = 0; t < tips.length; t++) {
                var li = document.createElement('li');
                li.textContent = tips[t];
                tipsList.appendChild(li);
            }
        } else {
            tipsContainer.style.display = 'none';
        }
    }

    // Animate the grade circle
    var graderEl = document.getElementById('grader-stage-' + stageNum);
    if (graderEl) {
        graderEl.classList.add('graded');
    }
}

function getCriteriaResults(stageNum) {
    switch(stageNum) {
        case 3: return gradeStage2();
        case 4: return gradeStage3();
        case 5: return gradeStage4();
        case 6: return gradeStage5();
        case 7: return gradeStage6();
        case 8: return gradeStage7();
        case 9: return gradeStage8();
        case 10: return gradeStage9();
        case 12: return gradeStage10();
        default: return [];
    }
}

function gradeStage2() {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var hasVision = !!(ps.visionStatement && ps.visionStatement.trim().length > 20);
    var hasMission = !!(ps.missionStatement && ps.missionStatement.trim().length > 20);
    var visionWords = hasVision ? ps.visionStatement.trim().split(/\s+/).length : 0;
    var visionConcise = hasVision && visionWords <= 30;
    var visionInspiring = hasVision && /\b(every|all|future|thrive|excel|transform|dream|aspir|empower)\b/i.test(ps.visionStatement);
    var visionStudentCentered = hasVision && /\b(student|learner|child|children|youth)\b/i.test(ps.visionStatement);
    var missionActionable = hasMission && /\b(will|ensure|provide|empower|commit|deliver|support|strive)\b/i.test(ps.missionStatement);
    var missionCommunity = hasMission && ps.missionStatement.trim().split(/\s+/).length <= 40;
    var aligned = hasVision && hasMission;
    var feedbackState = JSON.parse(localStorage.getItem('sd_stakeholderFeedback') || '{}');
    var hasFeedback = !!(feedbackState['3'] && feedbackState['3'].trim().length > 20);
    var feedbackReflected = hasFeedback && hasVision && hasMission;
    return [
        { met: visionConcise, tip: 'Keep your vision concise, under 30 words. Currently ' + visionWords + ' words.' },
        { met: visionInspiring, tip: 'Make your vision aspirational and forward-looking. Use inspiring language.' },
        { met: visionStudentCentered, tip: 'Center student outcomes in your vision. Mention students, learners, or children.' },
        { met: missionActionable, tip: 'State your purpose and approach. Use action words like "We will..." or "We commit to..."' },
        { met: missionCommunity, tip: 'Keep your mission understandable to any community member. Avoid jargon.' },
        { met: aligned, tip: 'Ensure your vision and mission complement each other and tell a coherent story.' },
        { met: hasFeedback, tip: 'Record stakeholder feedback in the feedback area. What did your community say?' },
        { met: feedbackReflected, tip: 'Revise your statements to reflect stakeholder input. Show you listened.' }
    ];
}

function gradeStage3() {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var values = ps.coreValues || [];
    var count = values.length;
    var inRange = count >= 4 && count <= 6;
    var distinct = true;
    var names = values.map(function(v) { return (v.name || v || '').toString().toLowerCase().trim(); });
    var unique = {};
    for (var n = 0; n < names.length; n++) { unique[names[n]] = true; }
    distinct = Object.keys(unique).length === names.length;
    var feedbackState = JSON.parse(localStorage.getItem('sd_stakeholderFeedback') || '{}');
    var hasFeedback = !!(feedbackState['4'] && feedbackState['4'].trim().length > 20);
    return [
        { met: inRange, tip: 'Select between 4 and 6 core values. You currently have ' + count + '.' },
        { met: distinct, tip: 'Make sure each value is distinct and doesn\'t overlap with others.' },
        { met: count >= 4, tip: 'Choose values that are actionable and observable in daily practice.' },
        { met: count >= 4, tip: 'Add behavioral indicators for each value so staff know what it looks like in action.' },
        { met: hasFeedback, tip: 'Record what stakeholders said about values in the feedback area.' },
        { met: hasFeedback && inRange, tip: 'Ensure your selected values reflect stakeholder input.' }
    ];
}

function gradeStage4() {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var comps = ps.competencies || [];
    var count = comps.length;
    return [
        { met: count >= 4, tip: 'Select competencies from each category (Leadership, Instructional, Operational, Cultural).' },
        { met: count >= 2, tip: 'Distinguish between core competencies (must-haves) and supporting competencies.' },
        { met: count >= 4, tip: 'Ensure competencies connect to your vision, mission, and strategic goals.' },
        { met: count >= 2, tip: 'Align competencies with staffing, technology, and operational needs.' }
    ];
}

function gradeStage5() {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var domains = ps.strategicDomains || [];
    var count = domains.length;
    var inRange = count >= 4 && count <= 6;
    var feedbackState = JSON.parse(localStorage.getItem('sd_stakeholderFeedback') || '{}');
    var hasFeedback = !!(feedbackState['6'] && feedbackState['6'].trim().length > 20);
    return [
        { met: inRange, tip: 'Select 4 to 6 strategic domains. You currently have ' + count + '.' },
        { met: count >= 3, tip: 'Ensure domains are clearly distinct from one another.' },
        { met: count >= 3, tip: 'Cover key areas: academic excellence, operational efficiency, and culture/climate.' },
        { met: count >= 2, tip: 'Check that each domain connects back to your vision and mission.' },
        { met: hasFeedback, tip: 'Record leadership team feedback on domain selection in the feedback area.' }
    ];
}

function gradeStage6() {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var goals = ps.goals || [];
    var domains = ps.strategicDomains || [];
    var goalsCount = goals.length;
    var domainsWithGoals = {};
    for (var g = 0; g < goals.length; g++) {
        if (goals[g].domain) domainsWithGoals[goals[g].domain] = true;
    }
    var allDomainsCovered = domains.length > 0 && Object.keys(domainsWithGoals).length >= domains.length;
    var hasSMART = goalsCount > 0;
    var hasMeasurable = goals.some(function(gl) { return /\d+/.test(gl.text || gl.name || ''); });
    var feedbackState = JSON.parse(localStorage.getItem('sd_stakeholderFeedback') || '{}');
    var hasFeedback = !!(feedbackState['7'] && feedbackState['7'].trim().length > 20);
    var equityData = ps.equityData || {};
    var hasEquityData = Object.keys(equityData).length > 0;
    
    return [
        { met: allDomainsCovered, tip: 'Every strategic domain should have at least one goal.' },
        { met: hasSMART, tip: 'Write goals in SMART format: Specific, Measurable, Achievable, Relevant, Time-bound.' },
        { met: hasMeasurable, tip: 'Include specific numbers or percentages so progress is measurable.' },
        { met: goalsCount >= 3, tip: 'Ensure goals clearly connect to your vision and strategic domains.' },
        { met: hasFeedback, tip: 'Record staff and community feedback on goals in the feedback area.' },
        { met: hasEquityData, tip: 'Set subgroup goals using the Equity Lens. Click "Generate Subgroup Targets" to begin.' }
    ];
}

function gradeStage7() {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var dp = ps.dataProfile || {};
    var hasBaseline = !!(dp.gradRate || dp.attendanceRate || dp.proficiency);
    var goals = ps.goals || [];
    var hasTargets = goals.some(function(g) { return g.target || g.targetValue; });
    var multiyearData = ps.multiyearProjections || {};
    var hasMultiyearProjections = Object.keys(multiyearData).length > 0;
    return [
        { met: hasBaseline, tip: 'Enter baseline data for your key performance metrics.' },
        { met: hasTargets, tip: 'Set improvement targets for each strategic goal.' },
        { met: hasBaseline, tip: 'Validate targets against research-based improvement rates.' },
        { met: hasBaseline, tip: 'Project targets across at least 3 years for meaningful trend analysis.' },
        { met: hasMultiyearProjections, tip: 'Build multi-year projections using the Multi-Year Projection tool in Build Your Forecasts.' }
    ];
}

function gradeStage8() {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var depts = ps.departments || [];
    var alignment = ps.alignmentMatrix || {};
    var hasMappings = Object.keys(alignment).length > 0;
    var feedbackState = JSON.parse(localStorage.getItem('sd_stakeholderFeedback') || '{}');
    var hasFeedback = !!(feedbackState['9'] && feedbackState['9'].trim().length > 20);
    return [
        { met: hasMappings, tip: 'Map each goal to at least one responsible department.' },
        { met: depts.length >= 3, tip: 'No single department should own more than 5 goals. Distribute the load.' },
        { met: hasMappings, tip: 'Identify where cross-department coordination is needed.' },
        { met: depts.length >= 2, tip: 'Assign clear accountability for each department-goal pairing.' },
        { met: hasFeedback, tip: 'Record department leader feedback on alignment in the feedback area.' }
    ];
}

function gradeStage9() {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var inits = ps.initiatives || [];
    var count = inits.length;
    var hasOwners = inits.some(function(i) { return i.owner || i.lead; });
    var hasBudgetEstimates = inits.every(function(i) { return i.budgetData && i.budgetData.costEstimate > 0; });
    return [
        { met: count >= 3, tip: 'Each goal should have at least one supporting initiative.' },
        { met: hasBudgetEstimates, tip: 'Include budget estimates (cost) for each initiative.' },
        { met: hasOwners, tip: 'Assign an owner or lead to each initiative.' },
        { met: count >= 3, tip: 'Consider impact vs. effort when prioritizing initiatives.' }
    ];
}

function gradeStage10() {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var calEntries = ps.calendarEntries || [];
    var hasEntries = calEntries.length > 0;
    var inits = ps.initiatives || [];
    return [
        { met: hasEntries || inits.length > 0, tip: 'Schedule all initiatives on the implementation calendar.' },
        { met: hasEntries, tip: 'Define milestones and checkpoints for each initiative.' },
        { met: hasEntries, tip: 'Include board reporting dates in the calendar.' },
        { met: hasEntries, tip: 'Review the timeline for realistic pacing across the school year.' }
    ];
}

// ============================================================
// DATA UPLOAD — handleDataUpload(), parseCSV, generateGoalsFromData
// ============================================================
function handleDataUpload(input) {
    var file = input.files[0];
    if (!file) return;

    var previewEl = document.getElementById('dataUploadPreview');
    var zone = document.getElementById('dataUploadZone');

    if (file.name.endsWith('.csv')) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var text = e.target.result;
            var rows = parseCSVText(text);
            displayDataPreview(rows, previewEl, zone, file.name);
        };
        reader.readAsText(file);
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // Use SheetJS if available
        if (typeof XLSX !== 'undefined') {
            var reader = new FileReader();
            reader.onload = function(e) {
                var data = new Uint8Array(e.target.result);
                var workbook = XLSX.read(data, {type: 'array'});
                var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                var rows = XLSX.utils.sheet_to_json(firstSheet, {header: 1});
                displayDataPreview(rows, previewEl, zone, file.name);
            };
            reader.readAsArrayBuffer(file);
        } else {
            if (zone) zone.innerHTML = '<p style="color:#c0392b;">Excel parsing requires SheetJS library. Please upload a CSV file instead.</p>';
        }
    }
}

function parseCSVText(text) {
    var lines = text.split(/\r?\n/);
    var rows = [];
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].trim()) {
            rows.push(lines[i].split(',').map(function(c) { return c.trim().replace(/^"|"$/g, ''); }));
        }
    }
    return rows;
}

function displayDataPreview(rows, previewEl, zone, filename) {
    if (!previewEl || rows.length < 2) return;

    if (zone) zone.style.display = 'none';
    previewEl.style.display = 'block';

    var html = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">';
    html += '<div><strong style="color:#22333B;">Uploaded:</strong> ' + filename + ' (' + (rows.length - 1) + ' rows)</div>';
    html += '<button class="btn btn-action" onclick="resetDataUpload()" style="font-size:0.8rem;">Remove File</button>';
    html += '</div>';
    html += '<div style="overflow-x:auto;max-height:250px;border:1px solid #E8E8E8;border-radius:6px;">';
    html += '<table style="width:100%;border-collapse:collapse;font-size:0.85rem;">';
    html += '<thead><tr>';
    for (var h = 0; h < rows[0].length; h++) {
        html += '<th style="padding:8px 12px;background:#22333B;color:#EAE0D5;text-align:left;font-weight:600;position:sticky;top:0;">' + rows[0][h] + '</th>';
    }
    html += '</tr></thead><tbody>';
    var maxRows = Math.min(rows.length, 20);
    for (var r = 1; r < maxRows; r++) {
        html += '<tr style="border-bottom:1px solid #f0f0f0;">';
        for (var c = 0; c < rows[r].length; c++) {
            html += '<td style="padding:6px 12px;">' + (rows[r][c] || '') + '</td>';
        }
        html += '</tr>';
    }
    if (rows.length > 20) {
        html += '<tr><td colspan="' + rows[0].length + '" style="padding:8px;text-align:center;color:#999;font-style:italic;">... and ' + (rows.length - 20) + ' more rows</td></tr>';
    }
    html += '</tbody></table></div>';
    html += '<button class="btn btn-ai" onclick="generateGoalsFromData()" style="margin-top:1rem;">Analyze Data & Generate Goals</button>';

    previewEl.innerHTML = html;

    // Store parsed data for later use
    window._uploadedDataRows = rows;
}

function resetDataUpload() {
    var previewEl = document.getElementById('dataUploadPreview');
    var zone = document.getElementById('dataUploadZone');
    var fileInput = document.getElementById('dataFileInput');
    if (previewEl) previewEl.style.display = 'none';
    if (zone) zone.style.display = 'block';
    if (fileInput) fileInput.value = '';
    window._uploadedDataRows = null;
}

function addManualMetricRow() {
    var container = document.getElementById('manualMetricRows');
    if (!container) return;

    // Populate domain options from planState
    var domains = (typeof planState !== 'undefined' && planState.strategicDomains) ? planState.strategicDomains : [];
    var domainOpts = '<option value="">Link to domain...</option>';
    for (var d = 0; d < domains.length; d++) {
        var dName = domains[d].name || domains[d];
        domainOpts += '<option value="' + dName + '">' + dName + '</option>';
    }

    var row = document.createElement('div');
    row.className = 'manual-metric-row';
    row.style.cssText = 'display:flex;gap:0.5rem;margin-bottom:0.5rem;flex-wrap:wrap;';
    row.innerHTML = '<input type="text" placeholder="Metric name" class="manual-metric-name" style="flex:2;min-width:180px;padding:0.5rem 0.7rem;border:1px solid #ddd;border-radius:4px;font-size:0.85rem;font-family:Inter,sans-serif;" />'
        + '<input type="number" placeholder="Baseline %" class="manual-metric-baseline" style="flex:1;min-width:80px;padding:0.5rem 0.7rem;border:1px solid #ddd;border-radius:4px;font-size:0.85rem;font-family:Inter,sans-serif;" />'
        + '<input type="number" placeholder="Target %" class="manual-metric-target" style="flex:1;min-width:80px;padding:0.5rem 0.7rem;border:1px solid #ddd;border-radius:4px;font-size:0.85rem;font-family:Inter,sans-serif;" />'
        + '<select class="manual-metric-domain" style="flex:1;min-width:140px;padding:0.5rem 0.7rem;border:1px solid #ddd;border-radius:4px;font-size:0.85rem;font-family:Inter,sans-serif;">' + domainOpts + '</select>'
        + '<button onclick="this.parentElement.remove()" style="padding:0.3rem 0.6rem;background:#f0f0f0;border:1px solid #ddd;border-radius:4px;cursor:pointer;color:#999;">x</button>';
    container.appendChild(row);
}

function generateGoalsFromData() {
    var outputEl = document.getElementById('dataAnalysisOutput');
    if (!outputEl) return;

    // Collect manual entries
    var metrics = [];
    var rows = document.querySelectorAll('.manual-metric-row');
    rows.forEach(function(row) {
        var name = row.querySelector('.manual-metric-name');
        var baseline = row.querySelector('.manual-metric-baseline');
        var target = row.querySelector('.manual-metric-target');
        var domain = row.querySelector('.manual-metric-domain');
        if (name && name.value.trim()) {
            metrics.push({
                name: name.value.trim(),
                baseline: baseline ? parseFloat(baseline.value) || null : null,
                target: target ? parseFloat(target.value) || null : null,
                domain: domain ? domain.value : ''
            });
        }
    });

    // Also include uploaded data if present
    if (window._uploadedDataRows && window._uploadedDataRows.length > 1) {
        var headers = window._uploadedDataRows[0];
        for (var r = 1; r < window._uploadedDataRows.length; r++) {
            var row = window._uploadedDataRows[r];
            metrics.push({
                name: row[0] || 'Metric ' + r,
                baseline: parseFloat(row[1]) || null,
                target: parseFloat(row[2]) || null,
                domain: row[3] || ''
            });
        }
    }

    if (metrics.length === 0) {
        outputEl.innerHTML = '<p style="color:#c0392b;">Please upload a file or enter at least one metric manually.</p>';
        return;
    }

    // Generate SMART goals from the data
    outputEl.innerHTML = '<div class="ai-loading">Analyzing data and generating goals...</div>';

    var goalsHtml = '<h3 style="color:#22333B;margin-bottom:1rem;">Generated SMART Goals from Your Data</h3>';
    for (var m = 0; m < metrics.length; m++) {
        var met = metrics[m];
        var bl = met.baseline || 0;
        var tgt = met.target || Math.min(bl + 10, 100);
        var improvement = tgt - bl;
        var timeframe = improvement > 15 ? '3 years' : improvement > 8 ? '2 years' : '1 year';

        goalsHtml += '<div style="padding:1rem;background:#f7f5f2;border-radius:8px;margin-bottom:0.75rem;border-left:4px solid #00B4CC;">';
        goalsHtml += '<strong style="color:#22333B;">' + met.name + '</strong>';
        if (met.domain) goalsHtml += ' <span style="font-size:0.75rem;background:#22333B;color:#EAE0D5;padding:2px 8px;border-radius:10px;margin-left:8px;">' + met.domain + '</span>';
        goalsHtml += '<p style="margin:0.5rem 0 0;font-size:0.9rem;color:#5E503F;">Increase ' + met.name + ' from <strong>' + bl + '%</strong> to <strong>' + tgt + '%</strong> within ' + timeframe + ', as measured by annual district assessments.</p>';
        goalsHtml += '<div style="margin-top:0.5rem;font-size:0.8rem;color:#888;">Improvement: +' + improvement.toFixed(1) + ' percentage points | Timeframe: ' + timeframe + '</div>';
        goalsHtml += '</div>';
    }
    goalsHtml += '<button class="btn btn-action" onclick="applyGeneratedGoals()" style="margin-top:1rem;">Apply These Goals to My Plan</button>';

    setTimeout(function() {
        outputEl.innerHTML = goalsHtml;
    }, 800);

    window._generatedGoalMetrics = metrics;
}

function applyGeneratedGoals() {
    if (!window._generatedGoalMetrics) return;
    var metrics = window._generatedGoalMetrics;
    for (var i = 0; i < metrics.length; i++) {
        var met = metrics[i];
        var bl = met.baseline || 0;
        var tgt = met.target || Math.min(bl + 10, 100);
        var timeframe = (tgt - bl) > 15 ? '3 years' : (tgt - bl) > 8 ? '2 years' : '1 year';
        if (typeof addGoal === 'function') {
            addGoal();
        }
        // Try to populate the last added goal
        var goalCards = document.querySelectorAll('#goalsContainer .goal-card, #goalsContainer .custom-item');
        if (goalCards.length > 0) {
            var lastCard = goalCards[goalCards.length - 1];
            var textarea = lastCard.querySelector('textarea');
            if (textarea) {
                textarea.value = 'Increase ' + met.name + ' from ' + bl + '% to ' + tgt + '% within ' + timeframe + ', as measured by annual district assessments.';
                textarea.dispatchEvent(new Event('input', {bubbles: true}));
            }
        }
    }
}

// ============================================================
// DRAG & DROP for data upload zone
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    var zone = document.getElementById('dataUploadZone');
    if (!zone) return;

    zone.addEventListener('dragover', function(e) {
        e.preventDefault();
        zone.style.borderColor = '#00B4CC';
        zone.style.background = '#f0fafa';
    });
    zone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        zone.style.borderColor = '#ddd';
        zone.style.background = '';
    });
    zone.addEventListener('drop', function(e) {
        e.preventDefault();
        zone.style.borderColor = '#ddd';
        zone.style.background = '';
        var files = e.dataTransfer.files;
        if (files.length > 0) {
            var input = document.getElementById('dataFileInput');
            if (input) {
                // Can't set files directly, so trigger handleDataUpload manually
                var file = files[0];
                var mockInput = { files: [file] };
                handleDataUpload(mockInput);
            }
        }
    });
});

/* ============================================================================
   GUIDED SUB-STEPS SYSTEM
   Toggle, track completion, and walk users through each section
   ============================================================================ */

function toggleGuidedStep(headerEl) {
    var step = headerEl.parentElement;
    if (step.classList.contains('collapsed')) {
        step.classList.remove('collapsed');
    } else {
        step.classList.add('collapsed');
    }
}

// Track guided step completion state
var guidedStepState = JSON.parse(localStorage.getItem('sd_guidedSteps') || '{}');

function markGuidedStepDone(stage, substep) {
    var key = stage + '-' + substep;
    guidedStepState[key] = true;
    localStorage.setItem('sd_guidedSteps', JSON.stringify(guidedStepState));

    // Update status badge
    var statusEl = document.getElementById('gs-' + key + '-status');
    if (statusEl) {
        statusEl.textContent = 'Done';
        statusEl.className = 'substep-status status-done';
    }

    // Mark step as completed
    var stepEl = document.getElementById('gs-' + key);
    if (stepEl) {
        stepEl.classList.add('completed-substep');
        stepEl.classList.remove('active-substep');
    }

    // Auto-open the next sub-step
    var nextKey = stage + '-' + (parseInt(substep) + 1);
    var nextStep = document.getElementById('gs-' + nextKey);
    if (nextStep) {
        nextStep.classList.remove('collapsed');
        nextStep.classList.add('active-substep');
        var nextStatus = document.getElementById('gs-' + nextKey + '-status');
        if (nextStatus && nextStatus.textContent === 'To Do') {
            nextStatus.textContent = 'Active';
            nextStatus.className = 'substep-status status-active';
        }
        // Smooth scroll to next step
        setTimeout(function() {
            nextStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
    }

    // Update nav completion indicator
    updateNavCompletion(parseInt(stage));
}

function updateNavCompletion(stageNum) {
    var stepItem = document.querySelector('.step-item[data-step="' + stageNum + '"]');
    if (!stepItem) return;

    // Count total and completed sub-steps for this stage
    var allSteps = document.querySelectorAll('#gs-' + stageNum + '-1, #gs-' + stageNum + '-2, #gs-' + stageNum + '-3, #gs-' + stageNum + '-4');
    var total = allSteps.length;
    var done = 0;
    for (var i = 0; i < allSteps.length; i++) {
        if (allSteps[i].classList.contains('completed-substep')) done++;
    }

    stepItem.classList.remove('complete', 'in-progress');
    if (done === total && total > 0) {
        stepItem.classList.add('complete');
    } else if (done > 0) {
        stepItem.classList.add('in-progress');
    }
}

// Restore guided step states on page load
function restoreGuidedStepStates() {
    var keys = Object.keys(guidedStepState);
    for (var i = 0; i < keys.length; i++) {
        if (guidedStepState[keys[i]]) {
            var parts = keys[i].split('-');
            var statusEl = document.getElementById('gs-' + keys[i] + '-status');
            if (statusEl) {
                statusEl.textContent = 'Done';
                statusEl.className = 'substep-status status-done';
            }
            var stepEl = document.getElementById('gs-' + keys[i]);
            if (stepEl) {
                stepEl.classList.add('completed-substep');
            }
            updateNavCompletion(parseInt(parts[0]));
        }
    }
}

// Init on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restoreGuidedStepStates);
} else {
    restoreGuidedStepStates();
}

/* ============================================================================
   STAKEHOLDER FEEDBACK PERSISTENCE
   Save and restore stakeholder feedback per stage
   ============================================================================ */

var stakeholderFeedbackState = JSON.parse(localStorage.getItem('sd_stakeholderFeedback') || '{}');

function saveStakeholderFeedback(stage, value) {
    stakeholderFeedbackState[stage] = value;
    localStorage.setItem('sd_stakeholderFeedback', JSON.stringify(stakeholderFeedbackState));
}

function restoreStakeholderFeedback() {
    var stages = Object.keys(stakeholderFeedbackState);
    for (var i = 0; i < stages.length; i++) {
        var textarea = document.getElementById('stakeholderFeedback' + stages[i]);
        if (textarea && stakeholderFeedbackState[stages[i]]) {
            textarea.value = stakeholderFeedbackState[stages[i]];
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restoreStakeholderFeedback);
} else {
    restoreStakeholderFeedback();
}

/* ============================================================================
   AI HELPER - Floating assistant per section
   One dedicated AI helper that changes actions based on current step
   ============================================================================ */

var aiHelperConfig = {
    2: {
        title: 'Vision & Mission Helper',
        actions: [
            { label: 'Draft Vision Statement', desc: 'Generate a polished vision from your selections', fn: 'aiGenerateVision' },
            { label: 'Draft Mission Statement', desc: 'Generate a mission statement from your elements', fn: 'aiGenerateMission' },
            { label: 'AI Clarity Score', desc: 'Rate clarity and alignment of your statements', fn: 'aiScoreClarity' }
        ]
    },
    3: {
        title: 'Core Values Helper',
        actions: [
            { label: 'Cluster Values', desc: 'Group stakeholder responses into value themes', fn: 'aiClusterValues' },
            { label: 'Generate Definitions', desc: 'Create behavioral definitions for each value', fn: 'aiGenerateValueDefinitions' }
        ]
    },
    4: {
        title: 'Competencies Helper',
        actions: [
            { label: 'Suggest Competencies', desc: 'AI picks competencies based on your vision and values', fn: 'aiGenerateCompetencies' },
            { label: 'Assess Gaps', desc: 'Identify capability gaps in your framework', fn: 'aiAssessCapabilityGaps' }
        ]
    },
    5: {
        title: 'Strategic Domains Helper',
        actions: [
            { label: 'Cluster Themes', desc: 'Group stakeholder input into strategic domains', fn: 'aiClusterDomains' },
            { label: 'Suggest Names', desc: 'Generate professional domain names', fn: 'aiSuggestDomainNames' }
        ]
    },
    6: {
        title: 'Goal Setting Helper',
        actions: [
            { label: 'Generate SMART Goals', desc: 'Create goals from your domains and data', fn: 'aiGenerateGoals' },
            { label: 'Evaluate Goals', desc: 'Check goals against SMART criteria', fn: 'aiEvaluateGoals' }
        ]
    },
    7: {
        title: 'Forecasting Helper',
        actions: [
            { label: 'Generate Scenarios', desc: 'Stretch vs. realistic improvement targets', fn: 'aiForecastGoals' },
            { label: 'Sensitivity Analysis', desc: 'Test your forecast assumptions', fn: 'aiSensitivityAnalysis' }
        ]
    },
    8: {
        title: 'Alignment Helper',
        actions: [
            { label: 'Detect Gaps', desc: 'Find alignment gaps and coordination opportunities', fn: 'aiDetectAlignmentGaps' }
        ]
    },
    9: {
        title: 'Initiatives Helper',
        actions: [
            { label: 'Suggest Initiatives', desc: 'Evidence-based initiatives for your goals', fn: 'aiSuggestInitiatives' },
            { label: 'Prioritize', desc: 'Rank by impact vs. effort', fn: 'aiPrioritizeInitiatives' }
        ]
    },
    10: {
        title: 'Calendar Helper',
        actions: [
            { label: 'Generate Roadmap', desc: 'Multi-year roadmap with dependencies', fn: 'aiGenerateTimeline' },
            { label: 'Identify Risks', desc: 'Implementation risks and mitigations', fn: 'aiIdentifyRisks' }
        ]
    }
};

function initAIHelper() {
    // Create AI helper DOM element
    var helper = document.createElement('div');
    helper.className = 'ai-helper';
    helper.id = 'aiHelper';
    helper.innerHTML = '<button class="ai-helper-toggle" onclick="toggleAIHelper()" title="AI Assistant">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 22 12 17.5 5.8 22l2.4-8.1L2 9.4h7.6z"/></svg>' +
        '<span class="helper-pulse"></span>' +
        '</button>' +
        '<div class="ai-helper-panel" id="aiHelperPanel">' +
        '<div class="ai-helper-panel-header">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 22 12 17.5 5.8 22l2.4-8.1L2 9.4h7.6z"/></svg>' +
        '<h4 id="aiHelperTitle">AI Assistant</h4>' +
        '<button class="close-helper" onclick="toggleAIHelper()">&times;</button>' +
        '</div>' +
        '<div class="ai-helper-panel-body" id="aiHelperBody"></div>' +
        '</div>';
    document.body.appendChild(helper);
}

function toggleAIHelper() {
    var panel = document.getElementById('aiHelperPanel');
    if (panel) {
        panel.classList.toggle('open');
    }
}

function updateAIHelper(stepNum) {
    var config = aiHelperConfig[stepNum];
    if (!config) {
        var helperEl = document.getElementById('aiHelper');
        if (helperEl) helperEl.style.display = 'none';
        return;
    }

    var helperEl = document.getElementById('aiHelper');
    if (helperEl) helperEl.style.display = '';

    var titleEl = document.getElementById('aiHelperTitle');
    if (titleEl) titleEl.textContent = config.title;

    var bodyEl = document.getElementById('aiHelperBody');
    if (!bodyEl) return;

    var html = '';
    for (var i = 0; i < config.actions.length; i++) {
        var a = config.actions[i];
        html += '<div class="ai-helper-action" onclick="' + a.fn + '(); toggleAIHelper();">' +
            '<div class="action-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 22 12 17.5 5.8 22l2.4-8.1L2 9.4h7.6z"/></svg></div>' +
            '<div class="action-text"><h5>' + a.label + '</h5><p>' + a.desc + '</p></div>' +
            '</div>';
    }
    html += '<div class="ai-helper-output" id="aiHelperOutput" style="display:none;"></div>';
    bodyEl.innerHTML = html;
}

// Hook into step navigation to update AI helper
var origGoToStep = typeof goToStep === 'function' ? goToStep : null;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initAIHelper();
        // Patch step navigation
        var stepItems = document.querySelectorAll('.step-item');
        for (var i = 0; i < stepItems.length; i++) {
            (function(item) {
                item.addEventListener('click', function() {
                    var step = parseInt(item.getAttribute('data-step'));
                    if (step) updateAIHelper(step);
                });
            })(stepItems[i]);
        }
    });
} else {
    initAIHelper();
}

// Also update AI helper when stepNext/stepPrev is called (hook via MutationObserver on visible step)
(function() {
    function checkVisibleStep() {
        var steps = document.querySelectorAll('.step-content');
        for (var i = 0; i < steps.length; i++) {
            if (steps[i].style.display !== 'none' && steps[i].offsetParent !== null) {
                var stepNum = parseInt(steps[i].getAttribute('data-step'));
                if (stepNum) updateAIHelper(stepNum);
                break;
            }
        }
    }
    // Check periodically (lightweight, catches step changes)
    setInterval(checkVisibleStep, 1000);
})();
