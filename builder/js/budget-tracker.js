/**
 * budget-tracker.js
 * Budget Integration for K-12 Strategic Plan Builder
 * Manages per-initiative budget tracking, funding sources, and budget reporting
 *
 * Global Dependencies:
 * - planState (global object with initiatives array)
 * - saveFormState() (global function for persistence)
 *
 * No external frameworks or npm dependencies. Pure vanilla JavaScript.
 */

// ============================================================================
// INITIALIZATION & STATE MANAGEMENT
// ============================================================================

/**
 * Initialize budget fields on all initiatives and set up budget summary
 */
function initializeBudgetTracking() {
  if (!planState.initiatives) return;

  planState.initiatives.forEach((initiative, idx) => {
    if (!initiative.budgetAmount) {
      initiative.budgetAmount = 0;
      initiative.fundingSource = 'general_fund';
      initiative.fundingSourceCustom = '';
      initiative.budgetNotes = '';
      initiative.budgetStatus = 'planned';
    }
  });

  initializeBudgetSummary();
}

/**
 * Initialize the budget summary object in planState
 */
function initializeBudgetSummary() {
  if (!planState.budgetSummary) {
    planState.budgetSummary = {
      totalBudget: 0,
      totalFunded: 0,
      totalGap: 0,
      bySource: {},
      byDomain: {},
      byStatus: {}
    };
  }
  recalculateBudgetSummary();
}

/**
 * Update the budget summary based on current initiative data
 */
function recalculateBudgetSummary() {
  if (!planState.budgetSummary || !planState.initiatives) return;

  const summary = {
    totalBudget: 0,
    totalFunded: 0,
    totalGap: 0,
    bySource: {},
    byDomain: {},
    byStatus: {}
  };

  planState.initiatives.forEach(init => {
    const amount = parseCurrency(String(init.budgetAmount || 0));
    summary.totalBudget += amount;

    // Track by funding source
    const source = init.fundingSource === 'other' ? (init.fundingSourceCustom || 'other') : init.fundingSource;
    summary.bySource[source] = (summary.bySource[source] || 0) + amount;

    // Track by status
    const status = init.budgetStatus || 'planned';
    summary.byStatus[status] = (summary.byStatus[status] || 0) + amount;

    if (status === 'allocated' || status === 'spent') {
      summary.totalFunded += amount;
    }

    // Track by domain
    const domain = init.domain || 'Uncategorized';
    if (!summary.byDomain[domain]) {
      summary.byDomain[domain] = { budget: 0, count: 0 };
    }
    summary.byDomain[domain].budget += amount;
    summary.byDomain[domain].count += 1;
  });

  summary.totalGap = summary.totalBudget - summary.totalFunded;
  planState.budgetSummary = summary;
}

// ============================================================================
// CURRENCY FORMATTING & PARSING
// ============================================================================

/**
 * Format a number as USD currency string
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string like "$1,234,567.00"
 */
