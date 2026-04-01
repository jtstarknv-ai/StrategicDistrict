// ============================================================
// FEATURES.JS — Multi-Year, Portrait, Templates, Drift, Equity
// ============================================================

// ============================================================
// MULTI-YEAR TRACKING
// ============================================================
function renderMultiyearTable() {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var goals = ps.goals || [];
    var container = document.getElementById('multiyearTableContainer');
    if (!container) return;
    var duration = parseInt((document.getElementById('multiyearDuration') || {}).value || 5);
    var startYear = parseInt((document.getElementById('multiyearStartYear') || {}).value || 2025);
    var saved = ps.multiyearProjections || {};

    if (goals.length === 0) {
        container.innerHTML = '<p style="color:#888;font-size:0.85rem;">Set strategic goals in Stage 6 first, then return here to project them across years.</p>';
        return;
    }

    var html = '<table style="width:100%;border-collapse:collapse;font-size:0.85rem;">';
    html += '<thead><tr style="background:#22333B;color:#fff;">';
    html += '<th style="padding:10px 12px;text-align:left;border-radius:8px 0 0 0;">Goal</th>';
    html += '<th style="padding:10px 12px;text-align:center;">Baseline</th>';
    for (var y = 0; y < duration; y++) {
        html += '<th style="padding:10px 12px;text-align:center;">Year ' + (y + 1) + '<br><span style="font-weight:400;font-size:0.75rem;">' + (startYear + y) + '-' + String(startYear + y + 1).slice(-2) + '</span></th>';
    }
    html += '<th style="padding:10px 12px;text-align:center;border-radius:0 8px 0 0;">Target</th></tr></thead><tbody>';

    for (var g = 0; g < goals.length; g++) {
        var goal = goals[g];
        var name = goal.text || goal.name || 'Goal ' + (g + 1);
        var baseline = goal.baseline || '';
        var target = goal.target || goal.targetValue || '';
        var bgColor = g % 2 === 0 ? '#fff' : '#faf8f5';
        var goalSaved = saved[g] || {};

        html += '<tr style="background:' + bgColor + ';">';
        html += '<td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;font-weight:600;color:#22333B;max-width:200px;">' + name.substring(0, 60) + '</td>';
        html += '<td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;text-align:center;color:#5E503F;">' + baseline + '</td>';
        for (var yr = 0; yr < duration; yr++) {
            var val = goalSaved['year' + yr] || '';
            html += '<td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;text-align:center;">';
            html += '<input type="number" id="my-' + g + '-' + yr + '" value="' + val + '" style="width:72px;padding:6px 8px;border:1px solid #e0d8cf;border-radius:4px;text-align:center;font-family:Inter,sans-serif;font-size:0.85rem;" onchange="saveMultiyearData()">';
            html += '</td>';
        }
        html += '<td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;text-align:center;font-weight:700;color:#D4A537;">' + target + '</td>';
        html += '</tr>';
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}

function autoProjectTargets() {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var goals = ps.goals || [];
    var duration = parseInt((document.getElementById('multiyearDuration') || {}).value || 5);

    for (var g = 0; g < goals.length; g++) {
        var baseline = parseFloat(goals[g].baseline || 0);
        var target = parseFloat(goals[g].target || goals[g].targetValue || 0);

        for (var yr = 0; yr < duration; yr++) {
            var input = document.getElementById('my-' + g + '-' + yr);
            if (!input) continue;
            var projected;
            if (target > 0 && baseline > 0) {
                projected = Math.round((baseline + ((target - baseline) * (yr + 1) / duration)) * 10) / 10;
                input.style.background = '#e8f8f5';
            } else if (baseline > 0) {
                projected = Math.round(baseline * Math.pow(1.03, yr + 1) * 10) / 10;
                input.style.background = '#fef9e7';
            } else {
                continue;
            }
            input.value = projected;
            setTimeout((function(el) { return function() { el.style.background = ''; }; })(input), 2000);
        }
    }
    saveMultiyearData();
}

function saveMultiyearData() {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var goals = ps.goals || [];
    var duration = parseInt((document.getElementById('multiyearDuration') || {}).value || 5);
    if (!ps.multiyearProjections) ps.multiyearProjections = {};

    for (var g = 0; g < goals.length; g++) {
        if (!ps.multiyearProjections[g]) ps.multiyearProjections[g] = {};
        for (var yr = 0; yr < duration; yr++) {
            var input = document.getElementById('my-' + g + '-' + yr);
            if (input) ps.multiyearProjections[g]['year' + yr] = input.value;
        }
    }
    try { localStorage.setItem('planState', JSON.stringify(ps)); } catch(e) {}
    renderMultiyearVisualization();
}

function renderMultiyearVisualization() {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var goals = ps.goals || [];
    var projections = ps.multiyearProjections || {};
    var container = document.getElementById('multiyearVisualization');
    if (!container || goals.length === 0) return;

    var html = '<h4 style="font-family:Plus Jakarta Sans,sans-serif;font-size:0.9rem;font-weight:700;color:#22333B;margin:0 0 1rem 0;">Trajectory Overview</h4>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">';

    for (var g = 0; g < Math.min(goals.length, 6); g++) {
        var goal = goals[g];
        var name = (goal.text || goal.name || 'Goal ' + (g + 1)).substring(0, 40);
        var baseline = parseFloat(goal.baseline || 0);
        var target = parseFloat(goal.target || goal.targetValue || 0);
        var maxVal = Math.max(baseline, target, 100);

        html += '<div style="padding:1rem;background:#faf8f5;border-radius:8px;border:1px solid #e8e8e8;">';
        html += '<div style="font-size:0.8rem;font-weight:600;color:#22333B;margin-bottom:0.5rem;">' + name + '</div>';
        html += '<div style="display:flex;align-items:flex-end;gap:4px;height:60px;">';
        html += '<div style="flex:1;background:#22333B;border-radius:3px 3px 0 0;height:' + Math.max(baseline / maxVal * 100, 4) + '%;min-height:4px;" title="Baseline: ' + baseline + '"></div>';

        var gp = projections[g] || {};
        for (var k = 0; k < 5; k++) {
            var v = parseFloat(gp['year' + k] || 0);
            if (v > 0) {
                html += '<div style="flex:1;background:linear-gradient(180deg,#00B4CC,#2EC4B6);border-radius:3px 3px 0 0;height:' + Math.max(v / maxVal * 100, 4) + '%;min-height:4px;" title="Year ' + (k+1) + ': ' + v + '"></div>';
            }
        }
        html += '<div style="flex:1;background:#D4A537;border-radius:3px 3px 0 0;height:' + Math.max(target / maxVal * 100, 4) + '%;min-height:4px;" title="Target: ' + target + '"></div>';
        html += '</div></div>';
    }
    html += '</div>';
    container.innerHTML = html;
}

// ============================================================
// PORTRAIT OF A GRADUATE
// ============================================================
var PORTRAIT_DEFAULTS = [
    { name: 'Critical Thinking', category: 'cognitive', desc: 'Analyzes complex problems, evaluates evidence, and develops reasoned solutions' },
    { name: 'Communication', category: 'interpersonal', desc: 'Expresses ideas clearly across formats: written, verbal, visual, and digital' },
    { name: 'Collaboration', category: 'interpersonal', desc: 'Works effectively with diverse teams toward shared goals' },
    { name: 'Creativity', category: 'cognitive', desc: 'Generates innovative ideas and approaches to challenges' },
    { name: 'Character', category: 'personal', desc: 'Demonstrates integrity, resilience, empathy, and self-discipline' },
    { name: 'Citizenship', category: 'civic', desc: 'Engages responsibly in local and global communities' },
    { name: 'Content Mastery', category: 'cognitive', desc: 'Demonstrates deep understanding of core academic disciplines' },
    { name: 'Digital Literacy', category: 'cognitive', desc: 'Navigates, evaluates, and creates with digital tools responsibly' },
    { name: 'Cultural Competence', category: 'interpersonal', desc: 'Respects and values diverse perspectives and backgrounds' },
    { name: 'Financial Literacy', category: 'personal', desc: 'Understands personal finance, budgeting, and economic principles' },
    { name: 'Health & Wellness', category: 'personal', desc: 'Maintains physical and mental wellbeing and makes healthy choices' },
    { name: 'Leadership', category: 'civic', desc: 'Inspires and guides others, takes initiative, and serves the community' }
];

var CATEGORY_COLORS = { cognitive: '#00B4CC', personal: '#D4A537', interpersonal: '#6ECF6E', civic: '#9B59B6' };

function renderPortraitDefaults() {
    var container = document.getElementById('portraitAttributes');
    if (!container) return;
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var saved = (ps.portraitOfGraduate || {}).selected || [];
    var html = '';

    for (var i = 0; i < PORTRAIT_DEFAULTS.length; i++) {
        var attr = PORTRAIT_DEFAULTS[i];
        var isSelected = saved.indexOf(attr.name) >= 0;
        var borderStyle = isSelected ? 'border-left:4px solid #00B4CC;background:#e8f8f5;' : 'border-left:4px solid transparent;background:#fff;';
        html += '<div class="portrait-attr-card" id="portrait-attr-' + i + '" onclick="toggleAttributeSelection(' + i + ')" style="padding:0.75rem;border:1px solid #e0d8cf;border-radius:8px;cursor:pointer;transition:all 0.2s;' + borderStyle + '">';
        html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">';
        html += '<span style="display:inline-block;padding:2px 8px;border-radius:10px;font-size:0.7rem;font-weight:600;color:#fff;background:' + CATEGORY_COLORS[attr.category] + ';">' + attr.category + '</span>';
        html += '<strong style="font-size:0.85rem;color:#22333B;">' + attr.name + '</strong>';
        if (isSelected) html += '<span style="margin-left:auto;color:#00B4CC;">&#10003;</span>';
        html += '</div>';
        html += '<p style="font-size:0.78rem;color:#5E503F;margin:0;">' + attr.desc + '</p>';
        html += '</div>';
    }
    container.innerHTML = html;
}

function toggleAttributeSelection(idx) {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    if (!ps.portraitOfGraduate) ps.portraitOfGraduate = { selected: [], custom: [] };
    var attr = PORTRAIT_DEFAULTS[idx];
    if (!attr) return;
    var pos = ps.portraitOfGraduate.selected.indexOf(attr.name);
    if (pos >= 0) {
        ps.portraitOfGraduate.selected.splice(pos, 1);
    } else {
        ps.portraitOfGraduate.selected.push(attr.name);
    }
    renderPortraitDefaults();
    updatePortraitSummary();
}

function addCustomAttribute() {
    var form = document.getElementById('customAttributeForm');
    if (form) form.style.display = 'block';
}

function saveCustomAttribute() {
    var name = (document.getElementById('customAttrName') || {}).value || '';
    var category = (document.getElementById('customAttrCategory') || {}).value || 'cognitive';
    var desc = (document.getElementById('customAttrDesc') || {}).value || '';
    if (!name.trim()) return;

    PORTRAIT_DEFAULTS.push({ name: name.trim(), category: category, desc: desc.trim() || 'Custom attribute' });
    var ps = (typeof planState !== 'undefined') ? planState : {};
    if (!ps.portraitOfGraduate) ps.portraitOfGraduate = { selected: [], custom: [] };
    ps.portraitOfGraduate.selected.push(name.trim());
    ps.portraitOfGraduate.custom.push({ name: name.trim(), category: category, desc: desc.trim() });

    document.getElementById('customAttributeForm').style.display = 'none';
    document.getElementById('customAttrName').value = '';
    document.getElementById('customAttrDesc').value = '';
    renderPortraitDefaults();
    updatePortraitSummary();
}

function updatePortraitSummary() {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var selected = (ps.portraitOfGraduate || {}).selected || [];
    var container = document.getElementById('portraitSummary');
    var visual = document.getElementById('portraitVisual');
    if (!container || !visual) return;

    if (selected.length === 0) { container.style.display = 'none'; return; }
    container.style.display = 'block';
    var html = '';
    for (var i = 0; i < selected.length; i++) {
        var cat = 'cognitive';
        for (var j = 0; j < PORTRAIT_DEFAULTS.length; j++) {
            if (PORTRAIT_DEFAULTS[j].name === selected[i]) { cat = PORTRAIT_DEFAULTS[j].category; break; }
        }
        var color = CATEGORY_COLORS[cat] || '#D4A537';
        html += '<span style="display:inline-block;padding:6px 14px;border-radius:20px;font-size:0.8rem;font-weight:600;color:#fff;background:' + color + ';margin:2px;">' + selected[i] + '</span>';
    }
    visual.innerHTML = html;
}

function savePortraitData() {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    try { localStorage.setItem('planState', JSON.stringify(ps)); } catch(e) {}
    updatePortraitSummary();
}

// ============================================================
// TEMPLATE LIBRARY
// ============================================================
var TEMPLATE_LIBRARY = [
    {
        id: 'small-rural', name: 'Small/Rural District', category: 'size',
        tags: ['<5,000 students', 'Rural', 'Community-centered'],
        description: 'Designed for districts under 5,000 students with strong community ties.',
        data: {
            vision: 'Every student in our community will graduate prepared for college, career, and civic life, with the skills and confidence to thrive wherever life takes them.',
            mission: 'We commit to providing personalized, rigorous learning experiences that honor our community values while preparing students for a changing world.',
            coreValues: ['Community', 'Excellence', 'Integrity', 'Growth', 'Belonging'],
            strategicDomains: ['Academic Excellence', 'Student Wellbeing', 'Community Partnership', 'Operational Sustainability'],
            goalTemplates: ['Increase graduation rate by X% over 3 years', 'Reduce chronic absenteeism by X% annually', 'Achieve X% proficiency in ELA and Math', 'Increase family engagement participation by X%']
        }
    },
    {
        id: 'mid-suburban', name: 'Mid-Size Suburban District', category: 'size',
        tags: ['5,000-25,000 students', 'Suburban', 'Growth-focused'],
        description: 'For growing suburban districts balancing enrollment changes with quality.',
        data: {
            vision: 'Our district empowers every learner to discover their potential, develop critical skills, and make meaningful contributions to an interconnected world.',
            mission: 'We deliver innovative, equitable educational experiences through dedicated educators, engaged families, and strategic community partnerships.',
            coreValues: ['Innovation', 'Equity', 'Collaboration', 'Accountability', 'Respect'],
            strategicDomains: ['Teaching & Learning', 'Equity & Access', 'Talent Management', 'Fiscal Responsibility', 'Family & Community Engagement'],
            goalTemplates: ['Close achievement gaps by X% for identified subgroups', 'Increase advanced course enrollment by X%', 'Retain X% of highly effective teachers', 'Achieve X% satisfaction on family engagement surveys']
        }
    },
    {
        id: 'large-urban', name: 'Large Urban District', category: 'size',
        tags: ['25,000+ students', 'Urban', 'Equity-driven'],
        description: 'Built for large urban districts with diverse populations and equity imperatives.',
        data: {
            vision: 'We are building a district where every child, regardless of zip code or background, receives a world-class education that opens doors to unlimited futures.',
            mission: 'We relentlessly pursue equity and excellence by investing in our people, innovating our practices, and holding ourselves accountable to every student and family.',
            coreValues: ['Equity', 'Excellence', 'Transparency', 'Innovation', 'Cultural Responsiveness', 'Student Voice'],
            strategicDomains: ['Academic Achievement', 'Equity & Inclusion', 'Safe & Supportive Schools', 'Talent & Leadership', 'Operational Excellence', 'Community Trust'],
            goalTemplates: ['Eliminate opportunity gaps for historically marginalized students within 5 years', 'Reduce suspensions by X% through restorative practices', 'Increase 3rd grade reading proficiency to X%', 'Achieve X% teacher retention in high-need schools']
        }
    },
    {
        id: 'baldrige', name: 'Baldrige Excellence Framework', category: 'framework',
        tags: ['Baldrige', 'Systems-based', 'Continuous Improvement'],
        description: 'Based on Baldrige Performance Excellence with systems thinking.',
        data: {
            vision: 'A district recognized for performance excellence where every student achieves at the highest levels through data-driven continuous improvement.',
            mission: 'We leverage the Baldrige framework to align leadership, strategy, operations, and results in service of student success.',
            coreValues: ['Visionary Leadership', 'Student-Centered Excellence', 'Organizational Learning', 'Valuing People', 'Systems Perspective'],
            strategicDomains: ['Leadership & Governance', 'Strategy & Planning', 'Student & Stakeholder Focus', 'Measurement & Knowledge', 'Workforce Focus', 'Operations Focus'],
            goalTemplates: ['Achieve X% on leadership effectiveness index', 'Reach Level X on Baldrige maturity model', 'Score X% on stakeholder satisfaction', 'Reduce process cycle time by X%']
        }
    },
    {
        id: 'aasa-framework', name: 'AASA Strategic Planning Model', category: 'framework',
        tags: ['AASA', 'Superintendent-led', 'Board-aligned'],
        description: 'Aligned with AASA strategic planning best practices.',
        data: {
            vision: 'A premier school district where educational excellence, community partnerships, and innovative practices converge to prepare every student for future success.',
            mission: 'Working collaboratively with families and community, we provide safe, supportive, and challenging learning environments that prepare all students for post-secondary success.',
            coreValues: ['Student First', 'High Expectations', 'Collaborative Culture', 'Integrity', 'Continuous Growth'],
            strategicDomains: ['Student Achievement', 'Human Capital', 'School Culture & Climate', 'Resource Stewardship', 'Stakeholder Communication'],
            goalTemplates: ['Increase college/career readiness index to X%', 'Achieve X% positive school climate results', 'Maintain fund balance at X% of operating budget', 'Attain X% community awareness of priorities']
        }
    },
    {
        id: 'equity-first', name: 'Equity-First Strategic Plan', category: 'focus',
        tags: ['Equity', 'Anti-racist', 'Inclusive'],
        description: 'Centers equity in every aspect of planning with explicit gap-closing goals.',
        data: {
            vision: 'A district where race, income, language, and ability never predict success, and every child experiences belonging, challenge, and joy in learning.',
            mission: 'We dismantle systemic barriers, amplify student voice, and deliver culturally sustaining education that prepares all learners to thrive.',
            coreValues: ['Equity', 'Anti-racism', 'Student Voice', 'Cultural Sustaining', 'Transparency', 'Collective Responsibility'],
            strategicDomains: ['Equitable Access & Outcomes', 'Culturally Sustaining Pedagogy', 'Inclusive Environments', 'Diverse Workforce', 'Community Partnership'],
            goalTemplates: ['Eliminate disproportionality in discipline by race within 3 years', 'Achieve X% representation of BIPOC educators', 'Close EL reclassification gap by X%', 'Increase advanced coursework access for FRL students by X%']
        }
    },
    {
        id: 'stem-innovation', name: 'STEM & Innovation Focus', category: 'focus',
        tags: ['STEM', 'Innovation', 'Future-ready'],
        description: 'Centers innovation, technology, and STEM pathways throughout the plan.',
        data: {
            vision: 'Every student graduates as a confident problem-solver, creative thinker, and digitally fluent citizen ready to thrive in a technology-driven world.',
            mission: 'We ignite curiosity and build future-ready skills through innovative STEM programming, cutting-edge technology, and real-world learning.',
            coreValues: ['Innovation', 'Curiosity', 'Problem-Solving', 'Digital Citizenship', 'Future-Readiness'],
            strategicDomains: ['STEM Pathways', 'Technology Integration', 'Innovation Culture', 'Industry Partnerships', 'Workforce Readiness'],
            goalTemplates: ['Increase STEM course enrollment by X% across all demographics', 'Achieve 1:1 device ratio with X% daily instructional use', 'Launch X new industry partnership pathways', 'Reach X% of students earning industry certifications']
        }
    },
    {
        id: 'whole-child', name: 'Whole Child Approach', category: 'focus',
        tags: ['SEL', 'Wellness', 'Holistic'],
        description: 'Holistic approach addressing academic, social-emotional, and physical wellbeing.',
        data: {
            vision: 'Every child in our district is healthy, safe, engaged, supported, and challenged. We educate the whole child for a whole life.',
            mission: 'We nurture the academic, social, emotional, and physical development of every student through caring relationships and inclusive environments.',
            coreValues: ['Whole Child', 'Relationships', 'Wellness', 'Inclusivity', 'Joy in Learning'],
            strategicDomains: ['Academic Growth', 'Social-Emotional Learning', 'Health & Wellness', 'Safe Environments', 'Family Partnership'],
            goalTemplates: ['Achieve X% students reporting positive school connectedness', 'Reduce chronic absenteeism to X%', 'Implement SEL curriculum in X% of classrooms', 'Increase access to mental health services by X%']
        }
    }
];

var _previewedTemplateId = null;

function renderTemplates(filter) {
    var container = document.getElementById('templateGrid');
    if (!container) return;
    var html = '';

    for (var i = 0; i < TEMPLATE_LIBRARY.length; i++) {
        var t = TEMPLATE_LIBRARY[i];
        if (filter && filter !== 'all' && t.category !== filter) continue;
        var catColors = { size: '#00B4CC', framework: '#D4A537', focus: '#6ECF6E' };
        var catColor = catColors[t.category] || '#888';

        html += '<div style="padding:1.25rem;background:#fff;border:1px solid #e0d8cf;border-radius:10px;transition:all 0.2s;" onmouseenter="this.style.borderColor=\'#00B4CC\';this.style.boxShadow=\'0 4px 12px rgba(0,180,204,0.12)\'" onmouseleave="this.style.borderColor=\'#e0d8cf\';this.style.boxShadow=\'none\'">';
        html += '<span style="display:inline-block;padding:2px 10px;border-radius:10px;font-size:0.7rem;font-weight:600;color:#fff;background:' + catColor + ';margin-bottom:8px;">' + t.category + '</span>';
        html += '<h4 style="font-family:Plus Jakarta Sans,sans-serif;font-size:0.9rem;font-weight:700;color:#22333B;margin:0 0 6px 0;">' + t.name + '</h4>';
        html += '<p style="font-size:0.8rem;color:#5E503F;margin:0 0 8px 0;">' + t.description + '</p>';
        html += '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px;">';
        for (var j = 0; j < t.tags.length; j++) {
            html += '<span style="padding:2px 8px;background:#f0ebe4;border-radius:8px;font-size:0.7rem;color:#5E503F;">' + t.tags[j] + '</span>';
        }
        html += '</div>';
        html += '<div style="display:flex;gap:6px;">';
        html += '<button onclick="previewTemplate(\'' + t.id + '\')" style="padding:5px 12px;background:#f0ebe4;border:none;border-radius:6px;font-size:0.78rem;font-weight:600;color:#5E503F;cursor:pointer;">Preview</button>';
        html += '<button onclick="applyTemplate(\'' + t.id + '\')" style="padding:5px 12px;background:#22333B;border:none;border-radius:6px;font-size:0.78rem;font-weight:600;color:#fff;cursor:pointer;">Use Template</button>';
        html += '</div></div>';
    }
    container.innerHTML = html;
}

function filterTemplates(category, btn) {
    var buttons = document.querySelectorAll('.template-filter-btn');
    for (var b = 0; b < buttons.length; b++) {
        buttons[b].style.background = '#f0ebe4';
        buttons[b].style.color = '#5E503F';
    }
    if (btn) { btn.style.background = '#22333B'; btn.style.color = '#fff'; }
    renderTemplates(category);
}

function previewTemplate(templateId) {
    var t = null;
    for (var i = 0; i < TEMPLATE_LIBRARY.length; i++) {
        if (TEMPLATE_LIBRARY[i].id === templateId) { t = TEMPLATE_LIBRARY[i]; break; }
    }
    if (!t) return;
    _previewedTemplateId = templateId;

    var preview = document.getElementById('templatePreview');
    var title = document.getElementById('templatePreviewTitle');
    var content = document.getElementById('templatePreviewContent');
    if (!preview || !content) return;

    var html = '';
    html += '<div style="margin-bottom:1rem;"><strong style="color:#22333B;">Vision:</strong><p style="font-size:0.85rem;color:#5E503F;margin:4px 0 0 0;font-style:italic;">"' + t.data.vision + '"</p></div>';
    html += '<div style="margin-bottom:1rem;"><strong style="color:#22333B;">Mission:</strong><p style="font-size:0.85rem;color:#5E503F;margin:4px 0 0 0;font-style:italic;">"' + t.data.mission + '"</p></div>';
    html += '<div style="margin-bottom:1rem;"><strong style="color:#22333B;">Core Values:</strong><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">';
    for (var v = 0; v < t.data.coreValues.length; v++) {
        html += '<span style="padding:4px 12px;background:#22333B;color:#fff;border-radius:14px;font-size:0.78rem;">' + t.data.coreValues[v] + '</span>';
    }
    html += '</div></div>';
    html += '<div style="margin-bottom:1rem;"><strong style="color:#22333B;">Strategic Domains:</strong><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">';
    for (var d = 0; d < t.data.strategicDomains.length; d++) {
        html += '<span style="padding:4px 12px;background:#00B4CC;color:#fff;border-radius:14px;font-size:0.78rem;">' + t.data.strategicDomains[d] + '</span>';
    }
    html += '</div></div>';
    html += '<div><strong style="color:#22333B;">Sample Goals:</strong><ul style="margin:6px 0 0 0;padding-left:1.25rem;">';
    for (var g = 0; g < t.data.goalTemplates.length; g++) {
        html += '<li style="font-size:0.82rem;color:#5E503F;margin-bottom:4px;">' + t.data.goalTemplates[g] + '</li>';
    }
    html += '</ul></div>';

    title.textContent = t.name;
    content.innerHTML = html;
    preview.style.display = 'block';
    preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function applyTemplate(templateId) {
    var id = templateId || _previewedTemplateId;
    var t = null;
    for (var i = 0; i < TEMPLATE_LIBRARY.length; i++) {
        if (TEMPLATE_LIBRARY[i].id === id) { t = TEMPLATE_LIBRARY[i]; break; }
    }
    if (!t) return;

    var ps = (typeof planState !== 'undefined') ? planState : {};
    ps.visionStatement = t.data.vision;
    ps.missionStatement = t.data.mission;
    ps.coreValues = t.data.coreValues.map(function(v) { return { name: v }; });
    ps.strategicDomains = t.data.strategicDomains.map(function(d) { return { name: d }; });
    try { localStorage.setItem('planState', JSON.stringify(ps)); } catch(e) {}

    var preview = document.getElementById('templatePreview');
    if (preview) preview.style.display = 'none';
    alert('Template "' + t.name + '" applied! Navigate through the steps to review and customize.');
}

// Auto-render templates on load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('templateGrid')) renderTemplates('all');
});

