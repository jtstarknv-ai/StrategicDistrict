# Budget Integration Implementation Guide

## Overview

This guide explains how to integrate budget awareness into Steps 8, 10, 11, and 14 of the Strategic District Builder. The system adds four new budget tracking features across the planning workflow.

## Files Created

1. **budget-integration.js** (640 lines)
   - Core module with all budget display and calculation functions
   - Vanilla JavaScript, no frameworks
   - All functions exported to global scope

2. **budget-integration-snippets.txt** (240 lines)
   - HTML insertion points with exact locations
   - Line-by-line integration instructions
   - Data structure requirements

3. **BUDGET-INTEGRATION-README.md** (this file)
   - Implementation overview
   - Quick start guide

## Quick Start (5 Steps)

### Step 1: Load the Script

Add to `index.html` in the `<head>` or before `</body>`:

```html
<script src="js/budget-setup.js"></script>
<script src="js/budget-integration.js"></script>
```

**CRITICAL:** budget-integration.js MUST load AFTER budget-setup.js.

### Step 2: Add HTML Containers

Insert these four HTML snippets into the specified steps. See **budget-integration-snippets.txt** for exact locations.

**Step 8 (Strategic Goal Setting):**
```html
<div id="goalBudgetContext" style="margin-bottom:1.5rem"></div>
```

**Step 10 (Central Office Alignment):**
```html
<div id="departmentBudgetView" style="margin-bottom:1.5rem"></div>
```

**Step 11 (Action Initiatives):**
```html
<div id="budgetAllocationTracker" style="margin-bottom:1.5rem"></div>
```

**Step 14 (Review & Finalize):**
```html
<div id="feasibilityCheckContainer" style="margin-bottom:2rem"></div>
```

### Step 3: Add Function Calls

Call the render functions at the right time:

**In Step 8 activation:**
```javascript
renderGoalBudgetContext();
```

**In Step 10 activation (or when departments are selected):**
```javascript
renderDepartmentBudgetView();
```

**In Step 11 (after any initiative change):**
```javascript
renderBudgetAllocationTracker();
```

**In Step 14 activation (or on button click):**
```javascript
renderFeasibilityCheck();
```

### Step 4: Extend Initiative Data Structure

Update `saveFormState()` in builder.js to capture budget data:

```javascript
planState.initiatives = Array.from(initItems).map(function(item) {
  return {
    title: item.querySelector('.initiative-title')?.value || '',
    description: item.querySelector('.initiative-description')?.value || '',
    lead: item.querySelector('.initiative-lead')?.value || '',
    budgetAmount: parseFloat(item.querySelector('.initiative-budget-amount')?.value) || 0,
    fundingSource: item.querySelector('.initiative-funding-source')?.value || ''
  };
});
```

And update `addInitiative()` to include budget fields in DOM:

```javascript
// Add these hidden inputs to the initiative item div
var budgetInput = document.createElement('input');
budgetInput.type = 'hidden';
budgetInput.className = 'initiative-budget-amount';
budgetInput.value = '0';
div.appendChild(budgetInput);

var sourceSelect = document.createElement('input');
sourceSelect.type = 'hidden';
sourceSelect.className = 'initiative-funding-source';
sourceSelect.value = '';
div.appendChild(sourceSelect);
```

### Step 5: Test

1. Set budget in Step 2 (total and by source)
2. Set budget priorities in Step 2
3. Navigate to Step 8 - should see "Budget Context" panel
4. Navigate to Step 10 - should see "Department Budget View"
5. Add initiatives with budgets and funding sources in Step 11 - should see tracker
6. Navigate to Step 14 - should see comprehensive feasibility analysis

## Function Reference

### Step 8: renderGoalBudgetContext()

Displays budget context when setting strategic goals.

**Input:** None (reads from `planState.budgetSetup`)

**Output:** HTML rendered to `#goalBudgetContext`

**Shows:**
- Total budget envelope
- Budget breakdown by funding source
- Guidance text about considering costs while setting goals

### Step 10: renderDepartmentBudgetView()

Shows budget implications by selected department.

**Input:** None (reads from planState and Step 10 department selections)

**Output:** HTML rendered to `#departmentBudgetView`

**Shows:**
- Selected departments
- Estimated per-department budget (placeholder estimate)
- Note about refining in Step 11

### Step 11: renderBudgetAllocationTracker()

Comprehensive budget allocation tracking for initiatives.

**Input:** None (reads from `planState.initiatives` and `planState.budgetSetup`)

**Output:** HTML rendered to `#budgetAllocationTracker`

**Shows:**
- Total available budget
- Total allocated to initiatives
- Per-source utilization with bars
- Status: over-allocated, perfectly allocated, or under-allocated

### Step 11: getSourceUtilization()

Calculates budget utilization by funding source.

**Returns:**
```javascript
{
  [sourceKey]: {
    total: number,        // Amount in budget envelope
    allocated: number,    // Amount allocated to initiatives
    remaining: number,    // Unused amount
    pct: number          // Percentage allocated (0-100+)
  }
}
```

