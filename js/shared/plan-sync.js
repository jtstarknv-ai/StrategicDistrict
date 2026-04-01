/**
 * Plan Sync Library - Cloud persistence for Strategic District builders
 * Saves plans to Supabase (cloud) with localStorage as fast cache.
 * Plans survive browser cache clears, work across devices.
 */
(function() {
    "use strict";

    var DEBOUNCE_MS = 2000; // Auto-save debounce (2 seconds after last change)
    var saveTimers = {};

    var planSync = {

        /**
         * Save plan to both localStorage (fast cache) and Supabase (permanent).
         * @param {string} planType - 'district' or 'school'
         * @param {string} storageKey - localStorage key
         * @param {object} planState - the plan data object
         * @param {string} planName - human-readable plan name
         */
        save: function(planType, storageKey, planState, planName) {
            // Always save to localStorage immediately (fast cache)
            try {
                localStorage.setItem(storageKey, JSON.stringify(planState));
            } catch(e) {
                console.warn('localStorage save failed:', e);
            }

            // Debounce the cloud save to avoid hammering Supabase on every keystroke
            if (saveTimers[planType]) {
                clearTimeout(saveTimers[planType]);
            }
            saveTimers[planType] = setTimeout(function() {
                planSync._saveToCloud(planType, storageKey, planState, planName);
            }, DEBOUNCE_MS);
        },

        /**
         * Save immediately to cloud (no debounce). Use for explicit "Save" button clicks.
         */
        saveNow: function(planType, storageKey, planState, planName) {
            try {
                localStorage.setItem(storageKey, JSON.stringify(planState));
            } catch(e) {
                console.warn('localStorage save failed:', e);
            }
            return planSync._saveToCloud(planType, storageKey, planState, planName);
        },

        /**
         * Load plan: try Supabase first (authoritative), fall back to localStorage.
         * @param {string} planType - 'district' or 'school'
         * @param {string} storageKey - localStorage key
         * @returns {Promise<object|null>} - plan data or null
         */
        load: function(planType, storageKey) {
            return planSync._loadFromCloud(planType).then(function(cloudData) {
                if (cloudData) {
                    // Cloud data found - update localStorage cache and return it
                    try {
                        localStorage.setItem(storageKey, JSON.stringify(cloudData));
                    } catch(e) {}
                    return cloudData;
                }

                // No cloud data - try localStorage as fallback
                var localData = planSync._loadFromLocal(storageKey);
                if (localData) {
                    // Migrate local-only data to cloud
                    planSync._saveToCloud(planType, storageKey, localData, localData.planName || 'My Plan');
                }
                return localData;
            }).catch(function(err) {
                console.warn('Cloud load failed, using localStorage:', err);
                return planSync._loadFromLocal(storageKey);
            });
        },

        /**
         * Load synchronously from localStorage only (for initial render before async completes)
         */
        loadLocal: function(storageKey) {
            return planSync._loadFromLocal(storageKey);
        },

        /**
         * Internal: save to Supabase with automatic version history
         */
        _saveToCloud: function(planType, storageKey, planState, planName) {
            if (!window.sdAuth || !window.sdAuth.currentUser || !window.sdAuth.client) {
                return Promise.resolve(null);
            }

            var userId = window.sdAuth.currentUser.id;
            var client = window.sdAuth.client;

            // Check if plan already exists for this user + type
            return client
                .from('saved_plans')
                .select('id, plan_data, current_version')
                .eq('user_id', userId)
                .eq('plan_type', planType)
                .then(function(result) {
                    if (result.error) {
                        console.error('Cloud save query error:', result.error);
                        return null;
                    }

                    var existingId = (result.data && result.data.length > 0) ? result.data[0].id : null;
                    var existingData = (result.data && result.data.length > 0) ? result.data[0].plan_data : null;
                    var currentVersion = (result.data && result.data.length > 0) ? (result.data[0].current_version || 1) : 0;

                    if (existingId) {
                        // Snapshot the previous version before overwriting
                        var versionPromise = existingData
                            ? client.from('sd_plan_versions').insert({
                                plan_id: existingId,
                                plan_type: planType,
                                version_number: currentVersion,
                                plan_data: existingData,
                                plan_name: planName || 'My Plan',
                                created_by: userId,
                                change_summary: 'Auto-saved version ' + currentVersion
                            })
                            : Promise.resolve(null);

                        return versionPromise.then(function() {
                            var newVersion = currentVersion + 1;
                            // UPDATE existing plan with new data and bumped version
                            return client
                                .from('saved_plans')
                                .update({
                                    plan_data: planState,
                                    plan_name: planName || 'My Plan',
                                    current_version: newVersion,
                                    updated_at: new Date().toISOString()
                                })
                                .eq('id', existingId)
                                .then(function(updateResult) {
                                    if (updateResult.error) {
                                        console.error('Cloud update error:', updateResult.error);
                                        return null;
                                    }
                                    planSync._showSaveIndicator('saved');
                                    return existingId;
                                });
                        });
                    } else {
                        // INSERT new plan (version 1, no previous version to snapshot)
                        return client
                            .from('saved_plans')
                            .insert({
                                user_id: userId,
                                plan_type: planType,
                                plan_name: planName || 'My Plan',
                                plan_data: planState,
                                current_version: 1,
                                is_finalized: false
                            })
                            .select('id')
                            .then(function(insertResult) {
                                if (insertResult.error) {
                                    console.error('Cloud insert error:', insertResult.error);
                                    return null;
                                }
                                planSync._showSaveIndicator('saved');
                                return (insertResult.data && insertResult.data[0]) ? insertResult.data[0].id : null;
                            });
                    }
                })
                .catch(function(err) {
                    console.error('Cloud save failed:', err);
                    return null;
                });
        },

        /**
         * Internal: load from Supabase
         */
        _loadFromCloud: function(planType) {
            if (!window.sdAuth || !window.sdAuth.currentUser || !window.sdAuth.client) {
                return Promise.resolve(null);
            }

            var userId = window.sdAuth.currentUser.id;
            var client = window.sdAuth.client;

            return client
                .from('saved_plans')
                .select('plan_data, plan_name, updated_at')
                .eq('user_id', userId)
                .eq('plan_type', planType)
                .order('updated_at', { ascending: false })
                .limit(1)
                .then(function(result) {
                    if (result.error) {
                        console.error('Cloud load error:', result.error);
                        return null;
                    }
                    if (result.data && result.data.length > 0) {
                        return result.data[0].plan_data;
                    }
                    return null;
                })
                .catch(function(err) {
                    console.error('Cloud load failed:', err);
                    return null;
                });
        },

        /**
         * Internal: load from localStorage
         */
        _loadFromLocal: function(storageKey) {
            try {
                var stored = localStorage.getItem(storageKey);
                if (stored) {
                    return JSON.parse(stored);
                }
            } catch(e) {
                console.warn('localStorage load failed:', e);
            }
            return null;
        },

        /**
         * Get version history for a plan
         * @param {string} planType - 'district' or 'school'
         * @returns {Promise<Array>} - array of version objects
         */
        getVersionHistory: function(planType) {
            if (!window.sdAuth || !window.sdAuth.currentUser || !window.sdAuth.client) {
                return Promise.resolve([]);
            }

            var userId = window.sdAuth.currentUser.id;
            var client = window.sdAuth.client;

            // First get the plan ID
            return client
                .from('saved_plans')
                .select('id, current_version')
                .eq('user_id', userId)
                .eq('plan_type', planType)
                .then(function(result) {
                    if (result.error || !result.data || result.data.length === 0) {
                        return [];
                    }
                    var planId = result.data[0].id;

                    return client
                        .from('sd_plan_versions')
                        .select('id, version_number, plan_name, change_summary, created_at')
                        .eq('plan_id', planId)
                        .order('version_number', { ascending: false })
                        .limit(50)
                        .then(function(vResult) {
                            if (vResult.error) return [];
                            return vResult.data || [];
                        });
                })
                .catch(function() { return []; });
        },

        /**
         * Restore a specific version
         * @param {string} versionId - UUID of the version to restore
         * @param {string} planType - 'district' or 'school'
         * @param {string} storageKey - localStorage key
         * @returns {Promise<object|null>} - restored plan data
         */
        restoreVersion: function(versionId, planType, storageKey) {
            if (!window.sdAuth || !window.sdAuth.client) {
                return Promise.resolve(null);
            }

            var client = window.sdAuth.client;

            return client
                .from('sd_plan_versions')
                .select('plan_data, version_number')
                .eq('id', versionId)
                .single()
                .then(function(result) {
                    if (result.error || !result.data) return null;

                    var restoredData = result.data.plan_data;
                    // Save restored version as current (which will snapshot the current first)
                    planSync.saveNow(planType, storageKey, restoredData, restoredData.planName || 'Restored Plan');
                    return restoredData;
                })
                .catch(function() { return null; });
        },

        /**
         * Show a small save status indicator
         */
        _showSaveIndicator: function(status) {
            var indicator = document.getElementById('planSyncIndicator');
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'planSyncIndicator';
                indicator.style.cssText = 'position:fixed;bottom:20px;right:20px;padding:8px 16px;border-radius:8px;font-size:0.8125rem;font-weight:600;z-index:9999;transition:opacity 0.3s;pointer-events:none;';
                document.body.appendChild(indicator);
            }

            if (status === 'saved') {
                indicator.textContent = 'Plan saved to cloud';
                indicator.style.backgroundColor = 'rgba(110,207,110,0.15)';
                indicator.style.color = '#2e7d32';
                indicator.style.border = '1px solid rgba(110,207,110,0.3)';
            } else if (status === 'saving') {
                indicator.textContent = 'Saving...';
                indicator.style.backgroundColor = 'rgba(0,180,204,0.1)';
                indicator.style.color = '#00839e';
                indicator.style.border = '1px solid rgba(0,180,204,0.2)';
            }

            indicator.style.opacity = '1';
            setTimeout(function() {
                indicator.style.opacity = '0';
            }, 2500);
        }
    };

    window.planSync = planSync;
})();