// ============================================================
// AI DRIFT DETECTION
// ============================================================
function calculateExpectedProgress(baseline, target, startDate, endDate, currentDate) {
    var start = new Date(startDate).getTime();
    var end = new Date(endDate).getTime();
    var current = new Date(currentDate).getTime();
    if (end <= start) return target;
    var elapsed = Math.min(Math.max((current - start) / (end - start), 0), 1);
    return baseline + (target - baseline) * elapsed;
}

function runDriftDetection() {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var goals = ps.goals || [];
    var dashData = {};
    try { dashData = JSON.parse(localStorage.getItem('sd_dashboardData') || '{}'); } catch(e) {}
    var alerts = [];
    var now = new Date();
    var startDate = ps.planStartDate || (now.getFullYear() - 1) + '-08-01';
    var endDate = ps.planEndDate || (now.getFullYear() + 2) + '-06-30';

    for (var g = 0; g < goals.length; g++) {
        var goal = goals[g];
        var baseline = parseFloat(goal.baseline || 0);
        var target = parseFloat(goal.target || goal.targetValue || 0);
        if (!baseline || !target) continue;

        var currentVal = parseFloat((dashData.goals || {})[g] || 0);
        if (!currentVal) continue;

        var expected = calculateExpectedProgress(baseline, target, startDate, endDate, now.toISOString());
        var gap = expected - currentVal;
        var gapPct = Math.abs(gap) / Math.max(Math.abs(target - baseline), 1) * 100;

        if (gapPct > 5) {
            var severity = gapPct > 10 ? 'off-track' : 'at-risk';
            var suggestions = [
                'Consider increasing intervention frequency for this goal area.',
                'Review resource allocation for supporting initiatives.',
                'Schedule a stakeholder check-in to reassess target feasibility.',
                'Analyze root causes through data disaggregation.',
                'Evaluate whether implementation timelines need adjustment.'
            ];
            alerts.push({
                goalIndex: g,
                goalName: goal.text || goal.name || 'Goal ' + (g + 1),
                severity: severity,
                expected: Math.round(expected * 10) / 10,
                actual: currentVal,
                gap: Math.round(gap * 10) / 10,
                gapPct: Math.round(gapPct),
                suggestion: suggestions[g % suggestions.length]
            });
        }
    }
    return alerts;
}