function formatCurrency(amount) {
  const num = parseFloat(amount) || 0;
  return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

/**
 * Parse a currency string back to a number
 * @param {string} str - Currency string like "$1,234,567" or "1234567"
 * @returns {number} Parsed numeric value
 */
function parseCurrency(str) {
  if (!str) return 0;
  const cleaned = String(str).replace(/[$,]/g, '').trim();
  return parseInt(cleaned, 10) || 0;
}

// ============================================================================
// BUDGET FIELD RENDERING
// ============================================================================

/**
 * Render budget input fields for a given initiative
 * @param {number} initiativeIndex - Index in planState.initiatives
 * @param {string} containerId - ID of container to render into
 */
function renderBudgetFields(initiativeIndex, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const initiative = planState.initiatives[initiativeIndex];
  if (!initiative) return;

  const budgetAmount = initiative.budgetAmount || 0;
  const fundingSource = initiative.fundingSource || 'general_fund';
  const fundingSourceCustom = initiative.fundingSourceCustom || '';
  const budgetNotes = initiative.budgetNotes || '';
  const budgetStatus = initiative.budgetStatus || 'planned';

  const fundingSourceOptions = [
    { value: 'general_fund', label: 'General Fund' },
    { value: 'title_i', label: 'Title I (ESSA)' },
    { value: 'title_ii', label: 'Title II (ESSA)' },
    { value: 'title_iii', label: 'Title III (ESSA)' },
    { value: 'title_iv', label: 'Title IV (ESSA)' },
    { value: 'idea', label: 'IDEA (Special Education)' },
    { value: 'state_grant', label: 'State Grant' },
    { value: 'federal_grant', label: 'Federal Grant' },
    { value: 'local_grant', label: 'Local/Private Grant' },
    { value: 'bond', label: 'Bond Funds' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'planned', label: 'Planned', color: '#999999' },
    { value: 'approved', label: 'Approved', color: '#00B4CC' },
    { value: 'allocated', label: 'Allocated', color: '#6ECF6E' },
    { value: 'spent', label: 'Spent', color: '#D4A537' }
  ];

  const statusColor = statusOptions.find(s => s.value === budgetStatus)?.color || '#999999';

  const html = `
    <div style="
      background: #EAE0D5;
      border-left: 4px solid #D4A537;
      padding: 16px;
      border-radius: 4px;
      margin: 12px 0;
      font-family: 'Inter', sans-serif;
    ">
      <div style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 12px;
      ">
        <!-- Budget Amount -->
        <div>
          <label style="
            display: block;
            font-weight: 600;
            font-size: 12px;
            color: #22333B;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-family: 'Plus Jakarta Sans', sans-serif;
          ">
            Budget Amount
          </label>
          <div style="position: relative;">
            <span style="
              position: absolute;
              left: 12px;
              top: 50%;
              transform: translateY(-50%);
              color: #D4A537;
              font-weight: 600;
              font-size: 16px;
            ">$</span>
            <input
              type="number"
              id="budget_amount_${initiativeIndex}"
              value="${budgetAmount}"
              min="0"
              step="1000"
              style="
                width: 100%;
                padding: 10px 10px 10px 28px;
                border: 1px solid #22333B;
                border-radius: 3px;
                font-size: 14px;
                font-family: 'Inter', sans-serif;
                background: white;
              "
              data-initiative="${initiativeIndex}"
              class="budget-amount-input"
            />
          </div>
        </div>

        <!-- Budget Status -->
        <div>
          <label style="
            display: block;
            font-weight: 600;
            font-size: 12px;
            color: #22333B;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-family: 'Plus Jakarta Sans', sans-serif;
          ">
            Budget Status
          </label>
          <div style="display: flex; gap: 8px; align-items: center;">
            <select
              id="budget_status_${initiativeIndex}"
              style="
                flex: 1;
                padding: 10px;
                border: 1px solid #22333B;
                border-radius: 3px;
                font-size: 14px;
                font-family: 'Inter', sans-serif;
                background: white;
              "
              data-initiative="${initiativeIndex}"
              class="budget-status-select"
            >
              ${statusOptions.map(opt => `
                <option value="${opt.value}" ${opt.value === budgetStatus ? 'selected' : ''}>
                  ${opt.label}
                </option>
              `).join('')}
            </select>
            <div style="
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: ${statusColor};
              flex-shrink: 0;
            "></div>
          </div>
        </div>
      </div>

      <!-- Funding Source -->
      <div style="margin-bottom: 12px;">
        <label style="
          display: block;
          font-weight: 600;
          font-size: 12px;
          color: #22333B;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        ">
          Funding Source
        </label>
        <select
          id="funding_source_${initiativeIndex}"
          style="
            width: 100%;
            padding: 10px;
            border: 1px solid #22333B;
            border-radius: 3px;
            font-size: 14px;
            font-family: 'Inter', sans-serif;
            background: white;
          "
          data-initiative="${initiativeIndex}"
          class="funding-source-select"
        >
          ${fundingSourceOptions.map(opt => `
            <option value="${opt.value}" ${opt.value === fundingSource ? 'selected' : ''}>
              ${opt.label}
            </option>
          `).join('')}
        </select>
      </div>

      <!-- Custom Funding Source (shown if "other" selected) -->
      ${fundingSource === 'other' ? `
        <div style="margin-bottom: 12px;">
          <label style="
            display: block;
            font-weight: 600;
            font-size: 12px;
            color: #22333B;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-family: 'Plus Jakarta Sans', sans-serif;
          ">
            Funding Source (Other)
          </label>
          <input
            type="text"
            id="funding_source_custom_${initiativeIndex}"
            value="${fundingSourceCustom}"
            placeholder="Please specify..."
            style="
              width: 100%;
              padding: 10px;
              border: 1px solid #22333B;
              border-radius: 3px;
              font-size: 14px;
              font-family: 'Inter', sans-serif;
              background: white;
            "
            data-initiative="${initiativeIndex}"
            class="funding-source-custom-input"
          />
        </div>
      ` : ''}

      <!-- Budget Notes -->
      <div>
        <label style="
          display: block;
          font-weight: 600;
          font-size: 12px;
          color: #22333B;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        ">
          Budget Notes (Optional)
        </label>
        <textarea
          id="budget_notes_${initiativeIndex}"
          placeholder="Add any notes about this budget (funding contingencies, timing, etc.)"
          style="
            width: 100%;
            padding: 10px;
            border: 1px solid #22333B;
            border-radius: 3px;
            font-size: 14px;
            font-family: 'Inter', sans-serif;
            background: white;
            min-height: 60px;
            resize: vertical;
          "
          data-initiative="${initiativeIndex}"
          class="budget-notes-textarea"
        >${budgetNotes}</textarea>
      </div>
    </div>
  `;

  container.innerHTML = html;
  attachBudgetFieldListeners(initiativeIndex);
}

/**
 * Attach change listeners to budget input fields
 * @param {number} initiativeIndex - Index of initiative
 */
function attachBudgetFieldListeners(initiativeIndex) {
  // Budget amount listener
  const amountInput = document.getElementById(`budget_amount_${initiativeIndex}`);
  if (amountInput) {
    amountInput.addEventListener('change', function() {
      planState.initiatives[initiativeIndex].budgetAmount = parseInt(this.value) || 0;
      recalculateBudgetSummary();
      saveFormState();
      renderBudgetSummaryCard();
      renderBudgetProgressSidebar();
    });
  }

  // Funding source listener
  const sourceSelect = document.getElementById(`funding_source_${initiativeIndex}`);
  if (sourceSelect) {
    sourceSelect.addEventListener('change', function() {
      planState.initiatives[initiativeIndex].fundingSource = this.value;
      recalculateBudgetSummary();
      saveFormState();
      // Re-render to show/hide custom field
      renderBudgetFields(initiativeIndex, `budget_container_${initiativeIndex}`);
      renderBudgetSummaryCard();
    });
  }

  // Custom funding source listener
  const customInput = document.getElementById(`funding_source_custom_${initiativeIndex}`);
  if (customInput) {
    customInput.addEventListener('change', function() {
      planState.initiatives[initiativeIndex].fundingSourceCustom = this.value;
      recalculateBudgetSummary();
      saveFormState();
      renderBudgetSummaryCard();
    });
  }

  // Budget status listener
  const statusSelect = document.getElementById(`budget_status_${initiativeIndex}`);
  if (statusSelect) {
    statusSelect.addEventListener('change', function() {
      planState.initiatives[initiativeIndex].budgetStatus = this.value;
      recalculateBudgetSummary();
      saveFormState();
      renderBudgetSummaryCard();
      renderBudgetProgressSidebar();
    });
  }

  // Budget notes listener
  const notesTextarea = document.getElementById(`budget_notes_${initiativeIndex}`);
  if (notesTextarea) {
    notesTextarea.addEventListener('change', function() {
      planState.initiatives[initiativeIndex].budgetNotes = this.value;
      saveFormState();
    });
  }
}

// ============================================================================
// BUDGET SUMMARY CARD
// ============================================================================

/**
 * Render the budget summary card showing totals and breakdowns
 */
function renderBudgetSummaryCard() {
  const container = document.getElementById('budgetSummaryCard');
  if (!container) return;

  recalculateBudgetSummary();
  const summary = planState.budgetSummary;

  const fundingSourceColors = {
    'general_fund': '#5E503F',
    'title_i': '#00B4CC',
    'title_ii': '#6B4C9A',
    'title_iii': '#E07A5F',
    'title_iv': '#D4A537',
    'idea': '#6ECF6E',
    'state_grant': '#22333B',
    'federal_grant': '#5E503F',
    'local_grant': '#00B4CC',
    'bond': '#D4A537'
  };

  const statusColors = {
    'planned': '#999999',
    'approved': '#00B4CC',
    'allocated': '#6ECF6E',
    'spent': '#D4A537'
  };

  // Generate funding source chips
  const fundingChips = Object.entries(summary.bySource)
    .map(([source, amount]) => {
      const displayLabel = source === 'general_fund' ? 'General Fund' :
        source === 'title_i' ? 'Title I' :
        source === 'title_ii' ? 'Title II' :
        source === 'title_iii' ? 'Title III' :
        source === 'title_iv' ? 'Title IV' :
        source === 'idea' ? 'IDEA' :
        source === 'state_grant' ? 'State Grant' :
        source === 'federal_grant' ? 'Federal Grant' :
        source === 'local_grant' ? 'Local/Private' :
        source === 'bond' ? 'Bond' :
        source;

      const color = fundingSourceColors[source] || '#999999';

      return `
        <div style="
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: ${color}20;
          border: 1px solid ${color};
          border-radius: 20px;
          padding: 6px 12px;
          margin: 4px;
          font-size: 12px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          color: #22333B;
        ">
          <div style="
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: ${color};
          "></div>
          ${displayLabel}: ${formatCurrency(amount)}
        </div>
      `;
    })
    .join('');

  // Generate status breakdown
  const statusBreakdown = Object.entries(summary.byStatus)
    .map(([status, amount]) => {
      const percent = summary.totalBudget > 0 ? Math.round((amount / summary.totalBudget) * 100) : 0;
      const label = status.charAt(0).toUpperCase() + status.slice(1);
      const color = statusColors[status] || '#999999';

      return `
        <div style="margin-bottom: 12px;">
          <div style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
            font-family: 'Inter', sans-serif;
            font-size: 13px;
          ">
            <span style="color: #22333B; font-weight: 600;">
              ${label}: ${formatCurrency(amount)}
            </span>
            <span style="color: #999999;">
              ${percent}%
            </span>
          </div>
          <div style="
            height: 8px;
            background: #DDD;
            border-radius: 2px;
            overflow: hidden;
          ">
            <div style="
              height: 100%;
              width: ${percent}%;
              background: ${color};
              transition: width 0.3s ease;
            "></div>
          </div>
        </div>
      `;
    })
    .join('');

  const fundedPercent = summary.totalBudget > 0 ? Math.round((summary.totalFunded / summary.totalBudget) * 100) : 0;
  const gapPercent = 100 - fundedPercent;

  const html = `
    <div style="
      background: white;
      border: 1px solid #22333B;
      border-radius: 6px;
      padding: 20px;
      font-family: 'Inter', sans-serif;
    ">
      <div style="
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 20px;
        margin-bottom: 24px;
      ">
        <!-- Total Budget -->
        <div style="
          background: #F5F1EB;
          padding: 16px;
          border-radius: 4px;
          border-left: 4px solid #D4A537;
        ">
          <div style="
            font-size: 11px;
            font-weight: 700;
            color: #999999;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
            font-family: 'Plus Jakarta Sans', sans-serif;
          ">
            Total Investment
          </div>
          <div style="
            font-size: 28px;
            font-weight: 700;
            color: #D4A537;
            font-family: 'Source Serif Pro', serif;
          ">
            ${formatCurrency(summary.totalBudget)}
          </div>
          <div style="
            font-size: 12px;
            color: #666;
            margin-top: 6px;
          ">
            ${planState.initiatives?.length || 0} initiatives
          </div>
        </div>

        <!-- Total Funded -->
        <div style="
          background: #F5F1EB;
          padding: 16px;
          border-radius: 4px;
          border-left: 4px solid #6ECF6E;
        ">
          <div style="
            font-size: 11px;
            font-weight: 700;
            color: #999999;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
            font-family: 'Plus Jakarta Sans', sans-serif;
          ">
            Allocated/Spent
          </div>
          <div style="
            font-size: 28px;
            font-weight: 700;
            color: #6ECF6E;
            font-family: 'Source Serif Pro', serif;
          ">
            ${formatCurrency(summary.totalFunded)}
          </div>
          <div style="
            font-size: 12px;
            color: #666;
            margin-top: 6px;
          ">
            ${fundedPercent}% funded
          </div>
        </div>

        <!-- Funding Gap -->
        <div style="
          background: #F5F1EB;
          padding: 16px;
          border-radius: 4px;
          border-left: 4px solid #E07A5F;
        ">
          <div style="
            font-size: 11px;
            font-weight: 700;
            color: #999999;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
            font-family: 'Plus Jakarta Sans', sans-serif;
          ">
            Funding Gap
          </div>
          <div style="
            font-size: 28px;
            font-weight: 700;
            color: #E07A5F;
            font-family: 'Source Serif Pro', serif;
          ">
            ${formatCurrency(summary.totalGap)}
          </div>
          <div style="
            font-size: 12px;
            color: #666;
            margin-top: 6px;
          ">
            ${gapPercent}% to allocate
          </div>
        </div>
      </div>

      <!-- Funding by Source -->
      <div style="margin-bottom: 24px;">
        <h3 style="
          font-size: 13px;
          font-weight: 700;
          color: #22333B;
          margin: 0 0 12px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        ">
          Funding Sources
        </h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0;">
          ${fundingChips}
        </div>
      </div>

      <!-- Budget Status Breakdown -->
      <div>
        <h3 style="
          font-size: 13px;
          font-weight: 700;
          color: #22333B;
          margin: 0 0 16px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        ">
          Budget Status Breakdown
        </h3>
        ${statusBreakdown}
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// ============================================================================
// BUDGET PROGRESS SIDEBAR
// ============================================================================

/**
 * Render the budget progress sidebar panel
 */
function renderBudgetProgressSidebar() {
  const container = document.getElementById('budgetProgressSidebar');
  if (!container) return;

  recalculateBudgetSummary();
  const summary = planState.budgetSummary;

  const statusColors = {
    'planned': '#999999',
    'approved': '#00B4CC',
    'allocated': '#6ECF6E',
    'spent': '#D4A537'
  };

  // Group initiatives by domain
  const byDomain = {};
  planState.initiatives.forEach((init, idx) => {
    const domain = init.domain || 'Uncategorized';
    if (!byDomain[domain]) {
      byDomain[domain] = [];
    }
    byDomain[domain].push({ ...init, index: idx });
  });

  const domainSections = Object.entries(byDomain)
    .map(([domain, initiatives]) => {
      const domainTotal = initiatives.reduce((sum, init) => sum + (parseCurrency(String(init.budgetAmount || 0))), 0);

      const initiativeCards = initiatives
        .map(init => {
          const statusColor = statusColors[init.budgetStatus || 'planned'] || '#999999';
          const amount = parseCurrency(String(init.budgetAmount || 0));

          return `
            <div style="
              padding: 10px;
              background: #F9F7F4;
              border-left: 3px solid ${statusColor};
              border-radius: 2px;
              margin-bottom: 8px;
              font-size: 12px;
              font-family: 'Inter', sans-serif;
            ">
              <div style="
                display: flex;
                justify-content: space-between;
                align-items: start;
                margin-bottom: 4px;
              ">
                <div style="
                  font-weight: 600;
                  color: #22333B;
                  flex: 1;
                ">
                  ${(init.title || init.name || 'Initiative').substring(0, 40)}
                </div>
                <div style="
                  font-weight: 700;
                  color: #D4A537;
                  white-space: nowrap;
                  margin-left: 8px;
                ">
                  ${formatCurrency(amount)}
                </div>
              </div>
              <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 11px;
                color: #666;
              ">
                <span>${init.budgetStatus || 'planned'}</span>
                <div style="
                  width: 10px;
                  height: 10px;
                  border-radius: 50%;
                  background: ${statusColor};
                "></div>
              </div>
            </div>
          `;
        })
        .join('');

      return `
        <div style="margin-bottom: 16px;">
          <div style="
            font-weight: 700;
            color: #22333B;
            font-size: 13px;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 2px solid #D4A537;
            font-family: 'Plus Jakarta Sans', sans-serif;
          ">
            ${domain} - ${formatCurrency(domainTotal)}
          </div>
          <div>
            ${initiativeCards}
          </div>
        </div>
      `;
    })
    .join('');

  const html = `
    <div style="
      background: white;
      border: 1px solid #22333B;
      border-radius: 6px;
      padding: 16px;
      font-family: 'Inter', sans-serif;
    ">
      <h3 style="
        font-size: 13px;
        font-weight: 700;
        color: #22333B;
        margin: 0 0 16px 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-family: 'Plus Jakarta Sans', sans-serif;
      ">
        Budget Progress by Domain
      </h3>

      ${domainSections}
    </div>
  `;

  container.innerHTML = html;
}

// ============================================================================
// BUDGET AGGREGATION FUNCTIONS
// ============================================================================

/**
 * Get budget totals grouped by domain
 * @returns {object} Object with domain names as keys and {budget, count} as values
 */
function getBudgetByDomain() {
  const result = {};

  (planState.initiatives || []).forEach(init => {
    const domain = init.domain || 'Uncategorized';
    const amount = parseCurrency(String(init.budgetAmount || 0));

    if (!result[domain]) {
      result[domain] = { budget: 0, count: 0 };
    }
    result[domain].budget += amount;
    result[domain].count += 1;
  });

  return result;
}

/**
 * Get budget totals grouped by funding source
 * @returns {object} Object with source names as keys and totals as values
 */
function getBudgetByFundingSource() {
  const result = {};

  (planState.initiatives || []).forEach(init => {
    const source = init.fundingSource === 'other' ? (init.fundingSourceCustom || 'other') : init.fundingSource;
    const amount = parseCurrency(String(init.budgetAmount || 0));
    result[source] = (result[source] || 0) + amount;
  });

  return result;
}

// ============================================================================
// BUDGET REPORTING
// ============================================================================

/**
 * Generate a printable HTML budget report and open in new window
 */
function generateBudgetReportHTML() {
  recalculateBudgetSummary();
  const summary = planState.budgetSummary;
  const byDomain = getBudgetByDomain();
  const bySource = getBudgetByFundingSource();

  // Generate domain breakdown HTML
  const domainRows = Object.entries(byDomain)
    .map(([domain, data]) => {
      const initiatives = (planState.initiatives || [])
        .filter(init => (init.domain || 'Uncategorized') === domain)
        .map(init => `
          <tr style="border-bottom: 1px solid #EEE;">
            <td style="padding: 8px 12px; font-size: 12px;">${init.title || init.name || 'Untitled'}</td>
            <td style="padding: 8px 12px; font-size: 12px; text-align: right;">${formatCurrency(parseCurrency(String(init.budgetAmount || 0)))}</td>
            <td style="padding: 8px 12px; font-size: 12px;">${init.fundingSource || 'general_fund'}</td>
            <td style="padding: 8px 12px; font-size: 12px;">${init.budgetStatus || 'planned'}</td>
          </tr>
        `)
        .join('');

      return `
        <div style="margin-bottom: 24px;">
          <h4 style="
            color: #22333B;
            font-size: 14px;
            font-weight: 700;
            margin: 0 0 12px 0;
          ">
            ${domain}
          </h4>
          <table style="width: 100%; border-collapse: collapse; background: white;">
            <thead>
              <tr style="background: #F5F1EB;">
                <th style="padding: 10px 12px; text-align: left; font-weight: 700; font-size: 12px; color: #22333B;">Initiative</th>
                <th style="padding: 10px 12px; text-align: right; font-weight: 700; font-size: 12px; color: #22333B;">Budget</th>
                <th style="padding: 10px 12px; text-align: left; font-weight: 700; font-size: 12px; color: #22333B;">Funding Source</th>
                <th style="padding: 10px 12px; text-align: left; font-weight: 700; font-size: 12px; color: #22333B;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${initiatives}
              <tr style="background: #F5F1EB; font-weight: 700;">
                <td style="padding: 10px 12px;">Domain Total</td>
                <td style="padding: 10px 12px; text-align: right; color: #D4A537;">${formatCurrency(data.budget)}</td>
                <td colspan="2" style="padding: 10px 12px;">${data.count} initiative(s)</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    })
    .join('');

  // Generate funding source breakdown
  const sourceRows = Object.entries(bySource)
    .map(([source, amount]) => {
      const percent = summary.totalBudget > 0 ? Math.round((amount / summary.totalBudget) * 100) : 0;
      return `
        <tr style="border-bottom: 1px solid #EEE;">
          <td style="padding: 10px 12px;">${source}</td>
          <td style="padding: 10px 12px; text-align: right;">${formatCurrency(amount)}</td>
          <td style="padding: 10px 12px; text-align: right;">${percent}%</td>
        </tr>
      `;
    })
    .join('');

  // Generate status breakdown
  const statusRows = Object.entries(summary.byStatus)
    .map(([status, amount]) => {
      const percent = summary.totalBudget > 0 ? Math.round((amount / summary.totalBudget) * 100) : 0;
      const label = status.charAt(0).toUpperCase() + status.slice(1);
      return `
        <tr style="border-bottom: 1px solid #EEE;">
          <td style="padding: 10px 12px;">${label}</td>
          <td style="padding: 10px 12px; text-align: right;">${formatCurrency(amount)}</td>
          <td style="padding: 10px 12px; text-align: right;">${percent}%</td>
        </tr>
      `;
    })
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Budget Report</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #22333B;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
          background: #EAE0D5;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          padding: 30px;
          border-radius: 6px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h1 {
          font-family: 'Source Serif Pro', serif;
          font-size: 32px;
          margin: 0 0 10px 0;
          color: #22333B;
        }
        h2 {
          font-family: 'Source Serif Pro', serif;
          font-size: 20px;
          margin: 30px 0 16px 0;
          color: #22333B;
          border-bottom: 2px solid #D4A537;
          padding-bottom: 8px;
        }
        .executive-summary {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
          margin: 20px 0;
        }
        .summary-card {
          background: #F5F1EB;
          padding: 16px;
          border-radius: 4px;
          border-left: 4px solid #D4A537;
        }
        .summary-label {
          font-size: 11px;
          font-weight: 700;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }
        .summary-value {
          font-size: 24px;
          font-weight: 700;
          color: #D4A537;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
        }
        th, td {
          text-align: left;
          border-bottom: 1px solid #EEE;
        }
        th {
          background: #F5F1EB;
          font-weight: 700;
          padding: 10px 12px;
          font-size: 12px;
        }
        td {
          padding: 10px 12px;
          font-size: 13px;
        }
        .text-right {
          text-align: right;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #DDD;
          font-size: 11px;
          color: #999;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Budget Report</h1>
        <p style="color: #999; margin: 0 0 20px 0;">Generated on ${new Date().toLocaleDateString()}</p>

        <h2>Executive Summary</h2>
        <div class="executive-summary">
          <div class="summary-card">
            <div class="summary-label">Total Investment</div>
            <div class="summary-value">${formatCurrency(summary.totalBudget)}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Allocated/Spent</div>
            <div class="summary-value">${formatCurrency(summary.totalFunded)}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Funding Gap</div>
            <div class="summary-value">${formatCurrency(summary.totalGap)}</div>
          </div>
        </div>

        <h2>Budget by Domain</h2>
        ${domainRows}

        <h2>Budget by Funding Source</h2>
        <table>
          <thead>
            <tr>
              <th>Funding Source</th>
              <th class="text-right">Amount</th>
              <th class="text-right">Percentage</th>
            </tr>
          </thead>
          <tbody>
            ${sourceRows}
          </tbody>
        </table>

        <h2>Budget by Status</h2>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th class="text-right">Amount</th>
              <th class="text-right">Percentage</th>
            </tr>
          </thead>
          <tbody>
            ${statusRows}
          </tbody>
        </table>

        <div class="footer">
          <p>This report was automatically generated from the Strategic Plan Builder.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const reportWindow = window.open('', '_blank');
  reportWindow.document.write(html);
  reportWindow.document.close();
}

