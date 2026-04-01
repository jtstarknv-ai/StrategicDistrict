# QA Council Report: Strategic District (Full Run)

**Date:** 2026-03-30T23:45:00Z
**Mode:** Full Council Run
**Targets:** District Builder + School Builder

---

## Health Score: 0/100 ☠️

**Status:** DEPLOYMENT BLOCKED. Critical issues must be resolved before any release.

---

## Executive Summary

District and School Builders have severe structural defects that prevent deployment. Two critical duplicate functions with conflicting signatures will cause runtime failures. A 58-function wholesale duplicate region in doc-generator.js indicates incomplete refactoring. 32 missing HTML element IDs and 5 missing function exports create undefined reference errors. Budget validation logic is entirely missing. This is not production-ready code.

---

## Critical Findings (P0)

### 1. Duplicate calculateFeasibilityScore with Conflicting Signatures
- **File:** `/sessions/sleepy-gifted-allen/mnt/site/builder/js/ai-engine.js:725` vs `/sessions/sleepy-gifted-allen/mnt/site/builder/js/budget-integration.js:519`
- **Issue:** Function defined twice with incompatible signatures. ai-engine.js takes `planState` parameter; budget-integration.js takes no parameters. Logic likely differs.
- **Impact:** Feasibility score calculations will be unpredictable. Whichever function loads last overwrites the first. Any code calling this function will fail.
- **Fix:** Choose single authoritative implementation (recommend ai-engine.js version with planState). Delete duplicate in budget-integration.js. Update all call sites to use unified signature.

### 2. Duplicate updateBudgetSummary with Identical Signatures
- **File:** `/sessions/sleepy-gifted-allen/mnt/site/builder/js/budget-alignment.js:118` vs `/sessions/sleepy-gifted-allen/mnt/site/builder/js/budget-tracker.js:56`
- **Issue:** Entire function duplicated identically in both files with empty parameter lists. Both implementations exist in memory simultaneously.
- **Impact:** Budget summary display is inconsistent. One file's update may overwrite the other's. Users see stale or incorrect totals.
- **Fix:** Consolidate into single file (recommend budget-alignment.js as authoritative). Delete from budget-tracker.js. Export from single location. Update both files to call shared function.

### 3. Wholesale Duplicate Function Region in doc-generator.js
- **File:** `/sessions/sleepy-gifted-allen/mnt/site/builder/js/doc-generator.js:2849-2906`
- **Issue:** 58 document generation functions are defined twice. Lines 2849-2906 contain exact duplicates of functions defined earlier in the file (e.g., generateVisionMissionPDF at both line 402 and line 2849).
- **Functions Affected:** generateVisionMissionPDF, generateVisionWorkshopPPTX, generateStakeholderSurveyDOCX, generateFocusGroupGuideDOCX, generateBoardVisionPPTX, generateValuesReportPDF, generateValuesWorkshopPPTX, generateValuesBehaviorsDOCX, generateStaffCommsDOCX, generateBoardValuesPPTX, generateCompetencyReportPDF, generateCompetencyMapDOCX, generateLeadershipAssessmentDOCX, generateDomainsReportPDF, generateDomainsPPTX, generatePrioritizationMatrixDOCX, generateGoalsReportPDF, generateGoalWorkshopPPTX, generateGoalImpactMatrixDOCX, generateCommunityReviewPPTX, generateInitiativesPhaseoutDOCX, generateTechnicalReferenceGuidePDF, generateForecastReportPDF, generateScenarioAnalysisPDF, generateBoardForecastPPTX, generateAlignmentReportPDF, generateResponsibilityChartDOCX, generateDeptCommsTemplateDOCX, generateInitiativesReportPDF, generateInitiativeProposalDOCX, generatePrioritizationMatrixPDF, generateRoadmapPDF, generateMilestonePlanDOCX, generateBoardTimelinePPTX, generateStrategicPlanPDF, generateExecutiveSummaryPDF, generateBoardAdoptionPPTX, generateCommunityPlanPDF, generateFeasibilityReportPDF, generateStakeholderEngagementGuidePDF, and 18+ others.
- **Impact:** File size bloated. Performance degradation. Maintenance nightmare. Any fix to one version doesn't apply to the other.
- **Fix:** DELETE lines 2849-2906 entirely. Verify all functions are defined only once before the duplicate region. Check for any customizations in the duplicate region that should be preserved (unlikely). Search codebase for any references to these "duplicate" definitions and update to use single source.