function renderDriftAlerts(alerts) {
    var container = document.getElementById('driftAlertContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'driftAlertContainer';
        container.style.cssText = 'margin-top:1.5rem;';
        var feasFeedback = document.getElementById('feasibilityFeedback');
        if (feasFeedback) feasFeedback.parentNode.insertBefore(container, feasFeedback.nextSibling);
    }

    if (!alerts || alerts.length === 0) {
        container.innerHTML = '<div style="padding:1rem;background:#e8f8e8;border:1px solid #6ECF6E;border-radius:8px;text-align:center;"><strong style="color:#22333B;">All Clear</strong><p style="font-size:0.85rem;color:#5E503F;margin:4px 0 0 0;">No goals are currently drifting from expected trajectory.</p></div>';
        return;
    }

    var html = '<h4 style="font-family:Plus Jakarta Sans,sans-serif;font-size:0.95rem;font-weight:700;color:#22333B;margin:0 0 1rem 0;">' + alerts.length + ' Goal' + (alerts.length > 1 ? 's' : '') + ' Flagged for Drift</h4>';

    for (var i = 0; i < alerts.length; i++) {
        var a = alerts[i];
        var borderColor = a.severity === 'off-track' ? '#E74C3C' : '#D4A537';
        var bgColor = a.severity === 'off-track' ? '#fef5f3' : '#fef9e7';
        var badge = a.severity === 'off-track' ? '<span style="background:#E74C3C;color:#fff;padding:2px 8px;border-radius:10px;font-size:0.7rem;font-weight:600;">OFF TRACK</span>' : '<span style="background:#D4A537;color:#fff;padding:2px 8px;border-radius:10px;font-size:0.7rem;font-weight:600;">AT RISK</span>';

        html += '<div style="padding:1rem 1.25rem;background:' + bgColor + ';border:1px solid ' + borderColor + ';border-left:4px solid ' + borderColor + ';border-radius:8px;margin-bottom:0.75rem;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
        html += '<strong style="font-size:0.88rem;color:#22333B;">' + a.goalName + '</strong>' + badge + '</div>';
        html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem;margin-bottom:8px;">';
        html += '<div><span style="font-size:0.72rem;color:#888;text-transform:uppercase;">Expected</span><div style="font-weight:700;color:#22333B;">' + a.expected + '</div></div>';
        html += '<div><span style="font-size:0.72rem;color:#888;text-transform:uppercase;">Actual</span><div style="font-weight:700;color:' + borderColor + ';">' + a.actual + '</div></div>';
        html += '<div><span style="font-size:0.72rem;color:#888;text-transform:uppercase;">Gap</span><div style="font-weight:700;color:' + borderColor + ';">' + a.gap + ' (' + a.gapPct + '%)</div></div>';
        html += '</div>';
        html += '<p style="font-size:0.82rem;color:#5E503F;margin:0;padding-top:6px;border-top:1px solid #e8e8e8;"><strong>Recommended:</strong> ' + a.suggestion + '</p>';
        html += '</div>';
    }
    container.innerHTML = html;
}

