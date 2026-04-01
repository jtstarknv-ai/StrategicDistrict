/*
 * ai-engine.js
 * AI integration layer for Strategic Planning Toolkit
 * Uses Groq's free Llama API with Cloudflare Workers AI fallback
 */

var AI_CONFIG = {
  provider: 'groq', // 'groq' or 'cloudflare'
  groqApiKey: '', // Set by user in settings or loaded from localStorage
  groqModel: 'llama-3.3-70b-versatile',
  cloudflareModel: '@cf/meta/llama-3-8b-instruct',
  cloudflareToken: '', // Set by user in settings
  maxTokens: 2048,
  temperature: 0.7,
  maxRequestsPerMinute: 30,
  requestTimestamps: []
};

// Initialize settings from localStorage
var AI_SETTINGS_KEY = 'strategic_toolkit_ai_settings';

function initializeAISettings() {
  var saved = localStorage.getItem(AI_SETTINGS_KEY);
  if (saved) {
    var settings = JSON.parse(saved);
    AI_CONFIG.groqApiKey = settings.groqApiKey || '';
    AI_CONFIG.cloudflareToken = settings.cloudflareToken || '';
    AI_CONFIG.provider = settings.provider || 'groq';
  }
}

function saveAISettings() {
  var settings = {
    groqApiKey: AI_CONFIG.groqApiKey,
    cloudflareToken: AI_CONFIG.cloudflareToken,
    provider: AI_CONFIG.provider
  };
  localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(settings));
}

// ============================================================================
// RATE LIMITING & REQUEST MANAGEMENT
// ============================================================================

function checkRateLimit() {
  var now = Date.now();
  var oneMinuteAgo = now - 60000;
  
  // Remove old timestamps
  AI_CONFIG.requestTimestamps = AI_CONFIG.requestTimestamps.filter(function(ts) {
    return ts > oneMinuteAgo;
  });
  
  if (AI_CONFIG.requestTimestamps.length >= AI_CONFIG.maxRequestsPerMinute) {
    return {
      allowed: false,
      waitTime: Math.ceil((AI_CONFIG.requestTimestamps[0] + 60000 - now) / 1000),
      remaining: 0
    };
  }
  
  AI_CONFIG.requestTimestamps.push(now);
  
  return {
    allowed: true,
    remaining: AI_CONFIG.maxRequestsPerMinute - AI_CONFIG.requestTimestamps.length,
    waitTime: 0
  };
}

function queueRequest(requestFn, containerId) {
  var rateCheck = checkRateLimit();
  
  if (!rateCheck.allowed) {
    var message = 'Rate limit reached. Please wait ' + rateCheck.waitTime + ' seconds before trying again.';
    showAIError(containerId, message);
    return Promise.reject(new Error(message));
  }
  
  return requestFn();
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

var AI_CACHE_KEY = 'strategic_toolkit_ai_cache';

function getPromptHash(systemPrompt, userPrompt) {
  var combined = systemPrompt + '::' + userPrompt;
  var hash = 0;
  for (var i = 0; i < combined.length; i++) {
    var char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'hash_' + Math.abs(hash).toString(36);
}

function getCachedResponse(systemPrompt, userPrompt) {
  var hash = getPromptHash(systemPrompt, userPrompt);
  var cache = JSON.parse(localStorage.getItem(AI_CACHE_KEY) || '{}');
  return cache[hash] || null;
}

function cacheResponse(systemPrompt, userPrompt, response) {
  var hash = getPromptHash(systemPrompt, userPrompt);
  var cache = JSON.parse(localStorage.getItem(AI_CACHE_KEY) || '{}');
  cache[hash] = {
    response: response,
    timestamp: Date.now()
  };
  localStorage.setItem(AI_CACHE_KEY, JSON.stringify(cache));
}

function clearAICache() {
  localStorage.removeItem(AI_CACHE_KEY);
}

// ============================================================================
// API COMMUNICATION LAYER
// ============================================================================

function callGroqAPI(systemPrompt, userPrompt, options) {
  options = options || {};
  
  if (!AI_CONFIG.groqApiKey) {
    return Promise.reject(new Error('Groq API key not configured. Please set it in AI Settings.'));
  }
  
  var messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];
  
  var requestBody = {
    model: AI_CONFIG.groqModel,
    messages: messages,
    max_tokens: options.maxTokens || AI_CONFIG.maxTokens,
    temperature: options.temperature !== undefined ? options.temperature : AI_CONFIG.temperature,
    top_p: 0.95,
    stream: false
  };
  
  return fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + AI_CONFIG.groqApiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
  .then(function(response) {
    if (!response.ok) {
      return response.json().then(function(error) {
        throw new Error('Groq API error: ' + ((error.error && error.error.message) || response.statusText));
      });
    }
    return response.json();
  })
  .then(function(data) {
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    }
    throw new Error('Unexpected Groq API response format');
  });
}

