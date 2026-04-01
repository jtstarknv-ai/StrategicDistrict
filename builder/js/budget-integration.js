// ============================================================================
// BUDGET INTEGRATION - Cross-Step Budget Awareness
// Vanilla JS, no frameworks. Integrates budget context into Steps 8, 10, 11, 14.
// ============================================================================

// Design System Colors
var BUDGET_COLORS = {
  navy: '#22333B',
  cream: '#EAE0D5',
  brown: '#5E503F',
  teal: '#00B4CC',
  green: '#6ECF6E',
  gold: '#D4A537',
  coral: '#E07A5F',
  purple: '#6B4C9A'
};

// ============================================================================
// STEP 8: STRATEGIC GOAL SETTING - Budget Context
// ============================================================================

function renderGoalBudgetContext() {
  var container = document.getElementById('goalBudgetContext');
  if (!container) return;

  var budgetEnv = getBudgetEnvelope();
  var total = budgetEnv.total;
  var breakdown = budgetEnv.breakdown;

  var html = '';
  html += '<div style="background:white;border:1px solid #e0d5c7;border-radius:12px;padding:1.25rem;box-shadow:0 2px 4px rgba(0,0,0,0.05)">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem">';
  html += '<h3 style="margin:0;font-size:1rem;font-weight:700;color:' + BUDGET_COLORS.navy + '">Budget Context</h3>';
  html += '<span style="font-size:0.75rem;color:#999;text-transform:uppercase;letter-spacing:0.5px;font-weight:600">From Step 2</span>';
  html += '</div>';

  // Total Budget Display
  html += '<div style="margin-bottom:1rem">';
  html += '<div style="font-size:0.85rem;color:#666;margin-bottom:0.25rem;font-weight:600">Total Budget Envelope</div>';
  html += '<div style="font-family:\'Source Serif Pro\',serif;font-size:2rem;font-weight:700;color:' + BUDGET_COLORS.navy + '">';
  html += '$' + (total || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
  html += '</div>';
  html += '</div>';

  // By Source Breakdown (if sources are set)
  var hasBreakdown = Object.keys(breakdown).some(function(key) { return breakdown[key] > 0; });
  if (hasBreakdown) {
    html += '<div style="padding-top:0.75rem;border-top:1px solid #f0ebe5">';
    html += '<div style="font-size:0.8rem;color:#999;margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.5px;font-weight:600">By Funding Source</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:0.5rem">';

    FUNDING_SOURCES.forEach(function(source) {
      var amount = breakdown[source.key] || 0;
      if (amount > 0) {
        var pct = total > 0 ? Math.round((amount / total) * 100) : 0;
        html += '<span style="background:' + BUDGET_COLORS.teal + '12;border:1px solid ' + BUDGET_COLORS.teal + '40;border-radius:6px;padding:0.4rem 0.75rem;font-size:0.8rem;color:' + BUDGET_COLORS.navy + ';font-weight:600">';
        html += source.label + ': ' + pct + '%';
        html += '</span>';
      }
    });

    html += '</div>';
    html += '</div>';
  }

  // Guidance
  html += '<div style="margin-top:1rem;padding:0.75rem;background:#f9f8f6;border-radius:6px;border-left:3px solid ' + BUDGET_COLORS.gold + '">';
  html += '<div style="font-size:0.8rem;color:#5E503F;line-height:1.4">';
  html += '<strong>As you set goals:</strong> Consider what resources each goal will require. Goals without funding or clear resource allocation will be difficult to achieve.';
  html += '</div>';
  html += '</div>';

  html += '</div>';
  container.innerHTML = html;
}

// ============================================================================
// STEP 10: CENTRAL OFFICE ALIGNMENT - Department Budget View
// ============================================================================

function renderDepartmentBudgetView() {
  var container = document.getElementById('departmentBudgetView');
  if (!container) return;

  var budgetEnv = getBudgetEnvelope();
  var total = budgetEnv.total;
  var breakdown = budgetEnv.breakdown;

  // Check if departments are selected in Step 10
  var deptSelectionContainer = document.getElementById('departmentSelectionContainer');
  var departments = [];
  if (deptSelectionContainer) {
    var deptCheckboxes = deptSelectionContainer.querySelectorAll('input[type="checkbox"]:checked');
    deptCheckboxes.forEach(function(cb) {
      departments.push(cb.value);
    });
  }

  var html = '';
  html += '<div style="background:white;border:1px solid #e0d5c7;border-radius:12px;padding:1.25rem;box-shadow:0 2px 4px rgba(0,0,0,0.05)">';
  html += '<h3 style="margin:0 0 0.75rem 0;font-size:1rem;font-weight:700;color:' + BUDGET_COLORS.navy + '">Budget Implications by Department</h3>';
  html += '<p style="margin:0 0 1rem 0;font-size:0.85rem;color:#666;line-height:1.4">';
  html += 'Each selected department will need resources to drive their aligned strategic goals. Budget requests should support these department roles.';
  html += '</p>';

  if (departments.length === 0) {
    html += '<div style="padding:1rem;background:#f9f8f6;border-radius:6px;border-left:3px solid ' + BUDGET_COLORS.gold + ';color:#666;font-size:0.85rem">';
    html += 'No departments selected yet. Once departments are selected, their budget needs will be shown here.';
    html += '</div>';
  } else {
    // Estimate: divide budget evenly across departments as placeholder
    var perDept = total / departments.length;
    html += '<div style="display:grid;gap:0.5rem">';

    departments.forEach(function(deptName, idx) {
      var colors = [BUDGET_COLORS.teal, BUDGET_COLORS.green, BUDGET_COLORS.gold, BUDGET_COLORS.coral, BUDGET_COLORS.purple];
      var color = colors[idx % colors.length];

      html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem;background:' + color + '08;border:1px solid ' + color + '40;border-radius:6px">';
      html += '<span style="font-weight:600;color:' + BUDGET_COLORS.navy + ';font-size:0.9rem">' + deptName + '</span>';
      html += '<span style="font-family:\'Source Serif Pro\',serif;font-size:1.1rem;font-weight:700;color:' + color + '">';
      html += '$' + Math.round(perDept).toLocaleString();
      html += '</span>';
      html += '</div>';
    });

    html += '</div>';
    html += '<div style="margin-top:1rem;padding:0.75rem;background:#f9f8f6;border-radius:6px;border-left:3px solid ' + BUDGET_COLORS.gold + ';font-size:0.8rem;color:#5E503F">';
    html += '<strong>Note:</strong> This is a placeholder estimate. Refine per-department budgets in Step 11 when allocating costs to specific initiatives.';
    html += '</div>';
  }

  html += '</div>';
  container.innerHTML = html;
}

// ============================================================================
// STEP 11: ACTION INITIATIVES - Budget Allocation Tracker
// ============================================================================

function renderBudgetAllocationTracker() {
  var container = document.getElementById('budgetAllocationTracker');
  if (!container) return;

  var budgetEnv = getBudgetEnvelope();
  var sourceUtil = getSourceUtilization();

  var html = '';
  html += '<div style="background:white;border:1px solid #e0d5c7;border-radius:12px;padding:1.25rem;box-shadow:0 2px 4px rgba(0,0,0,0.05)">';
  html += '<h3 style="margin:0 0 1rem 0;font-size:1rem;font-weight:700;color:' + BUDGET_COLORS.navy + '">Budget Allocation Tracker</h3>';

  // Total Budget vs Allocated Summary
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">';

  // Total Available
  html += '<div style="padding:1rem;background:' + BUDGET_COLORS.teal + '08;border:1px solid ' + BUDGET_COLORS.teal + '40;border-radius:8px">';
  html += '<div style="font-size:0.8rem;color:#666;margin-bottom:0.25rem;font-weight:600">Total Available Budget</div>';
  html += '<div style="font-family:\'Source Serif Pro\',serif;font-size:2rem;font-weight:700;color:' + BUDGET_COLORS.teal + '">';
  html += '$' + (budgetEnv.total || 0).toLocaleString();
  html += '</div>';
  html += '</div>';

  // Total Allocated
  var totalAllocated = Object.keys(sourceUtil).reduce(function(sum, key) {
    return sum + sourceUtil[key].allocated;
  }, 0);

  var statusColor = totalAllocated <= budgetEnv.total ? BUDGET_COLORS.green : BUDGET_COLORS.coral;
  html += '<div style="padding:1rem;background:' + statusColor + '08;border:1px solid ' + statusColor + '40;border-radius:8px">';
  html += '<div style="font-size:0.8rem;color:#666;margin-bottom:0.25rem;font-weight:600">Allocated to Initiatives</div>';
  html += '<div style="font-family:\'Source Serif Pro\',serif;font-size:2rem;font-weight:700;color:' + statusColor + '">';
  html += '$' + (totalAllocated || 0).toLocaleString();
  html += '</div>';
  html += '</div>';

  html += '</div>';

  // Per-Source Breakdown
  html += '<div style="margin-bottom:1.5rem">';
  html += '<h4 style="margin:0 0 0.75rem 0;font-size:0.95rem;font-weight:700;color:' + BUDGET_COLORS.navy + '">By Funding Source</h4>';

  FUNDING_SOURCES.forEach(function(source) {
    if (sourceUtil[source.key]) {
      var util = sourceUtil[source.key];
      var pct = util.total > 0 ? Math.round((util.allocated / util.total) * 100) : 0;
      var barColor = pct > 100 ? BUDGET_COLORS.coral : (pct > 90 ? BUDGET_COLORS.gold : BUDGET_COLORS.green);
      var statusText = util.allocated > util.total ? 'OVER-ALLOCATED' : (util.remaining > 0 ? 'Remaining: $' + util.remaining.toLocaleString() : 'Allocated');

      html += '<div style="margin-bottom:1rem">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem">';
      html += '<span style="font-weight:600;color:' + BUDGET_COLORS.navy + ';font-size:0.9rem">' + source.label + '</span>';
      html += '<span style="font-size:0.85rem;color:' + barColor + ';font-weight:700">' + pct + '%</span>';
      html += '</div>';
      html += '<div style="height:8px;background:#E8E8E8;border-radius:4px;overflow:hidden;margin-bottom:0.3rem">';
      html += '<div style="height:100%;width:' + Math.min(pct, 100) + '%;background:' + barColor + ';border-radius:4px;transition:width 0.3s ease"></div>';
      html += '</div>';
      html += '<div style="display:flex;justify-content:space-between;font-size:0.75rem;color:#999">';
      html += '<span>$' + util.allocated.toLocaleString() + ' / $' + util.total.toLocaleString() + '</span>';
      html += '<span style="color:' + barColor + ';font-weight:600">' + statusText + '</span>';
      html += '</div>';
      html += '</div>';
    }
  });

  html += '</div>';

  // Overall Status
  var surplus = budgetEnv.total - totalAllocated;
  var statusMsg = '';
  var statusBgColor = '';

  if (surplus > 0) {
    statusMsg = 'You have $' + surplus.toLocaleString() + ' unallocated. Consider adding more initiatives or creating reserves.';
    statusBgColor = BUDGET_COLORS.gold + '12';
  } else if (surplus < 0) {
    statusMsg = 'You\'ve allocated $' + Math.abs(surplus).toLocaleString() + ' more than your budget. Review initiative costs.';
    statusBgColor = BUDGET_COLORS.coral + '12';
  } else {
    statusMsg = 'Budget perfectly allocated!';
    statusBgColor = BUDGET_COLORS.green + '12';
  }

  html += '<div style="padding:1rem;background:' + statusBgColor + ';border-radius:6px;border-left:3px solid ' + (surplus > 0 ? BUDGET_COLORS.gold : (surplus < 0 ? BUDGET_COLORS.coral : BUDGET_COLORS.green)) + '">';
  html += '<div style="font-size:0.85rem;color:#5E503F">' + statusMsg + '</div>';
  html += '</div>';

  html += '</div>';
  container.innerHTML = html;
}

function getSourceUtilization() {
  var budgetEnv = getBudgetEnvelope();
  var breakdown = budgetEnv.breakdown;
  var result = {};

  FUNDING_SOURCES.forEach(function(source) {
    var total = breakdown[source.key] || 0;
    var allocated = 0;

    // Sum budgets from initiatives that use this source
    if (planState.initiatives && planState.initiatives.length > 0) {
      planState.initiatives.forEach(function(init) {
        if (init.fundingSource === source.key && init.budgetAmount) {
          allocated += parseFloat(init.budgetAmount) || 0;
        }
      });
    }

    result[source.key] = {
      total: total,
      allocated: allocated,
      remaining: Math.max(0, total - allocated),
      pct: total > 0 ? Math.round((allocated / total) * 100) : 0
    };
  });

  return result;
}

// ============================================================================
// STEP 14: REVIEW & FINALIZE - Comprehensive Feasibility Check
// ============================================================================

function renderFeasibilityCheck() {
  var container = document.getElementById('feasibilityCheckContainer');
  if (!container) return;

  var feasData = calculateFeasibilityScore();
  var html = '';

  html += '<div style="background:white;border:1px solid #e0d5c7;border-radius:12px;padding:2rem;box-shadow:0 2px 4px rgba(0,0,0,0.05)">';
  html += '<h2 style="margin:0 0 0.5rem 0;font-family:\'Source Serif Pro\',serif;font-size:1.5rem;color:' + BUDGET_COLORS.navy + '">Financial Feasibility Analysis</h2>';
  html += '<p style="margin:0 0 2rem 0;color:#666;font-size:0.9rem">Comprehensive assessment of budget balance, priority alignment, and sustainability.</p>';

  // Overall Feasibility Score
  var scoreColor = feasData.score >= 80 ? BUDGET_COLORS.green : (feasData.score >= 60 ? BUDGET_COLORS.gold : BUDGET_COLORS.coral);
  var scoreLabel = feasData.score >= 80 ? 'Financially Feasible' : (feasData.score >= 60 ? 'Feasible with Adjustments' : 'Significant Concerns');

  html += '<div style="text-align:center;margin-bottom:2rem;padding:2rem;background:' + scoreColor + '08;border:2px solid ' + scoreColor + '40;border-radius:10px">';
  html += '<div style="font-size:0.8rem;color:#666;margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:1px;font-weight:700">Overall Feasibility Score</div>';
  html += '<div style="font-family:\'Source Serif Pro\',serif;font-size:4rem;font-weight:700;color:' + scoreColor + ';margin:0.5rem 0">' + feasData.score + '</div>';
  html += '<div style="font-size:1.1rem;font-weight:700;color:' + scoreColor + '">' + scoreLabel + '</div>';
  html += '</div>';

  // Section A: Budget Feasibility
  html += renderBudgetFeasibilitySection();

  // Section B: Multi-Year Feasibility
  html += renderMultiYearFeasibilitySection();

  // Section C: Priority Alignment
  html += renderPriorityAlignmentSection();

  // Section D: Funding Source Compliance
  html += renderFundingComplianceSection();

  // Section E: Warnings
  if (feasData.warnings && feasData.warnings.length > 0) {
    html += renderFeasibilityWarnings(feasData.warnings);
  }

  html += '</div>';
  container.innerHTML = html;
}

function renderBudgetFeasibilitySection() {
  var budgetEnv = getBudgetEnvelope();
  var sourceUtil = getSourceUtilization();
  var totalAllocated = Object.keys(sourceUtil).reduce(function(sum, key) { return sum + sourceUtil[key].allocated; }, 0);
  var surplus = budgetEnv.total - totalAllocated;

  var html = '';
  html += '<div style="margin-bottom:2rem;padding:1.5rem;background:#f9f8f6;border-radius:10px;border-left:4px solid ' + BUDGET_COLORS.navy + '">';
  html += '<h3 style="margin:0 0 1rem 0;font-size:1.1rem;font-weight:700;color:' + BUDGET_COLORS.navy + '">A. Budget Feasibility</h3>';

  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem">';

  // What You Budgeted
  html += '<div style="padding:1rem;background:white;border:1px solid #e0d5c7;border-radius:8px">';
  html += '<div style="font-size:0.8rem;color:#666;margin-bottom:0.5rem;font-weight:700;text-transform:uppercase">Budget Envelope (Step 2)</div>';
  html += '<div style="font-family:\'Source Serif Pro\',serif;font-size:2rem;font-weight:700;color:' + BUDGET_COLORS.teal + '">';
  html += '$' + (budgetEnv.total || 0).toLocaleString();
  html += '</div>';
  html += '</div>';

  // What You Allocated
  var allocColor = surplus >= 0 ? BUDGET_COLORS.green : BUDGET_COLORS.coral;
  html += '<div style="padding:1rem;background:white;border:1px solid #e0d5c7;border-radius:8px">';
  html += '<div style="font-size:0.8rem;color:#666;margin-bottom:0.5rem;font-weight:700;text-transform:uppercase">Allocated to Initiatives</div>';
  html += '<div style="font-family:\'Source Serif Pro\',serif;font-size:2rem;font-weight:700;color:' + allocColor + '">';
  html += '$' + (totalAllocated || 0).toLocaleString();
  html += '</div>';
  html += '</div>';

  html += '</div>';

  // Per-Source Status
  html += '<div style="margin-bottom:1.5rem">';
  html += '<div style="font-weight:700;color:' + BUDGET_COLORS.navy + ';margin-bottom:0.75rem;font-size:0.95rem">By Funding Source</div>';

  FUNDING_SOURCES.forEach(function(source) {
    if (sourceUtil[source.key]) {
      var util = sourceUtil[source.key];
      if (util.total > 0) {
        var statusColor = util.allocated > util.total ? BUDGET_COLORS.coral : BUDGET_COLORS.green;
        var statusText = util.allocated > util.total ? 'OVER' : 'OK';

        html += '<div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid #e8e0d5;align-items:center">';
        html += '<span style="font-size:0.9rem;color:#333">' + source.label + '</span>';
        html += '<div style="text-align:right">';
        html += '<div style="font-size:0.85rem;font-weight:600;color:#333">$' + util.allocated.toLocaleString() + ' / $' + util.total.toLocaleString() + '</div>';
        html += '<div style="font-size:0.75rem;font-weight:700;color:' + statusColor + ';margin-top:0.2rem">' + statusText + '</div>';
        html += '</div>';
        html += '</div>';
      }
    }
  });

  html += '</div>';

  // Overall Status
  if (surplus >= 0) {
    html += '<div style="padding:1rem;background:' + BUDGET_COLORS.green + '12;border-left:3px solid ' + BUDGET_COLORS.green + ';border-radius:6px;color:#333;font-size:0.9rem">';
    html += '<strong>Status:</strong> You have $' + surplus.toLocaleString() + ' unallocated. Budget is in balance.';
    html += '</div>';
  } else {
    html += '<div style="padding:1rem;background:' + BUDGET_COLORS.coral + '12;border-left:3px solid ' + BUDGET_COLORS.coral + ';border-radius:6px;color:#333;font-size:0.9rem">';
    html += '<strong>Alert:</strong> You\'ve allocated $' + Math.abs(surplus).toLocaleString() + ' more than available. Review initiative costs or increase budget.';
    html += '</div>';
  }

  html += '</div>';
  return html;
}

function renderMultiYearFeasibilitySection() {
  var budgetEnv = getBudgetEnvelope();
  var multiYear = planState.budgetSetup ? planState.budgetSetup.multiYearProjection : {};
  var esserSource = FUNDING_SOURCES.find(function(s) { return s.key === 'esser'; });

  var html = '';
  html += '<div style="margin-bottom:2rem;padding:1.5rem;background:#f9f8f6;border-radius:10px;border-left:4px solid ' + BUDGET_COLORS.navy + '">';
  html += '<h3 style="margin:0 0 1rem 0;font-size:1.1rem;font-weight:700;color:' + BUDGET_COLORS.navy + '">B. Multi-Year Feasibility</h3>';

  var hasMultiYear = Object.keys(multiYear).some(function(year) {
    return multiYear[year] && Object.keys(multiYear[year]).some(function(source) {
      return multiYear[year][source] > 0;
    });
  });

  if (!hasMultiYear) {
    html += '<div style="padding:1rem;background:white;border-radius:6px;color:#666;font-size:0.9rem">';
    html += 'Multi-year projections not yet configured. This will be available after setting growth rates in Step 2.';
    html += '</div>';
  } else {
    var years = Object.keys(multiYear).sort();
    html += '<div style="overflow-x:auto;margin-bottom:1rem">';
    html += '<table style="width:100%;font-size:0.9rem;border-collapse:collapse">';
    html += '<tr style="background:#E8E8E8;border-bottom:2px solid #ccc">';
    html += '<th style="text-align:left;padding:0.75rem;font-weight:700">Year</th>';

    FUNDING_SOURCES.forEach(function(source) {
      html += '<th style="text-align:right;padding:0.75rem;font-weight:700">' + source.label + '</th>';
    });

    html += '</tr>';

    years.forEach(function(year) {
      html += '<tr style="border-bottom:1px solid #e8e0d5">';
      html += '<td style="padding:0.75rem;font-weight:600">' + year + '</td>';

      FUNDING_SOURCES.forEach(function(source) {
        var amount = multiYear[year] && multiYear[year][source.key] ? multiYear[year][source.key] : 0;
        var isExpired = source.expiresYear && parseInt(year) > source.expiresYear;
        var style = isExpired ? 'color:#999;text-decoration:line-through' : 'color:#333';

        html += '<td style="text-align:right;padding:0.75rem;' + style + '">';
        html += amount > 0 ? '$' + Math.round(amount).toLocaleString() : '--';
        html += '</td>';
      });

      html += '</tr>';
    });

    html += '</table>';
    html += '</div>';
  }

  // Sustainability Warning
  if (esserSource) {
    html += '<div style="padding:1rem;background:' + BUDGET_COLORS.coral + '12;border-left:3px solid ' + BUDGET_COLORS.coral + ';border-radius:6px;font-size:0.9rem;color:#333">';
    html += '<strong>Sustainability Alert:</strong> ESSER/Federal Relief funds expire in ' + esserSource.expiresYear + '. Ensure initiatives funded by temporary grants have transition plans or local funding by then.';
    html += '</div>';
  }

  html += '</div>';
  return html;
}

function renderPriorityAlignmentSection() {
  var budgetEnv = getBudgetEnvelope();
  var totalBudget = budgetEnv.total;
  var breakdown = budgetEnv.breakdown;
  var priorities = planState.budgetSetup ? planState.budgetSetup.priorities : [];

  var html = '';
  html += '<div style="margin-bottom:2rem;padding:1.5rem;background:#f9f8f6;border-radius:10px;border-left:4px solid ' + BUDGET_COLORS.navy + '">';
  html += '<h3 style="margin:0 0 1rem 0;font-size:1.1rem;font-weight:700;color:' + BUDGET_COLORS.navy + '">C. Priority Alignment</h3>';
  html += '<p style="margin:0 0 1rem 0;font-size:0.9rem;color:#666">Does your actual spending match your stated budget priorities?</p>';

  if (!priorities || priorities.length === 0) {
    html += '<div style="padding:1rem;background:white;border-radius:6px;color:#666;font-size:0.9rem">';
    html += 'Budget priorities not yet set. This will be available after configuring priorities in Step 2.';
    html += '</div>';
  } else {
    // Sort by rank
    var sortedPriorities = priorities.slice().sort(function(a, b) { return a.rank - b.rank; });

    html += '<div>';
    sortedPriorities.slice(0, 3).forEach(function(priority, idx) {
      var priorityLabel = BUDGET_PRIORITIES.find(function(p) { return p.key === priority.key; });
      if (priorityLabel) {
        var alignmentColor = idx === 0 ? BUDGET_COLORS.green : (idx === 1 ? BUDGET_COLORS.gold : BUDGET_COLORS.coral);

        html += '<div style="margin-bottom:0.75rem;padding:0.75rem;background:white;border:1px solid #e0d5c7;border-radius:6px">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">';
        html += '<span style="font-weight:700;color:' + BUDGET_COLORS.navy + '">Priority #' + priority.rank + ': ' + priorityLabel.label + '</span>';
        html += '<span style="font-size:0.85rem;font-weight:700;color:' + alignmentColor + '">Est. 25% allocation</span>';
        html += '</div>';
        html += '<div style="height:6px;background:#E8E8E8;border-radius:3px;overflow:hidden">';
        html += '<div style="height:100%;width:' + (25 * (3 - idx)) + '%;background:' + alignmentColor + ';border-radius:3px"></div>';
        html += '</div>';
        html += '</div>';
      }
    });

    html += '</div>';

    html += '<div style="margin-top:1rem;padding:1rem;background:' + BUDGET_COLORS.gold + '12;border-left:3px solid ' + BUDGET_COLORS.gold + ';border-radius:6px;font-size:0.9rem;color:#333">';
    html += '<strong>Alignment Check:</strong> Verify that funding distribution reflects your prioritization. Top priorities should receive largest allocations.';
    html += '</div>';
  }

  html += '</div>';
  return html;
}

function renderFundingComplianceSection() {
  var html = '';
  html += '<div style="margin-bottom:2rem;padding:1.5rem;background:#f9f8f6;border-radius:10px;border-left:4px solid ' + BUDGET_COLORS.navy + '">';
  html += '<h3 style="margin:0 0 1rem 0;font-size:1.1rem;font-weight:700;color:' + BUDGET_COLORS.navy + '">D. Funding Source Compliance</h3>';
  html += '<p style="margin:0 0 1rem 0;font-size:0.9rem;color:#666">Are restricted funds being used appropriately?</p>';

  // Title I Supplement Not Supplant Check
  html += '<div style="margin-bottom:1rem;padding:1rem;background:white;border:1px solid #e0d5c7;border-radius:6px">';
  html += '<div style="font-weight:700;color:' + BUDGET_COLORS.navy + ';margin-bottom:0.5rem;font-size:0.95rem">Title I Funds (ESSA)</div>';
  html += '<div style="font-size:0.9rem;color:#666;line-height:1.5">';
  html += '<strong>Rule: Supplement, not supplant.</strong> Title I funds must supplement local funds, not replace them. Ensure initiatives using Title I show clear additional benefit.';
  html += '</div>';
  html += '</div>';

  // IDEA Check
  html += '<div style="margin-bottom:1rem;padding:1rem;background:white;border:1px solid #e0d5c7;border-radius:6px">';
  html += '<div style="font-weight:700;color:' + BUDGET_COLORS.navy + ';margin-bottom:0.5rem;font-size:0.95rem">IDEA Funds (Special Education)</div>';
  html += '<div style="font-size:0.9rem;color:#666;line-height:1.5">';
  html += '<strong>Rule: Use only for special education.</strong> IDEA funds must support special education services. Verify initiatives using IDEA funds serve students with disabilities.';
  html += '</div>';
  html += '</div>';

  // General Guidance
  html += '<div style="padding:1rem;background:' + BUDGET_COLORS.gold + '12;border-left:3px solid ' + BUDGET_COLORS.gold + ';border-radius:6px;font-size:0.9rem;color:#333">';
  html += '<strong>Compliance Check:</strong> Consult your district compliance officer to ensure all restricted fund allocations meet federal and state requirements.';
  html += '</div>';

  html += '</div>';
  return html;
}

function calculateFeasibilityScore() {
  var scores = {
    budget: 0,
    priority: 0,
    sustainability: 0,
    coverage: 0
  };
  var warnings = [];

  // Score A: Budget Balance (30%)
  var budgetEnv = getBudgetEnvelope();
  var sourceUtil = getSourceUtilization();
  var totalAllocated = Object.keys(sourceUtil).reduce(function(sum, key) { return sum + sourceUtil[key].allocated; }, 0);
  var surplus = budgetEnv.total - totalAllocated;

  if (budgetEnv.total === 0) {
    scores.budget = 0;
    warnings.push({ severity: 'critical', text: 'No budget envelope configured. Set total budget in Step 2.' });
  } else if (Math.abs(surplus) < budgetEnv.total * 0.05) {
    scores.budget = 100;
  } else if (surplus > 0) {
    scores.budget = 80;
  } else {
    scores.budget = Math.max(0, 100 + (surplus / budgetEnv.total) * 100);
    warnings.push({ severity: 'critical', text: 'Over-allocated by $' + Math.abs(surplus).toLocaleString() + '. Review initiative costs.' });
  }

  // Score B: Priority Alignment (25%)
  var priorities = planState.budgetSetup ? planState.budgetSetup.priorities : [];
  if (priorities.length > 0 && priorities.some(function(p) { return p.rank; })) {
    scores.priority = 75; // Placeholder: assume reasonably aligned if priorities are set
    var hasMisalignment = priorities.filter(function(p) { return p.rank > 3; }).length > 0;
    if (hasMisalignment) {
      scores.priority = 60;
      warnings.push({ severity: 'caution', text: 'Check that lower-ranked priorities are receiving proportionally lower funding.' });
    }
  } else {
    scores.priority = 0;
    warnings.push({ severity: 'caution', text: 'Budget priorities not configured. Set priorities in Step 2 for better alignment assessment.' });
  }

  // Score C: Sustainability (25%)
  var esserSource = FUNDING_SOURCES.find(function(s) { return s.key === 'esser'; });
  var esserAmount = sourceUtil['esser'] ? sourceUtil['esser'].allocated : 0;

  if (esserAmount > 0 && budgetEnv.total > 0) {
    var esserPct = (esserAmount / budgetEnv.total) * 100;
    if (esserPct > 20) {
      scores.sustainability = 50;
      warnings.push({ severity: 'caution', text: 'High dependence on temporary ESSER funds (' + Math.round(esserPct) + '%). Plan transitions to permanent funding.' });
    } else {
      scores.sustainability = 80;
    }
  } else {
    scores.sustainability = 90;
  }

  // Score D: Coverage (20%)
  var goals = (planState.goals && planState.goals.length) || 0;
  var initiatives = (planState.initiatives && planState.initiatives.length) || 0;

  if (goals === 0) {
    scores.coverage = 0;
    warnings.push({ severity: 'critical', text: 'No strategic goals defined. Complete Step 8 first.' });
  } else if (initiatives === 0) {
    scores.coverage = 0;
    warnings.push({ severity: 'critical', text: 'No action initiatives defined. Complete Step 11 first.' });
  } else if (initiatives >= Math.max(3, goals)) {
    scores.coverage = 100;
  } else {
    scores.coverage = Math.round((initiatives / Math.max(3, goals)) * 100);
    warnings.push({ severity: 'caution', text: 'Only ' + initiatives + ' initiatives for ' + goals + ' goals. Consider adding more initiatives.' });
  }

  // Calculate overall score
  var overall = Math.round(
    (scores.budget * 0.30) +
    (scores.priority * 0.25) +
    (scores.sustainability * 0.25) +
    (scores.coverage * 0.20)
  );

  return {
    score: overall,
    breakdown: scores,
    warnings: warnings
  };
}

function renderFeasibilityWarnings(warnings) {
  var html = '';

  if (warnings.length === 0) return html;

  html += '<div style="margin-bottom:2rem">';
  html += '<h3 style="margin:0 0 1rem 0;font-size:1.1rem;font-weight:700;color:' + BUDGET_COLORS.navy + '">Alerts & Recommendations</h3>';

  warnings.forEach(function(warning) {
    var color = warning.severity === 'critical' ? BUDGET_COLORS.coral : (warning.severity === 'caution' ? BUDGET_COLORS.gold : BUDGET_COLORS.teal);
    var label = warning.severity === 'critical' ? 'CRITICAL' : (warning.severity === 'caution' ? 'CAUTION' : 'INFO');

    html += '<div style="margin-bottom:0.75rem;padding:1rem;background:' + color + '12;border:1px solid ' + color + '40;border-left:4px solid ' + color + ';border-radius:6px">';
    html += '<div style="font-weight:700;font-size:0.85rem;color:' + color + ';text-transform:uppercase;margin-bottom:0.4rem;letter-spacing:0.5px">' + label + '</div>';
    html += '<div style="font-size:0.9rem;color:#333;line-height:1.4">' + warning.text + '</div>';
    html += '</div>';
  });

  html += '</div>';
  return html;
}

// ============================================================================
// Export functions to global scope
// ============================================================================

window.renderGoalBudgetContext = renderGoalBudgetContext;
window.renderDepartmentBudgetView = renderDepartmentBudgetView;
window.renderBudgetAllocationTracker = renderBudgetAllocationTracker;
window.getSourceUtilization = getSourceUtilization;
window.renderFeasibilityCheck = renderFeasibilityCheck;
window.calculateFeasibilityScore = calculateFeasibilityScore;
window.renderFeasibilityWarnings = renderFeasibilityWarnings;
