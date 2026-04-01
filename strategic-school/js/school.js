// Strategic School Plan Builder - school.js
// Complete JavaScript implementation for 12-step builder with goal builder, action planning, and full state management
// Last updated: March 2026

// ============================================================================
// 1. STORAGE & STATE MANAGEMENT
// ============================================================================

var STORAGE_KEY = 'strategicPlan_v3_school';
var currentStep = 1;

var planState = {
  // School profile
  selectedState: '', schoolName: '', schoolType: '', gradeLevels: '', enrollment: '',
  teacherCount: '', studentTeacherRatio: '', principalName: '', schoolYear: '',

  // Demographics
  frlRate: '', iepRate: '', elRate: '', pocRate: '',

  // Academic performance
  readingProf: '', mathProf: '', gradRate: '', absentRate: '',

  // Culture & climate
  suspensionRate: '', attendanceRate: '', retentionRate: '',
  schoolRating: '', titleIStatus: '', designations: [],

  // District connection
  districtId: '', districtPlan: null,

  // Needs assessment
  strengths: [], challenges: [], rootCauses: [], dataSources: [], priorityAreas: [],
  otherDataSource: '',

  // Vision/Mission
  schoolVision: '', schoolMission: '',

  // Values
  selectedValues: [], cultureCommitments: [],

  // Goals (array of goal objects) - LEGACY FORMAT
  schoolGoals: [],

  // Goals - NEW HIERARCHICAL FORMAT
  goalAreaPlans: [
    // {
    //   goalAreaKey: 'student_success',
    //   goalAreaName: 'Student Success',
    //   problemStatements: [
    //     {
    //       id: 'ps_1234',
    //       statement: 'Students are performing below...',
    //       rootCause: 'Lack of consistent...',
    //       goals: [
    //         {
    //           id: 'goal_1234',
    //           goalNumber: 1,
    //           goalStatement: 'By June 2027...',
    //           annualObjectives: [
    //             {
    //               id: 'apo_1234',
    //               objectiveNumber: 1,
    //               objectiveStatement: 'Increase reading proficiency from 45% to 55% by June 2026',
    //               strategies: [
    //                 {
    //                   id: 'strat_1234',
    //                   strategyNumber: 1,
    //                   description: 'Implement iReady diagnostic...',
    //                   essaTier: 2,
    //                   namedPrograms: ['iready', 'mtss'],
    //                   themes: ['data_review', 'scheduling'],
    //                   owner: 'Reading Specialist',
    //                   timeline: 'Aug 2025 - June 2026',
    //                   metric: 'iReady diagnostic growth percentile',
    //                   target: '65th percentile'
    //                 }
    //               ]
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // }
  ],

  // Action plans (linked to goals)
  actionPlans: [],

  // Stakeholder engagement
  stakeholders: [], stakeholderThemes: [], committeeMembers: [], familyEngagement: '',
  stakeholderUploadData: null,

  // Resources
  fundingSources: [], investments: [], resourceAlignments: [],

  // Calendar
  calendar: {},

  // Monitoring
  leadingIndicators: [], laggingIndicators: [], monitoringFrequency: '', accountabilityLead: '',

  // Finalization
  confirmAccuracy: false, confirmStakeholders: false, planAuthor: '', adoptionDate: '',
  finalized: false
};

// ============================================================================
// 2. PERSISTENCE FUNCTIONS
// ============================================================================

function loadPlanState() {
  var stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      planState = JSON.parse(stored);
    } catch(e) {
      console.error('Error loading plan state:', e);
    }
  }
}

function savePlanState() {
  planState.lastModified = new Date().toISOString();
  if (window.planSync) {
    window.planSync.save('school', STORAGE_KEY, planState, planState.schoolName || 'My School Plan');
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(planState));
  }
}

function initializePlan() {
  loadPlanState();
  migrateOldGoalFormat();
  populateStateDropdown();
  populateCommitteeRoles();
  renderStep(currentStep);
  updateProgressBar();
  updateGuidanceContent(1);

  if (window.planSync) {
    window.planSync.load('school', STORAGE_KEY).then(function(cloudData) {
      if (cloudData && cloudData.lastModified) {
        var cloudTime = new Date(cloudData.lastModified).getTime();
        var localTime = planState.lastModified ? new Date(planState.lastModified).getTime() : 0;
        if (cloudTime > localTime) {
          planState = cloudData;
          migrateOldGoalFormat();
          renderStep(currentStep);
          updateProgressBar();
        }
      }
    });
  }
}

// ============================================================================
// 3. NAVIGATION & STEP MANAGEMENT
// ============================================================================

function stepGoto(stepNum) {
  if (stepNum < 1 || stepNum > 12) return;
  saveCurrentStepData();
  currentStep = stepNum;
  renderStep(currentStep);
  updateProgressBar();
  updateGuidanceContent(currentStep);
  updateAssistantStep(stepNum);
  window.scrollTo(0, 0);
}

function saveCurrentStepData() {
  switch(currentStep) {
    case 1: saveStep1Data(); break;
    case 2: saveStep2Data(); break;
    case 3: saveStep3Data(); break;
    case 4: saveStep4Data(); break;
    case 5: saveStep5Data(); break;
    case 6: saveStep6Data(); break;
    case 7: saveStep7Data(); break;
    case 8: saveStep8Data(); break;
    case 9: saveStep9Data(); break;
    case 10: saveStep10Data(); break;
    case 11: saveStep11Data(); break;
    case 12: saveStep12Data(); break;
  }
  savePlanState();
}

function updateProgressBar() {
  var filledSteps = 0;
  if (planState.districtId) filledSteps++;
  if (planState.schoolName) filledSteps++;
  if (planState.strengths.length > 0 || planState.challenges.length > 0) filledSteps++;
  if (planState.schoolVision && planState.schoolMission) filledSteps++;
  if (planState.selectedValues.length > 0) filledSteps++;
  // Check both old and new goal formats
  var hasGoals = planState.schoolGoals.length > 0 ||
    (planState.goalAreaPlans && planState.goalAreaPlans.length > 0 &&
     planState.goalAreaPlans.some(function(p) { return p.problemStatements && p.problemStatements.length > 0; }));
  if (hasGoals) filledSteps++;
  if (planState.actionPlans.length > 0) filledSteps++;
  if (planState.stakeholderThemes.length > 0 || planState.committeeMembers.length > 0) filledSteps++;
  if (planState.fundingSources.length > 0) filledSteps++;
  if (planState.calendar && Object.keys(planState.calendar).length > 0) filledSteps++;
  if (planState.leadingIndicators.length > 0 || planState.laggingIndicators.length > 0) filledSteps++;
  if (planState.confirmAccuracy && planState.confirmStakeholders && planState.planAuthor) filledSteps++;

  var progressPercent = (filledSteps / 12) * 100;
  var progressFill = document.getElementById('progressFill');
  if (progressFill) progressFill.style.width = progressPercent + '%';

  var currentStepDisplay = document.getElementById('currentStepDisplay');
  if (currentStepDisplay) currentStepDisplay.textContent = currentStep;
}

function clearStep(stepNum) {
  switch(stepNum) {
    case 1:
      planState.districtId = '';
      planState.districtPlan = null;
      break;
    case 2:
      planState.selectedState = '';
      planState.schoolName = '';
      planState.schoolType = '';
      planState.gradeLevels = '';
      planState.enrollment = '';
      planState.teacherCount = '';
      planState.studentTeacherRatio = '';
      planState.principalName = '';
      planState.schoolYear = '';
      planState.frlRate = '';
      planState.iepRate = '';
      planState.elRate = '';
      planState.pocRate = '';
      planState.readingProf = '';
      planState.mathProf = '';
      planState.gradRate = '';
      planState.absentRate = '';
      planState.suspensionRate = '';
      planState.attendanceRate = '';
      planState.retentionRate = '';
      planState.titleIStatus = '';
      planState.designations = [];
      break;
    case 3:
      planState.strengths = [];
      planState.challenges = [];
      planState.rootCauses = [];
      planState.priorityAreas = [];
      break;
    case 4:
      planState.schoolVision = '';
      planState.schoolMission = '';
      break;
    case 5:
      planState.selectedValues = [];
      planState.cultureCommitments = [];
      break;
    case 6:
      planState.schoolGoals = [];
      planState.goalAreaPlans = [];
      break;
    case 7:
      planState.actionPlans = [];
      break;
    case 8:
      planState.stakeholderThemes = [];
      planState.committeeMembers = [];
      planState.familyEngagement = '';
      break;
    case 9:
      planState.fundingSources = [];
      planState.investments = [];
      planState.resourceAlignments = [];
      break;
    case 10:
      planState.calendar = {};
      break;
    case 11:
      planState.leadingIndicators = [];
      planState.laggingIndicators = [];
      planState.monitoringFrequency = '';
      planState.accountabilityLead = '';
      break;
    case 12:
      planState.confirmAccuracy = false;
      planState.confirmStakeholders = false;
      planState.planAuthor = '';
      planState.adoptionDate = '';
      break;
  }
  savePlanState();
  renderStep(stepNum);
}

function clearEntirePlan() {
  if (confirm('Are you sure you want to clear the entire plan? This cannot be undone.')) {
    planState = {
      selectedState: '', schoolName: '', schoolType: '', gradeLevels: '', enrollment: '',
      teacherCount: '', studentTeacherRatio: '', principalName: '', schoolYear: '',
      frlRate: '', iepRate: '', elRate: '', pocRate: '',
      readingProf: '', mathProf: '', gradRate: '', absentRate: '',
      suspensionRate: '', attendanceRate: '', retentionRate: '',
      schoolRating: '', titleIStatus: '', designations: [],
      districtId: '', districtPlan: null,
      strengths: [], challenges: [], rootCauses: [], dataSources: [], priorityAreas: [],
      otherDataSource: '',
      schoolVision: '', schoolMission: '',
      selectedValues: [], cultureCommitments: [],
      schoolGoals: [], goalAreaPlans: [],
      actionPlans: [],
      stakeholders: [], stakeholderThemes: [], committeeMembers: [], familyEngagement: '',
      stakeholderUploadData: null,
      fundingSources: [], investments: [], resourceAlignments: [],
      calendar: {},
      leadingIndicators: [], laggingIndicators: [], monitoringFrequency: '', accountabilityLead: '',
      confirmAccuracy: false, confirmStakeholders: false, planAuthor: '', adoptionDate: '',
      finalized: false
    };
    savePlanState();
    currentStep = 1;
    renderStep(1);
    updateProgressBar();
  }
}

// ============================================================================
// 4. STATE CONFIGURATION & DROPDOWNS
// ============================================================================

function populateStateDropdown() {
  var stateSelect = document.getElementById('stateSelect');
  if (!stateSelect) return;

  stateSelect.innerHTML = '<option value="">-- Select Your State --</option>';

  // Use STATE_ESSA_CONFIG if available, otherwise fallback
  if (typeof STATE_ESSA_CONFIG !== 'undefined' && STATE_ESSA_CONFIG.getAllStates) {
    var states = STATE_ESSA_CONFIG.getAllStates();
    states.forEach(function(s) {
      var option = document.createElement('option');
      option.value = s.abbr;
      option.textContent = s.name + ' (' + s.abbr + ')';
      stateSelect.appendChild(option);
    });
  } else {
    var fallbackStates = [
      'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA',
      'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
      'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
      'VA','WA','WV','WI','WY'
    ];
    fallbackStates.forEach(function(st) {
      var option = document.createElement('option');
      option.value = st;
      option.textContent = st;
      stateSelect.appendChild(option);
    });
  }

  if (planState.selectedState) {
    stateSelect.value = planState.selectedState;
    onStateSelected(planState.selectedState);
  }
}