function callCloudflareAPI(systemPrompt, userPrompt, options) {
  options = options || {};
  
  if (!AI_CONFIG.cloudflareToken) {
    return Promise.reject(new Error('Cloudflare token not configured.'));
  }
  
  var messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];
  
  var requestBody = {
    messages: messages,
    max_tokens: options.maxTokens || AI_CONFIG.maxTokens
  };
  
  return fetch('https://api.cloudflare.com/client/v4/accounts/' + AI_CONFIG.cloudflareAccountId + '/ai/run/' + AI_CONFIG.cloudflareModel, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + AI_CONFIG.cloudflareToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
  .then(function(response) {
    if (!response.ok) {
      return response.json().then(function(error) {
        throw new Error('Cloudflare API error: ' + ((error.errors && error.errors[0] && error.errors[0].message) || response.statusText));
      });
    }
    return response.json();
  })
  .then(function(data) {
    if (data.result && data.result.response) {
      return data.result.response;
    }
    throw new Error('Unexpected Cloudflare API response format');
  });
}

function callLlamaAPI(systemPrompt, userPrompt, options) {
  options = options || {};
  var useCache = options.useCache !== false;
  var containerId = options.containerId;
  
  // Check cache first
  if (useCache) {
    var cached = getCachedResponse(systemPrompt, userPrompt);
    if (cached) {
      return Promise.resolve(cached.response);
    }
  }
  
  var primaryPromise;
  if (AI_CONFIG.provider === 'groq') {
    primaryPromise = callGroqAPI(systemPrompt, userPrompt, options);
  } else {
    primaryPromise = callCloudflareAPI(systemPrompt, userPrompt, options);
  }
  
  return primaryPromise
    .catch(function(primaryError) {
      console.warn('Primary provider failed, trying fallback:', primaryError.message);
      
      // Fallback to other provider
      if (AI_CONFIG.provider === 'groq') {
        return callCloudflareAPI(systemPrompt, userPrompt, options)
          .catch(function(fallbackError) {
            throw new Error('Both providers failed. Groq: ' + primaryError.message + '. Cloudflare: ' + fallbackError.message);
          });
      } else {
        return callGroqAPI(systemPrompt, userPrompt, options)
          .catch(function(fallbackError) {
            throw new Error('Both providers failed. Cloudflare: ' + primaryError.message + '. Groq: ' + fallbackError.message);
          });
      }
    })
    .then(function(response) {
      // Cache the successful response
      if (useCache) {
        cacheResponse(systemPrompt, userPrompt, response);
      }
      return response;
    });
}

// ============================================================================
// SYSTEM PROMPTS
// ============================================================================

var SYSTEM_PROMPTS = {
  strategicConsultant: 'You are an experienced K-12 strategic planning consultant with expertise in district transformation, data-driven decision making, and sustainable improvement. Your recommendations are grounded in research-based practices and tailored specifically to public school districts. Be concise, specific, and avoid corporate jargon. Use education-specific language and reference best practices when relevant.',
  
  visionMissionCraft: 'You are a K-12 strategic planning expert specializing in vision and mission statement development. Your statements are inspiring yet grounded in educational reality. They reflect district values, are specific to K-12 education, and are actionable. Avoid generic corporate language.',
  
  valuesClustering: 'You are an expert in organizational values analysis and stakeholder engagement. You identify meaningful patterns in stakeholder input and cluster related values into coherent themes. You understand K-12 context and educator culture.',
  
  capabilityAssessment: 'You are an education data expert and organizational capability analyst. You understand K-12 systems, capacity constraints, and realistic assessment of district strengths and gaps. Your assessments are specific, evidence-informed, and actionable.',
  
  goalDevelopment: 'You are an expert in SMART goal development in K-12 education. Your goals are specific, measurable, achievable, relevant, and time-bound. They align with district vision/mission and are grounded in realistic improvement science practices.',
  
  forecasting: 'You are an education data analyst with expertise in trend analysis and goal forecasting. You understand typical improvement trajectories in K-12 education and can project realistic progress based on historical trends. Your recommendations account for typical implementation challenges and realistic capacity.',
  
  alignment: 'You are an expert in organizational alignment and systems thinking in K-12 districts. You help map goals to departments, identify gaps, and ensure coherent execution across the central office.',
  
  initiatives: 'You are an expert in evidence-based improvement initiatives for K-12 districts. Your suggestions are grounded in research, practical for district implementation, and clearly connected to goals. You assess impact and effort realistically.'
};

// ============================================================================
// VISION & MISSION
// ============================================================================