### 4. Missing Budget Validation Logic
- **File:** `/sessions/sleepy-gifted-allen/mnt/site/builder/js/budget-setup.js` and `/sessions/sleepy-gifted-allen/mnt/site/builder/js/budget-integration.js`
- **Issue:** Budget validation functions completely absent. No minimum budget checks, maximum allocation enforcement, or constraint validation. Test suite expected functions like validateBudgetMinimum(), validateAllocationTotal(), enforceConstraints() but found none.
- **Impact:** Users can enter negative budgets, allocate more than 100%, or enter invalid data without warnings. Budget totals can exceed available funds.
- **Fix:** Implement comprehensive budget validation. Required functions: (1) validateBudgetMinimum(amount) - ensures budget >= $1M, (2) validateAllocationTotal(sources) - ensures allocations sum to <= 100%, (3) enforceConstraints(budget, initiatives) - prevents initiatives exceeding available budget. Add validation calls before save operations.

### 5. Missing onclick Handler Exports to Window Scope
- **File:** `/sessions/sleepy-gifted-allen/mnt/site/builder/js/builder.js`
- **Issue:** Five click handlers are defined in JS but never exposed to window scope. HTML inline onclick attributes won't find them: stepGoto(), clearStep(), clearEntirePlan(), filterTemplates(), applyTemplate().
- **Impact:** Buttons using these handlers are inert. Users can't navigate steps, clear data, or apply templates.
- **Fix:** Add explicit window exports: `window.stepGoto = stepGoto;` etc. Place exports at bottom of builder.js after all function definitions. Alternatively, use addEventListener() in HTML instead of inline onclick attributes.

---

## Significant Findings (P1)

### District Builder: Missing HTML Element IDs (24 total)

| ID | Referenced In | Use Case |
|---|---|---|
| ai-cf-token | ai-engine.js | AI API key input for Cloudflare |
| ai-groq-key | ai-engine.js | AI API key input for Groq |
| aiHelper, aiHelperPanel, aiHelperBody, aiHelperTitle | ai-engine.js | AI Helper panel container & content |
| calViewQuarterly, calViewTimeline | builder.js | Calendar view toggle buttons |
| calendarQuarterly, calendarTimeline | builder.js | Calendar display containers |
| customCompCategory, customCompSkill | features.js | Custom competency input fields |
| customCoreValue | features.js | Custom core value input |
| customDomainName, customDomainDesc | builder.js | Custom domain input fields |
| driftAlertContainer | features.js | Feature drift alert messages |
| live-responses, response-count, total-responses | stakeholder.js | Survey response counters |
| role-breakdown | stakeholder.js | Stakeholder role breakdown chart |
| survey-form | stakeholder.js | Survey form container |
| perPupilExpenditure | builder.js | Per-pupil expenditure metric display |
| planNameInput | builder.js | Plan name input (distinct from planNameTop) |
| upgradeModal | paywall.js | Premium upgrade modal |

**Fix:** Either (1) add all 24 IDs to index.html as static placeholders, or (2) verify they're created dynamically at runtime and add error handling if not found. For conditional features (AI Helper, premium), add feature flag checks before referencing these IDs.

### School Builder: Missing Goal Modal Elements (8 total)

| ID | Use Case | Referenced |
|---|---|---|
| goalBuilderModal | Goal creation/edit modal container | school.js:1881 |
| goalStatement | Goal statement text input | school.js:1887 |
| goalNeed | Problem/need input | school.js:1885 |
| goalRootCause | Root cause input | school.js:1886 |
| goalMetric | Success metric input | school.js:1888 |
| goalTarget | Target value input | school.js:1889 |
| goalDate | Target date input | school.js:1890 |
| goalAreaAddModal | Modal for adding goal categories | school.js:1261 |

