/**
 * plan-loader.js
 * Handles loading selected plans from Supabase and populating builder forms
 * Connects Plan Hub selection to builder auto-population
 */

// Supabase configuration
const SUPABASE_CONFIG = {
  url: "https://mrdyxownxnyzjubvpwrk.supabase.co",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZHl4b3dueG55emp1YnZwd3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MzYwODksImV4cCI6MjA4OTIxMjA4OX0.4TQomjn_4hu-5TrcyGi90wyv1HxxGKmEP1mu682hJHM"
};

/**
 * Toast notification system
 */
function showToast(message, duration = 3000) {
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    `;
    document.body.appendChild(toastContainer);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.style.cssText = `
    background-color: #333;
    color: #fff;
    padding: 12px 20px;
    border-radius: 6px;
    margin-bottom: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    font-size: 14px;
    line-height: 1.4;
    max-width: 300px;
    word-wrap: break-word;
    animation: slideIn 0.3s ease-in-out;
  `;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Add animation styles if not already present
  if (!document.getElementById('toast-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-animation-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes slideOut {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(100%);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Auto-remove after duration
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in-out';
    setTimeout(() => {
      toastContainer.removeChild(toast);
      if (toastContainer.children.length === 0) {
        document.body.removeChild(toastContainer);
        document.getElementById('toast-container').remove();
      }
    }, 300);
  }, duration);
}

/**
 * Get current plan ID from localStorage
 */
function getCurrentPlanId() {
  return localStorage.getItem('sd_current_plan_id');
}

/**
 * Get current plan name from localStorage
 */
function getCurrentPlanName() {
  return localStorage.getItem('sd_current_plan_name');
}

/**
 * Fetch plan data from Supabase
 */
async function fetchPlanFromSupabase(planId) {
  try {
    const response = await fetch(
      `${SUPABASE_CONFIG.url}/rest/v1/saved_plans?id=eq.${planId}&select=*`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_CONFIG.key,
          'Authorization': `Bearer ${SUPABASE_CONFIG.key}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Supabase fetch error: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      throw new Error(`Plan ${planId} not found in database`);
    }

    return data[0];
  } catch (error) {
    console.error('Error fetching plan from Supabase:', error);
    showToast(`Error loading plan: ${error.message}`, 4000);
    throw error;
  }
}

/**
 * Populate district builder form fields
 */
function populateDistrictBuilder(planData) {
  // Helper function to safely set input value
  const setFieldValue = (fieldId, value) => {
    const element = document.getElementById(fieldId);
    if (element && value !== null && value !== undefined) {
      element.value = value;
      // Trigger input event for reactive frameworks
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  // Helper function to safely set textarea value
  const setTextareaValue = (fieldId, value) => {
    const element = document.getElementById(fieldId);
    if (element && value !== null && value !== undefined) {
      element.value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  try {
    // Plan name
    setFieldValue('planNameTop', planData.planName);

    // District information
    if (planData.district) {
      setFieldValue('districtName', planData.district.name);
      setFieldValue('districtLocation', planData.district.state);
      setFieldValue('studentEnrollment', planData.district.enrollment);
      setFieldValue('numberOfSchools', planData.district.numSchools);
    }

    // Store plan data in localStorage for plan-sync.js
    localStorage.setItem('sd_plan_data', JSON.stringify(planData));

    // Store in global planState if it exists (for builder use)
    if (typeof window.planState !== 'undefined') {
      window.planState = planData;
    }

    console.log('District builder populated successfully');
  } catch (error) {
    console.error('Error populating district builder:', error);
    showToast('Error populating form fields', 4000);
  }
}

/**
 * Populate school builder form fields
 */
function populateSchoolBuilder(planData) {
  // Helper function to safely set input value
  const setFieldValue = (fieldId, value) => {
    const element = document.getElementById(fieldId);
    if (element && value !== null && value !== undefined) {
      element.value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  try {
    // Plan name
    setFieldValue('planNameTop', planData.planName);

    // School/District information if available
    if (planData.district) {
      setFieldValue('schoolName', planData.district.name);
      setFieldValue('location', planData.district.state);
    }

    // Store plan data in localStorage for plan-sync.js
    localStorage.setItem('sd_plan_data', JSON.stringify(planData));

    // Store in global planState if it exists
    if (typeof window.planState !== 'undefined') {
      window.planState = planData;
    }

    console.log('School builder populated successfully');
  } catch (error) {
    console.error('Error populating school builder:', error);
    showToast('Error populating form fields', 4000);
  }
}

/**
 * Main function to load selected plan and populate forms
 */
async function loadSelectedPlan() {
  try {
    // Check if a plan is selected
    const planId = getCurrentPlanId();
    const planName = getCurrentPlanName();

    if (!planId) {
      console.log('No plan selected in localStorage');
      return;
    }

    // Show loading state
    console.log(`Loading plan: ${planName} (ID: ${planId})`);

    // Fetch plan data from Supabase
    const planData = await fetchPlanFromSupabase(planId);

    // Determine builder type and populate accordingly
    // Check if we're in a district or school builder context
    const isDistrictBuilder = document.getElementById('planNameTop') &&
                            document.getElementById('districtName');
    const isSchoolBuilder = document.getElementById('planNameTop') &&
                           document.getElementById('schoolName');

    if (isDistrictBuilder) {
      populateDistrictBuilder(planData);
    } else if (isSchoolBuilder) {
      populateSchoolBuilder(planData);
    }

    // Show success toast
    showToast(`Plan loaded: ${planName}`, 3000);

  } catch (error) {
    console.error('Error in loadSelectedPlan:', error);
    // Error toast is shown by the fetch/populate functions
  }
}

/**
 * Clear selected plan from localStorage
 */
function clearSelectedPlan() {
  localStorage.removeItem('sd_current_plan_id');
  localStorage.removeItem('sd_current_plan_name');
  localStorage.removeItem('sd_plan_data');
  console.log('Selected plan cleared');
}

/**
 * Initialize plan loader on page load
 */
document.addEventListener('DOMContentLoaded', () => {
  loadSelectedPlan();
});

// Also support manual initialization via window for older code
if (typeof window !== 'undefined') {
  window.loadSelectedPlan = loadSelectedPlan;
  window.getCurrentPlanId = getCurrentPlanId;
  window.getCurrentPlanName = getCurrentPlanName;
  window.clearSelectedPlan = clearSelectedPlan;
}