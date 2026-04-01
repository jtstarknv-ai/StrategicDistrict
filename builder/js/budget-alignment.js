// ============================================================
// BUDGET & FUNDING ALIGNMENT — renderBudgetAlignment(), updateBudgetSummary(), saveBudgetData()
// ============================================================

var fundingSourceColors = {
    'Title I': '#E8622A',
    'Title II': '#00B4CC',
    'Title III': '#6ECF6E',
    'Title IV': '#9B59B6',
    'General Fund': '#22333B',
    'Bond/Capital': '#C6AC8F',
    'Grant': '#D4A537',
    'ESSER/Federal Relief': '#E74C3C',
    'State Allocation': '#3498DB',
    'Private/Foundation': '#1ABC9C',
    'In-Kind': '#95A5A6',
    'Other': '#7F8C8D'
};

var fundingSources = ['Title I', 'Title II', 'Title III', 'Title IV', 'General Fund', 'Bond/Capital', 'Grant', 'ESSER/Federal Relief', 'State Allocation', 'Private/Foundation', 'In-Kind', 'Other'];

function renderBudgetAlignment() {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var inits = ps.initiatives || [];
    var container = document.getElementById('budgetAlignmentContainer');
    if (!container || inits.length === 0) {
        if (container) container.innerHTML = '<p style="color:#888;font-size:0.9rem;">Add initiatives above to set budget estimates and funding sources.</p>';
        return;
    }

    var html = '';
    for (var i = 0; i < inits.length; i++) {
        var init = inits[i];
        var initId = 'init-' + i;
        var costEstimate = (init.budgetData && init.budgetData.costEstimate) ? init.budgetData.costEstimate : '';
        var fundingSources_selected = (init.budgetData && init.budgetData.fundingSources) ? init.budgetData.fundingSources : [];
        var budgetNotes = (init.budgetData && init.budgetData.notes) ? init.budgetData.notes : '';

        html += '<div class="budget-card" style="padding:1rem;margin-bottom:1rem;border:1px solid #E0D8CF;border-radius:8px;background:#FAFAF8;">';
        html += '<h5 style="margin:0 0 0.75rem 0;font-size:0.95rem;color:#22333B;font-weight:700;">' + (init.title || 'Initiative ' + (i+1)) + '</h5>';
        
        // Cost estimate input
        html += '<div style="margin-bottom:1rem;">';
        html += '<label style="display:block;font-size:0.85rem;font-weight:700;color:#22333B;margin-bottom:0.5rem;">Cost Estimate (Annual)</label>';
        html += '<div style="display:flex;align-items:center;">';
        html += '<span style="margin-right:8px;font-weight:700;color:#22333B;">$</span>';
        html += '<input type="number" id="' + initId + '-cost" value="' + costEstimate + '" placeholder="0" step="1000" min="0" onchange="saveBudgetData()" style="flex:1;padding:8px 10px;border:2px solid #E8E8E8;border-radius:6px;font-size:14px;font-family:Inter,sans-serif;" />';
        html += '</div>';
        html += '</div>';

        // Funding sources multi-select (as tags)
        html += '<div style="margin-bottom:1rem;">';
        html += '<label style="display:block;font-size:0.85rem;font-weight:700;color:#22333B;margin-bottom:0.5rem;">Funding Sources</label>';
        html += '<div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.75rem;">';
        for (var j = 0; j < fundingSources.length; j++) {
            var source = fundingSources[j];
            var isSelected = fundingSources_selected.indexOf(source) !== -1;
            var btnClass = isSelected ? 'funding-source-btn-active' : 'funding-source-btn';
            var color = fundingSourceColors[source] || '#999';
            html += '<button type="button" class="' + btnClass + '" onclick="toggleFundingSource(\'' + initId + '\', \'' + source + '\')" style="padding:6px 10px;border:2px solid ' + (isSelected ? color : '#E8E8E8') + ';background:' + (isSelected ? color : '#fff') + ';color:' + (isSelected ? '#fff' : '#22333B') + ';border-radius:6px;cursor:pointer;font-size:0.8rem;font-weight:600;transition:all 0.2s ease;">' + source + '</button>';
        }
        html += '</div>';
        html += '<div id="' + initId + '-sources" style="display:flex;flex-wrap:wrap;gap:0.4rem;">';
        for (var j = 0; j < fundingSources_selected.length; j++) {
            var source = fundingSources_selected[j];
            var color = fundingSourceColors[source] || '#999';
            html += '<div style="display:inline-flex;align-items:center;padding:4px 8px;background:' + color + '20;border:1px solid ' + color + ';border-radius:4px;font-size:0.75rem;color:' + color + ';font-weight:600;">' + source + '</div>';
        }
        html += '</div>';
        html += '</div>';

        // Budget notes
        html += '<div style="margin-bottom:0;">';
        html += '<label style="display:block;font-size:0.85rem;font-weight:700;color:#22333B;margin-bottom:0.5rem;">Budget Justification (Optional)</label>';
        html += '<textarea id="' + initId + '-notes" placeholder="Explain the cost estimate and funding strategy for this initiative..." onchange="saveBudgetData()" style="width:100%;padding:8px 10px;border:2px solid #E8E8E8;border-radius:6px;font-size:13px;font-family:Inter,sans-serif;min-height:70px;resize:vertical;">' + budgetNotes + '</textarea>';
        html += '</div>';

        html += '</div>';
    }

    container.innerHTML = html;

    // Show summary card
    var summaryCard = document.getElementById('budgetSummaryCard');
    if (summaryCard && inits.length > 0) {
        summaryCard.style.display = 'block';
    }

    updateBudgetSummary();
}