function generateDriftReport() {
    var alerts = runDriftDetection();
    renderDriftAlerts(alerts);
    var report = {
        timestamp: new Date().toISOString(),
        totalGoals: ((typeof planState !== 'undefined') ? planState.goals || [] : []).length,
        driftingGoals: alerts.length,
        offTrack: alerts.filter(function(a) { return a.severity === 'off-track'; }).length,
        atRisk: alerts.filter(function(a) { return a.severity === 'at-risk'; }).length,
        alerts: alerts
    };
    try { localStorage.setItem('sd_driftReport', JSON.stringify(report)); } catch(e) {}
    return report;
}

// ============================================================
// EQUITY SUBGROUPS
// ============================================================
var EQUITY_SUBGROUPS = ['All Students', 'Hispanic/Latino', 'Black/African American', 'White', 'Asian', 'Two or More Races', 'Free/Reduced Lunch (FRL)', 'English Learners (EL)', 'Students with Disabilities (IEP)', 'Homeless/Foster', 'Gifted & Talented'];

function renderEquitySubgroups() {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var goals = ps.goals || [];
    var container = document.getElementById('equitySubgroupContainer');
    if (!container) return;
    var saved = ps.equityData || {};

    if (goals.length === 0) {
        container.innerHTML = '<p style="color:#888;font-size:0.85rem;">Set strategic goals first (above), then generate subgroup targets.</p>';
        return;
    }

    var html = '';
    for (var g = 0; g < goals.length; g++) {
        var goal = goals[g];
        var name = goal.text || goal.name || 'Goal ' + (g + 1);
        var baseline = goal.baseline || '';
        var target = goal.target || goal.targetValue || '';
        var goalSaved = saved[g] || {};

        html += '<div style="margin-bottom:1.5rem;padding:1rem;background:#fff;border:1px solid #e0d8cf;border-radius:8px;">';
        html += '<h5 style="font-size:0.88rem;font-weight:700;color:#22333B;margin:0 0 4px 0;">' + name.substring(0, 80) + '</h5>';
        html += '<div style="font-size:0.78rem;color:#888;margin-bottom:0.75rem;">Overall: Baseline ' + baseline + ' | Target ' + target + '</div>';

        html += '<table style="width:100%;border-collapse:collapse;font-size:0.82rem;">';
        html += '<tr style="background:#22333B;color:#fff;"><th style="padding:6px 8px;text-align:left;border-radius:6px 0 0 0;">Subgroup</th><th style="padding:6px 8px;text-align:center;">Baseline</th><th style="padding:6px 8px;text-align:center;">Current</th><th style="padding:6px 8px;text-align:center;">Target</th><th style="padding:6px 8px;text-align:center;border-radius:0 6px 0 0;">Gap</th></tr>';

        for (var s = 0; s < EQUITY_SUBGROUPS.length; s++) {
            var sg = EQUITY_SUBGROUPS[s];
            var sgData = goalSaved[sg] || {};
            var sgBaseline = sgData.baseline || '';
            var sgCurrent = sgData.current || '';
            var sgTarget = sgData.target || '';
            var gap = '';
            var gapColor = '#888';
            if (sgBaseline && baseline) {
                var diff = Math.abs(parseFloat(baseline) - parseFloat(sgBaseline));
                gap = diff.toFixed(1) + '%';
                gapColor = diff < 5 ? '#6ECF6E' : diff < 10 ? '#D4A537' : '#E74C3C';
            }
            var bgColor = s % 2 === 0 ? '#fff' : '#faf8f5';

            html += '<tr style="background:' + bgColor + ';">';
            html += '<td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;font-weight:' + (s === 0 ? '700' : '400') + ';">' + sg + '</td>';
            html += '<td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;text-align:center;"><input type="number" value="' + sgBaseline + '" style="width:60px;padding:4px;border:1px solid #e0d8cf;border-radius:4px;text-align:center;font-size:0.8rem;" onchange="saveEquityData(' + g + ')"></td>';
            html += '<td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;text-align:center;"><input type="number" value="' + sgCurrent + '" style="width:60px;padding:4px;border:1px solid #e0d8cf;border-radius:4px;text-align:center;font-size:0.8rem;" onchange="saveEquityData(' + g + ')"></td>';
            html += '<td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;text-align:center;"><input type="number" value="' + sgTarget + '" style="width:60px;padding:4px;border:1px solid #e0d8cf;border-radius:4px;text-align:center;font-size:0.8rem;" onchange="saveEquityData(' + g + ')"></td>';
            html += '<td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;text-align:center;color:' + gapColor + ';font-weight:600;">' + gap + '</td>';
            html += '</tr>';
        }
        html += '</table></div>';
    }
    container.innerHTML = html;
}