function generateVisionStatement(selectedConcepts, districtProfile) {
  var systemPrompt = SYSTEM_PROMPTS.visionMissionCraft;
  
  var conceptText = selectedConcepts ? selectedConcepts.join(', ') : 'student success';
  var profileText = districtProfile ? 
    'District: ' + districtProfile.name + '. Student demographics: ' + (districtProfile.demographics || 'diverse') + '. Key challenges: ' + (districtProfile.challenges || 'varied') :
    '';
  
  var userPrompt = 'Generate 3 distinct vision statements for a K-12 school district based on these selected concepts: ' + conceptText + '. ' + profileText + '. Each vision should be: 1-2 sentences, inspiring, specific to education, and actionable. Number them 1, 2, 3. After each vision, provide a brief rationale (1 sentence).';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 1024,
      temperature: 0.8
    });
  });
}

function generateMissionStatement(selectedPurposes, districtProfile) {
  var systemPrompt = SYSTEM_PROMPTS.visionMissionCraft;
  
  var purposeText = selectedPurposes ? selectedPurposes.join(', ') : 'education';
  var profileText = districtProfile ? 
    'District: ' + districtProfile.name + '. Serving ' + (districtProfile.grades || 'K-12') + '.' :
    '';
  
  var userPrompt = 'Generate 3 distinct mission statements for a K-12 school district centered on: ' + purposeText + '. ' + profileText + '. Each mission should: clearly define who you serve and what you do, be specific to K-12, be 1-2 sentences, and feel authentic to district values. Number them 1, 2, 3. After each mission, provide a brief rationale (1 sentence).';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 1024,
      temperature: 0.8
    });
  });
}

function scoreClarity(statement) {
  var systemPrompt = SYSTEM_PROMPTS.strategicConsultant;
  
  var userPrompt = 'Score this statement\'s clarity and strength on a scale of 1-10. Statement: "' + statement + '". Provide: 1) The score, 2) 2-3 strengths, 3) 2-3 areas to strengthen. Format as: Score: X/10. Strengths: [list]. Improvements: [list]';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 512,
      temperature: 0.5
    });
  });
}

// ============================================================================
// CORE VALUES
// ============================================================================

function clusterStakeholderValues(responses) {
  var systemPrompt = SYSTEM_PROMPTS.valuesClustering;
  
  var responsesText = Array.isArray(responses) ? responses.join(', ') : responses;
  
  var userPrompt = 'Analyze these stakeholder responses about important district values and cluster them into 4-6 core value themes. Responses: ' + responsesText + '. For each cluster: 1) Name the value theme (1-2 words), 2) List which responses belong to it, 3) Provide a 1-sentence definition specific to K-12 context. Return as numbered list with clear formatting.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 1024,
      temperature: 0.7
    });
  });
}

function generateValueDefinitions(values) {
  var systemPrompt = SYSTEM_PROMPTS.valuesClustering;
  
  var valuesText = Array.isArray(values) ? values.join(', ') : values;
  
  var userPrompt = 'For each of these core values, create a K-12-specific behavioral definition (1 paragraph each). Values: ' + valuesText + '. Each definition should: clarify what the value means in a school district context, provide observable behaviors that demonstrate the value, and be actionable for staff. Number each definition.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 1536,
      temperature: 0.6
    });
  });
}

function suggestValueBehaviors(value, role) {
  var systemPrompt = SYSTEM_PROMPTS.valuesClustering;
  
  var userPrompt = 'For a K-12 school district, describe observable behaviors that demonstrate this value in the "' + role + '" role. Value: ' + value + '. Provide 5-7 specific, measurable behaviors that someone in this role would exhibit. Format as a numbered list. Each behavior should be clear and observable.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 768,
      temperature: 0.6
    });
  });
}

// ============================================================================
// COMPETENCIES & CAPABILITIES
// ============================================================================

function assessCapabilityGaps(districtProfile, goals) {
  var systemPrompt = SYSTEM_PROMPTS.capabilityAssessment;
  
  var profileText = districtProfile ? 
    'District: ' + districtProfile.name + '. Current strengths: ' + (districtProfile.strengths || 'not specified') + '. Known gaps: ' + (districtProfile.gaps || 'not specified') + '.' :
    '';
  
  var goalsText = Array.isArray(goals) ? goals.join('; ') : goals;
  
  var userPrompt = 'Analyze this district\'s capability gaps based on their profile and goals. ' + profileText + ' Goals: ' + goalsText + '. Identify: 1) Key capabilities needed for these goals, 2) Current gaps (be realistic), 3) Priority areas for development. Format: [Needed Capabilities] [Current Gaps] [Priority Development Areas]. Be specific to K-12 context.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 1024,
      temperature: 0.6
    });
  });
}