### Step 14: renderFeasibilityCheck()

Comprehensive financial feasibility analysis.

**Input:** None (reads from all planState sections)

**Output:** HTML rendered to `#feasibilityCheckContainer`

**Includes:**
- Overall Feasibility Score (0-100)
- Section A: Budget Feasibility
- Section B: Multi-Year Feasibility
- Section C: Priority Alignment
- Section D: Funding Source Compliance
- Warnings and alerts

### Step 14: calculateFeasibilityScore()

Calculates the feasibility score and warnings.

**Returns:**
```javascript
{
  score: number,           // 0-100
  breakdown: {
    budget: number,        // 30% weight
    priority: number,      // 25% weight
    sustainability: number,// 25% weight
    coverage: number       // 20% weight
  },
  warnings: [
    {
      severity: 'critical|caution|info',
      text: string
    }
  ]
}
```

### Step 14: renderFeasibilityWarnings(warnings)

Renders an alert/warning section.

**Input:** warnings array from calculateFeasibilityScore()

**Output:** HTML with color-coded warning cards

## Design System

All functions use this color palette (defined in budget-integration.js):

- **Navy (#22333B):** Primary text, headings
- **Cream (#EAE0D5):** Borders, light backgrounds
- **Brown (#5E503F):** Secondary text
- **Teal (#00B4CC):** Primary accent, available budget
- **Green (#6ECF6E):** Good status, balanced budget
- **Gold (#D4A537):** Caution, warnings
- **Coral (#E07A5F):** Critical, over-allocated
- **Purple (#6B4C9A):** Secondary accent

All styling is inline CSS with border-radius: 12px, subtle shadows, and card-based layouts.

## Data Flow

```
Step 2 Budget Setup
  ↓
  planState.budgetSetup = {
    totalBudget,
    fundingSources: {sourceKey: {amount}},
    priorities: [{key, rank}]
  }
  ↓
Step 8: renderGoalBudgetContext()
  → Shows total and sources
  ↓
Step 10: renderDepartmentBudgetView()
  → Estimates per-department needs
  ↓
Step 11: Add Initiatives
  → User enters: title, description, budgetAmount, fundingSource
  → renderBudgetAllocationTracker() updates live
  ↓
Step 14: renderFeasibilityCheck()
  → Comprehensive analysis comparing:
    • What you budgeted (Step 2)
    • What you allocated (Step 11)
    • Multi-year sustainability
    • Priority alignment
    • Funding compliance
```

## Dependencies

This module depends on:

1. **budget-setup.js**
   - FUNDING_SOURCES array
   - BUDGET_PRIORITIES array
   - getBudgetEnvelope() function
   - planState.budgetSetup structure

2. **builder.js**
   - planState object
   - planState.initiatives array
   - planState.goals array
   - planState.departments array

## Common Integration Issues

### Issue: Functions not defined

**Fix:** Ensure budget-integration.js is loaded AFTER budget-setup.js.

### Issue: Budget context not showing in Step 8

**Fix:** Call renderGoalBudgetContext() after the div with id="goalBudgetContext" exists in DOM.

### Issue: Feasibility score is always 0

**Fix:** Ensure all required data is populated:
- Step 2: Total budget must be > 0
- Step 8: At least one goal must exist
- Step 11: At least one initiative must exist

### Issue: Over-allocated showing but no warning

**Fix:** Override calculateFeasibilityScore() to add custom logic.

## Extension Points

The module is designed for easy extension:

1. **Add custom warning types:**
   ```javascript
   warnings.push({
     severity: 'info',
     text: 'Custom warning text'
   });
   ```

2. **Customize scoring weights:**
   Edit this line in calculateFeasibilityScore():
   ```javascript
   var overall = Math.round(
     (scores.budget * 0.30) +
     (scores.priority * 0.25) +
     (scores.sustainability * 0.25) +
     (scores.coverage * 0.20)
   );
   ```

3. **Add new sections to feasibility check:**
   Create new renderXxxFeasibilitySection() function and call it from renderFeasibilityCheck().

## Testing Checklist

- [ ] budget-integration.js loads without errors
- [ ] All 7 functions are available on window object
- [ ] Step 8 shows budget context
- [ ] Step 10 shows department budget view
- [ ] Step 11 tracker updates when initiative is added
- [ ] Step 11 tracker shows warning when over-allocated
- [ ] Step 14 calculates feasibility score correctly
- [ ] Step 14 shows appropriate warnings based on data
- [ ] Colors and styling match design system
- [ ] Responsive on mobile/tablet

## Support

For issues or questions:
1. Check the **budget-integration-snippets.txt** file for exact insertion points
2. Verify all dependencies are loaded (budget-setup.js first)
3. Check browser console for JavaScript errors
4. Verify planState contains required data before rendering

---

**Version:** 1.0
**Last Updated:** 2026-03-30
**Status:** Ready for integration
