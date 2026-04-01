/**
 * STAKEHOLDER ENGAGEMENT SYSTEM
 * Strategic Plan Builder - Comprehensive Stakeholder Toolkit
 *
 * Handles PRE-PLAN and POST-PLAN stakeholder engagement including:
 * - Stakeholder convening recommendations
 * - Printable data packets
 * - Pre-plan & post-plan surveys with QR codes
 * - Response analysis and theme extraction
 * - Live stakeholder response viewing
 *
 * Dependencies: None (vanilla JS)
 * Global Access: planState, saveFormState()
 */

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const STAKEHOLDER_CONFIG = {
  SURVEY_BASE_URL: '/survey/',
  QR_CODE_API: 'https://api.qrserver.com/v1/create-qr-code/',
  COLORS: {
    navy: '#22333B',
    cream: '#EAE0D5',
    brown: '#5E503F',
    teal: '#00B4CC',
    green: '#6ECF6E',
    gold: '#D4A537',
    coral: '#E07A5F',
    purple: '#6B4C9A',
    // Severity indicators
    safe: '#6ECF6E',
    warning: '#D4A537',
    concern: '#E07A5F',
    critical: '#C41E3A'
  },
  STAKEHOLDER_GROUPS: [
    'School Board Members',
    'District Leaders (Superintendent, Cabinet)',
    'Representatives from Associations/Unions',
    'Directors and Department Heads',
    'Staff (Title I and Non-Title I Schools)',
    'Students (Secondary Level)',
    'Families (Title I and Non-Title I)',
    'Community Members (Business, Nonprofit, Faith)'
  ],
  PLANNING_PHASES: [
    {
      name: 'Situational Analysis',
      stages: ['Mission', 'Vision', 'Guiding Principles', 'Research & Findings'],
      boardResponsibility: 'HIGHER',
      adminResponsibility: 'COLLABORATIVE'
    },
    {
      name: 'Strategy Formulation',
      stages: ['Strategic Goals', 'Objectives'],
      boardResponsibility: 'SHARED',
      adminResponsibility: 'SHARED'
    },
    {
      name: 'Strategy Implementation',
      stages: ['Tactics & Implementation', 'Execution'],
      boardResponsibility: 'LOWER',
      adminResponsibility: 'HIGHER'
    }
  ]
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a unique survey ID
 */
function generateSurveyId() {
  return 'SRV_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

/**
 * Generate QR code image URL
 */
function generateQRCodeURL(url, size = '200x200') {
  const encodedUrl = encodeURIComponent(url);
  return `${STAKEHOLDER_CONFIG.QR_CODE_API}?data=${encodedUrl}&size=${size}&format=svg`;
}

/**
 * Create a unique plan ID if one doesn't exist
 */
function getPlanId() {
  if (!planState.planId) {
    planState.planId = 'PLAN_' + Date.now();
    saveFormState();
  }
  return planState.planId;
}

/**
 * Store survey response in localStorage
 */
function saveSurveyResponse(surveyId, responseData) {
  const key = `survey_${surveyId}`;
  let responses = JSON.parse(localStorage.getItem(key) || '[]');
  responses.push({
    timestamp: new Date().toISOString(),
    ...responseData
  });
  localStorage.setItem(key, JSON.stringify(responses));
}

/**
 * Retrieve all responses for a survey
 */
function getSurveyResponses(surveyId) {
  const key = `survey_${surveyId}`;
  return JSON.parse(localStorage.getItem(key) || '[]');
}

/**
 * Export survey responses as CSV
 */
function exportSurveyCSV(surveyId) {
  const responses = getSurveyResponses(surveyId);
  if (responses.length === 0) {
    alert('No responses to export.');
    return;
  }

  const keys = Object.keys(responses[0]);
  const csvHeader = keys.join(',');
  const csvRows = responses.map(r =>
    keys.map(k => {
      const val = r[k];
      if (typeof val === 'string' && val.includes(',')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }).join(',')
  );

  const csv = [csvHeader, ...csvRows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `survey_${surveyId}_responses.csv`;
  link.click();
}

/**
 * Parse CSV file into response objects
 */
function parseCSV(fileContent) {
  const lines = fileContent.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const responses = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = values[idx] || '';
    });
    responses.push(obj);
  }

  return responses;
}

/**
 * Extract themes from open-ended responses (simple keyword frequency)
 */
function extractThemes(textResponses) {
  if (!Array.isArray(textResponses) || textResponses.length === 0) {
    return [];
  }

  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'is', 'are', 'was', 'be', 'have', 'has', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can',
    'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
    'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how'
  ]);

  const wordFreq = {};
  let totalWords = 0;

  textResponses.forEach(text => {
    if (!text || typeof text !== 'string') return;
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    words.forEach(word => {
      if (!stopWords.has(word) && word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
        totalWords++;
      }
    });
  });

  // Get top themes (words appearing 3+ times)
  return Object.entries(wordFreq)
    .filter(([_, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word, count]) => ({
      word,
      count,
      percentage: ((count / totalWords) * 100).toFixed(1)
    }));
}

/**
 * Format severity level (0-100 scale to color indicator)
 */
function getSeverityColor(value) {
  if (value < 33) return STAKEHOLDER_CONFIG.COLORS.green; // Safe
  if (value < 66) return STAKEHOLDER_CONFIG.COLORS.gold;  // Warning
  if (value < 85) return STAKEHOLDER_CONFIG.COLORS.coral; // Concern
  return STAKEHOLDER_CONFIG.COLORS.critical;              // Critical
}

/**
 * Format severity label
 */
function getSeverityLabel(value) {
  if (value < 33) return 'Safe';
  if (value < 66) return 'Warning';
  if (value < 85) return 'Concern';
  return 'Critical';
}

// ============================================================================
// PRE-PLAN STAKEHOLDER ENGAGEMENT
// ============================================================================

/**
 * Render Stakeholder Convening Toolkit
 */