function suggestCompetencies(vision, mission, values) {
  var systemPrompt = SYSTEM_PROMPTS.capabilityAssessment;
  
  var userPrompt = 'Based on this district\'s vision, mission, and values, recommend 5-7 core competencies the central office should develop or strengthen. Vision: ' + vision + '. Mission: ' + mission + '. Values: ' + values + '. For each competency: provide 1-line name, explain why it\'s essential given their vision/mission, and note what it enables. Format as numbered list.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 1024,
      temperature: 0.7
    });
  });
}

// ============================================================================
// STRATEGIC DOMAINS & THEMES
// ============================================================================

function clusterThemes(surveyData, stakeholderInput) {
  var systemPrompt = SYSTEM_PROMPTS.strategicConsultant;
  
  var surveyText = Array.isArray(surveyData) ? surveyData.join('; ') : surveyData;
  var inputText = Array.isArray(stakeholderInput) ? stakeholderInput.join('; ') : stakeholderInput;
  
  var userPrompt = 'Analyze this input and cluster it into 4-6 strategic domain themes. Survey responses: ' + surveyText + '. Stakeholder input: ' + inputText + '. For each cluster: 1) Suggest a domain name (2-3 words), 2) List items that belong to it, 3) Provide a 1-sentence strategic focus. Format as numbered list with clear separation.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 1024,
      temperature: 0.7
    });
  });
}

function suggestDomainNames(themes) {
  var systemPrompt = SYSTEM_PROMPTS.strategicConsultant;
  
  var themesText = Array.isArray(themes) ? themes.join(', ') : themes;
  
  var userPrompt = 'Suggest professional, K-12-appropriate names for these strategic domain themes. Themes: ' + themesText + '. For each theme, provide 3 alternative names that are: clear and memorable, specific to K-12, actionable. Format: [Theme Name] > Option 1, Option 2, Option 3';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 768,
      temperature: 0.7
    });
  });
}

function validateDomainCount(domains) {
  var count = Array.isArray(domains) ? domains.length : 1;
  
  if (count < 3) {
    return {
      valid: false,
      message: 'You have ' + count + ' domain(s). Consider 4-6 domains for a balanced strategic plan.',
      severity: 'warning'
    };
  }
  
  if (count > 8) {
    return {
      valid: false,
      message: 'You have ' + count + ' domains. This may be too many to manage effectively. Consider consolidating related domains.',
      severity: 'warning'
    };
  }
  
  return {
    valid: true,
    message: 'Domain count is appropriate (' + count + ' domains).',
    severity: 'success'
  };
}

// ============================================================================
// GOAL SETTING
// ============================================================================

function generateSMARTGoals(domain, districtProfile) {
  var systemPrompt = SYSTEM_PROMPTS.goalDevelopment;
  
  var profileText = districtProfile ? 
    'District: ' + districtProfile.name + '. Student enrollment: ' + (districtProfile.enrollment || 'not specified') + '. Key metrics baseline: ' + (districtProfile.metrics || 'not specified') + '.' :
    '';
  
  var userPrompt = 'Generate 3 SMART goals for this strategic domain. ' + profileText + ' Domain: ' + domain + '. Each goal must be: Specific (measurable indicator), Measurable (with metric and baseline), Achievable (realistic for K-12), Relevant (to the domain), Time-bound (3-5 year timeframe). Number them 1, 2, 3. For each goal, also state the baseline metric and target year.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 1500,
      temperature: 0.6
    });
  });
}

function evaluateGoalQuality(goal) {
  var systemPrompt = SYSTEM_PROMPTS.goalDevelopment;
  
  var userPrompt = 'Evaluate this goal against SMART criteria. Goal: ' + goal + '. Provide: 1) Clarity score (1-10), 2) Assessment of each SMART element (S/M/A/R/T), 3) Specific recommendations for improvement. Format clearly with headers.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 768,
      temperature: 0.5
    });
  });
}

function alignGoalToVision(goal, vision, mission) {
  var systemPrompt = SYSTEM_PROMPTS.strategicConsultant;
  
  var userPrompt = 'Assess the alignment between this goal and the district\'s vision/mission. Goal: ' + goal + '. Vision: ' + vision + '. Mission: ' + mission + '. Provide: 1) Alignment score (1-10), 2) How the goal supports vision/mission, 3) Any misalignments or gaps. Format clearly.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 768,
      temperature: 0.5
    });
  });
}

// ============================================================================
// GOAL FORECASTING
// ============================================================================

function forecastGoalProgress(metric, historicalData, targetYears) {
  var systemPrompt = SYSTEM_PROMPTS.forecasting;
  
  var historicalText = Array.isArray(historicalData) ? 
    historicalData.map(function(d, i) { return 'Year ' + i + ': ' + d; }).join(', ') :
    historicalData;
  
  var userPrompt = 'Forecast realistic progress for this K-12 metric over ' + targetYears + ' years. Metric: ' + metric + '. Historical data: ' + historicalText + '. Provide: 1) Realistic annual projection (year by year), 2) Key assumptions about implementation, 3) Factors that could accelerate or slow progress. Account for typical improvement science pace in K-12 (often slower than expected).';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 1024,
      temperature: 0.6
    });
  });
}

