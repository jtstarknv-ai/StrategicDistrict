/* Strategic District Paywall System */

// ============================================================================
// PAYWALL STATE
// ============================================================================

var userTier = 'free';
var userAuthenticated = false;
var userEmail = '';

// ============================================================================
// PAYWALL INITIALIZATION
// ============================================================================

function initPaywall() {
  if (!window.sdAuth || !sdAuth.client) {
    userTier = 'free';
    lockPremiumSteps();
    updateBuilderNavAuth();
    return;
  }

  // Get session from Supabase. The user's plan_tier is stored in
  // user_metadata (on the session object itself), so no DB query needed.
  sdAuth.client.auth.getSession().then(function(result) {
    var session = result.data && result.data.session;

    if (!session) {
      userTier = 'free';
      lockPremiumSteps();
      updateBuilderNavAuth();
      return;
    }

    // Update sdAuth state
    sdAuth.currentSession = session;
    sdAuth.currentUser = session.user;
    userEmail = session.user.email || '';
    userAuthenticated = true;

    // Check plan_tier from user_metadata (set via auth.users raw_user_meta_data)
    var meta = session.user.user_metadata || {};
    var tier = meta.plan_tier || 'free';

    if (tier === 'enterprise') {
      userTier = 'enterprise';
      unlockAllSteps();
    } else {
      userTier = 'free';
      lockPremiumSteps();
    }
    updateBuilderNavAuth();
  }).catch(function(err) {
    userTier = 'free';
    lockPremiumSteps();
    updateBuilderNavAuth();
  });
}

// ============================================================================
// UPDATE BUILDER NAV BAR AUTH INFO
// ============================================================================

function updateBuilderNavAuth() {
  var authArea = document.getElementById('builderAuthInfo');
  if (!authArea) return;

  if (userEmail) {
    var tierLabel = userTier === 'enterprise' ? 'Enterprise' : 'Free Tier';
    var tierClass = userTier === 'enterprise' ? 'tier-enterprise' : 'tier-free';
    authArea.innerHTML = '<span class="builder-user-email">' + userEmail + '</span>' +
      '<span class="builder-tier-badge ' + tierClass + '">' + tierLabel + '</span>' +
      '<a href="#" class="nav-tab" onclick="handleSignOut(event)" style="color:#E07A5F;font-size:0.8125rem;margin-left:12px">Sign Out</a>';
  } else {
    authArea.innerHTML = '<a href="/login/" class="builder-auth-link">Sign In</a>' +
      '<a href="/signup/" class="builder-auth-link builder-auth-signup">Sign Up</a>';
  }
}

// ============================================================================
// LOCK PREMIUM STEPS (Steps 6-11) - Lock icons only, no badges
// ============================================================================

function lockPremiumSteps() {
  var premiumSteps = [8, 9, 10, 11, 12, 13, 14];

  premiumSteps.forEach(function(stepNum) {
    var stepItem = document.querySelector('.step-item[data-step="' + stepNum + '"]');
    if (stepItem) {
      stepItem.classList.add('step-locked');

      // Add lock icon only (no enterprise badge)
      if (!stepItem.querySelector('.lock-icon')) {
        var lockIcon = document.createElement('span');
        lockIcon.className = 'lock-icon';
        lockIcon.textContent = '\uD83D\uDD12';
        stepItem.appendChild(lockIcon);
      }

      stepItem.onclick = function(e) {
        e.stopPropagation();
        showUpgradeModal();
      };
    }

    // Add locked overlay to step content
    var stepContent = document.querySelector('.step-content[data-step="' + stepNum + '"]');
    if (stepContent && !stepContent.querySelector('.locked-overlay')) {
      var overlay = document.createElement('div');
      overlay.className = 'locked-overlay';
      overlay.innerHTML = '<div class="locked-message">' +
        '<p>Upgrade to Enterprise to unlock this step</p>' +
        '<button class="btn btn-primary" onclick="showUpgradeModal()">Unlock Now</button>' +
        '</div>';
      stepContent.appendChild(overlay);
    }
  });
}

// ============================================================================
// UNLOCK ALL STEPS
// ============================================================================

function unlockAllSteps() {
  var allSteps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  allSteps.forEach(function(stepNum) {
    var stepItem = document.querySelector('.step-item[data-step="' + stepNum + '"]');
    if (stepItem) {
      stepItem.classList.remove('step-locked');
      var lockIcon = stepItem.querySelector('.lock-icon');
      if (lockIcon) lockIcon.remove();
      var badge = stepItem.querySelector('.enterprise-badge');
      if (badge) badge.remove();

      stepItem.onclick = function() {
        stepGoto(stepNum);
      };
    }

    var stepContent = document.querySelector('.step-content[data-step="' + stepNum + '"]');
    if (stepContent) {
      var overlay = stepContent.querySelector('.locked-overlay');
      if (overlay) overlay.remove();
    }
  });
}

// ============================================================================
// UPGRADE MODAL
// ============================================================================

