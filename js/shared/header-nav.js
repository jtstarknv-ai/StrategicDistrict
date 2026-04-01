/**
 * Shared Header Navigation Component
 * Strategic District - Premium Design System
 *
 * Usage:
 *   renderSharedHeader('plan')  // or 'progress', 'school', 'monitoring'
 *   renderSharedHeader()         // auto-detect from current URL
 *
 * Dependencies:
 *   - auth.js (signOut function)
 *   - localStorage key 'sd_current_plan_name' (optional)
 */

function renderSharedHeader(activePageId = null) {
  // Auto-detect active page from URL if not provided
  if (!activePageId) {
    const href = window.location.href;
    if (href.includes('builder/index.html') || href.includes('/builder/') && href.includes('plan')) {
      activePageId = 'plan';
    } else if (href.includes('builder/dashboard.html') || href.includes('progress')) {
      activePageId = 'progress';
    } else if (href.includes('strategic-school')) {
      activePageId = 'school';
    } else if (href.includes('reports/district-monitoring') || href.includes('monitoring')) {
      activePageId = 'monitoring';
    }
  }

  // Inject CSS styles (scoped to avoid conflicts)
  injectHeaderStyles();

  // Create and inject gradient bar
  const gradientBar = document.createElement('div');
  gradientBar.className = 'sd-gradient-bar';
  document.body.prepend(gradientBar);

  // Create and inject header
  const header = document.createElement('header');
  header.className = 'sd-header-sticky';
  header.innerHTML = `
    <div class="sd-header-container">
      <!-- Left: Logo Section -->
      <div class="sd-header-left">
        <div class="sd-logo-section">
          ${getLogoSVG()}
          <div class="sd-logo-text">
            <div class="sd-logo-title">Strategic District</div>
            <div class="sd-logo-badge">${getPlanName()}</div>
          </div>
        </div>
      </div>

      <!-- Center: Navigation Links -->
      <nav class="sd-nav-center">
        <a href="/builder/index.html" class="sd-nav-link ${activePageId === 'plan' ? 'active' : ''}">
          ${getStrategicPlanIcon()}
          <span>Strategic Plan</span>
        </a>
        <a href="/builder/dashboard.html" class="sd-nav-link ${activePageId === 'progress' ? 'active' : ''}">
          ${getStrategicProgressIcon()}
          <span>Strategic Progress</span>
        </a>
        <a href="/strategic-school/index.html" class="sd-nav-link ${activePageId === 'school' ? 'active' : ''}">
          ${getStrategicSchoolIcon()}
          <span>Strategic School</span>
        </a>
        <a href="/reports/district-monitoring.html" class="sd-nav-link ${activePageId === 'monitoring' ? 'active' : ''}">
          ${getStrategicMonitoringIcon()}
          <span>Strategic Monitoring</span>
        </a>
      </nav>

      <!-- Right: Actions -->
      <div class="sd-nav-actions">
        <button class="sd-plan-switcher" onclick="navigateToPlanHub()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <span class="sd-plan-name">${getPlanName()}</span>
        </button>
        <button class="sd-signout-btn" onclick="handleSignOut()">Sign Out</button>
      </div>
    </div>
  `;

  document.body.prepend(header);

  // Adjust body padding to account for header height
  const headerHeight = header.offsetHeight + 5; // 5px for gradient bar
  document.body.style.paddingTop = headerHeight + 'px';
}

/**
 * Inject all CSS styles for the header
 */