function generateScenarios(metric, baseline, target) {
  var systemPrompt = SYSTEM_PROMPTS.forecasting;
  
  var userPrompt = 'Create three realistic scenarios (best case, likely case, worst case) for achieving this goal. Metric: ' + metric + '. Baseline: ' + baseline + '. Target: ' + target + '. For each scenario, provide: 1) Annual year-by-year progress, 2) Key drivers/assumptions, 3) Implementation requirements. Be realistic about K-12 improvement pace.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 1500,
      temperature: 0.7
    });
  });
}

function recommendTargets(metric, historicalTrend) {
  var systemPrompt = SYSTEM_PROMPTS.forecasting;
  
  var historyText = Array.isArray(historicalTrend) ? historicalTrend.join(', ') : historicalTrend;
  
  var userPrompt = 'Based on this historical trend, recommend realistic targets for a 3-year and 5-year goal. Metric: ' + metric + '. Historical trend: ' + historyText + '. For each timeframe: 1) Recommended target, 2) Rationale based on trend, 3) Key assumptions. Be realistic about achievability in K-12.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 768,
      temperature: 0.6
    });
  });
}

function sensitivityAnalysis(goals, assumptions) {
  var systemPrompt = SYSTEM_PROMPTS.forecasting;
  
  var goalsText = Array.isArray(goals) ? goals.join('; ') : goals;
  var assumptionsText = Array.isArray(assumptions) ? assumptions.join('; ') : assumptions;
  
  var userPrompt = 'Perform a sensitivity analysis on these goals. Goals: ' + goalsText + '. Key assumptions: ' + assumptionsText + '. Identify: 1) Which assumptions are most critical, 2) What happens if each assumption proves wrong, 3) Which goals are most sensitive to assumption changes, 4) Risk mitigation strategies. Focus on K-12 realities.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 1200,
      temperature: 0.6
    });
  });
}

// ============================================================================
// CENTRAL OFFICE ALIGNMENT
// ============================================================================

function suggestDepartmentAlignment(goals, departments) {
  var systemPrompt = SYSTEM_PROMPTS.alignment;
  
  var goalsText = Array.isArray(goals) ? goals.join('; ') : goals;
  var deptText = Array.isArray(departments) ? departments.join(', ') : departments;
  
  var userPrompt = 'Map these strategic goals to central office departments. Goals: ' + goalsText + '. Departments: ' + deptText + '. For each department, identify: 1) Primary goals they lead, 2) Supporting roles for other goals, 3) Key responsibilities. Create a clear alignment matrix format showing Primary/Supporting roles.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 1200,
      temperature: 0.6
    });
  });
}

function detectAlignmentGaps(alignmentMatrix) {
  var systemPrompt = SYSTEM_PROMPTS.alignment;
  
  var matrixText = Array.isArray(alignmentMatrix) ? alignmentMatrix.join('; ') : alignmentMatrix;
  
  var userPrompt = 'Analyze this alignment matrix for gaps and issues. Matrix: ' + matrixText + '. Identify: 1) Goals with no clear owner, 2) Departments with no assigned goals, 3) Overloaded departments, 4) Misalignments between goals and responsible departments. Provide specific recommendations for rebalancing.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 1024,
      temperature: 0.6
    });
  });
}

// ============================================================================
// ACTION INITIATIVES
// ============================================================================

function suggestInitiatives(goal, districtProfile) {
  var systemPrompt = SYSTEM_PROMPTS.initiatives;
  
  var profileText = districtProfile ? 
    'District: ' + districtProfile.name + '. Budget level: ' + (districtProfile.budget || 'standard') + '. Capacity: ' + (districtProfile.capacity || 'standard') + '.' :
    '';
  
  var userPrompt = 'Suggest 3-4 evidence-based initiatives to achieve this goal. ' + profileText + ' Goal: ' + goal + '. For each initiative: 1) Clear name and brief description, 2) Connection to goal, 3) Evidence base (what research supports this), 4) Key success factors, 5) Rough timeline. Be specific to K-12 and realistic for implementation.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 1500,
      temperature: 0.7
    });
  });
}

function estimateImpactEffort(initiative) {
  var systemPrompt = SYSTEM_PROMPTS.initiatives;
  
  var userPrompt = 'Assess the impact vs effort of this initiative. Initiative: ' + initiative + '. Provide: 1) Expected impact on goal (low/medium/high with rationale), 2) Implementation effort (low/medium/high with rationale), 3) Cost estimate (low/medium/high), 4) Timeline (months), 5) Key requirements for success. Use K-12 realistic perspectives on effort.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 1024,
      temperature: 0.6
    });
  });
}

