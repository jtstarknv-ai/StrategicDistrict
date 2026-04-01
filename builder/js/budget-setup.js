// ============================================================================
// BUDGET & FUNDING SOURCES - Step 2
// Vanilla JS, no frameworks. Handles budget allocation, multi-year projections.
// ============================================================================

// Funding source definitions for planning process (not district operations)
var FUNDING_SOURCES = [
  { key: 'facilitation', label: 'Facilitation & Leadership', category: 'planning' },
  { key: 'community_engagement', label: 'Community Engagement', category: 'planning' },
  { key: 'staff_time', label: 'Staff Time & Compensation', category: 'planning' },
  { key: 'data_tools', label: 'Data Tools & Analysis', category: 'planning' },
  { key: 'external_consultant', label: 'External Consultant Fees', category: 'planning' },
  { key: 'materials_comms', label: 'Materials & Communications', category: 'planning' },
  { key: 'monitoring_eval', label: 'Monitoring & Evaluation', category: 'planning' },
  { key: 'title_funds', label: 'Title I/II/III/IV Allocation', category: 'federal' },
  { key: 'general_fund', label: 'General Fund', category: 'local' },
  { key: 'grant_planning', label: 'Planning-Specific Grant', category: 'grant' },
  { key: 'other', label: 'Other (custom)', category: 'other' }
];

var BUDGET_PRIORITIES = [
  { key: 'facilitation', label: 'Quality Facilitation & Leadership' },
  { key: 'stakeholder_engagement', label: 'Robust Stakeholder Engagement' },
  { key: 'data_insights', label: 'Data Tools & Analysis' },
  { key: 'external_expertise', label: 'External Expertise & Consulting' },
  { key: 'communications', label: 'Clear Communications & Transparency' },
  { key: 'equity_focus', label: 'Equity-Centered Approach' },
  { key: 'monitoring', label: 'Monitoring & Evaluation' },
  { key: 'other_priority', label: 'Other (custom)' }
];

// ============================================================================
// Initialize Budget Setup
// ============================================================================
function initializeBudgetSetup() {
  if (!planState.budgetSetup) {
    planState.budgetSetup = {
      totalBudget: 0,
      fundingSources: {},
      multiYearProjection: {},
      growthRates: {},
      priorities: [],
      lastUpdated: null
    };

    // Initialize funding sources
    FUNDING_SOURCES.forEach(function(source) {
      planState.budgetSetup.fundingSources[source.key] = {
        amount: 0,
        notes: '',
        customLabel: source.key === 'other' ? '' : ''
      };
      planState.budgetSetup.growthRates[source.key] = 0;
    });

    // Initialize multi-year projection (2025-2029)
    for (var year = 2025; year <= 2029; year++) {
      planState.budgetSetup.multiYearProjection[year] = {};
      FUNDING_SOURCES.forEach(function(source) {
        planState.budgetSetup.multiYearProjection[year][source.key] = 0;
      });
    }

    // Initialize priorities
    BUDGET_PRIORITIES.forEach(function(priority, index) {
      planState.budgetSetup.priorities.push({
        key: priority.key,
        rank: index + 1,
        targetPct: 0,
        customLabel: priority.key === 'other_priority' ? '' : ''
      });
    });
  }
}

// ============================================================================
// Render Budget Setup
// ============================================================================
function renderBudgetSetup() {
  initializeBudgetSetup();
  renderFundingSourcesTable();
  renderMultiYearProjection();
  renderBudgetPriorities();
  loadBudgetSetupFromState();
}