function renderStakeholderConveningToolkit() {
  const container = document.getElementById('stakeholderToolkitContainer');
  if (!container) return;

  const html = `
    <div style="padding: 2rem; background-color: ${STAKEHOLDER_CONFIG.COLORS.cream}; border-radius: 8px;">
      <h2 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; font-family: 'Source Serif Pro', serif; margin: 0 0 1.5rem 0; font-size: 1.8rem;">
        Stakeholder Convening Toolkit
      </h2>

      <!-- Planning Model Visualization -->
      <div style="background: white; padding: 1.5rem; border-radius: 6px; margin-bottom: 2rem; border-left: 4px solid ${STAKEHOLDER_CONFIG.COLORS.teal};">
        <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; font-size: 1.2rem; margin-top: 0;">Strategic Planning Model</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
          ${STAKEHOLDER_CONFIG.PLANNING_PHASES.map((phase, idx) => `
            <div style="border: 2px solid ${STAKEHOLDER_CONFIG.COLORS.brown}; padding: 1rem; border-radius: 4px; background: #fafaf8;">
              <h4 style="color: ${STAKEHOLDER_CONFIG.COLORS.brown}; margin: 0 0 0.8rem 0; font-size: 0.95rem;">
                Phase ${idx + 1}: ${phase.name}
              </h4>
              <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.85rem; line-height: 1.6;">
                ${phase.stages.map(stage => `<li>${stage}</li>`).join('')}
              </ul>
              <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #ddd; font-size: 0.8rem;">
                <div style="color: ${phase.boardResponsibility === 'HIGHER' ? STAKEHOLDER_CONFIG.COLORS.coral : STAKEHOLDER_CONFIG.COLORS.brown};">
                  <strong>Board:</strong> ${phase.boardResponsibility}
                </div>
                <div style="color: ${phase.adminResponsibility === 'HIGHER' ? STAKEHOLDER_CONFIG.COLORS.teal : STAKEHOLDER_CONFIG.COLORS.brown}; margin-top: 0.3rem;">
                  <strong>Administration:</strong> ${phase.adminResponsibility}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <p style="font-size: 0.9rem; color: #666; margin: 1rem 0 0 0; font-style: italic;">
          This model ensures that stakeholders are engaged at the right moments with the right roles throughout the planning process.
        </p>
      </div>

      <!-- Stakeholder Groups & Roles Table -->
      <div style="background: white; padding: 1.5rem; border-radius: 6px; margin-bottom: 2rem; border-left: 4px solid ${STAKEHOLDER_CONFIG.COLORS.green}; overflow-x: auto;">
        <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; font-size: 1.2rem; margin-top: 0;">Recommended Stakeholder Groups</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
          <thead>
            <tr style="background-color: ${STAKEHOLDER_CONFIG.COLORS.navy}; color: white;">
              <th style="padding: 0.8rem; text-align: left; border: 1px solid #ddd;">Stakeholder Group</th>
              <th style="padding: 0.8rem; text-align: left; border: 1px solid #ddd;">Situational Analysis</th>
              <th style="padding: 0.8rem; text-align: left; border: 1px solid #ddd;">Strategy Formulation</th>
              <th style="padding: 0.8rem; text-align: left; border: 1px solid #ddd;">Implementation</th>
            </tr>
          </thead>
          <tbody>
            ${STAKEHOLDER_CONFIG.STAKEHOLDER_GROUPS.map(group => {
              const roles = getStakeholderRoles(group);
              return `
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 0.8rem; border: 1px solid #ddd; font-weight: 600; color: ${STAKEHOLDER_CONFIG.COLORS.navy};">${group}</td>
                  <td style="padding: 0.8rem; border: 1px solid #ddd; background-color: ${roles.situational};">${getRoleLabel(roles.situational)}</td>
                  <td style="padding: 0.8rem; border: 1px solid #ddd; background-color: ${roles.formulation};">${getRoleLabel(roles.formulation)}</td>
                  <td style="padding: 0.8rem; border: 1px solid #ddd; background-color: ${roles.implementation};">${getRoleLabel(roles.implementation)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Convening Format Recommendations -->
      <div style="background: white; padding: 1.5rem; border-radius: 6px; margin-bottom: 2rem; border-left: 4px solid ${STAKEHOLDER_CONFIG.COLORS.purple};">
        <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; font-size: 1.2rem; margin-top: 0;">Recommended Convening Formats</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1.5rem;">
          <div style="border: 1px solid #ddd; padding: 1rem; border-radius: 4px;">
            <h4 style="color: ${STAKEHOLDER_CONFIG.COLORS.teal}; margin: 0 0 0.5rem 0;">In-Person Convenings</h4>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem; line-height: 1.7;">
              <li>Board & leadership retreat (2 days)</li>
              <li>Stakeholder focus groups (90 mins each)</li>
              <li>All-hands staff presentation (1 hour)</li>
              <li>Community forum (evening, family-friendly)</li>
            </ul>
          </div>
          <div style="border: 1px solid #ddd; padding: 1rem; border-radius: 4px;">
            <h4 style="color: ${STAKEHOLDER_CONFIG.COLORS.teal}; margin: 0 0 0.5rem 0;">Virtual/Hybrid Options</h4>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem; line-height: 1.7;">
              <li>Zoom breakout sessions by role</li>
              <li>Asynchronous surveys with QR codes</li>
              <li>Online feedback forms & polling</li>
              <li>Recorded presentations for async viewing</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 2rem;">
        <button onclick="generateConveningPlan()" style="
          padding: 0.8rem 1.5rem;
          background-color: ${STAKEHOLDER_CONFIG.COLORS.teal};
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.95rem;
        ">
          📋 Generate Convening Plan
        </button>
        <button onclick="showPrePlanDataPacket()" style="
          padding: 0.8rem 1.5rem;
          background-color: ${STAKEHOLDER_CONFIG.COLORS.gold};
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.95rem;
        ">
          📊 Printable Data Packet
        </button>
        <button onclick="showPrePlanSurveySetup()" style="
          padding: 0.8rem 1.5rem;
          background-color: ${STAKEHOLDER_CONFIG.COLORS.green};
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.95rem;
        ">
          📝 Create Pre-Plan Survey
        </button>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Helper: Get stakeholder roles by phase
 */
function getStakeholderRoles(groupName) {
  const roleMap = {
    'School Board Members': { situational: '#E8F4F8', formulation: '#E8F4F8', implementation: '#FFE8E0' },
    'District Leaders (Superintendent, Cabinet)': { situational: '#E8F4F8', formulation: '#E8F4F8', implementation: '#E8F4F8' },
    'Representatives from Associations/Unions': { situational: '#E8E8E8', formulation: '#E8E8E8', implementation: '#E8E8E8' },
    'Directors and Department Heads': { situational: '#E8E8E8', formulation: '#E8E8E8', implementation: '#E8F4F8' },
    'Staff (Title I and Non-Title I Schools)': { situational: '#E8E8E8', formulation: '#E8E8E8', implementation: '#E8F4F8' },
    'Students (Secondary Level)': { situational: '#FFE8E0', formulation: '#E8E8E8', implementation: '#FFE8E0' },
    'Families (Title I and Non-Title I)': { situational: '#E8E8E8', formulation: '#E8E8E8', implementation: '#FFE8E0' },
    'Community Members (Business, Nonprofit, Faith)': { situational: '#E8E8E8', formulation: '#E8E8E8', implementation: '#FFE8E0' }
  };
  return roleMap[groupName] || { situational: '#FFF', formulation: '#FFF', implementation: '#FFF' };
}

/**
 * Helper: Get role label
 */
function getRoleLabel(colorCode) {
  if (colorCode.includes('E8F4')) return 'High';
  if (colorCode.includes('FFE8')) return 'Moderate';
  return 'Supporting';
}

/**
 * Generate downloadable Convening Plan
 */
function generateConveningPlan() {
  const planId = getPlanId();
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Stakeholder Convening Plan</title>
      <style>
        body { font-family: 'Inter', sans-serif; color: #22333B; line-height: 1.6; margin: 0; padding: 2rem; background: #fafaf8; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; }
        h1 { color: #22333B; border-bottom: 3px solid #00B4CC; padding-bottom: 0.5rem; }
        h2 { color: #5E503F; margin-top: 1.5rem; font-size: 1.3rem; }
        h3 { color: #6B4C9A; font-size: 1rem; margin-top: 1rem; }
        table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        th, td { padding: 0.8rem; text-align: left; border: 1px solid #ddd; }
        th { background-color: #22333B; color: white; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .section { margin: 2rem 0; page-break-inside: avoid; }
        .note { background-color: #EAE0D5; padding: 1rem; border-radius: 4px; margin: 1rem 0; }
        ul { margin: 0.5rem 0; padding-left: 1.5rem; }
        li { margin: 0.3rem 0; }
        @media print {
          body { background: white; }
          .container { box-shadow: none; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Stakeholder Convening Plan</h1>
        <p><strong>Plan ID:</strong> ${planId}<br><strong>District:</strong> ${planState.districtName || 'District Name'}<br><strong>Date Prepared:</strong> ${new Date().toLocaleDateString()}</p>

        <div class="section">
          <h2>Executive Summary</h2>
          <p>This convening plan outlines how and when to engage key stakeholder groups throughout the three phases of strategic planning: Situational Analysis, Strategy Formulation, and Implementation.</p>
        </div>

        <div class="section">
          <h2>Phase 1: Situational Analysis (Board-Led)</h2>
          <h3>Timeline: Months 1-2</h3>
          <p><strong>Purpose:</strong> Establish mission, vision, guiding principles, and shared understanding of current state based on data.</p>

          <h3>Key Participants</h3>
          <ul>
            <li><strong>Board Members:</strong> Lead design of mission, vision, guiding principles. Strategic responsibility.</li>
            <li><strong>Superintendent & Cabinet:</strong> Present data, lead facilitation, ensure alignment with operational reality.</li>
            <li><strong>Staff Representatives:</strong> Provide perspective on strengths and challenges.</li>
            <li><strong>Community Members:</strong> Offer external perspective on district's public image and community needs.</li>
          </ul>

          <h3>Recommended Convenings</h3>
          <table>
            <tr>
              <th>Convening</th>
              <th>Participants</th>
              <th>Duration</th>
              <th>Format</th>
            </tr>
            <tr>
              <td>Board Strategic Retreat</td>
              <td>Board, Superintendent, Cabinet</td>
              <td>2 days</td>
              <td>In-person (off-site recommended)</td>
            </tr>
            <tr>
              <td>Staff Focus Groups</td>
              <td>20-25 staff (mix of Title I and non-Title I)</td>
              <td>90 minutes</td>
              <td>In-person (by school or department)</td>
            </tr>
            <tr>
              <td>Community Forum</td>
              <td>Open to all families and community</td>
              <td>90 minutes</td>
              <td>In-person (evening, with childcare/food)</td>
            </tr>
            <tr>
              <td>Student Panel</td>
              <td>8-12 secondary students (diverse backgrounds)</td>
              <td>60 minutes</td>
              <td>In-person or virtual</td>
            </tr>
          </table>

          <div class="note">
            <strong>Data Packet:</strong> Distribute district profile, performance metrics, and key challenge areas to all participants 1 week before each convening.
          </div>
        </div>

        <div class="section">
          <h2>Phase 2: Strategy Formulation (Shared Leadership)</h2>
          <h3>Timeline: Months 2-3</h3>
          <p><strong>Purpose:</strong> Develop strategic goals and objectives based on situational analysis findings and stakeholder input.</p>

          <h3>Key Participants</h3>
          <ul>
            <li><strong>Board & Administration:</strong> Shared responsibility. Board provides strategic direction; administration ensures feasibility.</li>
            <li><strong>Expanded Leadership Team:</strong> Directors, department heads, building principals.</li>
            <li><strong>Staff & Union Representatives:</strong> Implementation perspective and buy-in.</li>
          </ul>

          <h3>Recommended Convenings</h3>
          <table>
            <tr>
              <th>Convening</th>
              <th>Participants</th>
              <th>Duration</th>
              <th>Format</th>
            </tr>
            <tr>
              <td>Board & Cabinet Goal-Setting Session</td>
              <td>Board, Superintendent, Cabinet, Directors</td>
              <td>Full day</td>
              <td>In-person</td>
            </tr>
            <tr>
              <td>Cross-Functional Breakout Sessions</td>
              <td>20-30 staff across multiple departments</td>
              <td>120 minutes</td>
              <td>Hybrid (virtual option available)</td>
            </tr>
            <tr>
              <td>Union & Association Input Session</td>
              <td>Representatives from staff and admin associations</td>
              <td>90 minutes</td>
              <td>In-person</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <h2>Phase 3: Implementation (Administration-Led)</h2>
          <h3>Timeline: Months 3-4</h3>
          <p><strong>Purpose:</strong> Develop tactics, action initiatives, timelines, and accountability structures.</p>

          <h3>Key Participants</h3>
          <ul>
            <li><strong>Administration:</strong> Higher operational responsibility. Lead detail development and resource allocation.</li>
            <li><strong>Building Leaders:</strong> Ensure school-level implementation feasibility.</li>
            <li><strong>Board:</strong> Oversight and accountability. Lower operational involvement but maintains strategic alignment.</li>
          </ul>

          <h3>Recommended Convenings</h3>
          <table>
            <tr>
              <th>Convening</th>
              <th>Participants</th>
              <th>Duration</th>
              <th>Format</th>
            </tr>
            <tr>
              <td>Implementation Planning Session</td>
              <td>Superintendent, Cabinet, Directors, Principals</td>
              <td>Full day</td>
              <td>In-person</td>
            </tr>
            <tr>
              <td>Building-Level Implementation Alignment</td>
              <td>Principal teams + department leads</td>
              <td>120 minutes</td>
              <td>Virtual (by school)</td>
            </tr>
            <tr>
              <td>Board Accountability Check-in</td>
              <td>Board, Superintendent</td>
              <td>60 minutes</td>
              <td>In-person (regular meeting)</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <h2>Engagement Best Practices</h2>
          <ul>
            <li><strong>Lead with Data:</strong> Always begin with district profile and performance metrics.</li>
            <li><strong>Diverse Representation:</strong> Ensure Title I and non-Title I schools, multiple languages, and varied stakeholder roles.</li>
            <li><strong>Clear Roles:</strong> Be explicit about decision-making authority vs. input gathering.</li>
            <li><strong>Feedback Loop:</strong> Show how stakeholder input shaped decisions. "You said X, and here's how we used that."</li>
            <li><strong>Accessibility:</strong> Provide childcare, meals, transportation, interpretation services as needed.</li>
            <li><strong>Asynchronous Options:</strong> Not everyone can attend meetings. Offer surveys and online feedback forms.</li>
          </ul>
        </div>

        <div class="section">
          <h2>Communications Timeline</h2>
          <ul>
            <li><strong>Month 1:</strong> Announce planning process. Share plan with all staff and families.</li>
            <li><strong>Months 1-2:</strong> Hold Phase 1 convenings. Collect pre-plan surveys.</li>
            <li><strong>Month 2:</strong> Share findings from Phase 1 with all stakeholders.</li>
            <li><strong>Months 2-3:</strong> Hold Phase 2 convenings. Refine goals based on feedback.</li>
            <li><strong>Month 3:</strong> Share draft strategic plan with all stakeholders. Collect post-plan surveys.</li>
            <li><strong>Months 3-4:</strong> Hold Phase 3 convenings. Finalize implementation details.</li>
            <li><strong>Month 4:</strong> Board approves final plan. Launch all-hands rollout.</li>
          </ul>
        </div>

        <button class="no-print" onclick="window.print()" style="padding: 0.8rem 1.5rem; background-color: #00B4CC; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; margin-top: 1rem;">
          🖨️ Print Plan
        </button>
      </div>
    </body>
    </html>
  `;

  const win = window.open('', '', 'width=900,height=1200');
  win.document.write(html);
  win.document.close();
}

/**
 * Render Printable Data Packet
 */
function showPrePlanDataPacket() {
  const packet = generatePrePlanDataPacket();
  const win = window.open('', '', 'width=900,height=1200');
  win.document.write(packet);
  win.document.close();
}

/**
 * Generate printable data packet
 */
function generatePrePlanDataPacket() {
  const data = planState || {};

  const districtMetrics = [
    { label: 'Total Enrollment', value: data.totalEnrollment || 'N/A', severity: 0 },
    { label: 'Schools', value: data.numberOfSchools || 'N/A', severity: 0 },
    { label: 'Graduation Rate', value: (data.graduationRate || 0) + '%', severity: 100 - (data.graduationRate || 0) },
    { label: 'Chronic Absenteeism', value: (data.chronicAbsenteeism || 0) + '%', severity: data.chronicAbsenteeism || 0 },
    { label: 'Free/Reduced Lunch', value: (data.freeReducedLunch || 0) + '%', severity: 0 },
    { label: 'ELL Students', value: (data.ellPercentage || 0) + '%', severity: 0 },
    { label: 'Special Education', value: (data.specialEdPercentage || 0) + '%', severity: 0 }
  ];

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>District Profile & Data Packet</title>
      <style>
        body { font-family: 'Inter', sans-serif; color: #22333B; line-height: 1.6; margin: 0; padding: 2rem; background: #fafaf8; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; }
        h1 { color: #22333B; border-bottom: 3px solid #00B4CC; padding-bottom: 0.5rem; }
        h2 { color: #5E503F; margin-top: 1.5rem; font-size: 1.3rem; border-bottom: 1px solid #ddd; padding-bottom: 0.5rem; }
        .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0; }
        .metric-card {
          padding: 1rem;
          border-radius: 6px;
          border-left: 4px solid #00B4CC;
          background: linear-gradient(135deg, #f9f9f9 0%, #fafaf8 100%);
        }
        .metric-label { font-size: 0.85rem; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
        .metric-value { font-size: 1.8rem; font-weight: bold; color: #22333B; margin: 0.5rem 0; }
        .severity-bar {
          width: 100%;
          height: 6px;
          background: #ddd;
          border-radius: 3px;
          overflow: hidden;
          margin-top: 0.5rem;
        }
        .severity-fill { height: 100%; background-color: #00B4CC; transition: background-color 0.3s; }
        .challenge { background-color: #FFE8E0; border-left-color: #E07A5F; }
        .strength { background-color: #E8F8E8; border-left-color: #6ECF6E; }
        .note-section { background: #EAE0D5; padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0; }
        .note-section h3 { margin-top: 0; color: #5E503F; }
        .notes-space { border: 1px dashed #999; min-height: 100px; background: white; padding: 1rem; margin: 1rem 0; font-style: italic; color: #999; }
        .demographic-table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        .demographic-table td { padding: 0.6rem; border-bottom: 1px solid #ddd; }
        .demographic-table td:first-child { font-weight: 600; color: #22333B; }
        @media print {
          body { background: white; }
          .container { box-shadow: none; }
          .no-print { display: none; }
          .notes-space { min-height: 80px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>District Profile & Stakeholder Data Packet</h1>
        <p><strong>District:</strong> ${data.districtName || 'District Name'}<br><strong>Prepared:</strong> ${new Date().toLocaleDateString()}</p>

        <h2>Quick Profile</h2>
        <div class="metric-grid">
          ${districtMetrics.map(m => {
            const severity = m.severity || 0;
            const color = getSeverityColor(severity);
            return `
              <div class="metric-card ${severity > 50 ? 'challenge' : 'strength'}">
                <div class="metric-label">${m.label}</div>
                <div class="metric-value">${m.value}</div>
                ${severity > 0 ? `
                  <div class="severity-bar">
                    <div class="severity-fill" style="width: ${Math.min(severity, 100)}%; background-color: ${color};"></div>
                  </div>
                  <div style="font-size: 0.75rem; color: #666; margin-top: 0.3rem;">${getSeverityLabel(severity)}</div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>

        <h2>Demographic Composition</h2>
        <table class="demographic-table">
          <tr>
            <td>Race/Ethnicity Breakdown</td>
            <td>${data.raceEthnicityBreakdown || 'Available in detailed report'}</td>
          </tr>
          <tr>
            <td>English Language Learners</td>
            <td>${(data.ellPercentage || 0) + '%'}</td>
          </tr>
          <tr>
            <td>Students with Disabilities</td>
            <td>${(data.specialEdPercentage || 0) + '%'}</td>
          </tr>
          <tr>
            <td>Free/Reduced Lunch Eligible</td>
            <td>${(data.freeReducedLunch || 0) + '%'}</td>
          </tr>
          <tr>
            <td>Homeless or Housing Insecure</td>
            <td>${(data.homelessPercentage || 0) + '%'}</td>
          </tr>
        </table>

        <h2>Performance Metrics vs. Benchmarks</h2>
        <table class="demographic-table">
          <tr>
            <td>Graduation Rate</td>
            <td>${(data.graduationRate || 0) + '%'} (State Avg: ${data.stateGraduationRate || '~85%'})</td>
          </tr>
          <tr>
            <td>Chronic Absenteeism</td>
            <td>${(data.chronicAbsenteeism || 0) + '%'} (National Avg: ~15%)</td>
          </tr>
          <tr>
            <td>Math Proficiency (Grade 3-8)</td>
            <td>${(data.mathProficiency || 0) + '%'} (State Avg: ${data.stateMathProficiency || '~50%'})</td>
          </tr>
          <tr>
            <td>ELA Proficiency (Grade 3-8)</td>
            <td>${(data.elaProficiency || 0) + '%'} (State Avg: ${data.stateElaProficiency || '~55%'})</td>
          </tr>
        </table>

        <h2>Key Challenge Areas (High Priority)</h2>
        <ul style="color: #E07A5F; font-weight: 600;">
          <li>${data.challenge1 || 'Chronic absenteeism in elementary schools'}</li>
          <li>${data.challenge2 || 'Math achievement gap between demographic groups'}</li>
          <li>${data.challenge3 || 'Staff retention and recruitment in STEM areas'}</li>
        </ul>

        <h2>Notable Strengths</h2>
        <ul style="color: #6ECF6E; font-weight: 600;">
          <li>${data.strength1 || 'Strong community engagement in Title I schools'}</li>
          <li>${data.strength2 || 'Innovative AP/IB program expansion'}</li>
          <li>${data.strength3 || 'District-wide professional learning focus'}</li>
        </ul>

        <div class="note-section">
          <h3>Notes for Stakeholders</h3>
          <p>This data packet is provided to give stakeholders a shared understanding of our district's current state. As we engage in strategic planning, we'll build on our strengths and address our challenges together.</p>
          <div class="notes-space" style="min-height: 120px;"></div>
        </div>

        <div class="note-section" style="background: #E8F4F8;">
          <h3>Next Steps</h3>
          <ol>
            <li><strong>Review this data</strong> before our planning sessions (week of ${new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString()})</li>
            <li><strong>Complete the stakeholder survey</strong> (link and QR code provided separately)</li>
            <li><strong>Attend a convening</strong> in Phase 1 (dates and locations TBA)</li>
            <li><strong>Provide feedback</strong> on draft goals and objectives (Phase 2)</li>
          </ol>
        </div>

        <button class="no-print" onclick="window.print()" style="padding: 0.8rem 1.5rem; background-color: #00B4CC; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; margin-top: 1rem;">
          🖨️ Print Data Packet
        </button>
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Show Pre-Plan Survey Setup
 */
function showPrePlanSurveySetup() {
  const container = document.getElementById('prePlanSurveyContainer') || document.body;

  const surveyId = planState.prePlanSurveyId || generateSurveyId();
  if (!planState.prePlanSurveyId) {
    planState.prePlanSurveyId = surveyId;
    saveFormState();
  }

  const surveyUrl = STAKEHOLDER_CONFIG.SURVEY_BASE_URL + '?id=' + surveyId;
  const qrCodeUrl = generateQRCodeURL(surveyUrl);

  const html = `
    <div style="padding: 2rem; background-color: ${STAKEHOLDER_CONFIG.COLORS.cream}; border-radius: 8px; margin-top: 2rem;">
      <h2 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; font-family: 'Source Serif Pro', serif; margin: 0 0 1.5rem 0; font-size: 1.8rem;">
        Pre-Plan Stakeholder Survey
      </h2>

      <div style="background: white; padding: 1.5rem; border-radius: 6px; margin-bottom: 2rem; border-left: 4px solid ${STAKEHOLDER_CONFIG.COLORS.teal};">
        <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; margin-top: 0;">Survey Overview</h3>
        <p style="line-height: 1.8;">This survey gathers input from all stakeholders BEFORE we finalize strategic goals. It covers:</p>
        <ul style="line-height: 2;">
          <li><strong>District Strengths & Challenges:</strong> Do you agree with what we identified in our data analysis?</li>
          <li><strong>Competencies:</strong> What skills and habits should every graduate have?</li>
          <li><strong>Goals:</strong> What should our district prioritize?</li>
          <li><strong>Action Initiatives:</strong> What specific programs matter most to you?</li>
        </ul>
        <p style="color: #666; font-size: 0.95rem; font-style: italic;">Time to complete: ~5-7 minutes | Responses are confidential</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
        <!-- QR Code -->
        <div style="background: white; padding: 1.5rem; border-radius: 6px; border: 1px solid #ddd; text-align: center;">
          <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; margin-top: 0;">QR Code (Print & Share)</h3>
          <img src="${qrCodeUrl}" alt="Survey QR Code" style="width: 200px; height: 200px; border: 1px solid #ddd; padding: 0.5rem;">
          <p style="font-size: 0.9rem; color: #666; margin: 1rem 0 0 0;">Scan to take survey on phone</p>
          <button onclick="openPrintableQRCard('${surveyId}')" style="
            margin-top: 0.5rem;
            padding: 0.6rem 1rem;
            background-color: ${STAKEHOLDER_CONFIG.COLORS.gold};
            color: white;
            border: none;
            border-radius: 4px;
            font-weight: 600;
            cursor: pointer;
            font-size: 0.9rem;
          ">
            🖨️ Print QR Card
          </button>
        </div>

        <!-- Survey Link -->
        <div style="background: white; padding: 1.5rem; border-radius: 6px; border: 1px solid #ddd;">
          <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; margin-top: 0;">Survey Link</h3>
          <div style="background: #f5f5f5; padding: 1rem; border-radius: 4px; border: 1px solid #ddd; margin: 1rem 0; word-break: break-all;">
            <code style="font-size: 0.85rem; color: #666;">${surveyUrl}</code>
          </div>
          <button onclick="copyToClipboard('${surveyUrl}')" style="
            width: 100%;
            padding: 0.8rem;
            background-color: ${STAKEHOLDER_CONFIG.COLORS.teal};
            color: white;
            border: none;
            border-radius: 4px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 0.5rem;
          ">
            📋 Copy Survey Link
          </button>
          <p style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;">Share via email, text, or on your website</p>
        </div>
      </div>

      <div style="background: #E8F4F8; padding: 1.5rem; border-radius: 6px; border-left: 4px solid ${STAKEHOLDER_CONFIG.COLORS.teal};">
        <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; margin-top: 0;">Distribution Tips</h3>
        <ul style="line-height: 2;">
          <li>Send QR code via email with invitation letter</li>
          <li>Post QR code in schools, community centers, library</li>
          <li>Include link in newsletter and website</li>
          <li>Announce survey at all stakeholder convenings</li>
          <li>Set response deadline (suggest 2 weeks)</li>
        </ul>
      </div>

      <div style="margin-top: 2rem;">
        <button onclick="viewPrePlanResponses('${surveyId}')" style="
          padding: 0.8rem 1.5rem;
          background-color: ${STAKEHOLDER_CONFIG.COLORS.green};
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.95rem;
        ">
          📊 View Responses & Analysis
        </button>
        <button onclick="exportSurveyCSV('${surveyId}')" style="
          margin-left: 0.5rem;
          padding: 0.8rem 1.5rem;
          background-color: ${STAKEHOLDER_CONFIG.COLORS.brown};
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.95rem;
        ">
          📥 Export Responses as CSV
        </button>
      </div>
    </div>
  `;

  if (container.id === 'preplan-survey-container') {
    container.innerHTML = html;
  } else {
    const div = document.createElement('div');
    div.id = 'preplan-survey-container';
    div.innerHTML = html;
    container.appendChild(div);
  }
}

/**
 * Open printable QR card
 */
function openPrintableQRCard(surveyId) {
  const surveyUrl = STAKEHOLDER_CONFIG.SURVEY_BASE_URL + '?id=' + surveyId;
  const qrCodeUrl = generateQRCodeURL(surveyUrl, '300x300');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Survey QR Code Card</title>
      <style>
        body { margin: 0; padding: 1rem; background: white; font-family: 'Inter', sans-serif; }
        .card {
          width: 5in;
          height: 7in;
          margin: 0.5in auto;
          padding: 0.5in;
          border: 1px solid #ddd;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          text-align: center;
          page-break-after: always;
        }
        h1 { color: #22333B; font-size: 1.5rem; margin: 0.5in 0; }
        .qr-container { margin: 0.5in 0; }
        .qr-container img { width: 3in; height: 3in; }
        p { margin: 0.3in 0; color: #666; font-size: 0.9rem; }
        .url { font-size: 0.75rem; color: #999; word-break: break-all; }
        @media print {
          body { background: white; padding: 0; }
          .card { box-shadow: none; margin: 0; width: 5in; height: 7in; }
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Survey QR Code</h1>
        <p style="font-weight: 600; color: #00B4CC;">Tell us what you think!</p>
        <div class="qr-container">
          <img src="${qrCodeUrl}" alt="Survey QR Code">
        </div>
        <p style="font-weight: 600;">Scan with your phone to take the survey</p>
        <p class="url">${surveyUrl}</p>
        <p style="color: #999; font-size: 0.75rem; margin-top: 0.3in;">Time to complete: 5-7 minutes | Responses are confidential</p>
      </div>
      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 500);
        };
      </script>
    </body>
    </html>
  `;

  const win = window.open('', '', 'width=600,height=800');
  win.document.write(html);
  win.document.close();
}

/**
 * Copy to clipboard
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Survey link copied to clipboard!');
  });
}

/**
 * View Pre-Plan Responses
 */
function viewPrePlanResponses(surveyId) {
  const responses = getSurveyResponses(surveyId);
  if (responses.length === 0) {
    alert('No responses yet. Survey has been created, but responses are still being collected.');
    return;
  }

  const analysis = analyzePrePlanResponses(responses);
  renderPrePlanAnalysis(analysis);
}

/**
 * Analyze Pre-Plan Responses
 */
function analyzePrePlanResponses(responses) {
  const openEndedFields = ['strengths', 'challenges', 'competencies', 'goals', 'initiatives', 'feedback'];
  const themes = {};

  openEndedFields.forEach(field => {
    const texts = responses
      .filter(r => r[field])
      .map(r => r[field]);
    themes[field] = extractThemes(texts);
  });

  const agreementCounts = {
    strengthsAgree: responses.filter(r => r.strengthsAgree === 'yes').length,
    challengesAgree: responses.filter(r => r.challengesAgree === 'yes').length
  };

  const total = responses.length;
  const strengths = total > 0 ? ((agreementCounts.strengthsAgree / total) * 100).toFixed(1) : 0;
  const challenges = total > 0 ? ((agreementCounts.challengesAgree / total) * 100).toFixed(1) : 0;

  return {
    totalResponses: total,
    themes,
    strengthsAgreement: strengths,
    challengesAgreement: challenges,
    recommendations: generateRecommendations(themes, strengths, challenges)
  };
}

/**
 * Generate recommendations from analysis
 */
function generateRecommendations(themes, strengths, challenges) {
  const recs = [];

  if (strengths < 60) {
    recs.push({
      type: 'alert',
      text: 'Less than 60% of stakeholders agree with AI-identified strengths. Consider revising or gathering more input.'
    });
  }

  if (challenges < 60) {
    recs.push({
      type: 'alert',
      text: 'Less than 60% of stakeholders agree with AI-identified challenges. Stakeholder-suggested challenges may be different.'
    });
  }

  if (themes.competencies && themes.competencies.length > 0) {
    recs.push({
      type: 'insight',
      text: `Top competencies stakeholders mentioned: ${themes.competencies.slice(0, 3).map(t => t.word).join(', ')}`
    });
  }

  if (themes.goals && themes.goals.length > 0) {
    recs.push({
      type: 'insight',
      text: `Most frequently mentioned goals/priorities: ${themes.goals.slice(0, 3).map(t => t.word).join(', ')}`
    });
  }

  return recs;
}

/**
 * Render Pre-Plan Analysis
 */
function renderPrePlanAnalysis(analysis) {
  const container = document.getElementById('prePlanAnalysisContainer') || document.body;

  const html = `
    <div style="padding: 2rem; background-color: ${STAKEHOLDER_CONFIG.COLORS.cream}; border-radius: 8px; margin-top: 2rem;">
      <h2 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; font-family: 'Source Serif Pro', serif; margin: 0 0 1.5rem 0; font-size: 1.8rem;">
        Pre-Plan Survey Analysis
      </h2>

      <div style="background: white; padding: 1.5rem; border-radius: 6px; margin-bottom: 2rem; border-left: 4px solid ${STAKEHOLDER_CONFIG.COLORS.teal};">
        <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; margin-top: 0;">Summary</h3>
        <p style="font-size: 1.2rem; color: ${STAKEHOLDER_CONFIG.COLORS.teal}; font-weight: 600;">
          ${analysis.totalResponses} stakeholder responses received
        </p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: white; padding: 1.5rem; border-radius: 6px; border-left: 4px solid ${STAKEHOLDER_CONFIG.COLORS.green};">
          <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; margin-top: 0; font-size: 1rem;">Strengths Alignment</h3>
          <div style="font-size: 2rem; font-weight: bold; color: ${STAKEHOLDER_CONFIG.COLORS.green}; margin: 1rem 0;">
            ${analysis.strengthsAgreement}%
          </div>
          <p style="color: #666; font-size: 0.9rem; margin: 0;">
            of stakeholders agree with AI-identified strengths
          </p>
        </div>

        <div style="background: white; padding: 1.5rem; border-radius: 6px; border-left: 4px solid ${STAKEHOLDER_CONFIG.COLORS.coral};">
          <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; margin-top: 0; font-size: 1rem;">Challenges Alignment</h3>
          <div style="font-size: 2rem; font-weight: bold; color: ${STAKEHOLDER_CONFIG.COLORS.coral}; margin: 1rem 0;">
            ${analysis.challengesAgreement}%
          </div>
          <p style="color: #666; font-size: 0.9rem; margin: 0;">
            of stakeholders agree with AI-identified challenges
          </p>
        </div>
      </div>

      ${analysis.recommendations.length > 0 ? `
        <div style="background: #FFF3E0; padding: 1.5rem; border-radius: 6px; border-left: 4px solid ${STAKEHOLDER_CONFIG.COLORS.coral}; margin-bottom: 2rem;">
          <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; margin-top: 0; font-size: 1rem;">Key Findings & Recommendations</h3>
          <ul style="margin: 0; padding-left: 1.5rem; line-height: 2;">
            ${analysis.recommendations.map(rec => `
              <li style="color: ${rec.type === 'alert' ? STAKEHOLDER_CONFIG.COLORS.coral : STAKEHOLDER_CONFIG.COLORS.brown};">
                ${rec.text}
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      <div style="background: white; padding: 1.5rem; border-radius: 6px; margin-bottom: 2rem;">
        <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; margin-top: 0;">Top Themes from Stakeholder Feedback</h3>

        ${Object.entries(analysis.themes).map(([field, themeList]) => {
          if (!themeList || themeList.length === 0) return '';
          const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
          return `
            <div style="margin-bottom: 1.5rem;">
              <h4 style="color: ${STAKEHOLDER_CONFIG.COLORS.brown}; margin: 0 0 0.8rem 0; font-size: 0.95rem;">${fieldLabel}</h4>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${themeList.slice(0, 8).map(theme => `
                  <div style="
                    background: ${STAKEHOLDER_CONFIG.COLORS.teal};
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                  ">
                    ${theme.word} (${theme.count}x)
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div style="background: white; padding: 1.5rem; border-radius: 6px; border: 2px solid ${STAKEHOLDER_CONFIG.COLORS.gold};">
        <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; margin-top: 0;">Next Steps</h3>
        <ol style="line-height: 2; color: #666;">
          <li>Review analysis with Leadership Team</li>
          <li>Identify which stakeholder themes should shape strategic goals</li>
          <li>Highlight any mismatches between AI analysis and stakeholder input</li>
          <li>Adjust draft goals based on stakeholder feedback</li>
          <li>Share results back with stakeholders ("You said X, and here's how it shaped our plan")</li>
        </ol>
      </div>
    </div>
  `;

  const div = document.createElement('div');
  div.id = 'preplan-analysis-container';
  div.innerHTML = html;
  document.body.appendChild(div);
}

// ============================================================================
// POST-PLAN STAKEHOLDER REVIEW
// ============================================================================

/**
 * Show Post-Plan Survey Setup
 */
function showPostPlanSurveySetup() {
  const container = document.getElementById('postPlanSurveyContainer') || document.body;

  const surveyId = planState.postPlanSurveyId || generateSurveyId();
  if (!planState.postPlanSurveyId) {
    planState.postPlanSurveyId = surveyId;
    saveFormState();
  }

  const surveyUrl = STAKEHOLDER_CONFIG.SURVEY_BASE_URL + '?id=' + surveyId + '&type=postplan';
  const qrCodeUrl = generateQRCodeURL(surveyUrl);

  const html = `
    <div style="padding: 2rem; background-color: ${STAKEHOLDER_CONFIG.COLORS.cream}; border-radius: 8px; margin-top: 2rem;">
      <h2 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; font-family: 'Source Serif Pro', serif; margin: 0 0 1.5rem 0; font-size: 1.8rem;">
        Post-Plan Stakeholder Review
      </h2>

      <div style="background: white; padding: 1.5rem; border-radius: 6px; margin-bottom: 2rem; border-left: 4px solid ${STAKEHOLDER_CONFIG.COLORS.teal};">
        <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; margin-top: 0;">Survey Overview</h3>
        <p style="line-height: 1.8;">After we've developed our strategic goals, we ask stakeholders to validate the plan:</p>
        <ul style="line-height: 2;">
          <li><strong>Role clarity:</strong> What role do you play in our district community?</li>
          <li><strong>Vision alignment:</strong> What should students experience when our district is at its best?</li>
          <li><strong>Goal validation:</strong> How well do our selected goals reflect what matters?</li>
          <li><strong>Clarity check:</strong> Is it clear what we're trying to accomplish?</li>
          <li><strong>Identity:</strong> What should our district be known for?</li>
          <li><strong>Open feedback:</strong> Any other thoughts about the plan?</li>
        </ul>
        <p style="color: #666; font-size: 0.95rem; font-style: italic;">Time to complete: ~8-10 minutes | Responses are confidential</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
        <!-- QR Code -->
        <div style="background: white; padding: 1.5rem; border-radius: 6px; border: 1px solid #ddd; text-align: center;">
          <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; margin-top: 0;">QR Code (Print & Share)</h3>
          <img src="${qrCodeUrl}" alt="Survey QR Code" style="width: 200px; height: 200px; border: 1px solid #ddd; padding: 0.5rem;">
          <p style="font-size: 0.9rem; color: #666; margin: 1rem 0 0 0;">Scan to review and provide feedback</p>
        </div>

        <!-- Survey Link -->
        <div style="background: white; padding: 1.5rem; border-radius: 6px; border: 1px solid #ddd;">
          <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; margin-top: 0;">Survey Link</h3>
          <div style="background: #f5f5f5; padding: 1rem; border-radius: 4px; border: 1px solid #ddd; margin: 1rem 0; word-break: break-all;">
            <code style="font-size: 0.85rem; color: #666;">${surveyUrl}</code>
          </div>
          <button onclick="copyToClipboard('${surveyUrl}')" style="
            width: 100%;
            padding: 0.8rem;
            background-color: ${STAKEHOLDER_CONFIG.COLORS.teal};
            color: white;
            border: none;
            border-radius: 4px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 0.5rem;
          ">
            📋 Copy Survey Link
          </button>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <button onclick="openPostPlanSurveyForm('${surveyId}')" style="
          padding: 0.8rem 1.5rem;
          background-color: ${STAKEHOLDER_CONFIG.COLORS.green};
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.95rem;
        ">
          🔍 Preview Survey
        </button>
        <button onclick="viewPostPlanResponses('${surveyId}')" style="
          margin-left: 0.5rem;
          padding: 0.8rem 1.5rem;
          background-color: ${STAKEHOLDER_CONFIG.COLORS.purple};
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.95rem;
        ">
          📊 View Responses
        </button>
      </div>
    </div>
  `;

  if (container.id === 'postplan-survey-container') {
    container.innerHTML = html;
  } else {
    const div = document.createElement('div');
    div.id = 'postplan-survey-container';
    div.innerHTML = html;
    container.appendChild(div);
  }
}

/**
 * Open Post-Plan Survey Form (preview)
 */
function openPostPlanSurveyForm(surveyId) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Strategic Plan Review Survey</title>
      <style>
        body {
          font-family: 'Inter', sans-serif;
          color: #22333B;
          line-height: 1.6;
          margin: 0;
          padding: 2rem;
          background: linear-gradient(135deg, #f5f5f5 0%, #fafaf8 100%);
        }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        h1 { color: #22333B; border-bottom: 3px solid #00B4CC; padding-bottom: 0.5rem; margin-top: 0; }
        h2 { color: #5E503F; font-size: 1.1rem; margin-top: 1.5rem; }
        .form-group { margin: 1.5rem 0; }
        label { display: block; font-weight: 600; margin-bottom: 0.5rem; color: #22333B; }
        input, select, textarea {
          width: 100%;
          padding: 0.8rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          box-sizing: border-box;
        }
        textarea { min-height: 100px; resize: vertical; }
        .radio-group { margin: 0.5rem 0; }
        .radio-group label { display: inline-block; margin-right: 1.5rem; font-weight: normal; }
        .likert { display: flex; justify-content: space-between; margin: 1rem 0; }
        .likert input[type="radio"] { margin: 0; }
        .likert label { display: inline; margin: 0; font-weight: normal; text-align: center; flex: 1; }
        button { padding: 0.8rem 1.5rem; background-color: #00B4CC; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 0.95rem; }
        .note { background: #EAE0D5; padding: 1rem; border-radius: 4px; margin: 1rem 0; font-size: 0.9rem; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Strategic Plan Review Survey</h1>
        <p><strong>Survey ID:</strong> ${surveyId}</p>
        <p style="color: #666; font-size: 0.95rem;">Your feedback helps us ensure our strategic plan reflects what our community values.</p>

        <form id="survey-form">
          <div class="form-group">
            <h2>1. What is your role in our district?</h2>
            <div class="radio-group">
              <label><input type="radio" name="role" value="family"> Family/Parent</label>
            </div>
            <div class="radio-group">
              <label><input type="radio" name="role" value="student"> Student</label>
            </div>
            <div class="radio-group">
              <label><input type="radio" name="role" value="staff"> Staff Member</label>
            </div>
            <div class="radio-group">
              <label><input type="radio" name="role" value="community"> Community Member</label>
            </div>
            <div class="radio-group">
              <label><input type="radio" name="role" value="other"> Other</label>
            </div>
          </div>

          <div class="form-group">
            <h2>2. Best Student Experience</h2>
            <label for="best-experience">When this district is at its best, what should every student experience?</label>
            <textarea name="best_experience" id="best-experience" placeholder="Share your thoughts..."></textarea>
          </div>

          <div class="form-group">
            <h2>3. Goal Alignment</h2>
            <label>How well do our selected strategic goals reflect what this district should prioritize?</label>
            <div class="likert">
              <label><input type="radio" name="goal_alignment" value="strongly_disagree"> Strongly Disagree</label>
              <label><input type="radio" name="goal_alignment" value="disagree"> Disagree</label>
              <label><input type="radio" name="goal_alignment" value="neutral"> Neutral</label>
              <label><input type="radio" name="goal_alignment" value="agree"> Agree</label>
              <label><input type="radio" name="goal_alignment" value="strongly_agree"> Strongly Agree</label>
            </div>
          </div>

          <div class="form-group">
            <h2>4. Clarity</h2>
            <label>After reading these goals, how clear is it what this district is trying to accomplish?</label>
            <div class="likert">
              <label><input type="radio" name="clarity" value="strongly_disagree"> Strongly Disagree</label>
              <label><input type="radio" name="clarity" value="disagree"> Disagree</label>
              <label><input type="radio" name="clarity" value="neutral"> Neutral</label>
              <label><input type="radio" name="clarity" value="agree"> Agree</label>
              <label><input type="radio" name="clarity" value="strongly_agree"> Strongly Agree</label>
            </div>
          </div>

          <div class="form-group">
            <h2>5. District Identity</h2>
            <label for="district-identity">In your words, what should this district be known for?</label>
            <textarea name="district_identity" id="district-identity" placeholder="What's our reputation? Our pride?"></textarea>
          </div>

          <div class="form-group">
            <h2>6. Additional Feedback</h2>
            <label for="feedback">What additional feedback do you have about this strategic plan?</label>
            <textarea name="feedback" id="feedback" placeholder="Any thoughts or suggestions?"></textarea>
          </div>

          <div class="note">
            <strong>Note:</strong> This is a preview of the actual survey. Your responses will be collected and analyzed to help refine our strategic plan.
          </div>

          <button type="submit">Submit Survey</button>
        </form>
      </div>

      <script>
        document.getElementById('survey-form').addEventListener('submit', function(e) {
          e.preventDefault();
          alert('Preview mode: Responses are not saved. Actual survey will be available to stakeholders.');
          window.close();
        });
      </script>
    </body>
    </html>
  `;

  const win = window.open('', '', 'width=900,height=1200');
  win.document.write(html);
  win.document.close();
}

/**
 * View Post-Plan Responses
 */
function viewPostPlanResponses(surveyId) {
  const responses = getSurveyResponses(surveyId);
  if (responses.length === 0) {
    alert('No responses yet. Start collecting feedback!');
    return;
  }

  renderPostPlanAnalysis(responses);
}

/**
 * Render Post-Plan Analysis
 */
function renderPostPlanAnalysis(responses) {
  const roles = {};
  responses.forEach(r => {
    const role = r.role || 'unknown';
    roles[role] = (roles[role] || 0) + 1;
  });

  const likertScores = {
    goal_alignment: [],
    clarity: []
  };

  const likertMap = {
    'strongly_disagree': 1,
    'disagree': 2,
    'neutral': 3,
    'agree': 4,
    'strongly_agree': 5
  };

  responses.forEach(r => {
    if (r.goal_alignment) likertScores.goal_alignment.push(likertMap[r.goal_alignment] || 0);
    if (r.clarity) likertScores.clarity.push(likertMap[r.clarity] || 0);
  });

  const avgGoalAlignment = likertScores.goal_alignment.length > 0
    ? (likertScores.goal_alignment.reduce((a, b) => a + b, 0) / likertScores.goal_alignment.length).toFixed(1)
    : 0;

  const avgClarity = likertScores.clarity.length > 0
    ? (likertScores.clarity.reduce((a, b) => a + b, 0) / likertScores.clarity.length).toFixed(1)
    : 0;

  const bestExperiences = responses.filter(r => r.best_experience).map(r => r.best_experience);
  const identityThemes = responses.filter(r => r.district_identity).map(r => r.district_identity);
  const feedbackThemes = responses.filter(r => r.feedback).map(r => r.feedback);

  const bestExpThemes = extractThemes(bestExperiences);
  const identityThemes_extracted = extractThemes(identityThemes);
  const feedbackThemes_extracted = extractThemes(feedbackThemes);

  const html = `
    <div style="padding: 2rem; background-color: ${STAKEHOLDER_CONFIG.COLORS.cream}; border-radius: 8px; margin-top: 2rem;">
      <h2 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; font-family: 'Source Serif Pro', serif; margin: 0 0 1.5rem 0; font-size: 1.8rem;">
        Post-Plan Review Analysis
      </h2>

      <div style="background: white; padding: 1.5rem; border-radius: 6px; margin-bottom: 2rem; border-left: 4px solid ${STAKEHOLDER_CONFIG.COLORS.teal};">
        <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; margin-top: 0;">Summary</h3>
        <p style="font-size: 1.2rem; color: ${STAKEHOLDER_CONFIG.COLORS.teal}; font-weight: 600;">
          ${responses.length} stakeholder reviews received
        </p>
      </div>

      <!-- Role Breakdown -->
      <div style="background: white; padding: 1.5rem; border-radius: 6px; margin-bottom: 2rem; border-left: 4px solid ${STAKEHOLDER_CONFIG.COLORS.green};">
        <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; margin-top: 0;">Respondent Roles</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
          ${Object.entries(roles).map(([role, count]) => `
            <div style="text-align: center; padding: 1rem; background: #f9f9f9; border-radius: 4px;">
              <div style="font-size: 1.8rem; font-weight: bold; color: ${STAKEHOLDER_CONFIG.COLORS.teal};">${count}</div>
              <div style="font-size: 0.85rem; color: #666; text-transform: capitalize;">${role}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Likert Scores -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: white; padding: 1.5rem; border-radius: 6px; border-left: 4px solid ${STAKEHOLDER_CONFIG.COLORS.gold};">
          <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; margin-top: 0; font-size: 1rem;">Goal Alignment</h3>
          <div style="font-size: 2.5rem; font-weight: bold; color: ${STAKEHOLDER_CONFIG.COLORS.gold}; margin: 0.5rem 0;">
            ${avgGoalAlignment}/5
          </div>
          <p style="color: #666; font-size: 0.9rem; margin: 0;">
            Average agreement that goals reflect priorities
          </p>
        </div>

        <div style="background: white; padding: 1.5rem; border-radius: 6px; border-left: 4px solid ${STAKEHOLDER_CONFIG.COLORS.purple};">
          <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; margin-top: 0; font-size: 1rem;">Plan Clarity</h3>
          <div style="font-size: 2.5rem; font-weight: bold; color: ${STAKEHOLDER_CONFIG.COLORS.purple}; margin: 0.5rem 0;">
            ${avgClarity}/5
          </div>
          <p style="color: #666; font-size: 0.9rem; margin: 0;">
            Average clarity of plan objectives
          </p>
        </div>
      </div>

      <!-- Themes -->
      <div style="background: white; padding: 1.5rem; border-radius: 6px; margin-bottom: 2rem;">
        <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; margin-top: 0;">Themes from Stakeholder Feedback</h3>

        ${bestExpThemes.length > 0 ? `
          <div style="margin-bottom: 1.5rem;">
            <h4 style="color: ${STAKEHOLDER_CONFIG.COLORS.teal}; margin: 0 0 0.8rem 0; font-size: 0.95rem;">Best Student Experience (Key Words)</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${bestExpThemes.slice(0, 10).map(theme => `
                <div style="background: ${STAKEHOLDER_CONFIG.COLORS.teal}; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
                  ${theme.word}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${identityThemes_extracted.length > 0 ? `
          <div style="margin-bottom: 1.5rem;">
            <h4 style="color: ${STAKEHOLDER_CONFIG.COLORS.purple}; margin: 0 0 0.8rem 0; font-size: 0.95rem;">District Identity (Key Words)</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${identityThemes_extracted.slice(0, 10).map(theme => `
                <div style="background: ${STAKEHOLDER_CONFIG.COLORS.purple}; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
                  ${theme.word}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${feedbackThemes_extracted.length > 0 ? `
          <div>
            <h4 style="color: ${STAKEHOLDER_CONFIG.COLORS.gold}; margin: 0 0 0.8rem 0; font-size: 0.95rem;">Other Feedback (Key Words)</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${feedbackThemes_extracted.slice(0, 8).map(theme => `
                <div style="background: ${STAKEHOLDER_CONFIG.COLORS.gold}; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
                  ${theme.word}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <div style="background: #E8F4F8; padding: 1.5rem; border-radius: 6px;">
        <h3 style="color: ${STAKEHOLDER_CONFIG.COLORS.navy}; margin-top: 0;">Recommendations</h3>
        <ul style="line-height: 2; color: #666;">
          ${avgGoalAlignment >= 4 ? `<li style="color: ${STAKEHOLDER_CONFIG.COLORS.green};">✓ Strong goal alignment. Stakeholders support our strategic direction.</li>` : avgGoalAlignment >= 3 ? `<li>Moderate goal alignment. Consider communicating more clearly WHY these goals matter.</li>` : `<li style="color: ${STAKEHOLDER_CONFIG.COLORS.coral};">⚠️ Goal alignment below expectations. Revisit goals or get more detailed stakeholder input.</li>`}
          ${avgClarity >= 4 ? `<li style="color: ${STAKEHOLDER_CONFIG.COLORS.green};">✓ Plan is clear. Stakeholders understand what we're trying to accomplish.</li>` : avgClarity >= 3 ? `<li>Plan clarity could improve. Add clearer language in goal statements and objectives.</li>` : `<li style="color: ${STAKEHOLDER_CONFIG.COLORS.coral};">⚠️ Plan lacks clarity. Simplify goals and add concrete examples.</li>`}
          <li>Share these results back to stakeholders: "You said X, and here's how we're responding."</li>
          <li>Consider next steps: Timeline? Quick wins? Communication plan?</li>
        </ul>
      </div>
    </div>
  `;

  const div = document.createElement('div');
  div.id = 'postplan-analysis-container';
  div.innerHTML = html;
  document.body.appendChild(div);
}

// ============================================================================
// LIVE STAKEHOLDER MODE
// ============================================================================

/**
 * Enter Live Stakeholder Mode
 * Display incoming survey responses in real-time for live audience
 */
function enterLiveStakeholderMode(surveyId) {
  if (!surveyId) {
    alert('Survey ID required. Create a survey first.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Live Stakeholder Response View</title>
      <style>
        body {
          font-family: 'Inter', sans-serif;
          color: #22333B;
          margin: 0;
          padding: 2rem;
          background: linear-gradient(135deg, #22333B 0%, #5E503F 100%);
          min-height: 100vh;
        }
        .container { max-width: 1400px; margin: 0 auto; }
        h1 { color: white; text-align: center; margin: 0 0 2rem 0; font-size: 2.5rem; }
        .controls {
          text-align: center;
          margin-bottom: 2rem;
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        button {
          padding: 0.8rem 1.5rem;
          background-color: #00B4CC;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.95rem;
        }
        button.secondary { background-color: #6B4C9A; }
        .counter {
          background: white;
          color: #22333B;
          padding: 0.8rem 1.5rem;
          border-radius: 4px;
          font-weight: 600;
          font-size: 1rem;
        }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 1.5rem; }
        .card {
          background: white;
          padding: 1.5rem;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card h3 { margin: 0 0 0.5rem 0; color: #00B4CC; font-size: 1rem; }
        .card p { margin: 0; color: #666; font-size: 0.9rem; line-height: 1.6; }
        .role-badge {
          display: inline-block;
          background: #E8F4F8;
          color: #00B4CC;
          padding: 0.3rem 0.8rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          margin: 0.5rem 0.5rem 0 0;
        }
        .summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .summary-card {
          background: white;
          padding: 1.5rem;
          border-radius: 6px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .summary-card .big-number {
          font-size: 2.5rem;
          font-weight: bold;
          color: #00B4CC;
          margin: 0.5rem 0;
        }
        .summary-card .label {
          font-size: 0.85rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📊 Live Stakeholder Response View</h1>

        <div class="controls">
          <span class="counter">Responses: <strong id="response-count">0</strong></span>
          <button onclick="refreshLiveView()">🔄 Refresh Now</button>
          <button class="secondary" onclick="toggleAutoRefresh()">⏸️ Pause Auto-Refresh</button>
          <button class="secondary" onclick="window.close()">Close</button>
        </div>

        <div class="summary" id="live-summary">
          <div class="summary-card">
            <div class="label">Total Responses</div>
            <div class="big-number" id="total-responses">0</div>
          </div>
          <div class="summary-card">
            <div class="label">Role Breakdown</div>
            <div style="font-size: 0.9rem; color: #666;" id="role-breakdown">Loading...</div>
          </div>
          <div class="summary-card">
            <div class="label">Avg Goal Alignment</div>
            <div class="big-number" id="avg-alignment">--</div>
          </div>
          <div class="summary-card">
            <div class="label">Avg Clarity Score</div>
            <div class="big-number" id="avg-clarity">--</div>
          </div>
        </div>

        <div id="live-responses" class="grid"></div>
      </div>

      <script>
        let autoRefresh = true;
        const SURVEY_ID = '${surveyId}';

        function refreshLiveView() {
          const key = 'survey_' + SURVEY_ID;
          const responses = JSON.parse(localStorage.getItem(key) || '[]');

          document.getElementById('response-count').textContent = responses.length;
          document.getElementById('total-responses').textContent = responses.length;

          // Role breakdown
          const roles = {};
          responses.forEach(r => {
            const role = r.role || 'unknown';
            roles[role] = (roles[role] || 0) + 1;
          });

          const roleText = Object.entries(roles)
            .map(([role, count]) => role + ': ' + count)
            .join(' | ') || 'No data';
          document.getElementById('role-breakdown').textContent = roleText;

          // Likert scores
          const likertMap = { 'strongly_disagree': 1, 'disagree': 2, 'neutral': 3, 'agree': 4, 'strongly_agree': 5 };
          const alignmentScores = responses
            .filter(r => r.goal_alignment)
            .map(r => likertMap[r.goal_alignment] || 0);
          const clarityScores = responses
            .filter(r => r.clarity)
            .map(r => likertMap[r.clarity] || 0);

          const avgAlignment = alignmentScores.length > 0
            ? (alignmentScores.reduce((a,b) => a+b, 0) / alignmentScores.length).toFixed(1)
            : '--';
          const avgClarity = clarityScores.length > 0
            ? (clarityScores.reduce((a,b) => a+b, 0) / clarityScores.length).toFixed(1)
            : '--';

          document.getElementById('avg-alignment').textContent = avgAlignment + '/5';
          document.getElementById('avg-clarity').textContent = avgClarity + '/5';

          // Render recent responses
          const container = document.getElementById('live-responses');
          container.innerHTML = responses.slice(-12).reverse().map(r => \`
            <div class="card">
              <h3>\${r.role ? r.role.charAt(0).toUpperCase() + r.role.slice(1) : 'Respondent'}</h3>
              <div class="role-badge">\${r.role || 'Unknown'}</div>
              <p><strong>Best Experience:</strong> \${r.best_experience ? r.best_experience.substring(0, 80) + '...' : 'No response'}</p>
              <p><strong>District Identity:</strong> \${r.district_identity ? r.district_identity.substring(0, 80) + '...' : 'No response'}</p>
              <p style="color: #00B4CC; font-size: 0.85rem; margin-top: 0.5rem;">\${new Date(r.timestamp).toLocaleTimeString()}</p>
            </div>
          \`).join('');
        }

        function toggleAutoRefresh() {
          autoRefresh = !autoRefresh;
          event.target.textContent = autoRefresh ? '⏸️ Pause Auto-Refresh' : '▶️ Resume Auto-Refresh';
        }

        // Auto-refresh every 5 seconds
        refreshLiveView();
        setInterval(() => {
          if (autoRefresh) refreshLiveView();
        }, 5000);
      </script>
    </body>
    </html>
  `;

  const win = window.open('', '', 'width=1400,height=900');
  win.document.write(html);
  win.document.close();
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize Stakeholder System
 * Call this once when the step loads
 */
function initializeStakeholderSystem() {
  // Ensure planState has stakeholder properties
  if (!planState.stakeholderConveningPlan) {
    planState.stakeholderConveningPlan = {};
  }
  if (!planState.prePlanResponses) {
    planState.prePlanResponses = [];
  }
  if (!planState.postPlanResponses) {
    planState.postPlanResponses = [];
  }

  saveFormState();
}

// ============================================================================
// CSV UPLOAD HANDLERS
// ============================================================================

function handlePrePlanCSVUpload(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const responses = parseCSV(e.target.result);
    if (responses.length === 0) {
      alert('No valid responses found in CSV. Check the format and try again.');
      return;
    }
    // Store responses
    planState.prePlanResponses = responses;
    saveFormState();
    // Also store in localStorage under survey key
    if (planState.prePlanSurveyId) {
      const key = 'sd_survey_' + planState.prePlanSurveyId;
      localStorage.setItem(key, JSON.stringify(responses));
    }
    // Run analysis
    const analysis = analyzePrePlanResponses(responses);
    planState.prePlanAnalysis = analysis;
    saveFormState();
    renderPrePlanAnalysis(analysis);
    alert(responses.length + ' responses imported successfully.');
  };
  reader.readAsText(file);
}

function handlePostPlanCSVUpload(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const responses = parseCSV(e.target.result);
    if (responses.length === 0) {
      alert('No valid responses found in CSV. Check the format and try again.');
      return;
    }
    // Store responses
    planState.postPlanResponses = responses;
    saveFormState();
    // Also store in localStorage under survey key
    if (planState.postPlanSurveyId) {
      const key = 'sd_survey_' + planState.postPlanSurveyId;
      localStorage.setItem(key, JSON.stringify(responses));
    }
    // Run analysis
    renderPostPlanAnalysis(responses);
    alert(responses.length + ' responses imported successfully.');
  };
  reader.readAsText(file);
}

// Export functions globally
window.handlePrePlanCSVUpload = handlePrePlanCSVUpload;
window.handlePostPlanCSVUpload = handlePostPlanCSVUpload;
window.renderStakeholderConveningToolkit = renderStakeholderConveningToolkit;
window.generateConveningPlan = generateConveningPlan;
window.showPrePlanDataPacket = showPrePlanDataPacket;
window.showPrePlanSurveySetup = showPrePlanSurveySetup;
window.openPrintableQRCard = openPrintableQRCard;
window.copyToClipboard = copyToClipboard;
window.viewPrePlanResponses = viewPrePlanResponses;
window.generatePrePlanDataPacket = generatePrePlanDataPacket;
window.analyzePrePlanResponses = analyzePrePlanResponses;
window.renderPrePlanAnalysis = renderPrePlanAnalysis;
window.showPostPlanSurveySetup = showPostPlanSurveySetup;
window.openPostPlanSurveyForm = openPostPlanSurveyForm;
window.viewPostPlanResponses = viewPostPlanResponses;
window.renderPostPlanAnalysis = renderPostPlanAnalysis;
window.enterLiveStakeholderMode = enterLiveStakeholderMode;
window.saveSurveyResponse = saveSurveyResponse;
window.getSurveyResponses = getSurveyResponses;
window.exportSurveyCSV = exportSurveyCSV;
window.initializeStakeholderSystem = initializeStakeholderSystem;