/**
 * Export budget data as CSV file
 */
function exportBudgetCSV() {
  const headers = ['Initiative', 'Domain', 'Goal', 'Budget Amount', 'Funding Source', 'Status', 'Notes'];
  const rows = (planState.initiatives || []).map(init => [
    init.title || init.name || '',
    init.domain || 'Uncategorized',
    init.goal || '',
    init.budgetAmount || 0,
    init.fundingSource === 'other' ? (init.fundingSourceCustom || 'other') : (init.fundingSource || ''),
    init.budgetStatus || 'planned',
    (init.budgetNotes || '').replace(/"/g, '""')
  ]);

  // Build CSV
  let csv = headers.map(h => `"${h}"`).join(',') + '\n';
  csv += rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

  // Download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `budget-export-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ============================================================================
// BUDGET DASHBOARD (FOR REVIEW & FINALIZE STEP)
// ============================================================================

/**
 * Render comprehensive budget dashboard for Review & Finalize step
 * @param {string} containerId - ID of container to render into
 */
function renderBudgetDashboard(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  recalculateBudgetSummary();
  const summary = planState.budgetSummary;
  const byDomain = getBudgetByDomain();
  const bySource = getBudgetByFundingSource();

  // Get max values for chart scaling
  const maxDomainBudget = Math.max(...Object.values(byDomain).map(d => d.budget), 1);
  const maxSourceBudget = Math.max(...Object.values(bySource), 1);
  const statusTotal = Object.values(summary.byStatus).reduce((a, b) => a + b, 0);

  // Funding source bars
  const sourceBars = Object.entries(bySource)
    .sort((a, b) => b[1] - a[1])
    .map(([source, amount]) => {
      const percent = (amount / maxSourceBudget) * 100;
      const displayLabel = source === 'general_fund' ? 'General Fund' :
        source === 'title_i' ? 'Title I' :
        source === 'title_ii' ? 'Title II' :
        source === 'title_iii' ? 'Title III' :
        source === 'title_iv' ? 'Title IV' :
        source === 'idea' ? 'IDEA' :
        source === 'state_grant' ? 'State Grant' :
        source === 'federal_grant' ? 'Federal Grant' :
        source === 'local_grant' ? 'Local/Private' :
        source === 'bond' ? 'Bond' :
        source;

      return `
        <div style="margin-bottom: 16px;">
          <div style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 13px;
            font-family: 'Inter', sans-serif;
          ">
            <span style="font-weight: 600; color: #22333B;">${displayLabel}</span>
            <span style="font-weight: 700; color: #D4A537;">${formatCurrency(amount)}</span>
          </div>
          <div style="
            height: 20px;
            background: #F0F0F0;
            border-radius: 3px;
            overflow: hidden;
          ">
            <div style="
              height: 100%;
              width: ${percent}%;
              background: linear-gradient(to right, #D4A537, #E07A5F);
            "></div>
          </div>
        </div>
      `;
    })
    .join('');

  // Domain bars
  const domainBars = Object.entries(byDomain)
    .sort((a, b) => b[1].budget - a[1].budget)
    .map(([domain, data]) => {
      const percent = (data.budget / maxDomainBudget) * 100;

      return `
        <div style="margin-bottom: 16px;">
          <div style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 13px;
            font-family: 'Inter', sans-serif;
          ">
            <span style="font-weight: 600; color: #22333B;">${domain}</span>
            <span style="font-weight: 700; color: #00B4CC;">${formatCurrency(data.budget)}</span>
          </div>
          <div style="
            height: 20px;
            background: #F0F0F0;
            border-radius: 3px;
            overflow: hidden;
          ">
            <div style="
              height: 100%;
              width: ${percent}%;
              background: linear-gradient(to right, #00B4CC, #6ECF6E);
            "></div>
          </div>
          <div style="
            font-size: 11px;
            color: #999;
            margin-top: 4px;
          ">
            ${data.count} initiative(s)
          </div>
        </div>
      `;
    })
    .join('');

  // Status donut chart (CSS conic-gradient)
  const statusEntries = Object.entries(summary.byStatus);
  let conicGradient = 'conic-gradient(';
  let currentAngle = 0;
  const statusDonutParts = statusEntries.map(([status, amount]) => {
    const angle = (amount / statusTotal) * 360;
    const colors = {
      'planned': '#999999',
      'approved': '#00B4CC',
      'allocated': '#6ECF6E',
      'spent': '#D4A537'
    };
    const color = colors[status] || '#999999';
    conicGradient += `${color} ${currentAngle}deg ${currentAngle + angle}deg, `;
    currentAngle += angle;
    return { status, angle, color, amount };
  });
  conicGradient = conicGradient.slice(0, -2) + ')';

  // Status legend
  const statusLegend = statusEntries
    .map(([status, amount]) => {
      const percent = statusTotal > 0 ? Math.round((amount / statusTotal) * 100) : 0;
      const colors = {
        'planned': '#999999',
        'approved': '#00B4CC',
        'allocated': '#6ECF6E',
        'spent': '#D4A537'
      };
      const color = colors[status] || '#999999';
      const label = status.charAt(0).toUpperCase() + status.slice(1);

      return `
        <div style="
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          font-size: 12px;
          font-family: 'Inter', sans-serif;
        ">
          <div style="
            width: 12px;
            height: 12px;
            border-radius: 2px;
            background: ${color};
            flex-shrink: 0;
          "></div>
          <span style="color: #22333B; font-weight: 600;">${label}</span>
          <span style="color: #999; margin-left: auto;">${formatCurrency(amount)} (${percent}%)</span>
        </div>
      `;
    })
    .join('');

  const html = `
    <div style="
      background: white;
      border-radius: 6px;
      overflow: hidden;
    ">
      <!-- Header Stats -->
      <div style="
        background: linear-gradient(135deg, #22333B 0%, #5E503F 100%);
        color: white;
        padding: 24px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 24px;
      ">
        <div>
          <div style="
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            opacity: 0.8;
            margin-bottom: 8px;
            font-family: 'Plus Jakarta Sans', sans-serif;
          ">
            Total Investment
          </div>
          <div style="
            font-size: 32px;
            font-weight: 700;
            color: #D4A537;
            font-family: 'Source Serif Pro', serif;
          ">
            ${formatCurrency(summary.totalBudget)}
          </div>
        </div>
        <div>
          <div style="
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            opacity: 0.8;
            margin-bottom: 8px;
            font-family: 'Plus Jakarta Sans', sans-serif;
          ">
            Allocated/Spent
          </div>
          <div style="
            font-size: 32px;
            font-weight: 700;
            color: #6ECF6E;
            font-family: 'Source Serif Pro', serif;
          ">
            ${formatCurrency(summary.totalFunded)}
          </div>
        </div>
        <div>
          <div style="
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            opacity: 0.8;
            margin-bottom: 8px;
            font-family: 'Plus Jakarta Sans', sans-serif;
          ">
            Funding Gap
          </div>
          <div style="
            font-size: 32px;
            font-weight: 700;
            color: #E07A5F;
            font-family: 'Source Serif Pro', serif;
          ">
            ${formatCurrency(summary.totalGap)}
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div style="
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 24px;
        padding: 24px;
      ">
        <!-- Status Donut -->
        <div>
          <h3 style="
            font-size: 12px;
            font-weight: 700;
            color: #22333B;
            margin: 0 0 16px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-family: 'Plus Jakarta Sans', sans-serif;
          ">
            Budget Status
          </h3>
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 16px;
          ">
            <div style="
              width: 120px;
              height: 120px;
              border-radius: 50%;
              background: ${conicGradient};
              position: relative;
              margin-bottom: 16px;
            ">
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                color: #22333B;
                font-size: 14px;
                font-family: 'Source Serif Pro', serif;
              ">
                ${(planState.initiatives || []).length}
              </div>
            </div>
          </div>
          <div style="font-size: 12px;">
            ${statusLegend}
          </div>
        </div>

        <!-- Funding by Source -->
        <div>
          <h3 style="
            font-size: 12px;
            font-weight: 700;
            color: #22333B;
            margin: 0 0 16px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-family: 'Plus Jakarta Sans', sans-serif;
          ">
            Investment by Source
          </h3>
          ${sourceBars}
        </div>

        <!-- Funding by Domain -->
        <div>
          <h3 style="
            font-size: 12px;
            font-weight: 700;
            color: #22333B;
            margin: 0 0 16px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-family: 'Plus Jakarta Sans', sans-serif;
          ">
            Investment by Domain
          </h3>
          ${domainBars}
        </div>
      </div>

      <!-- Initiative Details -->
      <div style="
        padding: 24px;
        border-top: 1px solid #EEE;
      ">
        <h3 style="
          font-size: 12px;
          font-weight: 700;
          color: #22333B;
          margin: 0 0 16px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        ">
          Initiative Details
        </h3>
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        ">
          ${(planState.initiatives || []).map((init, idx) => {
            const amount = parseCurrency(String(init.budgetAmount || 0));
            const statusColors = {
              'planned': '#999999',
              'approved': '#00B4CC',
              'allocated': '#6ECF6E',
              'spent': '#D4A537'
            };
            const statusColor = statusColors[init.budgetStatus || 'planned'] || '#999999';

            return `
              <div style="
                border: 1px solid #EEE;
                border-radius: 4px;
                padding: 16px;
                background: #FAFAF8;
              ">
                <div style="
                  font-weight: 700;
                  color: #22333B;
                  font-size: 13px;
                  margin-bottom: 8px;
                  line-height: 1.4;
                ">
                  ${(init.title || init.name || 'Initiative').substring(0, 60)}
                </div>
                <div style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 8px;
                ">
                  <span style="
                    font-size: 12px;
                    color: #666;
                  ">
                    ${init.domain || 'Uncategorized'}
                  </span>
                  <span style="
                    font-weight: 700;
                    color: #D4A537;
                    font-size: 14px;
                  ">
                    ${formatCurrency(amount)}
                  </span>
                </div>
                <div style="
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  font-size: 11px;
                  color: #666;
                ">
                  <div style="
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: ${statusColor};
                  "></div>
                  ${(init.budgetStatus || 'planned').charAt(0).toUpperCase() + (init.budgetStatus || 'planned').slice(1)}
                </div>
                ${init.fundingSource ? `
                  <div style="
                    font-size: 10px;
                    color: #999;
                    margin-top: 6px;
                  ">
                    Source: ${init.fundingSource === 'other' ? (init.fundingSourceCustom || 'Other') : init.fundingSource}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Export Buttons -->
      <div style="
        padding: 24px;
        border-top: 1px solid #EEE;
        background: #F9F7F4;
        display: flex;
        gap: 12px;
      ">
        <button
          onclick="generateBudgetReportHTML()"
          style="
            padding: 10px 16px;
            background: #22333B;
            color: white;
            border: none;
            border-radius: 3px;
            font-weight: 600;
            font-size: 12px;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          "
        >
          Print Report
        </button>
        <button
          onclick="exportBudgetCSV()"
          style="
            padding: 10px 16px;
            background: #D4A537;
            color: #22333B;
            border: none;
            border-radius: 3px;
            font-weight: 600;
            font-size: 12px;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          "
        >
          Export CSV
        </button>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize when document is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeBudgetTracking);
} else {
  initializeBudgetTracking();
}