function toggleFundingSource(initId, source) {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var inits = ps.initiatives || [];
    var idx = parseInt(initId.replace('init-', ''));
    
    if (idx >= 0 && idx < inits.length) {
        if (!inits[idx].budgetData) {
            inits[idx].budgetData = {};
        }
        if (!inits[idx].budgetData.fundingSources) {
            inits[idx].budgetData.fundingSources = [];
        }

        var sourcesArray = inits[idx].budgetData.fundingSources;
        var sourceIdx = sourcesArray.indexOf(source);
        if (sourceIdx !== -1) {
            sourcesArray.splice(sourceIdx, 1);
        } else {
            sourcesArray.push(source);
        }

        saveBudgetData();
        renderBudgetAlignment();
    }
}

function updateBudgetSummary() {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var inits = ps.initiatives || [];
    
    var totalEstimated = 0;
    var totalFunded = 0;
    var fundingBySource = {};

    for (var i = 0; i < inits.length; i++) {
        var init = inits[i];
        var budgetData = init.budgetData || {};
        var cost = parseInt(budgetData.costEstimate || 0);
        totalEstimated += cost;

        var sources = budgetData.fundingSources || [];
        if (sources.length > 0) {
            var perSource = cost / sources.length;
            totalFunded += cost;
            for (var j = 0; j < sources.length; j++) {
                var src = sources[j];
                if (!fundingBySource[src]) fundingBySource[src] = 0;
                fundingBySource[src] += perSource;
            }
        }
    }

    var fundingGap = totalEstimated - totalFunded;

    var totalEl = document.getElementById('budgetTotal');
    var fundedEl = document.getElementById('budgetFunded');
    var gapEl = document.getElementById('budgetGap');
    
    if (totalEl) totalEl.textContent = '$' + numberFormat(totalEstimated);
    if (fundedEl) fundedEl.textContent = '$' + numberFormat(totalFunded);
    if (gapEl) gapEl.textContent = '$' + numberFormat(Math.max(0, fundingGap));

    var barEl = document.getElementById('budgetFundedBar');
    if (barEl) {
        var pct = totalEstimated > 0 ? (totalFunded / totalEstimated) * 100 : 0;
        barEl.style.width = Math.min(100, pct) + '%';
    }

    var breakdownEl = document.getElementById('fundingBreakdown');
    if (breakdownEl) {
        var html = '';
        for (var source in fundingBySource) {
            var amount = fundingBySource[source];
            var color = fundingSourceColors[source] || '#999';
            var pct = totalEstimated > 0 ? Math.round((amount / totalEstimated) * 100) : 0;
            html += '<div style="display:inline-flex;align-items:center;padding:4px 8px;background:' + color + '20;border:1px solid ' + color + ';border-radius:4px;font-size:0.75rem;color:' + color + ';font-weight:600;">' + source + ' (' + pct + '%)</div>';
        }
        breakdownEl.innerHTML = html || '<span style="color:#888;font-size:0.85rem;">Select funding sources to see breakdown</span>';
    }
}

function saveBudgetData() {
    var ps = (typeof planState !== 'undefined') ? planState : {};
    var inits = ps.initiatives || [];

    for (var i = 0; i < inits.length; i++) {
        var initId = 'init-' + i;
        var costInput = document.getElementById(initId + '-cost');
        var notesInput = document.getElementById(initId + '-notes');

        if (!inits[i].budgetData) {
            inits[i].budgetData = {};
        }

        if (costInput) {
            inits[i].budgetData.costEstimate = parseInt(costInput.value || 0);
        }
        if (notesInput) {
            inits[i].budgetData.notes = notesInput.value;
        }
    }

    if (typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem('planState', JSON.stringify(ps));
        } catch (e) {
            console.log('Unable to save budget data to localStorage:', e);
        }
    }

    updateBudgetSummary();
}

function numberFormat(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