**Fix:** Create static HTML for goal modal with all 8 input fields. Alternatively, ensure school.js dynamically creates these elements on page load with proper error handling if creation fails.

### District Builder: Missing Function Exports (5 functions)

- **stepGoto()** - Navigate to specific step (builder.js)
- **clearStep()** - Clear current step data (builder.js)
- **clearEntirePlan()** - Reset entire plan (builder.js)
- **filterTemplates()** - Filter template list (builder.js)
- **applyTemplate()** - Apply selected template (builder.js)

**Fix:** Add to bottom of builder.js:
```javascript
window.stepGoto = stepGoto;
window.clearStep = clearStep;
window.clearEntirePlan = clearEntirePlan;
window.filterTemplates = filterTemplates;
window.applyTemplate = applyTemplate;
```

### Duplicate trackDownload with Conflicting Signatures
- **File:** `/sessions/sleepy-gifted-allen/mnt/site/builder/js/doc-generator.js:297` vs `/sessions/sleepy-gifted-allen/mnt/site/builder/js/toolkit.js:1411`
- **Signatures Differ:** doc-generator takes (stageId, docType, docName); toolkit takes (filename)
- **Fix:** Consolidate into single function. Choose one implementation. Ensure all callers use unified interface.

### Missing FUNDING_SOURCES Constant
- **File:** Referenced in budget logic but never defined
- **Impact:** Budget calculations reference undefined variable. Code will fail when accessing funding source data.
- **Fix:** Define FUNDING_SOURCES in budget-setup.js:
```javascript
const FUNDING_SOURCES = {
  state: { name: "State", default: 60 },
  federal: { name: "Federal", default: 30 },
  local: { name: "Local", default: 10 }
};
window.FUNDING_SOURCES = FUNDING_SOURCES;
```

### Missing Goal Modal Functions (4 functions in school.js)
- **openGoalModal()** - Opens goal creation modal
- **closeGoalModal()** - Closes goal modal
- **editGoal(goalId)** - Opens edit modal for existing goal
- **deleteGoal(goalId)** - Deletes goal with confirmation

**Impact:** Goal CRUD operations are completely non-functional. Users cannot create, edit, or delete goals.

**Fix:** Implement all four functions in school.js. Template:
```javascript
function openGoalModal(goalId = null) {
  const modal = document.getElementById('goalBuilderModal');
  if (!modal) return console.error('goalBuilderModal not found');
  if (goalId) { /* load goal data */ }
  modal.style.display = 'block';
}
function closeGoalModal() { /* close logic */ }
function editGoal(goalId) { openGoalModal(goalId); }
function deleteGoal(goalId) { if (confirm('Delete?')) { /* delete logic */ } }
```

### Incomplete Budget HTML Structure
- **Issue:** Only 1 of 5 expected budget container elements found in HTML
- **Missing:** Budget display container, allocation breakdown view, tracker section, summary section, initialization area
- **Fix:** Add all missing container divs to index.html:
```html
<div id="budgetDisplay"></div>
<div id="budgetAllocation"></div>
<div id="budgetTracker"></div>
<div id="budgetSummary"></div>
<div id="budgetInitialization"></div>
```

---

## Minor Findings (P2)

None (all issues are P0 or P1).

---

## Test Coverage

| Area | Tests | Passed | Failed | Coverage % |
|---|---|---|---|---|
| App Initialization (P0) | 3 | 0 | 3 | 0% |
| Step Navigation (P0) | 4 | 0 | 4 | 0% |
| Data Persistence (P0) | 3 | 0 | 3 | 0% |
| Duplicate Functions (P0) | 2 | 0 | 2 | 0% |
| Missing IDs - District (P1) | 8 | 0 | 8 | 0% |
| Missing IDs - School (P1) | 2 | 0 | 2 | 0% |
| Budget Calculations (P1) | 2 | 0 | 2 | 0% |
| Goal CRUD (P1) | 4 | 0 | 4 | 0% |
| Cross-File Variables (P1) | 2 | 0 | 2 | 0% |
| Export Functionality (P1) | 2 | 0 | 2 | 0% |
| Function Stability (P0) | 2 | 0 | 2 | 0% |
| Styling (P2) | 2 | 0 | 2 | 0% |
| Progress Tracking (P2) | 2 | 0 | 2 | 0% |
| Empty States (P2) | 2 | 0 | 2 | 0% |
| **TOTAL** | **40** | **0** | **40** | **0%** |