function onStateSelected(stateAbbr) {
  planState.selectedState = stateAbbr;
  savePlanState();

  // Load state-specific ESSA requirements
  var reqContainer = document.getElementById('stateRequirementsInfo');
  var desigContainer = document.getElementById('designationCheckboxes');

  if (!stateAbbr) {
    if (reqContainer) reqContainer.innerHTML = '';
    return;
  }

  if (typeof STATE_ESSA_CONFIG === 'undefined' || !STATE_ESSA_CONFIG.getStateConfig) return;

  var config = STATE_ESSA_CONFIG.getStateConfig(stateAbbr);
  if (!config) return;

  // Show state-specific ESSA info
  if (reqContainer) {
    var scopeLabel = config.sipScope === 'all_schools' ? 'All schools' : 'Designated schools only';
    var reqHtml = '<div class="state-requirements-card">';
    reqHtml += '<h4>' + config.name + ' ESSA Requirements</h4>';
    reqHtml += '<p class="req-scope"><strong>SIP Scope:</strong> ' + scopeLabel + '</p>';

    if (config.assessmentName) {
      reqHtml += '<p><strong>State Assessment:</strong> ' + config.assessmentName + '</p>';
    }

    if (config.requiredComponents && config.requiredComponents.length > 0) {
      reqHtml += '<p><strong>Required Plan Components:</strong></p><ul class="req-components-list">';
      config.requiredComponents.forEach(function(comp) {
        var label = comp.replace(/_/g, ' ').replace(/\b\w/g, function(l) { return l.toUpperCase(); });
        reqHtml += '<li>' + label + '</li>';
      });
      reqHtml += '</ul>';
    }

    if (config.focusAreas && config.focusAreas.length > 0) {
      reqHtml += '<p><strong>State Focus Areas:</strong></p><ul class="req-components-list">';
      config.focusAreas.forEach(function(area) {
        reqHtml += '<li>' + area + '</li>';
      });
      reqHtml += '</ul>';
    }

    reqHtml += '</div>';
    reqContainer.innerHTML = reqHtml;
  }

  // Populate designation checkboxes based on state config
  if (desigContainer) {
    var desigHtml = '';
    var designations = config.designations || {};
    var desigKeys = Object.keys(designations);

    if (desigKeys.length > 0) {
      desigKeys.forEach(function(key) {
        var d = designations[key];
        var checked = planState.designations && planState.designations.indexOf(key.toUpperCase()) > -1 ? ' checked' : '';
        desigHtml += '<label class="checkbox-label">';
        desigHtml += '<input type="checkbox" value="' + key.toUpperCase() + '" onchange="toggleDesignation(this.value, this.checked)"' + checked + '>';
        desigHtml += ' <strong>' + (d.name || key.toUpperCase()) + '</strong>';
        if (d.fullName) desigHtml += ' - ' + d.fullName;
        desigHtml += '</label>';
      });
    } else {
      // Fallback to federal defaults
      ['CSI', 'TSI', 'ATSI'].forEach(function(key) {
        var checked = planState.designations && planState.designations.indexOf(key) > -1 ? ' checked' : '';
        desigHtml += '<label class="checkbox-label">';
        desigHtml += '<input type="checkbox" value="' + key + '" onchange="toggleDesignation(this.value, this.checked)"' + checked + '>';
        desigHtml += ' <strong>' + key + '</strong>';
        desigHtml += '</label>';
      });
    }
    desigContainer.innerHTML = desigHtml;
  }
}

function toggleDesignation(value, checked) {
  if (!planState.designations) planState.designations = [];
  if (checked) {
    if (planState.designations.indexOf(value) === -1) {
      planState.designations.push(value);
    }
  } else {
    planState.designations = planState.designations.filter(function(d) { return d !== value; });
  }
  savePlanState();
}

function populateCommitteeRoles() {
  var roleSelect = document.getElementById('committeeMemberRole');
  if (!roleSelect) return;

  var roles = [
    'Principal', 'Assistant Principal', 'Teacher', 'Counselor', 'Special Education Coordinator',
    'EL Coordinator', 'Parent', 'Community Partner', 'District Administrator', 'Other'
  ];

  roleSelect.innerHTML = '<option value="">-- Role --</option>';
  roles.forEach(function(role) {
    var option = document.createElement('option');
    option.value = role;
    option.textContent = role;
    roleSelect.appendChild(option);
  });
}

// ============================================================================
// 5. RENDER FUNCTIONS - Master Dispatcher
// ============================================================================

function renderStep(stepNum) {
  var stepContents = document.querySelectorAll('.step-content');
  stepContents.forEach(function(el) { el.classList.remove('active'); });

  var stepItems = document.querySelectorAll('.step-item');
  stepItems.forEach(function(el) { el.classList.remove('active'); });

  var activeContent = document.querySelector('.step-content[data-step="' + stepNum + '"]');
  if (activeContent) activeContent.classList.add('active');

  var activeItem = document.querySelector('.step-item[data-step="' + stepNum + '"]');
  if (activeItem) activeItem.classList.add('active');

  switch(stepNum) {
    case 1: renderStep1(); break;
    case 2: renderStep2(); break;
    case 3: renderStep3(); break;
    case 4: renderStep4(); break;
    case 5: renderStep5(); break;
    case 6: renderStep6(); break;
    case 7: renderStep7(); break;
    case 8: renderStep8(); break;
    case 9: renderStep9(); break;
    case 10: renderStep10(); break;
    case 11: renderStep11(); break;
    case 12: renderStep12(); break;
  }
}

// ============================================================================
// 6. STEP 1: DISTRICT CONNECTION
// ============================================================================

function saveStep1Data() {
  // District selection is saved on selection
}

function renderStep1() {
  updateDistrictReferences();
}

function searchDistrict() {
  var searchInput = document.getElementById('districtSearch');
  if (!searchInput) return;

  var query = searchInput.value.trim().toLowerCase();
  if (!query) {
    alert('Please enter a district name to search.');
    return;
  }

  var results = DISTRICT_DATABASE.filter(function(d) {
    return d.name.toLowerCase().indexOf(query) !== -1 || d.location.toLowerCase().indexOf(query) !== -1;
  });

  if (results.length === 0) {
    alert('No districts found matching "' + query + '"');
    return;
  }

  if (results.length === 1) {
    selectDistrict(results[0]);
  } else {
    var resultsContainer = document.getElementById('districtRefBox1');
    if (resultsContainer) {
      var html = '<h3 style="margin-bottom:1rem">Search Results</h3>';
      results.forEach(function(d) {
        html += '<div class="suggestion-card" style="padding:1rem;margin-bottom:0.75rem;background:#f9f7f4;border:1px solid #d0c5ba;border-radius:6px;cursor:pointer;transition:all 0.2s" onclick="selectDistrict(' + JSON.stringify(d).replace(/"/g, '&quot;') + ')">';
        html += '<div style="font-weight:600;margin-bottom:0.25rem">' + escapeHtml(d.name) + '</div>';
        html += '<div style="font-size:0.875rem;color:#666">' + escapeHtml(d.location) + ' | ' + escapeHtml(d.enrollment.toString()) + ' students</div>';
        html += '</div>';
      });
      resultsContainer.innerHTML = html;
    }
  }
}

function selectDistrict(districtObj) {
  planState.districtId = districtObj.id;
  planState.districtPlan = districtObj;
  savePlanState();
  cascadeDistrictGoalAreas();
  updateDistrictReferences();
  var searchInput = document.getElementById('districtSearch');
  if (searchInput) searchInput.value = '';
}

function clearDistrictSelection() {
  planState.districtId = '';
  planState.districtPlan = null;
  savePlanState();
  updateDistrictReferences();
}

function skipDistrictConnection() {
  stepGoto(2);
}

function updateDistrictReferences() {
  var refBoxes = [
    { id: 'districtRefContent1', district: true },
    { id: 'districtRefContent4', district: true },
    { id: 'districtRefContent5', values: true },
    { id: 'districtRefContent6', goals: true }
  ];

  refBoxes.forEach(function(box) {
    var el = document.getElementById(box.id);
    if (!el) return;

    if (!planState.districtPlan) {
      el.innerHTML = '<p class="text-muted">Link a district plan in Step 1 to see district information here.</p>';
      return;
    }

    var html = '<div style="background:#e8f5e9;padding:1rem;border-radius:6px;border-left:4px solid #6ECF6E">';

    if (box.district) {
      html += '<p style="margin:0 0 0.5rem 0"><strong>' + escapeHtml(planState.districtPlan.name) + '</strong></p>';
      html += '<p style="margin:0 0 0.25rem 0;font-size:0.875rem;color:#555"><strong>Vision:</strong> ' + escapeHtml(planState.districtPlan.vision) + '</p>';
      html += '<p style="margin:0;font-size:0.875rem;color:#555"><strong>Mission:</strong> ' + escapeHtml(planState.districtPlan.mission) + '</p>';
    }
    if (box.values) {
      html += '<p style="margin:0;font-size:0.875rem;color:#555"><strong>Values:</strong> ' + (planState.districtPlan.values || []).map(escapeHtml).join(', ') + '</p>';
    }
    if (box.goals) {
      html += '<p style="margin:0;font-size:0.875rem;color:#555"><strong>Goals:</strong></p>';
      html += '<ul style="margin:0.5rem 0 0 1.5rem;font-size:0.875rem;color:#555">';
      (planState.districtPlan.goals || []).forEach(function(goal) {
        html += '<li>' + escapeHtml(goal) + '</li>';
      });
      html += '</ul>';
    }

    // Show inherited goal areas from district cascade
    if (box.id === 'districtRefContent6' && planState.goalAreaPlans && planState.goalAreaPlans.length > 0) {
      var inheritedAreas = planState.goalAreaPlans.map(function(ga) { return ga.goalAreaName; });
      if (inheritedAreas.length > 0) {
        html += '<p style="margin:1rem 0 0 0;font-size:0.875rem;color:#555"><strong>Suggested Goal Areas (from district domains):</strong></p>';
        html += '<ul style="margin:0.5rem 0 0 1.5rem;font-size:0.875rem;color:#555">';
        inheritedAreas.forEach(function(area) {
          html += '<li>' + escapeHtml(area) + '</li>';
        });
        html += '</ul>';
      }
    }

    html += '</div>';
    el.innerHTML = html;
  });
}

// ============================================================================
// 7. STEP 2: SCHOOL PROFILE
// ============================================================================

function saveStep2Data() {
  planState.schoolName = document.getElementById('schoolName') ? document.getElementById('schoolName').value : '';
  planState.schoolType = document.getElementById('schoolType') ? document.getElementById('schoolType').value : '';
  planState.gradeLevels = document.getElementById('gradeLevels') ? document.getElementById('gradeLevels').value : '';
  planState.enrollment = document.getElementById('enrollment') ? document.getElementById('enrollment').value : '';
  planState.teacherCount = document.getElementById('teacherCount') ? document.getElementById('teacherCount').value : '';
  planState.studentTeacherRatio = document.getElementById('studentTeacherRatio') ? document.getElementById('studentTeacherRatio').value : '';
  planState.principalName = document.getElementById('principalName') ? document.getElementById('principalName').value : '';
  planState.schoolYear = document.getElementById('schoolYear') ? document.getElementById('schoolYear').value : '';
  planState.frlRate = document.getElementById('frlRate') ? document.getElementById('frlRate').value : '';
  planState.iepRate = document.getElementById('iepRate') ? document.getElementById('iepRate').value : '';
  planState.elRate = document.getElementById('elRate') ? document.getElementById('elRate').value : '';
  planState.pocRate = document.getElementById('pocRate') ? document.getElementById('pocRate').value : '';
  planState.readingProf = document.getElementById('readingProf') ? document.getElementById('readingProf').value : '';
  planState.mathProf = document.getElementById('mathProf') ? document.getElementById('mathProf').value : '';
  planState.gradRate = document.getElementById('gradRate') ? document.getElementById('gradRate').value : '';
  planState.absentRate = document.getElementById('absentRate') ? document.getElementById('absentRate').value : '';
  planState.suspensionRate = document.getElementById('suspensionRate') ? document.getElementById('suspensionRate').value : '';
  planState.attendanceRate = document.getElementById('attendanceRate') ? document.getElementById('attendanceRate').value : '';
  planState.retentionRate = document.getElementById('retentionRate') ? document.getElementById('retentionRate').value : '';
  planState.titleIStatus = document.getElementById('titleIStatus') ? document.getElementById('titleIStatus').value : '';

  // Collect designations
  var designations = [];
  ['designationCSI', 'designationTSI', 'designationATSI', 'designationMRI', 'designationNone'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el && el.checked) {
      designations.push(el.value);
    }
  });
  planState.designations = designations;
}