function injectHeaderStyles() {
  const styleId = 'sd-header-styles';
  if (document.getElementById(styleId)) return; // Only inject once

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    :root {
      --sd-navy: #22333B;
      --sd-cream: #EAE0D5;
      --sd-tan: #C6AC8F;
      --sd-brown: #5E503F;
      --sd-teal: #00B4CC;
      --sd-gold: #D4A537;
      --sd-green: #6ECF6E;
      --sd-coral: #E07A5F;
      --sd-purple: #6B4C9A;
      --sd-gradient: linear-gradient(to right, #6ECF6E, #00B4CC, #D4A537, #E07A5F, #6B4C9A);
    }

    /* Gradient Bar (5px fixed top) */
    .sd-gradient-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: var(--sd-gradient);
      z-index: 9999;
      pointer-events: none;
    }

    /* Sticky Header with Glassmorphism */
    .sd-header-sticky {
      position: fixed;
      top: 5px;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(34, 51, 59, 0.08);
      z-index: 9998;
      padding: 0;
      margin: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    .sd-header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1400px;
      margin: 0 auto;
      padding: 12px 32px;
      height: 60px;
      width: 100%;
      box-sizing: border-box;
    }

    /* Logo Section (Left) */
    .sd-header-left {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      min-width: 0;
    }

    .sd-logo-section {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: opacity 0.2s ease;
    }

    .sd-logo-section:hover {
      opacity: 0.8;
    }

    .sd-logo-section svg {
      width: 28px;
      height: 28px;
      flex-shrink: 0;
    }

    .sd-logo-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .sd-logo-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px;
      font-weight: 700;
      color: var(--sd-navy);
      letter-spacing: -0.3px;
      line-height: 1;
    }

    .sd-logo-badge {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 500;
      color: var(--sd-teal);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      line-height: 1;
    }

    /* Center Navigation */
    .sd-nav-center {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      flex: 1;
      margin: 0 32px;
    }

    .sd-nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 500;
      color: var(--sd-brown);
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.2s ease;
      border-bottom: 2px solid transparent;
      position: relative;
      white-space: nowrap;
    }

    .sd-nav-link svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    .sd-nav-link:hover {
      background: rgba(34, 51, 59, 0.04);
      color: var(--sd-navy);
    }

    .sd-nav-link.active {
      color: var(--sd-teal);
      border-bottom-color: var(--sd-teal);
      background: rgba(0, 180, 204, 0.06);
    }

    .sd-nav-link span {
      display: inline;
    }

    /* Right Actions */
    .sd-nav-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    /* Plan Switcher Button */
    .sd-plan-switcher {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 500;
      color: var(--sd-brown);
      background: rgba(34, 51, 59, 0.06);
      border: 1px solid rgba(34, 51, 59, 0.12);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .sd-plan-switcher:hover {
      background: rgba(34, 51, 59, 0.12);
      border-color: rgba(34, 51, 59, 0.2);
      color: var(--sd-navy);
    }

    .sd-plan-switcher svg {
      width: 14px;
      height: 14px;
      stroke: currentColor;
    }

    .sd-plan-name {
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Sign Out Button */
    .sd-signout-btn {
      padding: 8px 16px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 500;
      color: #fff;
      background: linear-gradient(135deg, var(--sd-teal), var(--sd-green));
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .sd-signout-btn:hover {
      opacity: 0.9;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 180, 204, 0.2);
    }

    .sd-signout-btn:active {
      transform: translateY(0);
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .sd-header-container {
        padding: 12px 24px;
      }

      .sd-nav-center {
        margin: 0 16px;
        gap: 4px;
      }

      .sd-nav-link {
        padding: 8px 12px;
        font-size: 12px;
      }

      .sd-nav-link span {
        display: none;
      }

      .sd-nav-link svg {
        width: 18px;
        height: 18px;
      }
    }

    @media (max-width: 768px) {
      .sd-header-container {
        padding: 12px 16px;
        gap: 8px;
      }

      .sd-logo-title {
        font-size: 13px;
      }

      .sd-nav-center {
        margin: 0 8px;
        gap: 0;
      }

      .sd-nav-link {
        padding: 6px 8px;
        font-size: 11px;
        border-radius: 4px;
      }

      .sd-plan-switcher {
        padding: 6px 10px;
        font-size: 12px;
      }

      .sd-plan-name {
        display: none;
      }

      .sd-signout-btn {
        padding: 6px 12px;
        font-size: 12px;
      }
    }

    /* Focus states for accessibility */
    .sd-nav-link:focus,
    .sd-plan-switcher:focus,
    .sd-signout-btn:focus {
      outline: 2px solid var(--sd-teal);
      outline-offset: 2px;
    }

    /* Print styles */
    @media print {
      .sd-gradient-bar,
      .sd-header-sticky {
        display: none;
      }
    }
  `;

  document.head.appendChild(style);
}

/**
 * Get the current plan name from localStorage
 */
function getPlanName() {
  return localStorage.getItem('sd_current_plan_name') || 'Select Plan';
}

/**
 * Navigate to plan hub
 */
function navigateToPlanHub() {
  window.location.href = '/builder/plan-hub.html';
}

/**
 * Handle sign out action
 */
function handleSignOut() {
  if (typeof signOut === 'function') {
    signOut();
  } else {
    console.warn('signOut function not found in auth.js');
    // Fallback: redirect to login
    window.location.href = '/login.html';
  }
}

/**
 * Logo SVG with gradient
 */
function getLogoSVG() {
  return `
    <svg width="22" height="22" viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="20" fill="url(#sdG)" fill-opacity="0.08"/>
      <circle cx="36" cy="36" r="20" stroke="url(#sdG)" stroke-width="1.5" stroke-opacity="0.2"/>
      <text x="36" y="42" text-anchor="middle" font-family="Source Serif Pro, serif" font-weight="700" font-size="20" fill="#22333B">SD</text>
      <defs>
        <linearGradient id="sdG" x1="16" y1="16" x2="56" y2="56">
          <stop stop-color="#00B4CC"/>
          <stop offset="0.5" stop-color="#D4A537"/>
          <stop offset="1" stop-color="#6B4C9A"/>
        </linearGradient>
      </defs>
    </svg>
  `;
}

/**
 * Strategic Plan Icon (Bar Chart)
 */
function getStrategicPlanIcon() {
  return `
    <svg width="15" height="15" viewBox="0 0 48 48" fill="none">
      <rect x="10" y="20" width="9" height="16" rx="2" fill="#00B4CC" fill-opacity="0.75"/>
      <rect x="20" y="14" width="9" height="22" rx="2" fill="#00B4CC" fill-opacity="0.5"/>
      <rect x="30" y="8" width="9" height="28" rx="2" fill="#00B4CC" fill-opacity="0.35"/>
    </svg>
  `;
}

/**
 * Strategic Progress Icon (Line Chart)
 */
function getStrategicProgressIcon() {
  return `
    <svg width="15" height="15" viewBox="0 0 48 48" fill="none">
      <polyline points="8,34 16,26 24,30 32,16 40,12" stroke="#6ECF6E" stroke-width="3" stroke-linecap="round" fill="none"/>
      <circle cx="32" cy="16" r="3" fill="#6ECF6E" fill-opacity="0.8"/>
    </svg>
  `;
}

/**
 * Strategic School Icon (Building)
 */
function getStrategicSchoolIcon() {
  return `
    <svg width="15" height="15" viewBox="0 0 48 48" fill="none">
      <rect x="14" y="24" width="20" height="14" rx="2" fill="#E07A5F" fill-opacity="0.6"/>
      <polygon points="24,12 12,26 36,26" fill="#E07A5F" fill-opacity="0.4"/>
      <rect x="21" y="30" width="6" height="8" rx="1" fill="#EAE0D5" fill-opacity="0.9"/>
    </svg>
  `;
}

/**
 * Strategic Monitoring Icon (Grid/Chart)
 */
function getStrategicMonitoringIcon() {
  return `
    <svg width="15" height="15" viewBox="0 0 48 48" fill="none">
      <rect x="6" y="6" width="36" height="36" rx="4" stroke="#6B4C9A" stroke-width="2" fill="none"/>
      <polyline points="14,34 22,22 30,28 38,14" stroke="#6B4C9A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="22" cy="22" r="2" fill="#6B4C9A" fill-opacity="0.6"/>
      <circle cx="30" cy="28" r="2" fill="#6B4C9A" fill-opacity="0.6"/>
    </svg>
  `;
}

/**
 * Export for module usage
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderSharedHeader };
}