function saveEquityData(goalIdx) {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    if (!ps.equityData) ps.equityData = {};
    if (!ps.equityData[goalIdx]) ps.equityData[goalIdx] = {};

    var container = document.getElementById('equitySubgroupContainer');
    if (!container) return;
    var tables = container.querySelectorAll('table');
    if (!tables[goalIdx]) return;

    var rows = tables[goalIdx].querySelectorAll('tr');
    for (var r = 1; r < rows.length; r++) {
        var inputs = rows[r].querySelectorAll('input');
        var sg = EQUITY_SUBGROUPS[r - 1];
        if (!sg) continue;
        ps.equityData[goalIdx][sg] = {
            baseline: inputs[0] ? inputs[0].value : '',
            current: inputs[1] ? inputs[1].value : '',
            target: inputs[2] ? inputs[2].value : ''
        };
    }
    try { localStorage.setItem('planState', JSON.stringify(ps)); } catch(e) {}
}

function calculateEquityScore() {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var equityData = ps.equityData || {};
    var goals = ps.goals || [];
    var score = 0;

    var hasAnyData = Object.keys(equityData).length > 0;
    if (hasAnyData) score += 25;

    var hasDifferentiated = false;
    var closesGaps = false;
    var subgroupsAddressed = {};

    for (var g in equityData) {
        for (var sg in equityData[g]) {
            if (sg === 'All Students') continue;
            var d = equityData[g][sg];
            if (d.target) {
                subgroupsAddressed[sg] = true;
                var goalTarget = parseFloat((goals[g] || {}).target || (goals[g] || {}).targetValue || 0);
                if (parseFloat(d.target) !== goalTarget) hasDifferentiated = true;
                if (parseFloat(d.baseline) < goalTarget && parseFloat(d.target) >= goalTarget) closesGaps = true;
            }
        }
    }

    if (hasDifferentiated) score += 25;
    if (closesGaps) score += 25;
    if (Object.keys(subgroupsAddressed).length >= 5) score += 25;

    // Update feasibility bar
    var equityScoreEl = document.getElementById('feasEquity');
    var equityBarEl = document.getElementById('feasEquityBar');
    if (equityScoreEl && equityBarEl) {
        equityScoreEl.textContent = Math.round(score) + '%';
        equityBarEl.style.width = Math.round(score) + '%';
    }

    if (typeof planState !== 'undefined') {
        planState.equityScore = score;
    }
    try { localStorage.setItem('equityScore', score.toString()); } catch(e) {}

    return score;
}