function prioritizeInitiatives(initiatives) {
  var systemPrompt = SYSTEM_PROMPTS.initiatives;
  
  var initText = Array.isArray(initiatives) ? initiatives.join('; ') : initiatives;
  
  var userPrompt = 'Prioritize these initiatives using impact-effort-feasibility analysis. Initiatives: ' + initText + '. For each: assign priority (1-Highest, 2-High, 3-Medium, 4-Lower), explain rationale. Consider: impact on goals, implementation effort, resource requirements, feasibility in K-12 context. Recommend a phased implementation sequence.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 1200,
      temperature: 0.6
    });
  });
}

// ============================================================================
// IMPLEMENTATION CALENDAR
// ============================================================================

function generateTimeline(initiatives, constraints) {
  var systemPrompt = SYSTEM_PROMPTS.initiatives;
  
  var initText = Array.isArray(initiatives) ? initiatives.join('; ') : initiatives;
  var constraintText = Array.isArray(constraints) ? constraints.join('; ') : constraints;
  
  var userPrompt = 'Create a multi-year implementation timeline for these initiatives. Initiatives: ' + initText + '. Constraints: ' + constraintText + '. Provide: 1) Year 1 activities (by quarter), 2) Year 2 focus areas, 3) Year 3 consolidation/growth, 4) Key milestones and decision points, 5) Resource allocation by phase. Account for K-12 school calendar and realistic capacity.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 1500,
      temperature: 0.6
    });
  });
}

function identifyDependencies(initiatives) {
  var systemPrompt = SYSTEM_PROMPTS.initiatives;
  
  var initText = Array.isArray(initiatives) ? initiatives.join('; ') : initiatives;
  
  var userPrompt = 'Identify dependencies and sequencing requirements among these initiatives. Initiatives: ' + initText + '. For each initiative: 1) Prerequisites that must be in place first, 2) Initiatives that depend on its success, 3) Parallel vs sequential timing. Create a dependency map showing critical path.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 1024,
      temperature: 0.6
    });
  });
}

function flagRisks(calendar) {
  var systemPrompt = SYSTEM_PROMPTS.initiatives;
  
  var calendarText = Array.isArray(calendar) ? calendar.join('; ') : calendar;
  
  var userPrompt = 'Analyze this implementation calendar and identify key risks. Calendar: ' + calendarText + '. For each risk: 1) Describe the risk, 2) Probability (high/medium/low), 3) Impact if it occurs, 4) Mitigation strategy. Focus on realistic K-12 implementation challenges (staff turnover, budget cuts, competing initiatives, etc).';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 1200,
      temperature: 0.6
    });
  });
}

// ============================================================================
// REVIEW & FINALIZE
// ============================================================================

function aiAssessFeasibility(planState) {
  var systemPrompt = SYSTEM_PROMPTS.strategicConsultant;
  
  var planText = planState ? 
    'Vision: ' + (planState.vision || 'not set') + '. Mission: ' + (planState.mission || 'not set') + '. Domains: ' + (planState.domainsCount || 0) + '. Goals: ' + (planState.goalsCount || 0) + '. Initiatives: ' + (planState.initiativesCount || 0) + '. Timeline set: ' + (planState.hasTimeline ? 'yes' : 'no') + '.' :
    '';
  
  var userPrompt = 'Assess the overall feasibility and readiness of this strategic plan. Plan: ' + planText + '. Provide: 1) Overall feasibility score (1-10), 2) Completeness assessment (all key elements present?), 3) Realism check (achievable in K-12 context?), 4) Confidence in success (factors supporting/hindering), 5) Top 3 recommendations to strengthen the plan.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 1200,
      temperature: 0.6
    });
  });
}

function generateExecutiveSummary(planState) {
  var systemPrompt = SYSTEM_PROMPTS.strategicConsultant;
  
  var planText = planState ? JSON.stringify(planState) : 'Plan details not provided';
  
  var userPrompt = 'Generate a compelling 1-2 page executive summary of this strategic plan suitable for board presentation. Plan elements: ' + planText + '. Include: 1) District vision/mission (concise), 2) Strategic domains (with brief description), 3) Key goals (headline metrics), 4) Primary initiatives by year, 5) Expected outcomes. Use clear, professional language. No jargon.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 2000,
      temperature: 0.7
    });
  });
}