function renderStep2() {
  updateDistrictReferences();

  var fields = ['schoolName', 'schoolType', 'gradeLevels', 'enrollment', 'teacherCount',
    'studentTeacherRatio', 'principalName', 'schoolYear', 'frlRate', 'iepRate', 'elRate',
    'pocRate', 'readingProf', 'mathProf', 'gradRate', 'absentRate', 'suspensionRate',
    'attendanceRate', 'retentionRate'];

  fields.forEach(function(fieldId) {
    var el = document.getElementById(fieldId);
    if (el && planState[fieldId]) {
      el.value = planState[fieldId];
    }
  });

  var titleIEl = document.getElementById('titleIStatus');
  if (titleIEl) {
    titleIEl.value = planState.titleIStatus || '';
  }

  // Restore designations
  var designationIds = ['designationCSI', 'designationTSI', 'designationATSI', 'designationMRI', 'designationNone'];
  designationIds.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.checked = planState.designations && planState.designations.indexOf(el.value) !== -1;
    }
  });
}

// ============================================================================
// 8. STEP 3: NEEDS ASSESSMENT
// ============================================================================

function saveStep3Data() {
  // Selections are saved when items are added/removed
}

function renderStep3() {
  updateDistrictReferences();
  renderSuggestionCards('strengthsList', SCHOOL_STRENGTHS_DB, planState.strengths, 'addStrength');
  renderSuggestionCards('challengesList', SCHOOL_CHALLENGES_DB, planState.challenges, 'addChallenge');
  renderSuggestionCards('rootCausesList', ROOT_CAUSES_DB, planState.rootCauses, 'addRootCause');
  renderSuggestionCards('priorityAreasList', PRIORITY_AREAS_DB, planState.priorityAreas, 'addPriorityArea');
}

function renderSuggestionCards(containerId, database, selectedArray, addFunction) {
  var container = document.getElementById(containerId);
  if (!container) return;

  var html = '<div class="suggestion-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem">';
  database.forEach(function(item, idx) {
    var isSelected = selectedArray.indexOf(item) !== -1;
    var bgColor = isSelected ? 'rgba(0,180,204,0.08)' : '#fff';
    var borderColor = isSelected ? '#00B4CC' : '#d0c5ba';
    var checkmark = isSelected ? '✓ ' : '';

    html += '<div class="suggestion-card" style="padding:0.75rem;cursor:pointer;border:2px solid ' + borderColor + ';border-radius:6px;background:' + bgColor + ';transition:all 0.2s;font-size:0.875rem" onclick="' + addFunction + '(' + idx + ')">';
    html += '<span style="color:#00B4CC;font-weight:600">' + checkmark + '</span>';
    html += '<span>' + escapeHtml(item) + '</span>';
    html += '</div>';
  });
  html += '</div>';
  container.innerHTML = html;
}

function addStrength(idx) {
  var item = SCHOOL_STRENGTHS_DB[idx];
  if (item && planState.strengths.indexOf(item) === -1) {
    planState.strengths.push(item);
    savePlanState();
    renderStep3();
  } else if (item && planState.strengths.indexOf(item) !== -1) {
    planState.strengths.splice(planState.strengths.indexOf(item), 1);
    savePlanState();
    renderStep3();
  }
}

function addChallenge(idx) {
  var item = SCHOOL_CHALLENGES_DB[idx];
  if (item && planState.challenges.indexOf(item) === -1) {
    planState.challenges.push(item);
    savePlanState();
    renderStep3();
  } else if (item && planState.challenges.indexOf(item) !== -1) {
    planState.challenges.splice(planState.challenges.indexOf(item), 1);
    savePlanState();
    renderStep3();
  }
}

function addRootCause(idx) {
  var item = ROOT_CAUSES_DB[idx];
  if (item && planState.rootCauses.indexOf(item) === -1) {
    planState.rootCauses.push(item);
    savePlanState();
    renderStep3();
  } else if (item && planState.rootCauses.indexOf(item) !== -1) {
    planState.rootCauses.splice(planState.rootCauses.indexOf(item), 1);
    savePlanState();
    renderStep3();
  }
}

function addPriorityArea(idx) {
  var item = PRIORITY_AREAS_DB[idx];
  if (item && planState.priorityAreas.indexOf(item) === -1) {
    planState.priorityAreas.push(item);
    savePlanState();
    renderStep3();
  } else if (item && planState.priorityAreas.indexOf(item) !== -1) {
    planState.priorityAreas.splice(planState.priorityAreas.indexOf(item), 1);
    savePlanState();
    renderStep3();
  }
}

function addCustomStrength() {
  var input = document.getElementById('customStrengthInput');
  if (input && input.value.trim()) {
    planState.strengths.push(input.value.trim());
    input.value = '';
    savePlanState();
    renderStep3();
  }
}

function addCustomChallenge() {
  var input = document.getElementById('customChallengeInput');
  if (input && input.value.trim()) {
    planState.challenges.push(input.value.trim());
    input.value = '';
    savePlanState();
    renderStep3();
  }
}

function addCustomRootCause() {
  var input = document.getElementById('customRootCauseInput');
  if (input && input.value.trim()) {
    planState.rootCauses.push(input.value.trim());
    input.value = '';
    savePlanState();
    renderStep3();
  }
}

function addCustomPriority() {
  var input = document.getElementById('customPriorityInput');
  if (input && input.value.trim()) {
    planState.priorityAreas.push(input.value.trim());
    input.value = '';
    savePlanState();
    renderStep3();
  }
}

// ============================================================================
// 9. STEP 4: VISION & MISSION
// ============================================================================

function saveStep4Data() {
  planState.schoolVision = document.getElementById('schoolVision') ? document.getElementById('schoolVision').value : '';
  planState.schoolMission = document.getElementById('schoolMission') ? document.getElementById('schoolMission').value : '';
}

function renderStep4() {
  updateDistrictReferences();

  var visionEl = document.getElementById('schoolVision');
  if (visionEl) {
    visionEl.value = planState.schoolVision || '';
    updateCharCount('schoolVision', 'visionCharCount');
  }

  var missionEl = document.getElementById('schoolMission');
  if (missionEl) {
    missionEl.value = planState.schoolMission || '';
    updateCharCount('schoolMission', 'missionCharCount');
  }

  // Render vision templates
  var visionTemplatesEl = document.getElementById('visionTemplates');
  if (visionTemplatesEl) {
    var html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">';
    VISION_TEMPLATES.forEach(function(template) {
      html += '<div class="suggestion-card" style="padding:0.75rem;cursor:pointer;border:1px solid #d0c5ba;border-radius:6px;background:#fff;transition:all 0.2s;font-size:0.875rem" onclick="document.getElementById(\'schoolVision\').value=' + JSON.stringify(template) + ';updateCharCount(\'schoolVision\', \'visionCharCount\')">';
      html += escapeHtml(template);
      html += '</div>';
    });
    html += '</div>';
    visionTemplatesEl.innerHTML = html;
  }

  // Render mission templates
  var missionTemplatesEl = document.getElementById('missionTemplates');
  if (missionTemplatesEl) {
    var html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">';
    MISSION_TEMPLATES.forEach(function(template) {
      html += '<div class="suggestion-card" style="padding:0.75rem;cursor:pointer;border:1px solid #d0c5ba;border-radius:6px;background:#fff;transition:all 0.2s;font-size:0.875rem" onclick="document.getElementById(\'schoolMission\').value=' + JSON.stringify(template) + ';updateCharCount(\'schoolMission\', \'missionCharCount\')">';
      html += escapeHtml(template);
      html += '</div>';
    });
    html += '</div>';
    missionTemplatesEl.innerHTML = html;
  }
}

// ============================================================================
// 10. STEP 5: VALUES & CULTURE
// ============================================================================

function saveStep5Data() {
  // Selections are saved when items are added/removed
}

function renderStep5() {
  updateDistrictReferences();
  renderValuesList();
  renderCultureList();
}

function renderValuesList() {
  var container = document.getElementById('valuesList');
  if (!container) return;

  var html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem">';
  CORE_VALUES.forEach(function(value, idx) {
    var isSelected = planState.selectedValues.indexOf(value) !== -1;
    var bgColor = isSelected ? 'rgba(0,180,204,0.08)' : '#fff';
    var borderColor = isSelected ? '#00B4CC' : '#d0c5ba';
    var checkmark = isSelected ? '✓ ' : '';

    html += '<div class="suggestion-card" style="padding:0.75rem;cursor:pointer;border:2px solid ' + borderColor + ';border-radius:6px;background:' + bgColor + ';transition:all 0.2s;font-size:0.875rem" onclick="toggleValue(' + idx + ')">';
    html += '<span style="color:#00B4CC;font-weight:600">' + checkmark + '</span>';
    html += '<span>' + escapeHtml(value) + '</span>';
    html += '</div>';
  });
  html += '</div>';

  html += '<div style="margin-top:1rem">';
  planState.selectedValues.forEach(function(value, idx) {
    html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0.75rem;background:#f5f5f5;border-radius:6px;margin-bottom:0.5rem;font-size:0.875rem">';
    html += '<span>' + escapeHtml(value) + '</span>';
    html += '<button class="btn-clear" onclick="removeValue(' + idx + ')" style="padding:0.25rem 0.5rem;font-size:0.75rem">Remove</button>';
    html += '</div>';
  });
  html += '</div>';

  container.innerHTML = html;
}

function toggleValue(idx) {
  var value = CORE_VALUES[idx];
  if (planState.selectedValues.indexOf(value) === -1) {
    if (planState.selectedValues.length < 5) {
      planState.selectedValues.push(value);
    } else {
      alert('You can select up to 5 values.');
      return;
    }
  } else {
    planState.selectedValues.splice(planState.selectedValues.indexOf(value), 1);
  }
  savePlanState();
  renderValuesList();
}

function removeValue(idx) {
  planState.selectedValues.splice(idx, 1);
  savePlanState();
  renderValuesList();
}

function addCustomValue() {
  var input = document.getElementById('customValueInput');
  if (input && input.value.trim()) {
    if (planState.selectedValues.length < 5) {
      planState.selectedValues.push(input.value.trim());
      input.value = '';
      savePlanState();
      renderValuesList();
    } else {
      alert('You can select up to 5 values.');
    }
  }
}

function renderCultureList() {
  var container = document.getElementById('cultureList');
  if (!container) return;

  var html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem">';
  CULTURE_COMMITMENTS_DB.forEach(function(commitment, idx) {
    var isSelected = planState.cultureCommitments.indexOf(commitment) !== -1;
    var bgColor = isSelected ? 'rgba(0,180,204,0.08)' : '#fff';
    var borderColor = isSelected ? '#00B4CC' : '#d0c5ba';
    var checkmark = isSelected ? '✓ ' : '';

    html += '<div class="suggestion-card" style="padding:0.75rem;cursor:pointer;border:2px solid ' + borderColor + ';border-radius:6px;background:' + bgColor + ';transition:all 0.2s;font-size:0.875rem" onclick="toggleCultureCommitment(' + idx + ')">';
    html += '<span style="color:#00B4CC;font-weight:600">' + checkmark + '</span>';
    html += '<span>' + escapeHtml(commitment) + '</span>';
    html += '</div>';
  });
  html += '</div>';

  html += '<div style="margin-top:1rem">';
  planState.cultureCommitments.forEach(function(commitment, idx) {
    html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0.75rem;background:#f5f5f5;border-radius:6px;margin-bottom:0.5rem;font-size:0.875rem">';
    html += '<span>' + escapeHtml(commitment) + '</span>';
    html += '<button class="btn-clear" onclick="removeCultureCommitment(' + idx + ')" style="padding:0.25rem 0.5rem;font-size:0.75rem">Remove</button>';
    html += '</div>';
  });
  html += '</div>';

  container.innerHTML = html;
}

function toggleCultureCommitment(idx) {
  var commitment = CULTURE_COMMITMENTS_DB[idx];
  if (planState.cultureCommitments.indexOf(commitment) === -1) {
    planState.cultureCommitments.push(commitment);
  } else {
    planState.cultureCommitments.splice(planState.cultureCommitments.indexOf(commitment), 1);
  }
  savePlanState();
  renderCultureList();
}

function removeCultureCommitment(idx) {
  planState.cultureCommitments.splice(idx, 1);
  savePlanState();
  renderCultureList();
}

function addCustomCulture() {
  var input = document.getElementById('customCultureInput');
  if (input && input.value.trim()) {
    planState.cultureCommitments.push(input.value.trim());
    input.value = '';
    savePlanState();
    renderCultureList();
  }
}