// ============================================================================
// Format Currency Input (for display)
// ============================================================================
function formatCurrencyInput(input) {
  var value = input.value.replace(/[^\d.]/g, '');
  if (value) {
    var num = parseFloat(value);
    input.value = '$' + num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
}

// ============================================================================
// Parse Currency Value (from display to number)
// ============================================================================
function parseCurrencyValue(str) {
  if (!str) return 0;
  return parseInt(str.replace(/[^\d]/g, ''), 10) || 0;
}

// ============================================================================
// Handle Total Budget Input
// ============================================================================
function handleTotalBudgetInput() {
  var input = document.getElementById('totalBudgetInput');
  var raw = input.value.replace(/[^\d.]/g, '');

  if (raw) {
    var num = parseFloat(raw);
    planState.budgetSetup.totalBudget = num;
    recalculateBudgetTotals();
    saveFormState();
  }
}

// ============================================================================
// Format Total Budget Display on Blur
// ============================================================================
function formatTotalBudgetDisplay() {
  var input = document.getElementById('totalBudgetInput');
  formatCurrencyInput(input);
}

// ============================================================================
// Render Funding Sources Table
// ============================================================================
function renderFundingSourcesTable() {
  var tbody = document.getElementById('fundingTableBody');
  tbody.innerHTML = '';

  FUNDING_SOURCES.forEach(function(source) {
    var row = document.createElement('tr');
    row.style.borderBottom = '1px solid #f0ebe5';
    row.style.backgroundColor = 'white';

    var sourceData = planState.budgetSetup.fundingSources[source.key];

    // Source name cell
    var cellLabel = document.createElement('td');
    cellLabel.style.padding = '12px 16px';
    cellLabel.style.fontSize = '13px';
    cellLabel.style.color = '#22333B';
    cellLabel.style.fontWeight = '500';
    cellLabel.innerHTML = source.label;
    if (source.expiresYear) {
      cellLabel.innerHTML += '<span style="display:block; font-size:11px; color:#999; margin-top:2px;">Expires: ' + source.expiresYear + '</span>';
    }
    row.appendChild(cellLabel);

    // Amount input cell
    var cellAmount = document.createElement('td');
    cellAmount.style.padding = '12px 16px';
    cellAmount.style.textAlign = 'right';
    var amountInput = document.createElement('input');
    amountInput.type = 'text';
    amountInput.value = sourceData.amount > 0 ? '$' + sourceData.amount.toLocaleString() : '';
    amountInput.placeholder = '$0';
    amountInput.dataset.sourceKey = source.key;
    amountInput.onblur = function() {
      formatCurrencyInput(this);
      updateFundingSourceAmount(this.dataset.sourceKey, parseCurrencyValue(this.value));
    };
    amountInput.oninput = function() {
      var raw = this.value.replace(/[^\d.]/g, '');
      if (raw) {
        var num = parseFloat(raw);
        planState.budgetSetup.fundingSources[this.dataset.sourceKey].amount = num;
      }
    };
    amountInput.style.width = '100px';
    amountInput.style.padding = '8px 10px';
    amountInput.style.border = '1px solid #e0d5c7';
    amountInput.style.borderRadius = '6px';
    amountInput.style.fontSize = '13px';
    amountInput.style.fontFamily = 'Inter, sans-serif';
    amountInput.style.textAlign = 'right';
    cellAmount.appendChild(amountInput);
    row.appendChild(cellAmount);

    // Percentage cell
    var cellPct = document.createElement('td');
    cellPct.style.padding = '12px 16px';
    cellPct.style.textAlign = 'right';
    cellPct.style.fontSize = '13px';
    cellPct.style.color = '#666';
    cellPct.style.fontWeight = '500';
    cellPct.className = 'pct-' + source.key;
    cellPct.innerHTML = '0%';
    row.appendChild(cellPct);

    // Notes cell
    var cellNotes = document.createElement('td');
    cellNotes.style.padding = '12px 16px';
    var notesInput = document.createElement('input');
    notesInput.type = 'text';
    notesInput.placeholder = 'e.g., state match required';
    notesInput.value = sourceData.notes || '';
    notesInput.oninput = function() {
      planState.budgetSetup.fundingSources[source.key].notes = this.value;
      saveFormState();
    };
    notesInput.style.width = '100%';
    notesInput.style.padding = '8px 10px';
    notesInput.style.border = '1px solid #e0d5c7';
    notesInput.style.borderRadius = '6px';
    notesInput.style.fontSize = '12px';
    notesInput.style.fontFamily = 'Inter, sans-serif';
    cellNotes.appendChild(notesInput);
    row.appendChild(cellNotes);

    tbody.appendChild(row);
  });
}

// ============================================================================
// Update Funding Source Amount
// ============================================================================
function updateFundingSourceAmount(sourceKey, amount) {
  planState.budgetSetup.fundingSources[sourceKey].amount = amount || 0;
  recalculateBudgetTotals();
  saveFormState();
}

// ============================================================================
// Recalculate Budget Totals and Percentages
// ============================================================================
function recalculateBudgetTotals() {
  var totalAllocated = 0;

  FUNDING_SOURCES.forEach(function(source) {
    var amount = planState.budgetSetup.fundingSources[source.key].amount || 0;
    totalAllocated += amount;
  });

  var budgetEnvelope = planState.budgetSetup.totalBudget || 0;

  // Update percentage display for each source
  FUNDING_SOURCES.forEach(function(source) {
    var amount = planState.budgetSetup.fundingSources[source.key].amount || 0;
    var pct = budgetEnvelope > 0 ? Math.round((amount / budgetEnvelope) * 100) : 0;
    var pctCell = document.querySelector('.pct-' + source.key);
    if (pctCell) {
      pctCell.innerHTML = pct + '%';
    }
  });

  // Update running totals
  var totalAllocatedEl = document.getElementById('totalAllocated');
  var budgetEnvelopeEl = document.getElementById('budgetEnvelope');
  var matchIndicatorEl = document.getElementById('matchIndicator');
  var matchStatusEl = document.getElementById('matchStatus');

  if (totalAllocatedEl) {
    totalAllocatedEl.innerHTML = '$' + totalAllocated.toLocaleString();
  }

  if (budgetEnvelopeEl) {
    budgetEnvelopeEl.innerHTML = '$' + budgetEnvelope.toLocaleString();
  }

  // Update match indicator
  if (matchIndicatorEl && matchStatusEl) {
    var diff = totalAllocated - budgetEnvelope;

    if (Math.abs(diff) < 1) {
      matchIndicatorEl.style.borderLeftColor = 'var(--pop-green)';
      matchStatusEl.style.color = 'var(--pop-green)';
      matchStatusEl.innerHTML = 'Budget matches';
    } else if (totalAllocated > budgetEnvelope) {
      matchIndicatorEl.style.borderLeftColor = 'var(--pop-coral)';
      matchStatusEl.style.color = 'var(--pop-coral)';
      var overage = totalAllocated - budgetEnvelope;
      matchStatusEl.innerHTML = 'Over by $' + overage.toLocaleString();
    } else {
      matchIndicatorEl.style.borderLeftColor = 'var(--pop-gold)';
      matchStatusEl.style.color = 'var(--pop-gold)';
      var remaining = budgetEnvelope - totalAllocated;
      matchStatusEl.innerHTML = '$' + remaining.toLocaleString() + ' unallocated';
    }
  }
}

// ============================================================================
// Render Multi-Year Projection
// ============================================================================
function renderMultiYearProjection() {
  var container = document.getElementById('yearProjectionContainer');
  var yearSelector = document.getElementById('yearSelector');

  if (!container || !yearSelector) return;

  var selectedYear = parseInt(yearSelector.value);
  var projection = planState.budgetSetup.multiYearProjection[selectedYear] || {};

  var table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.fontFamily = 'Inter, sans-serif';

  // Header row
  var thead = document.createElement('thead');
  var headerRow = document.createElement('tr');
  headerRow.style.backgroundColor = '#F7F5F2';
  headerRow.style.borderBottom = '2px solid #e0d5c7';

  var th1 = document.createElement('th');
  th1.innerHTML = 'Funding Source';
  th1.style.padding = '12px 16px';
  th1.style.textAlign = 'left';
  th1.style.fontSize = '12px';
  th1.style.fontWeight = '700';
  th1.style.color = 'var(--brown)';
  headerRow.appendChild(th1);

  var th2 = document.createElement('th');
  th2.innerHTML = 'Projected Amount (' + selectedYear + '-' + (selectedYear + 1) + ')';
  th2.style.padding = '12px 16px';
  th2.style.textAlign = 'right';
  th2.style.fontSize = '12px';
  th2.style.fontWeight = '700';
  th2.style.color = 'var(--brown)';
  headerRow.appendChild(th2);

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Body rows
  var tbody = document.createElement('tbody');
  var yearTotal = 0;

  FUNDING_SOURCES.forEach(function(source) {
    var row = document.createElement('tr');
    row.style.borderBottom = '1px solid #f0ebe5';

    var cellLabel = document.createElement('td');
    cellLabel.innerHTML = source.label;
    cellLabel.style.padding = '12px 16px';
    cellLabel.style.fontSize = '13px';
    cellLabel.style.color = '#22333B';
    cellLabel.style.fontWeight = '500';
    row.appendChild(cellLabel);

    var cellAmount = document.createElement('td');
    var amountInput = document.createElement('input');
    amountInput.type = 'text';
    amountInput.value = projection[source.key] > 0 ? '$' + projection[source.key].toLocaleString() : '';
    amountInput.placeholder = '$0';
    amountInput.dataset.sourceKey = source.key;
    amountInput.dataset.year = selectedYear;
    amountInput.onblur = function() {
      formatCurrencyInput(this);
      updateYearProjection(parseInt(this.dataset.year), this.dataset.sourceKey, parseCurrencyValue(this.value));
    };
    amountInput.oninput = function() {
      var raw = this.value.replace(/[^\d.]/g, '');
      if (raw) {
        var num = parseFloat(raw);
        planState.budgetSetup.multiYearProjection[parseInt(this.dataset.year)][this.dataset.sourceKey] = num;
      }
    };
    amountInput.style.width = '100px';
    amountInput.style.padding = '8px 10px';
    amountInput.style.border = '1px solid #e0d5c7';
    amountInput.style.borderRadius = '6px';
    amountInput.style.fontSize = '13px';
    amountInput.style.fontFamily = 'Inter, sans-serif';
    amountInput.style.textAlign = 'right';
    cellAmount.style.padding = '12px 16px';
    cellAmount.style.textAlign = 'right';
    cellAmount.appendChild(amountInput);
    row.appendChild(cellAmount);

    tbody.appendChild(row);

    if (projection[source.key]) {
      yearTotal += projection[source.key];
    }
  });

  // Total row
  var totalRow = document.createElement('tr');
  totalRow.style.backgroundColor = '#F7F5F2';
  totalRow.style.borderTop = '2px solid #e0d5c7';
  totalRow.style.fontWeight = '700';

  var totalLabel = document.createElement('td');
  totalLabel.innerHTML = 'TOTAL PROJECTED BUDGET';
  totalLabel.style.padding = '12px 16px';
  totalLabel.style.fontSize = '13px';
  totalLabel.style.fontWeight = '700';
  totalLabel.style.color = 'var(--navy)';
  totalRow.appendChild(totalLabel);

  var totalAmount = document.createElement('td');
  totalAmount.innerHTML = '$' + yearTotal.toLocaleString();
  totalAmount.style.padding = '12px 16px';
  totalAmount.style.textAlign = 'right';
  totalAmount.style.fontSize = '13px';
  totalAmount.style.fontWeight = '700';
  totalAmount.style.color = 'var(--navy)';
  totalRow.appendChild(totalAmount);

  tbody.appendChild(totalRow);
  table.appendChild(tbody);

  container.innerHTML = '';
  container.appendChild(table);

  // Render growth rate controls
  renderGrowthRateControls();
}

// ============================================================================
// Update Year Projection
// ============================================================================
function updateYearProjection(year, sourceKey, amount) {
  if (!planState.budgetSetup.multiYearProjection[year]) {
    planState.budgetSetup.multiYearProjection[year] = {};
  }
  planState.budgetSetup.multiYearProjection[year][sourceKey] = amount || 0;
  saveFormState();
}

// ============================================================================
// Update Year Projection Display
// ============================================================================
function updateYearProjectionDisplay() {
  renderMultiYearProjection();
}

// ============================================================================
// Render Growth Rate Controls
// ============================================================================
function renderGrowthRateControls() {
  var container = document.getElementById('growthRateContainer');
  if (!container) return;

  container.innerHTML = '';

  var grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = '1fr 1fr';
  grid.style.gap = '12px';

  FUNDING_SOURCES.forEach(function(source) {
    var div = document.createElement('div');
    div.style.display = 'flex';
    div.style.alignItems = 'flex-end';
    div.style.gap = '8px';

    var label = document.createElement('label');
    label.style.fontSize = '12px';
    label.style.fontWeight = '600';
    label.style.color = '#22333B';
    label.innerHTML = source.label;

    var input = document.createElement('input');
    input.type = 'number';
    input.step = '0.01';
    input.value = planState.budgetSetup.growthRates[source.key] || 0;
    input.placeholder = '0.00';
    input.dataset.sourceKey = source.key;
    input.onchange = function() {
      applyGrowthRate(this.dataset.sourceKey, parseFloat(this.value) || 0);
    };
    input.style.padding = '6px 8px';
    input.style.border = '1px solid #e0d5c7';
    input.style.borderRadius = '6px';
    input.style.fontSize = '12px';
    input.style.fontFamily = 'Inter, sans-serif';
    input.style.width = '70px';

    var unit = document.createElement('span');
    unit.innerHTML = 'per year';
    unit.style.fontSize = '11px';
    unit.style.color = '#999';

    div.appendChild(label);
    div.appendChild(input);
    div.appendChild(unit);
    grid.appendChild(div);
  });

  container.appendChild(grid);
}

// ============================================================================
// Apply Growth Rate
// ============================================================================
function applyGrowthRate(sourceKey, rate) {
  planState.budgetSetup.growthRates[sourceKey] = rate;

  var currentYear = parseInt(document.getElementById('yearSelector').value);
  var currentAmount = planState.budgetSetup.multiYearProjection[currentYear][sourceKey] || 0;

  // Project forward to next years
  for (var year = currentYear + 1; year <= 2029; year++) {
    var prevAmount = planState.budgetSetup.multiYearProjection[year - 1][sourceKey] || 0;
    var newAmount = prevAmount * (1 + rate);
    planState.budgetSetup.multiYearProjection[year][sourceKey] = newAmount;
  }

  saveFormState();
  renderMultiYearProjection();
}

// ============================================================================
// Render Budget Priorities
// ============================================================================
function renderBudgetPriorities() {
  var container = document.getElementById('prioritiesContainer');
  if (!container) return;

  container.innerHTML = '';

  BUDGET_PRIORITIES.forEach(function(priority, index) {
    var div = document.createElement('div');
    div.style.padding = '12px 14px';
    div.style.border = '1px solid #e0d5c7';
    div.style.borderRadius = '8px';
    div.style.backgroundColor = 'white';
    div.dataset.priorityKey = priority.key;

    var label = document.createElement('label');
    label.style.fontSize = '12px';
    label.style.fontWeight = '600';
    label.style.color = '#22333B';
    label.style.display = 'block';
    label.style.marginBottom = '6px';
    label.innerHTML = priority.label;

    var rankInput = document.createElement('input');
    rankInput.type = 'number';
    rankInput.min = '1';
    rankInput.max = '8';
    rankInput.value = index + 1;
    rankInput.placeholder = 'Rank';
    rankInput.dataset.priorityKey = priority.key;
    rankInput.onchange = function() {
      updatePriorityRank(this.dataset.priorityKey, parseInt(this.value) || 0);
    };
    rankInput.style.width = '50px';
    rankInput.style.padding = '6px 8px';
    rankInput.style.border = '1px solid #e0d5c7';
    rankInput.style.borderRadius = '4px';
    rankInput.style.fontSize = '12px';
    rankInput.style.fontFamily = 'Inter, sans-serif';

    var rankLabel = document.createElement('span');
    rankLabel.innerHTML = 'Priority rank';
    rankLabel.style.fontSize = '10px';
    rankLabel.style.color = '#999';
    rankLabel.style.marginLeft = '8px';

    var rankDiv = document.createElement('div');
    rankDiv.style.display = 'flex';
    rankDiv.style.alignItems = 'center';
    rankDiv.style.gap = '6px';
    rankDiv.appendChild(rankInput);
    rankDiv.appendChild(rankLabel);

    div.appendChild(label);
    div.appendChild(rankDiv);
    container.appendChild(div);
  });
}

// ============================================================================
// Update Priority Rank
// ============================================================================
function updatePriorityRank(priorityKey, rank) {
  var priorityItem = planState.budgetSetup.priorities.find(function(p) {
    return p.key === priorityKey;
  });
  if (priorityItem) {
    priorityItem.rank = rank;
    saveFormState();
  }
}

// ============================================================================
// Save Budget Setup
// ============================================================================
function saveBudgetSetup() {
  planState.budgetSetup.lastUpdated = new Date().toISOString();
  saveFormState();
}

// ============================================================================
// Load Budget Setup from State
// ============================================================================
function loadBudgetSetupFromState() {
  if (planState.budgetSetup.totalBudget > 0) {
    var totalInput = document.getElementById('totalBudgetInput');
    if (totalInput) {
      totalInput.value = '$' + planState.budgetSetup.totalBudget.toLocaleString();
    }
  }

  recalculateBudgetTotals();
  updateYearProjectionDisplay();
}

// ============================================================================
// Get Budget Envelope
// ============================================================================
function getBudgetEnvelope() {
  var breakdown = {};
  FUNDING_SOURCES.forEach(function(source) {
    breakdown[source.key] = planState.budgetSetup.fundingSources[source.key].amount || 0;
  });
  return {
    total: planState.budgetSetup.totalBudget || 0,
    breakdown: breakdown
  };
}

// ============================================================================
// Get Remaining Budget for a Source
// ============================================================================
function getRemainingBudget(sourceKey) {
  var allocation = planState.budgetSetup.fundingSources[sourceKey].amount || 0;
  // This will be calculated by Step 11 based on initiatives
  return allocation;
}

// ============================================================================
// Export functions to global scope
// ============================================================================
window.initializeBudgetSetup = initializeBudgetSetup;
window.renderBudgetSetup = renderBudgetSetup;
window.updateFundingSourceAmount = updateFundingSourceAmount;
window.recalculateBudgetTotals = recalculateBudgetTotals;
window.formatCurrencyInput = formatCurrencyInput;
window.parseCurrencyValue = parseCurrencyValue;
window.renderMultiYearProjection = renderMultiYearProjection;
window.updateYearProjection = updateYearProjection;
window.applyGrowthRate = applyGrowthRate;
window.saveBudgetSetup = saveBudgetSetup;
window.getBudgetEnvelope = getBudgetEnvelope;
window.getRemainingBudget = getRemainingBudget;
window.renderBudgetPriorities = renderBudgetPriorities;
window.updatePriorityRank = updatePriorityRank;
window.handleTotalBudgetInput = handleTotalBudgetInput;
window.formatTotalBudgetDisplay = formatTotalBudgetDisplay;
window.updateYearProjectionDisplay = updateYearProjectionDisplay;
window.loadBudgetSetupFromState = loadBudgetSetupFromState;