function showUpgradeModal() {
  var existingModal = document.getElementById('upgradeModal');
  if (existingModal) {
    existingModal.style.display = 'flex';
    return;
  }

  var modalHtml = '<div id="upgradeModal" class="upgrade-modal">' +
    '<div class="upgrade-modal-content">' +
    '<button class="upgrade-modal-close" onclick="closeUpgradeModal()">&times;</button>' +
    '<h2 class="upgrade-modal-title">Unlock Your Full Strategic Plan</h2>' +
    '<div class="upgrade-modal-body">' +
    '<div class="upgrade-section">' +
    '<h3>What You Get</h3>' +
    '<p class="upgrade-subtitle">Complete access to all 14 steps plus premium features</p>' +
    '<ul class="upgrade-features">' +
    '<li><strong>Steps 8-14:</strong> Strategic Goal Setting, Goal Forecasting, Central Office Alignment, Action Initiatives, Stakeholder Review, Implementation Calendar, Review and Export</li>' +
    '<li><strong>3 Export Formats:</strong> Interactive Dashboard, Quick Summary, Full Plan Document</li>' +
    '<li><strong>School Builder:</strong> Create strategic plans for individual schools</li>' +
    '<li><strong>Unlimited Saved Plans:</strong> Create and manage as many plans as you need</li>' +
    '</ul>' +
    '</div>' +
    '<div class="upgrade-section">' +
    '<h3>Pricing</h3>' +
    '<div class="upgrade-pricing">' +
    '<div class="price-option">' +
    '<div class="price-label">Annual</div>' +
    '<div class="price-amount">$5,000</div>' +
    '<div class="price-term">/year</div>' +
    '</div>' +
    '<div class="price-option">' +
    '<div class="price-label">2-Year</div>' +
    '<div class="price-amount">$9,000</div>' +
    '<div class="price-term">$4,500/year</div>' +
    '</div>' +
    '<div class="price-option">' +
    '<div class="price-label">3-Year</div>' +
    '<div class="price-amount">$12,000</div>' +
    '<div class="price-term">$4,000/year</div>' +
    '</div>' +
    '</div>' +
    '<p class="upgrade-guarantee">Always get upgrades, never pay more</p>' +
    '</div>' +
    '<div class="upgrade-section">' +
    '<button class="btn btn-primary upgrade-cta" onclick="contactUpgrade()">Contact Us for Enterprise Access</button>' +
    '<p class="upgrade-signin">Already have an enterprise account? <a href="/login/" style="color:#00B4CC;text-decoration:none;font-weight:600">Sign In</a></p>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  var modal = document.getElementById('upgradeModal');
  modal.style.display = 'flex';

  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeUpgradeModal();
    }
  });
}

function closeUpgradeModal() {
  var modal = document.getElementById('upgradeModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function contactUpgrade() {
  window.location.href = '/contact/';
}

// ============================================================================
// OVERRIDE STEP NAVIGATION FOR PREMIUM STEPS
// ============================================================================

var originalStepGoto = window.stepGoto;

function stepGotoWithPaywall(stepNum) {
  if (userTier === 'free' && stepNum >= 8 && stepNum <= 14) {
    showUpgradeModal();
    return;
  }

  if (typeof originalStepGoto === 'function') {
    originalStepGoto(stepNum);
  }
}

function stepNextWithPaywall() {
  var current = document.querySelector('.step-content.active');
  if (!current) return;

  var currentStep = parseInt(current.getAttribute('data-step'));
  var nextStep = currentStep + 1;

  if (userTier === 'free' && nextStep >= 8 && nextStep <= 14) {
    showUpgradeModal();
    return;
  }

  if (nextStep <= 14) {
    stepGotoWithPaywall(nextStep);
  }
}

// ============================================================================
// SCHOOL BUILDER PAYWALL
// ============================================================================

function lockSchoolBuilder() {
  var builderContainer = document.querySelector('.school-builder-container');
  if (builderContainer && userTier === 'free') {
    var overlay = document.createElement('div');
    overlay.className = 'locked-overlay full-page';
    overlay.innerHTML = '<div class="locked-message"><div>' +
      '<h2>School Strategic Plan Builder</h2>' +
      '<p>Enterprise tier only</p>' +
      '<button class="btn btn-primary" onclick="showUpgradeModal()">Upgrade Now</button>' +
      '<a href="/builder/" class="btn btn-secondary" style="text-decoration:none;display:inline-block;margin-top:8px">Back to District Builder</a>' +
      '</div></div>';
    builderContainer.parentNode.insertBefore(overlay, builderContainer);

    document.querySelectorAll('.step-item').forEach(function(item) {
      item.style.pointerEvents = 'none';
      item.style.opacity = '0.5';
    });
  }
}

// ============================================================================
// SIGN OUT
// ============================================================================

function handleSignOut(e) {
  if (e) e.preventDefault();
  if (window.sdAuth && sdAuth.client) {
    sdAuth.signOut();
  } else {
    window.location.href = '/';
  }
}

window.handleSignOut = handleSignOut;

// ============================================================================
// INITIALIZE ON PAGE LOAD
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
  var retryCount = 0;
  var maxRetries = 8;

  function tryInitPaywall() {
    if (window.sdAuth && sdAuth.client) {
      initPaywall();
    } else if (retryCount < maxRetries) {
      retryCount++;
      setTimeout(tryInitPaywall, 300);
    } else {
      console.log('Paywall: Auth never loaded, defaulting to free');
      userTier = 'free';
      lockPremiumSteps();
      updateBuilderNavAuth();
    }
  }

  setTimeout(tryInitPaywall, 200);
});