// ============================================================================
// 11. STEP 6: SCHOOL GOALS (GOAL BUILDER) - HIERARCHICAL
// ============================================================================

// GOAL AREA DATABASE (default areas)
var GOAL_AREAS_DB = [
  { key: 'student_success', name: 'Student Success' },
  { key: 'adult_learning', name: 'Adult Learning Culture' },
  { key: 'connectedness', name: 'Connectedness' },
  { key: 'academic_equity', name: 'Academic Equity' },
  { key: 'college_career', name: 'College & Career Readiness' }
];

// ESSA TIERS
var ESSA_TIERS = {
  1: { label: 'Tier 1: Strong Evidence', color: '#00B4CC' },
  2: { label: 'Tier 2: Moderate Evidence', color: '#7FB3D5' },
  3: { label: 'Tier 3: Promising Evidence', color: '#A8D8D8' },
  4: { label: 'Tier 4: Limited Evidence', color: '#D0C5BA' }
};

// NAMED PROGRAMS DATABASE
var NAMED_PROGRAMS_DB = [
  { key: 'iready', label: 'iReady' },
  { key: 'mtss', label: 'MTSS/RTI' },
  { key: 'pbis', label: 'PBIS' },
  { key: 'sel', label: 'Social-Emotional Learning' },
  { key: 'bilingual', label: 'Bilingual Program' },
  { key: 'special_ed', label: 'Special Education' },
  { key: 'gifted', label: 'Gifted & Talented' },
  { key: 'mental_health', label: 'Mental Health Services' },
  { key: 'family_engagement', label: 'Family Engagement' },
  { key: 'professional_dev', label: 'Professional Development' }
];

// THEMES DATABASE
var THEMES_DB = [
  { key: 'data_review', label: 'Data Review & Analysis' },
  { key: 'scheduling', label: 'Master Schedule Adjustment' },
  { key: 'hiring', label: 'Hiring & Staffing' },
  { key: 'allocation', label: 'Resource Allocation' },
  { key: 'professional_dev', label: 'Professional Development' },
  { key: 'family_engagement', label: 'Family Engagement' },
  { key: 'community_partnerships', label: 'Community Partnerships' },
  { key: 'curriculum', label: 'Curriculum & Instruction' }
];

// ============================================================================
// DISTRICT-TO-SCHOOL GOAL AREA CASCADE
// ============================================================================

// Mapping table: district strategic domain names to school goal area keys
var DOMAIN_TO_GOAL_AREA_MAP = {
  'Student Learning & Achievement': 'student_success',
  'Equity & Access': 'academic_equity',
  'Talent Management': 'adult_learning',
  'Operational Excellence': null,
  'Community & Family Engagement': 'connectedness',
  'Social-Emotional Learning': 'connectedness',
  'College & Career Readiness': 'college_career',
  'Technology & Innovation': 'student_success',
  'Safety & School Climate': 'connectedness'
};

function cascadeDistrictGoalAreas() {
  var dp = planState.districtPlan;
  if (!dp || !dp.strategicDomains || !dp.strategicDomains.length) return;

  // Only cascade if school hasn't started building goals yet
  var hasExistingWork = planState.goalAreaPlans && planState.goalAreaPlans.length > 0 &&
    planState.goalAreaPlans.some(function(p) { return p.problemStatements && p.problemStatements.length > 0; });
  if (hasExistingWork) return;

  var newGoalAreas = [];
  var addedKeys = {};

  dp.strategicDomains.forEach(function(domainName) {
    var goalAreaKey = DOMAIN_TO_GOAL_AREA_MAP[domainName];
    if (!goalAreaKey || addedKeys[goalAreaKey]) return;

    var areaObj = GOAL_AREAS_DB.find(function(a) { return a.key === goalAreaKey; });
    if (!areaObj) return;

    addedKeys[goalAreaKey] = true;
    newGoalAreas.push({
      goalAreaKey: goalAreaKey,
      goalAreaName: areaObj.name,
      problemStatements: []
    });
  });

  if (newGoalAreas.length > 0) {
    planState.goalAreaPlans = newGoalAreas;
    savePlanState();
  }
}

function saveStep6Data() {
  // Goals are saved when created
}

function renderStep6() {
  updateDistrictReferences();
  renderGoalAreaPlans();
}

// ============================================================================
// MIGRATION: OLD FORMAT TO NEW FORMAT
// ============================================================================

function migrateOldGoalFormat() {
  if (planState.schoolGoals && planState.schoolGoals.length > 0 && (!planState.goalAreaPlans || planState.goalAreaPlans.length === 0)) {
    planState.goalAreaPlans = [{
      goalAreaKey: 'student_success',
      goalAreaName: 'Student Success',
      problemStatements: [{
        id: 'ps_migrated_' + Date.now(),
        statement: 'Migrated from previous plan format',
        rootCause: '',
        goals: planState.schoolGoals.map(function(old, idx) {
          return {
            id: old.id || 'goal_' + Date.now() + idx,
            goalNumber: idx + 1,
            goalStatement: old.goalStatement,
            annualObjectives: [{
              id: 'apo_' + Date.now() + idx,
              objectiveNumber: 1,
              objectiveStatement: old.metric + ': ' + old.target,
              strategies: [{
                id: 'strat_' + Date.now() + idx,
                strategyNumber: 1,
                description: (old.strategies || []).join('; '),
                essaTier: 3,
                namedPrograms: [],
                themes: [],
                owner: '',
                timeline: old.targetDate || '',
                metric: old.metric || '',
                target: old.target || ''
              }]
            }]
          };
        })
      }]
    }];
    savePlanState();
  }
}

// ============================================================================
// GOAL AREA FUNCTIONS
// ============================================================================

function addGoalArea(goalAreaKey) {
  var areaObj = GOAL_AREAS_DB.find(function(a) { return a.key === goalAreaKey; });
  if (!areaObj) return;

  var alreadyExists = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
  if (alreadyExists) return;

  planState.goalAreaPlans.push({
    goalAreaKey: goalAreaKey,
    goalAreaName: areaObj.name,
    problemStatements: []
  });
  savePlanState();
  renderGoalAreaPlans();
}

function removeGoalArea(goalAreaKey) {
  if (confirm('Remove this entire goal area and all nested content?')) {
    var idx = planState.goalAreaPlans.findIndex(function(p) { return p.goalAreaKey === goalAreaKey; });
    if (idx !== -1) {
      planState.goalAreaPlans.splice(idx, 1);
      savePlanState();
      renderGoalAreaPlans();
    }
  }
}

function renderGoalAreaSelector() {
  var usedKeys = planState.goalAreaPlans.map(function(p) { return p.goalAreaKey; });
  var availableAreas = GOAL_AREAS_DB.filter(function(a) { return usedKeys.indexOf(a.key) === -1; });

  var html = '';
  if (availableAreas.length === 0) {
    html = '<p style="padding:1rem;text-align:center;color:#999">All goal areas have been added.</p>';
  } else {
    html = '<div style="padding:1rem">';
    availableAreas.forEach(function(area) {
      html += '<button class="btn btn-primary" onclick="addGoalArea(\'' + area.key + '\')" style="display:block;width:100%;margin-bottom:0.5rem;text-align:left">' + area.name + '</button>';
    });
    html += '</div>';
  }
  return html;
}

function renderGoalAreaPlans() {
  var container = document.getElementById('goalsContainer');
  if (!container) return;

  if (planState.goalAreaPlans.length === 0) {
    var html = '<div style="padding:2rem;text-align:center;color:#999">';
    html += '<p style="margin-bottom:1rem">No goal areas added yet. Add your first goal area below.</p>';
    html += renderGoalAreaSelector();
    html += '</div>';
    container.innerHTML = html;
    return;
  }

  var html = '<div style="margin-bottom:2rem">';
  html += '<div style="display:flex;gap:0.5rem;margin-bottom:1rem;flex-wrap:wrap">';

  // Goal Area Tabs
  planState.goalAreaPlans.forEach(function(area, idx) {
    var isActive = (currentGoalAreaKey === area.goalAreaKey);
    html += '<button class="btn' + (isActive ? ' btn-primary' : '') + '" onclick="switchGoalArea(\'' + area.goalAreaKey + '\')" style="padding:0.75rem 1rem;font-size:0.875rem">' + area.goalAreaName + '</button>';
  });

  html += '<button class="btn btn-secondary" onclick="showGoalAreaModal()" style="padding:0.75rem 1rem;font-size:0.875rem">+ Add Area</button>';
  html += '</div>';
  html += '</div>';

  // Active Goal Area Content
  var activeArea = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === currentGoalAreaKey; });
  if (!activeArea) {
    if (planState.goalAreaPlans.length > 0) {
      currentGoalAreaKey = planState.goalAreaPlans[0].goalAreaKey;
      activeArea = planState.goalAreaPlans[0];
    }
  }

  if (activeArea) {
    html += renderProblemStatements(activeArea.goalAreaKey);
  }

  container.innerHTML = html;
}

function switchGoalArea(goalAreaKey) {
  currentGoalAreaKey = goalAreaKey;
  renderGoalAreaPlans();
}

function showGoalAreaModal() {
  var modal = document.getElementById('goalAreaAddModal');
  if (!modal) {
    var div = document.createElement('div');
    div.id = 'goalAreaAddModal';
    div.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999';
    div.innerHTML = '<div style="background:#fff;border-radius:8px;padding:2rem;max-width:500px;width:90%">' +
      '<h3>Add Goal Area</h3>' +
      '<div style="max-height:400px;overflow-y:auto;margin:1rem 0">' +
      renderGoalAreaSelector() +
      '</div>' +
      '<button class="btn" onclick="closeGoalAreaModal()" style="width:100%;margin-top:1rem">Close</button>' +
      '</div>';
    document.body.appendChild(div);
    modal = div;
  }
  modal.style.display = 'flex';
}

function closeGoalAreaModal() {
  var modal = document.getElementById('goalAreaAddModal');
  if (modal) modal.style.display = 'none';
}

var currentGoalAreaKey = '';

// ============================================================================
// PROBLEM STATEMENT FUNCTIONS
// ============================================================================

function addProblemStatement(goalAreaKey) {
  var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
  if (!area) return;

  var ps = {
    id: 'ps_' + Date.now(),
    statement: '',
    rootCause: '',
    goals: []
  };
  area.problemStatements.push(ps);
  savePlanState();
  renderProblemStatements(goalAreaKey);
}

function removeProblemStatement(goalAreaKey, psId) {
  if (confirm('Remove this problem statement and all nested goals and strategies?')) {
    var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
    if (area) {
      var idx = area.problemStatements.findIndex(function(ps) { return ps.id === psId; });
      if (idx !== -1) {
        area.problemStatements.splice(idx, 1);
        savePlanState();
        renderProblemStatements(goalAreaKey);
      }
    }
  }
}

function renderProblemStatements(goalAreaKey) {
  var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
  if (!area) return '';

  var html = '<div style="margin-top:1.5rem">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">';
  html += '<h3 style="margin:0">Problem Statements</h3>';
  html += '<button class="btn btn-primary" onclick="addProblemStatement(\'' + goalAreaKey + '\')" style="padding:0.5rem 1rem;font-size:0.875rem">+ Add Problem Statement</button>';
  html += '</div>';

  if (area.problemStatements.length === 0) {
    html += '<p style="padding:1rem;text-align:center;color:#999;background:#f5f5f5;border-radius:6px">No problem statements added. Click the button above to add one.</p>';
  } else {
    html += '<div style="display:grid;gap:1rem">';
    area.problemStatements.forEach(function(ps) {
      html += renderProblemStatementCard(goalAreaKey, ps);
    });
    html += '</div>';
  }

  html += '</div>';
  return html;
}