function identifyPlanGaps(planState) {
  var systemPrompt = SYSTEM_PROMPTS.strategicConsultant;
  
  var planText = planState ? JSON.stringify(planState) : 'Plan details not provided';
  
  var userPrompt = 'Identify gaps and weak areas in this strategic plan. Plan: ' + planText + '. Assess: 1) Missing voices (which stakeholders not represented?), 2) Underdeveloped areas (which domains lack detail?), 3) Resource gaps (are resource requirements clear?), 4) Implementation details (does plan provide actionable next steps?), 5) Equity considerations (does plan address achievement gaps?). Provide specific recommendations to strengthen each gap.';
  
  return queueRequest(function() {
    return callLlamaAPI(systemPrompt, userPrompt, {
      maxTokens: 1500,
      temperature: 0.6
    });
  });
}

// ============================================================================
// UI HELPER FUNCTIONS
// ============================================================================

function showAILoading(containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '<div class="ai-loading" style="padding: 20px; text-align: center;">' +
    '<div style="font-size: 24px; margin-bottom: 10px;">⏳</div>' +
    '<div style="color: #666;">Consulting AI strategist...</div>' +
    '</div>';
  
  container.style.display = 'block';
}

function showAIResponse(containerId, response, actions) {
  var container = document.getElementById(containerId);
  if (!container) return;
  
  var actionHtml = '';
  if (actions) {
    actionHtml = '<div class="ai-actions" style="margin-top: 15px; border-top: 1px solid #ddd; padding-top: 15px;">';
    
    if (actions.regenerate) {
      actionHtml += '<button onclick="' + actions.regenerate + '" style="margin-right: 10px; padding: 8px 16px; background: #E8622A; color: white; border: none; border-radius: 4px; cursor: pointer;">Regenerate</button>';
    }
    
    if (actions.copy) {
      actionHtml += '<button onclick="' + actions.copy + '" style="margin-right: 10px; padding: 8px 16px; background: #2EC4B6; color: white; border: none; border-radius: 4px; cursor: pointer;">Copy to Clipboard</button>';
    }
    
    if (actions.export) {
      actionHtml += '<button onclick="' + actions.export + '" style="padding: 8px 16px; background: #1B2A4A; color: white; border: none; border-radius: 4px; cursor: pointer;">Export</button>';
    }
    
    actionHtml += '</div>';
  }
  
  container.innerHTML = '<div class="ai-response" style="padding: 20px; background: #f9f9f9; border-left: 4px solid #2EC4B6; border-radius: 4px;">' +
    '<div style="line-height: 1.6; color: #333;">' + response.replace(/\n/g, '<br>') + '</div>' +
    actionHtml +
    '</div>';
  
  container.style.display = 'block';
}

function showAIError(containerId, error) {
  var container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '<div class="ai-error" style="padding: 15px; background: #fff3cd; border-left: 4px solid #E8622A; border-radius: 4px;">' +
    '<div style="color: #856404; font-weight: bold;">⚠ Error</div>' +
    '<div style="color: #856404; margin-top: 5px; font-size: 14px;">' + error + '</div>' +
    '</div>';
  
  container.style.display = 'block';
}

function renderAISettings() {
  var settingsHtml = '<div class="ai-settings" style="padding: 20px; background: #f5f5f5; border-radius: 6px;">' +
    '<h3 style="margin-top: 0;">AI Integration Settings</h3>' +
    
    '<div style="margin-bottom: 20px;">' +
      '<label style="display: block; margin-bottom: 5px; font-weight: bold;">AI Provider</label>' +
      '<select id="ai-provider" onchange="AI_CONFIG.provider = this.value; saveAISettings();" style="padding: 8px; width: 100%; max-width: 300px; border: 1px solid #ddd; border-radius: 4px;">' +
        '<option value="groq" ' + (AI_CONFIG.provider === 'groq' ? 'selected' : '') + '>Groq (Free Llama 3.3)</option>' +
        '<option value="cloudflare" ' + (AI_CONFIG.provider === 'cloudflare' ? 'selected' : '') + '>Cloudflare Workers AI</option>' +
      '</select>' +
      '<p style="font-size: 12px; color: #666; margin-top: 5px;">Groq offers free inference with high rate limits. Get a free API key at <a href="https://console.groq.com" target="_blank">console.groq.com</a></p>' +
    '</div>' +
    
    '<div style="margin-bottom: 20px;">' +
      '<label style="display: block; margin-bottom: 5px; font-weight: bold;">Groq API Key</label>' +
      '<input type="password" id="ai-groq-key" value="' + (AI_CONFIG.groqApiKey.substring(0, 10) + '...' || '') + '" placeholder="Enter your Groq API key" style="padding: 8px; width: 100%; max-width: 400px; border: 1px solid #ddd; border-radius: 4px;">' +
      '<p style="font-size: 12px; color: #666; margin-top: 5px;"><a href="https://console.groq.com/keys" target="_blank">Get free API key</a> from Groq console (free tier: 30 requests/min)</p>' +
    '</div>' +
    
    '<div style="margin-bottom: 20px;">' +
      '<label style="display: block; margin-bottom: 5px; font-weight: bold;">Cloudflare Token (Optional)</label>' +
      '<input type="password" id="ai-cf-token" value="' + (AI_CONFIG.cloudflareToken.substring(0, 10) + '...' || '') + '" placeholder="Enter Cloudflare token for fallback" style="padding: 8px; width: 100%; max-width: 400px; border: 1px solid #ddd; border-radius: 4px;">' +
      '<p style="font-size: 12px; color: #666; margin-top: 5px;">Optional. If set, used as fallback if Groq is unavailable.</p>' +
    '</div>' +
    
    '<div style="margin-bottom: 20px;">' +
      '<button onclick="saveAIConfiguration()" style="padding: 10px 20px; background: #1B2A4A; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Save Settings</button>' +
      '<button onclick="clearAICache()" style="margin-left: 10px; padding: 10px 20px; background: #ccc; color: #333; border: none; border-radius: 4px; cursor: pointer;">Clear Response Cache</button>' +
    '</div>' +
    
    '<div style="padding: 12px; background: #e7f3ff; border-left: 4px solid #2196F3; border-radius: 4px;">' +
      '<p style="margin: 0; font-size: 13px; color: #1565c0;"><strong>Note:</strong> Your API keys are stored locally in your browser and never sent to our servers.</p>' +
    '</div>' +
  '</div>';
  
  return settingsHtml;
}