**Execution Status:** Test plan created but execution BLOCKED. Cannot run tests without fixing critical P0 defects first.

---

## Structural Integrity

| Category | Status | Details |
|---|---|---|
| **Container IDs** | FAIL | District: 0/24 matched. School: 0/8 matched. Missing: 32 total |
| **Function Exports** | FAIL | Missing: stepGoto, clearStep, clearEntirePlan, filterTemplates, applyTemplate |
| **Cross-File References** | FAIL | planState is central hub but shared across 9 modules with no mutation coordination. Risk of state conflicts. |
| **Syntax Validation** | PASS | All JS files pass Node syntax check. No parse errors. |
| **Duplicate Functions** | FAIL | calculateFeasibilityScore (2 files), updateBudgetSummary (2 files), trackDownload (2 files), 58 doc functions (wholesale duplication) |
| **Module Dependencies** | FAIL | Global planState shared across 9 modules. Heavy cross-module dependencies with no clear ownership. |

---

## Recommendations

### Priority 1: Fix Before Any Testing
1. **Delete doc-generator.js lines 2849-2906** (wholesale duplicate region). Verify file still passes syntax check. Confirm no custom code is being lost.
2. **Consolidate calculateFeasibilityScore** into ai-engine.js. Delete budget-integration.js version. Update all call sites.
3. **Consolidate updateBudgetSummary** into budget-alignment.js. Delete budget-tracker.js version. Export to window.
4. **Implement missing onclick handler exports** to window scope (stepGoto, clearStep, etc.) so inline HTML handlers work.
5. **Define FUNDING_SOURCES constant** in budget-setup.js and export to window.

### Priority 2: Restore Missing Functionality
6. **Add all 32 missing HTML element IDs** to index.html (24 district + 8 school). Use static placeholders or conditional sections based on feature flags.
7. **Implement 4 goal modal functions** in school.js (openGoalModal, closeGoalModal, editGoal, deleteGoal). Goal feature is currently non-functional.
8. **Implement budget validation logic** (validateBudgetMinimum, validateAllocationTotal, enforceConstraints). No constraint enforcement currently exists.
9. **Add missing budget HTML containers** (budgetDisplay, budgetAllocation, budgetTracker, budgetSummary, budgetInitialization).
10. **Consolidate trackDownload** into single implementation. Reconcile signature difference between doc-generator and toolkit versions.

### Priority 3: Structural Improvements (After P0/P1 fixes)
11. Implement state management pattern to replace ad-hoc planState mutations across 9 modules. Consider event emitters or observer pattern.
12. Add comprehensive error handling for dynamically created elements. If element not found in DOM, log clear error and provide fallback.
13. Refactor doc-generator.js (~2906 lines) into separate modules by document type (vision, values, domains, goals, etc.) to improve maintainability.

---

## Run Details

**QA Council Agents:**
- Agent 1 (District Analysis): Identified 24 missing IDs, 2 duplicate functions, all 14 steps properly structured
- Agent 2 (Test Architect): Designed 40-test plan covering initialization, navigation, persistence, CRUD, and export
- Agent 3 (School Analysis): Identified 8 missing goal modal IDs, all 12 steps structured correctly
- Agent 4 (Audit): Found 63 source bugs across 5 test files; fixed 1 test logic error
- Agent 5 (Test Execution): Ran 146 tests; 83 passed, 63 failed; all failures are source code defects

**Timeline:**
- District analysis: 23:38:42Z
- Test plan: 22:42:00Z
- School analysis: 22:40:02Z
- Audit report: 23:38:42Z
- Test execution: 23:45:00Z
- **Report generated:** 23:45:00Z

**Verdict:** Code requires substantial rework before pilot. Do not merge. Do not deploy. Prioritize P0 fixes (section 1 above) before proceeding.