function renderProblemStatementCard(goalAreaKey, ps) {
  var html = '<div style="border:1px solid #d0c5ba;border-radius:8px;padding:1.5rem;background:#fafaf8">';
  html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem">';
  html += '<div style="flex:1">';

  if (!ps.statement) {
    html += '<input type="text" id="ps_statement_' + ps.id + '" placeholder="Enter problem statement..." value="" style="width:100%;padding:0.5rem;border:1px solid #d0c5ba;border-radius:4px;margin-bottom:0.5rem;font-family:inherit" onchange="savePSField(\'' + goalAreaKey + '\', \'' + ps.id + '\', \'statement\', this.value)">';
  } else {
    html += '<div style="font-weight:600;color:#333;margin-bottom:0.5rem">' + escapeHtml(ps.statement) + '</div>';
    html += '<button class="btn-link" onclick="editPSStatement(\'' + goalAreaKey + '\', \'' + ps.id + '\')" style="font-size:0.75rem;color:#00B4CC">Edit</button>';
  }

  if (!ps.rootCause) {
    html += '<textarea id="ps_rootcause_' + ps.id + '" placeholder="What is the critical root cause?" style="width:100%;padding:0.5rem;border:1px solid #d0c5ba;border-radius:4px;margin:0.5rem 0;font-family:inherit;min-height:60px" onchange="savePSField(\'' + goalAreaKey + '\', \'' + ps.id + '\', \'rootCause\', this.value)"></textarea>';
  } else {
    html += '<div style="margin-top:0.5rem"><small style="color:#666">Root Cause:</small><div style="font-size:0.875rem;color:#333">' + escapeHtml(ps.rootCause) + '</div>';
    html += '<button class="btn-link" onclick="editPSRootCause(\'' + goalAreaKey + '\', \'' + ps.id + '\')" style="font-size:0.75rem;color:#00B4CC">Edit</button></div>';
  }

  html += '</div>';
  html += '<button class="btn-clear" onclick="removeProblemStatement(\'' + goalAreaKey + '\', \'' + ps.id + '\')" style="padding:0.5rem;font-size:0.75rem;color:#c44536">Remove</button>';
  html += '</div>';

  // Goals under this problem statement
  html += renderGoals(goalAreaKey, ps.id);

  html += '</div>';
  return html;
}

function savePSField(goalAreaKey, psId, field, value) {
  var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
  if (area) {
    var ps = area.problemStatements.find(function(ps) { return ps.id === psId; });
    if (ps) {
      ps[field] = value;
      savePlanState();
      renderProblemStatements(goalAreaKey);
    }
  }
}

function editPSStatement(goalAreaKey, psId) {
  var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
  if (area) {
    var ps = area.problemStatements.find(function(ps) { return ps.id === psId; });
    if (ps) {
      ps.statement = '';
      savePlanState();
      renderProblemStatements(goalAreaKey);
    }
  }
}

function editPSRootCause(goalAreaKey, psId) {
  var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
  if (area) {
    var ps = area.problemStatements.find(function(ps) { return ps.id === psId; });
    if (ps) {
      ps.rootCause = '';
      savePlanState();
      renderProblemStatements(goalAreaKey);
    }
  }
}

// ============================================================================
// GOAL FUNCTIONS
// ============================================================================

function addGoal(goalAreaKey, psId) {
  var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
  if (!area) return;
  var ps = area.problemStatements.find(function(ps) { return ps.id === psId; });
  if (!ps) return;

  var goalNum = ps.goals.length + 1;
  ps.goals.push({
    id: 'goal_' + Date.now(),
    goalNumber: goalNum,
    goalStatement: '',
    annualObjectives: []
  });
  savePlanState();
  renderProblemStatements(goalAreaKey);
}

function removeGoal(goalAreaKey, psId, goalId) {
  if (confirm('Remove this goal and all nested APOs and strategies?')) {
    var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
    if (area) {
      var ps = area.problemStatements.find(function(ps) { return ps.id === psId; });
      if (ps) {
        var idx = ps.goals.findIndex(function(g) { return g.id === goalId; });
        if (idx !== -1) {
          ps.goals.splice(idx, 1);
          savePlanState();
          renderProblemStatements(goalAreaKey);
        }
      }
    }
  }
}

function renderGoals(goalAreaKey, psId) {
  var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
  if (!area) return '';
  var ps = area.problemStatements.find(function(ps) { return ps.id === psId; });
  if (!ps) return '';

  var html = '<div style="margin-top:1rem;border-top:1px solid #d0c5ba;padding-top:1rem">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem">';
  html += '<h4 style="margin:0;font-size:0.95rem">Goals</h4>';
  html += '<button class="btn btn-secondary" onclick="addGoal(\'' + goalAreaKey + '\', \'' + psId + '\')" style="padding:0.4rem 0.8rem;font-size:0.75rem">+ Goal</button>';
  html += '</div>';

  if (ps.goals.length === 0) {
    html += '<p style="font-size:0.875rem;color:#999;margin:0">No goals added yet.</p>';
  } else {
    html += '<div style="display:grid;gap:0.75rem">';
    ps.goals.forEach(function(goal) {
      html += renderGoalCard(goalAreaKey, psId, goal);
    });
    html += '</div>';
  }

  html += '</div>';
  return html;
}

function renderGoalCard(goalAreaKey, psId, goal) {
  var html = '<div style="background:#fff;border:1px solid #e0dbd0;border-radius:6px;padding:1rem">';
  html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.75rem">';
  html += '<div style="flex:1">';
  html += '<div style="font-size:0.75rem;color:#666;font-weight:600;text-transform:uppercase;margin-bottom:0.25rem">Goal ' + goal.goalNumber + '</div>';

  if (!goal.goalStatement) {
    html += '<textarea id="goal_statement_' + goal.id + '" placeholder="Write the goal statement (e.g., By June 2027, all students will...)" style="width:100%;padding:0.5rem;border:1px solid #d0c5ba;border-radius:4px;font-family:inherit;min-height:50px" onchange="saveGoalField(\'' + goalAreaKey + '\', \'' + psId + '\', \'' + goal.id + '\', \'goalStatement\', this.value)"></textarea>';
  } else {
    html += '<div style="font-weight:500;color:#333;margin-bottom:0.25rem">' + escapeHtml(goal.goalStatement) + '</div>';
    html += '<button class="btn-link" onclick="editGoalStatement(\'' + goalAreaKey + '\', \'' + psId + '\', \'' + goal.id + '\')" style="font-size:0.75rem;color:#00B4CC">Edit</button>';
  }

  html += '</div>';
  html += '<button class="btn-clear" onclick="removeGoal(\'' + goalAreaKey + '\', \'' + psId + '\', \'' + goal.id + '\')" style="padding:0.4rem;font-size:0.7rem;color:#c44536">Remove</button>';
  html += '</div>';

  html += renderAPOs(goalAreaKey, psId, goal.id);

  html += '</div>';
  return html;
}

function saveGoalField(goalAreaKey, psId, goalId, field, value) {
  var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
  if (area) {
    var ps = area.problemStatements.find(function(ps) { return ps.id === psId; });
    if (ps) {
      var goal = ps.goals.find(function(g) { return g.id === goalId; });
      if (goal) {
        goal[field] = value;
        savePlanState();
        renderProblemStatements(goalAreaKey);
      }
    }
  }
}

function editGoalStatement(goalAreaKey, psId, goalId) {
  var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
  if (area) {
    var ps = area.problemStatements.find(function(ps) { return ps.id === psId; });
    if (ps) {
      var goal = ps.goals.find(function(g) { return g.id === goalId; });
      if (goal) {
        goal.goalStatement = '';
        savePlanState();
        renderProblemStatements(goalAreaKey);
      }
    }
  }
}

// ============================================================================
// ANNUAL PERFORMANCE OBJECTIVE (APO) FUNCTIONS
// ============================================================================

function addAPO(goalAreaKey, psId, goalId) {
  var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
  if (!area) return;
  var ps = area.problemStatements.find(function(ps) { return ps.id === psId; });
  if (!ps) return;
  var goal = ps.goals.find(function(g) { return g.id === goalId; });
  if (!goal) return;

  var apoNum = goal.annualObjectives.length + 1;
  goal.annualObjectives.push({
    id: 'apo_' + Date.now(),
    objectiveNumber: apoNum,
    objectiveStatement: '',
    strategies: []
  });
  savePlanState();
  renderProblemStatements(goalAreaKey);
}

function removeAPO(goalAreaKey, psId, goalId, apoId) {
  if (confirm('Remove this APO and all nested strategies?')) {
    var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
    if (area) {
      var ps = area.problemStatements.find(function(ps) { return ps.id === psId; });
      if (ps) {
        var goal = ps.goals.find(function(g) { return g.id === goalId; });
        if (goal) {
          var idx = goal.annualObjectives.findIndex(function(a) { return a.id === apoId; });
          if (idx !== -1) {
            goal.annualObjectives.splice(idx, 1);
            savePlanState();
            renderProblemStatements(goalAreaKey);
          }
        }
      }
    }
  }
}

function renderAPOs(goalAreaKey, psId, goalId) {
  var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
  if (!area) return '';
  var ps = area.problemStatements.find(function(ps) { return ps.id === psId; });
  if (!ps) return '';
  var goal = ps.goals.find(function(g) { return g.id === goalId; });
  if (!goal) return '';

  var html = '<div style="margin-top:0.75rem;border-top:1px solid #f0f0f0;padding-top:0.75rem">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">';
  html += '<h5 style="margin:0;font-size:0.85rem">Annual Performance Objectives (APOs)</h5>';
  html += '<button class="btn btn-secondary" onclick="addAPO(\'' + goalAreaKey + '\', \'' + psId + '\', \'' + goalId + '\')" style="padding:0.3rem 0.6rem;font-size:0.7rem">+ APO</button>';
  html += '</div>';

  if (goal.annualObjectives.length === 0) {
    html += '<p style="font-size:0.8rem;color:#999;margin:0">No APOs added yet.</p>';
  } else {
    html += '<div style="display:grid;gap:0.5rem">';
    goal.annualObjectives.forEach(function(apo) {
      html += renderAPOCard(goalAreaKey, psId, goalId, apo);
    });
    html += '</div>';
  }

  html += '</div>';
  return html;
}

function renderAPOCard(goalAreaKey, psId, goalId, apo) {
  var html = '<div style="background:#f9f9f9;border:1px solid #e8e8e8;border-radius:4px;padding:0.75rem">';
  html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem">';
  html += '<div style="flex:1">';
  html += '<div style="font-size:0.7rem;color:#888;font-weight:600;text-transform:uppercase;margin-bottom:0.2rem">APO ' + apo.objectiveNumber + '</div>';

  if (!apo.objectiveStatement) {
    html += '<textarea id="apo_statement_' + apo.id + '" placeholder="Annual objective (e.g., Increase reading proficiency from 45% to 55% by June 2026)" style="width:100%;padding:0.4rem;border:1px solid #d0c5ba;border-radius:3px;font-family:inherit;font-size:0.8rem;min-height:40px" onchange="saveAPOField(\'' + goalAreaKey + '\', \'' + psId + '\', \'' + goalId + '\', \'' + apo.id + '\', \'objectiveStatement\', this.value)"></textarea>';
  } else {
    html += '<div style="font-weight:500;color:#333;font-size:0.8rem">' + escapeHtml(apo.objectiveStatement) + '</div>';
    html += '<button class="btn-link" onclick="editAPOStatement(\'' + goalAreaKey + '\', \'' + psId + '\', \'' + goalId + '\', \'' + apo.id + '\')" style="font-size:0.65rem;color:#00B4CC">Edit</button>';
  }

  html += '</div>';
  html += '<button class="btn-clear" onclick="removeAPO(\'' + goalAreaKey + '\', \'' + psId + '\', \'' + goalId + '\', \'' + apo.id + '\')" style="padding:0.3rem;font-size:0.65rem;color:#c44536">Remove</button>';
  html += '</div>';

  html += renderStrategies(goalAreaKey, psId, goalId, apo.id);

  html += '</div>';
  return html;
}

function saveAPOField(goalAreaKey, psId, goalId, apoId, field, value) {
  var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
  if (area) {
    var ps = area.problemStatements.find(function(ps) { return ps.id === psId; });
    if (ps) {
      var goal = ps.goals.find(function(g) { return g.id === goalId; });
      if (goal) {
        var apo = goal.annualObjectives.find(function(a) { return a.id === apoId; });
        if (apo) {
          apo[field] = value;
          savePlanState();
          renderProblemStatements(goalAreaKey);
        }
      }
    }
  }
}