function saveAIConfiguration() {
  var groqKey = document.getElementById('ai-groq-key').value;
  var cfToken = document.getElementById('ai-cf-token').value;
  
  if (groqKey && !groqKey.includes('...')) {
    AI_CONFIG.groqApiKey = groqKey;
  }
  
  if (cfToken && !cfToken.includes('...')) {
    AI_CONFIG.cloudflareToken = cfToken;
  }
  
  saveAISettings();
  
  var confirmDiv = document.createElement('div');
  confirmDiv.style.cssText = 'padding: 12px; background: #d4edda; color: #155724; border-radius: 4px; margin-top: 10px;';
  confirmDiv.textContent = '✓ Settings saved successfully.';
  
  var settingsContainer = document.querySelector('.ai-settings');
  if (settingsContainer) {
    settingsContainer.parentNode.insertBefore(confirmDiv, settingsContainer.nextSibling);
    setTimeout(function() { confirmDiv.remove(); }, 3000);
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

initializeAISettings();

// Export functions as globals for use in builder.js
if (typeof window !== 'undefined') {
  window.AI_ENGINE = {
    // Configuration
    getConfig: function() { return AI_CONFIG; },
    saveSettings: saveAISettings,
    
    // Vision & Mission
    generateVisionStatement: generateVisionStatement,
    generateMissionStatement: generateMissionStatement,
    scoreClarity: scoreClarity,
    
    // Values
    clusterStakeholderValues: clusterStakeholderValues,
    generateValueDefinitions: generateValueDefinitions,
    suggestValueBehaviors: suggestValueBehaviors,
    
    // Capabilities
    assessCapabilityGaps: assessCapabilityGaps,
    suggestCompetencies: suggestCompetencies,
    
    // Domains
    clusterThemes: clusterThemes,
    suggestDomainNames: suggestDomainNames,
    validateDomainCount: validateDomainCount,
    
    // Goals
    generateSMARTGoals: generateSMARTGoals,
    evaluateGoalQuality: evaluateGoalQuality,
    alignGoalToVision: alignGoalToVision,
    
    // Forecasting
    forecastGoalProgress: forecastGoalProgress,
    generateScenarios: generateScenarios,
    recommendTargets: recommendTargets,
    sensitivityAnalysis: sensitivityAnalysis,
    
    // Alignment
    suggestDepartmentAlignment: suggestDepartmentAlignment,
    detectAlignmentGaps: detectAlignmentGaps,
    
    // Initiatives
    suggestInitiatives: suggestInitiatives,
    estimateImpactEffort: estimateImpactEffort,
    prioritizeInitiatives: prioritizeInitiatives,
    
    // Timeline
    generateTimeline: generateTimeline,
    identifyDependencies: identifyDependencies,
    flagRisks: flagRisks,
    
    // Review
    calculateFeasibilityScore: calculateFeasibilityScore,
    generateExecutiveSummary: generateExecutiveSummary,
    identifyPlanGaps: identifyPlanGaps,
    
    // UI
    showAILoading: showAILoading,
    showAIResponse: showAIResponse,
    showAIError: showAIError,
    renderAISettings: renderAISettings,
    saveAIConfiguration: saveAIConfiguration,
    clearCache: clearAICache
  };
}