function editAPOStatement(goalAreaKey, psId, goalId, apoId) {
  var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
  if (area) {
    var ps = area.problemStatements.find(function(ps) { return ps.id === psId; });
    if (ps) {
      var goal = ps.goals.find(function(g) { return g.id === goalId; });
      if (goal) {
        var apo = goal.annualObjectives.find(function(a) { return a.id === apoId; });
        if (apo) {
          apo.objectiveStatement = '';
          savePlanState();
          renderProblemStatements(goalAreaKey);
        }
      }
    }
  }
}

// ============================================================================
// STRATEGY FUNCTIONS
// ============================================================================

function addStrategy(goalAreaKey, psId, goalId, apoId) {
  var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
  if (!area) return;
  var ps = area.problemStatements.find(function(ps) { return ps.id === psId; });
  if (!ps) return;
  var goal = ps.goals.find(function(g) { return g.id === goalId; });
  if (!goal) return;
  var apo = goal.annualObjectives.find(function(a) { return a.id === apoId; });
  if (!apo) return;

  var stratNum = apo.strategies.length + 1;
  apo.strategies.push({
    id: 'strat_' + Date.now(),
    strategyNumber: stratNum,
    description: '',
    essaTier: 3,
    namedPrograms: [],
    themes: [],
    owner: '',
    timeline: '',
    metric: '',
    target: ''
  });
  savePlanState();
  renderProblemStatements(goalAreaKey);
}

function removeStrategy(goalAreaKey, psId, goalId, apoId, stratId) {
  if (confirm('Remove this strategy?')) {
    var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
    if (area) {
      var ps = area.problemStatements.find(function(ps) { return ps.id === psId; });
      if (ps) {
        var goal = ps.goals.find(function(g) { return g.id === goalId; });
        if (goal) {
          var apo = goal.annualObjectives.find(function(a) { return a.id === apoId; });
          if (apo) {
            var idx = apo.strategies.findIndex(function(s) { return s.id === stratId; });
            if (idx !== -1) {
              apo.strategies.splice(idx, 1);
              savePlanState();
              renderProblemStatements(goalAreaKey);
            }
          }
        }
      }
    }
  }
}

function renderStrategies(goalAreaKey, psId, goalId, apoId) {
  var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
  if (!area) return '';
  var ps = area.problemStatements.find(function(ps) { return ps.id === psId; });
  if (!ps) return '';
  var goal = ps.goals.find(function(g) { return g.id === goalId; });
  if (!goal) return '';
  var apo = goal.annualObjectives.find(function(a) { return a.id === apoId; });
  if (!apo) return '';

  var html = '<div style="margin-top:0.5rem;border-top:1px solid #f0f0f0;padding-top:0.5rem">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem">';
  html += '<h6 style="margin:0;font-size:0.8rem">Improvement Strategies</h6>';
  html += '<button class="btn btn-secondary" onclick="addStrategy(\'' + goalAreaKey + '\', \'' + psId + '\', \'' + goalId + '\', \'' + apoId + '\')" style="padding:0.2rem 0.5rem;font-size:0.65rem">+ Strategy</button>';
  html += '</div>';

  if (apo.strategies.length === 0) {
    html += '<p style="font-size:0.75rem;color:#999;margin:0">No strategies added yet.</p>';
  } else {
    html += '<div style="display:grid;gap:0.4rem">';
    apo.strategies.forEach(function(strat) {
      html += renderStrategyCard(goalAreaKey, psId, goalId, apoId, strat);
    });
    html += '</div>';
  }

  html += '</div>';
  return html;
}

function renderStrategyCard(goalAreaKey, psId, goalId, apoId, strat) {
  var essaTierInfo = (typeof ESSA_EVIDENCE_TIERS !== 'undefined') ? ESSA_EVIDENCE_TIERS.find(function(t) { return t.tier === strat.essaTier; }) || ESSA_EVIDENCE_TIERS[2] : { color: '#D4A537', label: 'Tier ' + strat.essaTier };

  var html = '<div style="background:#fff;border:1px solid #d0c5ba;border-radius:3px;padding:0.6rem;font-size:0.75rem">';

  // Header with ESSA tier badge and remove button
  html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.4rem">';
  html += '<div style="display:flex;align-items:center;gap:0.4rem">';
  html += '<span style="background:' + essaTierInfo.color + ';color:#fff;padding:0.2rem 0.5rem;border-radius:3px;font-size:0.65rem;font-weight:600">ESSA ' + strat.essaTier + '</span>';
  html += '<span style="color:#666">Strategy ' + strat.strategyNumber + '</span>';
  html += '</div>';
  html += '<button class="btn-clear" onclick="removeStrategy(\'' + goalAreaKey + '\', \'' + psId + '\', \'' + goalId + '\', \'' + apoId + '\', \'' + strat.id + '\')" style="padding:0.2rem;font-size:0.6rem;color:#c44536">×</button>';
  html += '</div>';

  // Description (textarea)
  html += '<div style="margin-bottom:0.4rem">';
  html += '<label style="display:block;font-weight:600;margin-bottom:0.2rem;color:#333">Description</label>';
  html += '<textarea id="strat_desc_' + strat.id + '" placeholder="Describe the improvement strategy in detail. Include specific action steps, implementation timeline, responsible parties, and how this connects to the problem statement and root cause..." style="width:100%;padding:0.4rem;border:1px solid #d0c5ba;border-radius:3px;font-family:inherit;font-size:0.75rem;min-height:80px;resize:vertical" onchange="saveStrategyField(\'' + goalAreaKey + '\', \'' + psId + '\', \'' + goalId + '\', \'' + apoId + '\', \'' + strat.id + '\', \'description\', this.value)">' + escapeHtml(strat.description) + '</textarea>';
  html += '</div>';

  // ESSA Tier selector
  html += '<div style="margin-bottom:0.4rem">';
  html += '<label style="display:block;font-weight:600;margin-bottom:0.2rem;color:#333">ESSA Evidence Tier</label>';
  html += '<select id="strat_essa_' + strat.id + '" onchange="saveStrategyField(\'' + goalAreaKey + '\', \'' + psId + '\', \'' + goalId + '\', \'' + apoId + '\', \'' + strat.id + '\', \'essaTier\', parseInt(this.value))" style="width:100%;padding:0.4rem;border:1px solid #d0c5ba;border-radius:3px;font-family:inherit;font-size:0.75rem">';
  [1, 2, 3, 4].forEach(function(tier) {
    var tierObj = ESSA_EVIDENCE_TIERS.find(function(t) { return t.tier === tier; });
    html += '<option value="' + tier + '"' + (strat.essaTier === tier ? ' selected' : '') + '>' + tierObj.label + ' (Tier ' + tier + ')</option>';
  });
  html += '</select>';
  html += '</div>';

  // Named Programs (multi-select tags)
  html += '<div style="margin-bottom:0.4rem">';
  html += '<label style="display:block;font-weight:600;margin-bottom:0.2rem;color:#333">Named Programs</label>';
  html += '<div id="strat_programs_' + strat.id + '" style="display:flex;flex-wrap:wrap;gap:0.3rem;margin-bottom:0.3rem">';
  strat.namedPrograms.forEach(function(prog) {
    html += '<span style="background:#e0e0e0;color:#333;padding:0.2rem 0.5rem;border-radius:3px;font-size:0.65rem;display:flex;align-items:center;gap:0.3rem">' + prog + '<button onclick="removeProgramTag(\'' + goalAreaKey + '\', \'' + psId + '\', \'' + goalId + '\', \'' + apoId + '\', \'' + strat.id + '\', \'' + prog + '\')" style="background:none;border:none;color:#666;cursor:pointer;padding:0;font-weight:bold">×</button></span>';
  });
  html += '</div>';
  html += '<select id="strat_program_select_' + strat.id + '" onchange="addProgramTag(\'' + goalAreaKey + '\', \'' + psId + '\', \'' + goalId + '\', \'' + apoId + '\', \'' + strat.id + '\', this.value); this.value=\'\';" style="width:100%;padding:0.4rem;border:1px solid #d0c5ba;border-radius:3px;font-family:inherit;font-size:0.75rem">';
  html += '<option value="">-- Add Program --</option>';
  NAMED_PROGRAMS_DB.forEach(function(prog) {
    html += '<option value="' + prog.key + '">' + prog.name + '</option>';
  });
  html += '</select>';
  html += '</div>';

  // Owner, Timeline, Metric, Target in grid
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.4rem;margin-bottom:0.4rem">';
  html += '<div>';
  html += '<label style="display:block;font-weight:600;margin-bottom:0.1rem;color:#333">Owner</label>';
  html += '<input type="text" id="strat_owner_' + strat.id + '" value="' + escapeHtml(strat.owner) + '" placeholder="e.g., Reading Specialist" style="width:100%;padding:0.3rem;border:1px solid #d0c5ba;border-radius:3px;font-family:inherit;font-size:0.75rem" onchange="saveStrategyField(\'' + goalAreaKey + '\', \'' + psId + '\', \'' + goalId + '\', \'' + apoId + '\', \'' + strat.id + '\', \'owner\', this.value)">';
  html += '</div>';
  html += '<div>';
  html += '<label style="display:block;font-weight:600;margin-bottom:0.1rem;color:#333">Timeline</label>';
  html += '<input type="text" id="strat_timeline_' + strat.id + '" value="' + escapeHtml(strat.timeline) + '" placeholder="e.g., Aug 2025 - June 2026" style="width:100%;padding:0.3rem;border:1px solid #d0c5ba;border-radius:3px;font-family:inherit;font-size:0.75rem" onchange="saveStrategyField(\'' + goalAreaKey + '\', \'' + psId + '\', \'' + goalId + '\', \'' + apoId + '\', \'' + strat.id + '\', \'timeline\', this.value)">';
  html += '</div>';
  html += '<div>';
  html += '<label style="display:block;font-weight:600;margin-bottom:0.1rem;color:#333">Metric</label>';
  html += '<input type="text" id="strat_metric_' + strat.id + '" value="' + escapeHtml(strat.metric) + '" placeholder="e.g., iReady diagnostics" style="width:100%;padding:0.3rem;border:1px solid #d0c5ba;border-radius:3px;font-family:inherit;font-size:0.75rem" onchange="saveStrategyField(\'' + goalAreaKey + '\', \'' + psId + '\', \'' + goalId + '\', \'' + apoId + '\', \'' + strat.id + '\', \'metric\', this.value)">';
  html += '</div>';
  html += '<div>';
  html += '<label style="display:block;font-weight:600;margin-bottom:0.1rem;color:#333">Target</label>';
  html += '<input type="text" id="strat_target_' + strat.id + '" value="' + escapeHtml(strat.target) + '" placeholder="e.g., 65th percentile" style="width:100%;padding:0.3rem;border:1px solid #d0c5ba;border-radius:3px;font-family:inherit;font-size:0.75rem" onchange="saveStrategyField(\'' + goalAreaKey + '\', \'' + psId + '\', \'' + goalId + '\', \'' + apoId + '\', \'' + strat.id + '\', \'target\', this.value)">';
  html += '</div>';
  html += '</div>';

  html += '</div>';
  return html;
}

function saveStrategyField(goalAreaKey, psId, goalId, apoId, stratId, field, value) {
  var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
  if (area) {
    var ps = area.problemStatements.find(function(ps) { return ps.id === psId; });
    if (ps) {
      var goal = ps.goals.find(function(g) { return g.id === goalId; });
      if (goal) {
        var apo = goal.annualObjectives.find(function(a) { return a.id === apoId; });
        if (apo) {
          var strat = apo.strategies.find(function(s) { return s.id === stratId; });
          if (strat) {
            strat[field] = value;
            savePlanState();
            renderProblemStatements(goalAreaKey);
          }
        }
      }
    }
  }
}

function addProgramTag(goalAreaKey, psId, goalId, apoId, stratId, progKey) {
  if (!progKey) return;
  var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
  if (area) {
    var ps = area.problemStatements.find(function(ps) { return ps.id === psId; });
    if (ps) {
      var goal = ps.goals.find(function(g) { return g.id === goalId; });
      if (goal) {
        var apo = goal.annualObjectives.find(function(a) { return a.id === apoId; });
        if (apo) {
          var strat = apo.strategies.find(function(s) { return s.id === stratId; });
          if (strat) {
            if (strat.namedPrograms.indexOf(progKey) === -1) {
              strat.namedPrograms.push(progKey);
              savePlanState();
              renderProblemStatements(goalAreaKey);
            }
          }
        }
      }
    }
  }
}

function removeProgramTag(goalAreaKey, psId, goalId, apoId, stratId, progKey) {
  var area = planState.goalAreaPlans.find(function(p) { return p.goalAreaKey === goalAreaKey; });
  if (area) {
    var ps = area.problemStatements.find(function(ps) { return ps.id === psId; });
    if (ps) {
      var goal = ps.goals.find(function(g) { return g.id === goalId; });
      if (goal) {
        var apo = goal.annualObjectives.find(function(a) { return a.id === apoId; });
        if (apo) {
          var strat = apo.strategies.find(function(s) { return s.id === stratId; });
          if (strat) {
            var idx = strat.namedPrograms.indexOf(progKey);
            if (idx !== -1) {
              strat.namedPrograms.splice(idx, 1);
              savePlanState();
              renderProblemStatements(goalAreaKey);
            }
          }
        }
      }
    }
  }
}

// ============================================================================
// OLD GOAL MODAL CODE REMOVED
// The flat goal builder (goalBuilderModal) was replaced by the hierarchical
// goal builder (Goal Area → Problem Statement → Goal → APO → Strategy)
// which uses planState.goalAreaPlans. See renderGoalAreaPlans().
// ============================================================================

// ============================================================================
// 12. STEP 7: ACTION PLANNING
// ============================================================================

function saveStep7Data() {
  // Action plans are saved when created
}

function renderStep7() {
  renderActionPlans();
}

function addActionPlan() {
  // Check new goal structure for any goals
  var hasGoals = false;
  if (planState.goalAreaPlans && planState.goalAreaPlans.length > 0) {
    planState.goalAreaPlans.forEach(function(ga) {
      if (ga.problemStatements) {
        ga.problemStatements.forEach(function(ps) {
          if (ps.goals && ps.goals.length > 0) hasGoals = true;
        });
      }
    });
  }
  // Fallback to old structure during migration
  if (!hasGoals && planState.schoolGoals && planState.schoolGoals.length > 0) hasGoals = true;

  if (!hasGoals) {
    alert('Please add at least one goal in Step 6 before adding action plans.');
    return;
  }

  // Show dialog for new action plan
  var goalSelect = '<select id="actionGoalSelect"><option value="">-- Select Goal --</option>';
  // New hierarchical goals
  if (planState.goalAreaPlans) {
    planState.goalAreaPlans.forEach(function(ga) {
      if (ga.problemStatements) {
        ga.problemStatements.forEach(function(ps) {
          if (ps.goals) {
            ps.goals.forEach(function(goal) {
              var label = goal.goalStatement ? goal.goalStatement.substring(0, 50) : ('Goal in ' + ga.goalAreaKey);
              goalSelect += '<option value="' + goal.id + '">' + escapeHtml(label) + '...</option>';
            });
          }
        });
      }
    });
  }
  // Fallback: old structure
  if (planState.schoolGoals) {
    planState.schoolGoals.forEach(function(goal) {
      if (goal.goalStatement) {
        goalSelect += '<option value="' + goal.id + '">' + escapeHtml(goal.goalStatement.substring(0, 50)) + '...</option>';
      }
    });
  }
  goalSelect += '</select>';

  var dialog = 'Goal: ' + goalSelect + '\n' +
    'Action: ' + '<input type="text" id="actionText" placeholder="Describe the action">' + '\n' +
    'Responsible: ' + '<input type="text" id="actionResponsible" placeholder="Who is responsible?">' + '\n' +
    'Timeline: ' + '<input type="text" id="actionTimeline" placeholder="e.g., By Dec 2026">';

  // For now, use a simpler approach with prompt
  var goalId = prompt('Enter goal ID or use the builder dialog');
  if (!goalId) return;

  var action = prompt('Describe the action');
  if (!action) return;

  var responsible = prompt('Who is responsible?');
  if (!responsible) return;

  var timeline = prompt('Timeline (e.g., By Dec 2026)');
  if (!timeline) return;

  var actionPlan = {
    id: 'action_' + Date.now(),
    goalId: goalId,
    action: action,
    responsible: responsible,
    timeline: timeline,
    evidenceLevel: 'Tier 2 (Moderate Evidence)',
    category: 'Academic',
    budget: ''
  };

  planState.actionPlans.push(actionPlan);
  savePlanState();
  renderActionPlans();
}

function removeActionPlan(actionId) {
  var idx = planState.actionPlans.findIndex(function(a) { return a.id === actionId; });
  if (idx !== -1) {
    planState.actionPlans.splice(idx, 1);
    savePlanState();
    renderActionPlans();
  }
}

function renderActionPlans() {
  var container = document.getElementById('actionPlansContainer');
  if (!container) return;

  if (planState.actionPlans.length === 0) {
    container.innerHTML = '<p class="text-muted" style="padding:1rem;text-align:center">No action plans added yet. Click the button below to add your first action plan.</p>';
    return;
  }

  var html = '';
  planState.actionPlans.forEach(function(action) {
    html += '<div style="padding:1rem;border:1px solid #d0c5ba;border-radius:8px;background:#fafaf8;margin-bottom:1rem">';
    html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.75rem">';
    html += '<div style="font-weight:600;flex:1">' + escapeHtml(action.action) + '</div>';
    html += '<button class="btn-clear" onclick="removeActionPlan(' + JSON.stringify(action.id) + ')" style="padding:0.5rem;font-size:0.75rem;margin-left:1rem">Remove</button>';
    html += '</div>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;font-size:0.875rem">';
    html += '<div><small style="color:#666">Responsible:</small> ' + escapeHtml(action.responsible) + '</div>';
    html += '<div><small style="color:#666">Timeline:</small> ' + escapeHtml(action.timeline) + '</div>';
    html += '<div><small style="color:#666">Evidence Level:</small> ' + escapeHtml(action.evidenceLevel) + '</div>';
    html += '</div>';
    html += '</div>';
  });

  container.innerHTML = html;
}

// ============================================================================
// 13. STEP 8: STAKEHOLDER ENGAGEMENT
// ============================================================================

function saveStep8Data() {
  planState.familyEngagement = document.getElementById('familyEngagement') ? document.getElementById('familyEngagement').value : '';
}

function renderStep8() {
  renderCommitteeMembers();

  var familyEl = document.getElementById('familyEngagement');
  if (familyEl) {
    familyEl.value = planState.familyEngagement || '';
  }
}

function handleStakeholderUpload(input) {
  if (!input.files || !input.files[0]) return;

  var file = input.files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    var content = e.target.result;
    // Simple CSV parsing
    var lines = content.split('\n');
    var themes = [];

    lines.forEach(function(line) {
      if (line.trim()) {
        themes.push(line.trim());
      }
    });

    planState.stakeholderThemes = themes.slice(0, 10); // Limit to 10 themes
    savePlanState();

    var resultsEl = document.getElementById('themeAnalysisResults');
    if (resultsEl) {
      var html = '<div style="background:#e8f5e9;padding:1rem;border-radius:6px;border-left:4px solid #6ECF6E">';
      html += '<p style="margin:0 0 0.5rem 0;font-weight:600">Analysis Complete: ' + themes.length + ' themes found</p>';
      html += '<ul style="margin:0;padding-left:1.5rem">';
      themes.slice(0, 10).forEach(function(theme) {
        html += '<li style="margin-bottom:0.25rem;font-size:0.875rem">' + escapeHtml(theme) + '</li>';
      });
      html += '</ul>';
      html += '</div>';
      resultsEl.innerHTML = html;
    }
  };
  reader.readAsText(file);
}

function addCommitteeMember() {
  var name = document.getElementById('committeeMemberName') ? document.getElementById('committeeMemberName').value : '';
  var role = document.getElementById('committeeMemberRole') ? document.getElementById('committeeMemberRole').value : '';

  if (!name || !role) {
    alert('Please enter name and role.');
    return;
  }

  planState.committeeMembers.push({ name: name, role: role });
  savePlanState();

  if (document.getElementById('committeeMemberName')) document.getElementById('committeeMemberName').value = '';
  if (document.getElementById('committeeMemberRole')) document.getElementById('committeeMemberRole').value = '';

  renderCommitteeMembers();
}

function removeCommitteeMember(idx) {
  planState.committeeMembers.splice(idx, 1);
  savePlanState();
  renderCommitteeMembers();
}

function renderCommitteeMembers() {
  var container = document.getElementById('committeeMembersList');
  if (!container) return;

  if (planState.committeeMembers.length === 0) {
    container.innerHTML = '<p class="text-muted" style="padding:0.5rem 0">No members added yet.</p>';
    return;
  }

  var html = '';
  planState.committeeMembers.forEach(function(member, idx) {
    html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0.75rem;background:#f5f5f5;border-radius:6px;margin-bottom:0.5rem;font-size:0.875rem">';
    html += '<div>';
    html += '<div style="font-weight:500">' + escapeHtml(member.name) + '</div>';
    html += '<div style="color:#666;font-size:0.8125rem">' + escapeHtml(member.role) + '</div>';
    html += '</div>';
    html += '<button class="btn-clear" onclick="removeCommitteeMember(' + idx + ')" style="padding:0.25rem 0.5rem;font-size:0.75rem">Remove</button>';
    html += '</div>';
  });

  container.innerHTML = html;
}

// ============================================================================
// 14. STEP 9: RESOURCE ALLOCATION
// ============================================================================

function saveStep9Data() {
  // Resources are saved when added
}

function renderStep9() {
  renderFundingSources();
  renderInvestments();
}

function addFundingSource() {
  var input = document.getElementById('fundingSourceInput');
  if (input && input.value.trim()) {
    planState.fundingSources.push(input.value.trim());
    input.value = '';
    savePlanState();
    renderFundingSources();
  }
}

function removeFundingSource(idx) {
  planState.fundingSources.splice(idx, 1);
  savePlanState();
  renderFundingSources();
}

function renderFundingSources() {
  var container = document.getElementById('fundingSourcesList');
  if (!container) return;

  if (planState.fundingSources.length === 0) {
    container.innerHTML = '<p class="text-muted" style="padding:0.5rem 0">No funding sources added yet.</p>';
    return;
  }

  var html = '';
  planState.fundingSources.forEach(function(source, idx) {
    html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0.75rem;background:#f5f5f5;border-radius:6px;margin-bottom:0.5rem;font-size:0.875rem">';
    html += '<span>' + escapeHtml(source) + '</span>';
    html += '<button class="btn-clear" onclick="removeFundingSource(' + idx + ')" style="padding:0.25rem 0.5rem;font-size:0.75rem">Remove</button>';
    html += '</div>';
  });

  container.innerHTML = html;
}

function addInvestment() {
  var input = document.getElementById('investmentInput');
  if (input && input.value.trim()) {
    planState.investments.push(input.value.trim());
    input.value = '';
    savePlanState();
    renderInvestments();
  }
}

function removeInvestment(idx) {
  planState.investments.splice(idx, 1);
  savePlanState();
  renderInvestments();
}

function renderInvestments() {
  var container = document.getElementById('investmentsList');
  if (!container) return;

  if (planState.investments.length === 0) {
    container.innerHTML = '<p class="text-muted" style="padding:0.5rem 0">No investments added yet.</p>';
    return;
  }

  var html = '';
  planState.investments.forEach(function(investment, idx) {
    html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0.75rem;background:#f5f5f5;border-radius:6px;margin-bottom:0.5rem;font-size:0.875rem">';
    html += '<span>' + escapeHtml(investment) + '</span>';
    html += '<button class="btn-clear" onclick="removeInvestment(' + idx + ')" style="padding:0.25rem 0.5rem;font-size:0.75rem">Remove</button>';
    html += '</div>';
  });

  container.innerHTML = html;
}

// ============================================================================
// 15. STEP 10: IMPLEMENTATION CALENDAR
// ============================================================================

function saveStep10Data() {
  // Calendar is saved when entries are added
}

function renderStep10() {
  var container = document.getElementById('calendarContainer');
  if (!container) return;

  var html = '<p style="padding:1rem;text-align:center;color:#999">Calendar integration coming soon. For now, document your timeline in action plans.</p>';
  container.innerHTML = html;
}

// ============================================================================
// 16. STEP 11: MONITORING & ACCOUNTABILITY
// ============================================================================

function saveStep11Data() {
  planState.monitoringFrequency = document.getElementById('monitoringFrequency') ? document.getElementById('monitoringFrequency').value : '';
  planState.accountabilityLead = document.getElementById('accountabilityLead') ? document.getElementById('accountabilityLead').value : '';
}

function renderStep11() {
  renderLeadingIndicators();
  renderLaggingIndicators();

  var frequencyEl = document.getElementById('monitoringFrequency');
  if (frequencyEl) {
    frequencyEl.value = planState.monitoringFrequency || '';
  }

  var leadEl = document.getElementById('accountabilityLead');
  if (leadEl) {
    leadEl.value = planState.accountabilityLead || '';
  }
}

function renderLeadingIndicators() {
  var container = document.getElementById('leadingIndicatorsList');
  if (!container) return;

  var html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem">';
  LEADING_INDICATORS_DB.forEach(function(item, idx) {
    var isSelected = planState.leadingIndicators.findIndex(function(l) { return l.indicator === item.indicator; }) !== -1;
    var bgColor = isSelected ? 'rgba(0,180,204,0.08)' : '#fff';
    var borderColor = isSelected ? '#00B4CC' : '#d0c5ba';
    var checkmark = isSelected ? '✓ ' : '';

    html += '<div class="suggestion-card" style="padding:0.75rem;cursor:pointer;border:2px solid ' + borderColor + ';border-radius:6px;background:' + bgColor + ';transition:all 0.2s;font-size:0.875rem" onclick="toggleLeadingIndicator(' + idx + ')">';
    html += '<span style="color:#00B4CC;font-weight:600">' + checkmark + '</span>';
    html += '<span>' + escapeHtml(item.indicator) + '</span>';
    if (item.frequency) {
      html += '<div style="font-size:0.75rem;color:#999;margin-top:0.25rem">' + escapeHtml(item.frequency) + '</div>';
    }
    html += '</div>';
  });
  html += '</div>';

  container.innerHTML = html;
}

function toggleLeadingIndicator(idx) {
  var item = LEADING_INDICATORS_DB[idx];
  var existingIdx = planState.leadingIndicators.findIndex(function(l) { return l.indicator === item.indicator; });

  if (existingIdx === -1) {
    planState.leadingIndicators.push(item);
  } else {
    planState.leadingIndicators.splice(existingIdx, 1);
  }

  savePlanState();
  renderLeadingIndicators();
}

function renderLaggingIndicators() {
  var container = document.getElementById('laggingIndicatorsList');
  if (!container) return;

  var html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem">';
  LAGGING_MEASURES_DB.forEach(function(item, idx) {
    var isSelected = planState.laggingIndicators.findIndex(function(l) { return l.measure === item.measure; }) !== -1;
    var bgColor = isSelected ? 'rgba(0,180,204,0.08)' : '#fff';
    var borderColor = isSelected ? '#00B4CC' : '#d0c5ba';
    var checkmark = isSelected ? '✓ ' : '';

    html += '<div class="suggestion-card" style="padding:0.75rem;cursor:pointer;border:2px solid ' + borderColor + ';border-radius:6px;background:' + bgColor + ';transition:all 0.2s;font-size:0.875rem" onclick="toggleLaggingIndicator(' + idx + ')">';
    html += '<span style="color:#00B4CC;font-weight:600">' + checkmark + '</span>';
    html += '<span>' + escapeHtml(item.measure) + '</span>';
    if (item.source) {
      html += '<div style="font-size:0.75rem;color:#999;margin-top:0.25rem">' + escapeHtml(item.source) + '</div>';
    }
    html += '</div>';
  });
  html += '</div>';

  container.innerHTML = html;
}

function toggleLaggingIndicator(idx) {
  var item = LAGGING_MEASURES_DB[idx];
  var existingIdx = planState.laggingIndicators.findIndex(function(l) { return l.measure === item.measure; });

  if (existingIdx === -1) {
    planState.laggingIndicators.push(item);
  } else {
    planState.laggingIndicators.splice(existingIdx, 1);
  }

  savePlanState();
  renderLaggingIndicators();
}

// ============================================================================
// 17. STEP 12: REVIEW & EXPORT
// ============================================================================

function saveStep12Data() {
  planState.confirmAccuracy = document.getElementById('confirmAccuracy') ? document.getElementById('confirmAccuracy').checked : false;
  planState.confirmStakeholders = document.getElementById('confirmStakeholders') ? document.getElementById('confirmStakeholders').checked : false;
  planState.planAuthor = document.getElementById('planAuthor') ? document.getElementById('planAuthor').value : '';
  planState.adoptionDate = document.getElementById('adoptionDate') ? document.getElementById('adoptionDate').value : '';
}

function renderStep12() {
  var confirmAccuracyEl = document.getElementById('confirmAccuracy');
  if (confirmAccuracyEl) confirmAccuracyEl.checked = planState.confirmAccuracy;

  var confirmStakeholdersEl = document.getElementById('confirmStakeholders');
  if (confirmStakeholdersEl) confirmStakeholdersEl.checked = planState.confirmStakeholders;

  var planAuthorEl = document.getElementById('planAuthor');
  if (planAuthorEl) planAuthorEl.value = planState.planAuthor;

  var adoptionDateEl = document.getElementById('adoptionDate');
  if (adoptionDateEl) adoptionDateEl.value = planState.adoptionDate;
}

function exportPDF() {
  alert('PDF export functionality coming soon. For now, use your browser\'s Print to PDF feature.');
}

function exportWord() {
  alert('Word export functionality coming soon.');
}

function savePlan() {
  saveCurrentStepData();
  savePlanState();
  alert('Your plan has been saved. You can return to continue editing anytime.');
}

// ============================================================================
// 18. UTILITY FUNCTIONS
// ============================================================================

function escapeHtml(text) {
  if (!text) return '';
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function updateCharCount(inputId, countId) {
  var input = document.getElementById(inputId);
  var counter = document.getElementById(countId);
  if (input && counter) {
    counter.textContent = input.value.length;
  }
}

function toggleGuidance() {
  var panel = document.getElementById('guidancePanel');
  if (panel) {
    panel.classList.toggle('open');
  }
}

function updateGuidanceContent(stepNum) {
  var container = document.getElementById('guidanceContent');
  if (!container) return;

  var guidance = {
    1: { title: 'District Connection', tips: [{ title: 'Optional but valuable', text: 'Linking to your district plan helps align school-level goals with district strategy.' }] },
    2: { title: 'School Profile', tips: [{ title: 'Be accurate', text: 'Your demographic and performance data are the foundation for needs assessment.' }] },
    3: { title: 'Needs Assessment', tips: [{ title: 'ESSA Required', text: 'A comprehensive needs assessment is required for all schools in improvement.' }] },
    4: { title: 'Vision & Mission', tips: [{ title: 'Make it inspiring', text: 'Your vision should paint a picture of success that excites stakeholders.' }] },
    5: { title: 'Values & Culture', tips: [{ title: 'Live your values', text: 'Select 3-5 core values and make specific commitments to live them out.' }] },
    6: { title: 'School Goals', tips: [{ title: 'Make them SMART', text: 'Goals should be Specific, Measurable, Achievable, Relevant, and Time-bound.' }] },
    7: { title: 'Action Planning', tips: [{ title: 'Link to goals', text: 'Every action should connect to at least one school goal.' }] },
    8: { title: 'Stakeholder Engagement', tips: [{ title: 'ESSA Required', text: 'Meaningful engagement of families and community is required.' }] },
    9: { title: 'Resource Allocation', tips: [{ title: 'Align to priorities', text: 'Ensure your budget reflects your school\'s highest priorities.' }] },
    10: { title: 'Implementation Calendar', tips: [{ title: 'Sequence matters', text: 'Build in time for professional development before launching initiatives.' }] },
    11: { title: 'Monitoring & Accountability', tips: [{ title: 'Monthly reviews', text: 'Review leading indicators frequently to stay on track.' }] },
    12: { title: 'Preview and Finalize', tips: [{ title: 'Final check', text: 'Ensure all required fields are complete before finalizing.' }] }
  };

  var content = guidance[stepNum] || { title: 'Help', tips: [] };
  var html = '<h3>' + escapeHtml(content.title) + '</h3>';

  if (content.tips) {
    content.tips.forEach(function(tip) {
      html += '<div style="margin-bottom:1rem;padding:0.75rem;background:#f5f5f5;border-radius:6px">';
      html += '<div style="font-weight:600;font-size:0.875rem;margin-bottom:0.25rem">' + escapeHtml(tip.title) + '</div>';
      html += '<div style="font-size:0.8125rem;color:#666">' + escapeHtml(tip.text) + '</div>';
      html += '</div>';
    });
  }

  container.innerHTML = html;
}

// ============================================================================
// 19. WINDOW EXPORTS (expose all onclick handlers)
// ============================================================================

// Legacy functions
window.stepGoto = stepGoto;
window.clearStep = clearStep;
window.clearEntirePlan = clearEntirePlan;
window.searchDistrict = searchDistrict;
window.selectDistrict = selectDistrict;
window.clearDistrictSelection = clearDistrictSelection;
window.skipDistrictConnection = skipDistrictConnection;
window.cascadeDistrictGoalAreas = cascadeDistrictGoalAreas;
window.onStateSelected = onStateSelected;
window.toggleDesignation = toggleDesignation;
window.addStrength = addStrength;
window.addChallenge = addChallenge;
window.addRootCause = addRootCause;
window.addPriorityArea = addPriorityArea;
window.addCustomStrength = addCustomStrength;
window.addCustomChallenge = addCustomChallenge;
window.addCustomRootCause = addCustomRootCause;
window.addCustomPriority = addCustomPriority;
window.toggleValue = toggleValue;
window.removeValue = removeValue;
window.addCustomValue = addCustomValue;
window.toggleCultureCommitment = toggleCultureCommitment;
window.removeCultureCommitment = removeCultureCommitment;
window.addCustomCulture = addCustomCulture;
window.addActionPlan = addActionPlan;
window.removeActionPlan = removeActionPlan;
window.handleStakeholderUpload = handleStakeholderUpload;
window.addCommitteeMember = addCommitteeMember;
window.removeCommitteeMember = removeCommitteeMember;
window.addFundingSource = addFundingSource;
window.removeFundingSource = removeFundingSource;
window.addInvestment = addInvestment;
window.removeInvestment = removeInvestment;
window.toggleLeadingIndicator = toggleLeadingIndicator;
window.toggleLaggingIndicator = toggleLaggingIndicator;

// New hierarchical goal functions
window.migrateOldGoalFormat = migrateOldGoalFormat;
window.addGoalArea = addGoalArea;
window.removeGoalArea = removeGoalArea;
window.renderGoalAreaSelector = renderGoalAreaSelector;
window.renderGoalAreaPlans = renderGoalAreaPlans;
window.switchGoalArea = switchGoalArea;
window.showGoalAreaModal = showGoalAreaModal;
window.closeGoalAreaModal = closeGoalAreaModal;
window.addProblemStatement = addProblemStatement;
window.removeProblemStatement = removeProblemStatement;
window.renderProblemStatements = renderProblemStatements;
window.savePSField = savePSField;
window.editPSStatement = editPSStatement;
window.editPSRootCause = editPSRootCause;
window.addGoal = addGoal;
window.renderGoals = renderGoals;
window.saveGoalField = saveGoalField;
window.editGoalStatement = editGoalStatement;
window.addAPO = addAPO;
window.removeAPO = removeAPO;
window.renderAPOs = renderAPOs;
window.saveAPOField = saveAPOField;
window.editAPOStatement = editAPOStatement;
window.addStrategy = addStrategy;
window.removeStrategy = removeStrategy;
window.renderStrategies = renderStrategies;
window.saveStrategyField = saveStrategyField;
window.addProgramTag = addProgramTag;
window.removeProgramTag = removeProgramTag;
window.removeGoal = removeGoal;
window.exportPDF = exportPDF;
window.exportWord = exportWord;
window.savePlan = savePlan;
window.updateCharCount = updateCharCount;
window.toggleGuidance = toggleGuidance;

function handleSignOut(e) {
  if (e) e.preventDefault();
  if (window.sdAuth && typeof window.sdAuth.signOut === 'function') {
    window.sdAuth.signOut();
  } else {
    window.location.href = '/';
  }
}
window.handleSignOut = handleSignOut;

// ============================================================================
// 20. INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
  initializePlan();
});
