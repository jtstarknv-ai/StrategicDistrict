(function() {
  "use strict";

  var SUPABASE_URL = "https://mrdyxownxnyzjubvpwrk.supabase.co";
  var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZHl4b3dueG55emp1YnZwd3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MzYwODksImV4cCI6MjA4OTIxMjA4OX0.4TQomjn_4hu-5TrcyGi90wyv1HxxGKmEP1mu682hJHM";

  var sdAuth = {
    client: null,
    currentUser: null,
    currentSession: null,
    authStateCallbacks: [],

    init: function() {
      if (typeof window.supabase === "undefined") {
        console.error("Supabase client not loaded. Make sure to include the Supabase CDN before auth.js");
        return false;
      }

      this.client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      
      this.initAuthStateListener();
      this.updateHeaderOnLoad();
      
      return true;
    },

    initAuthStateListener: function() {
      var self = this;
      
      this.client.auth.onAuthStateChange(function(event, session) {
        self.currentSession = session;
        self.currentUser = session ? session.user : null;
        
        self.updateHeader();
        self.callAuthStateCallbacks(event, session);
      });
    },

    updateHeaderOnLoad: function() {
      var self = this;
      
      this.client.auth.getSession().then(function(result) {
        if (result.data && result.data.session) {
          self.currentSession = result.data.session;
          self.currentUser = result.data.session.user;
          self.updateHeader();
        }
      }).catch(function(error) {
        console.error("Error checking session:", error);
      });
    },

    updateHeader: function() {
      var authButtonsContainer = document.getElementById("auth-buttons");
      
      if (!authButtonsContainer) {
        return;
      }

      authButtonsContainer.innerHTML = "";

      if (this.currentUser) {
        var userName = this.currentUser.email || "User";
        
        var userNameSpan = document.createElement("span");
        userNameSpan.className = "header-user-name";
        userNameSpan.textContent = userName;

        var signOutBtn = document.createElement("a");
        signOutBtn.href = "#";
        signOutBtn.className = "header-link header-signout";
        signOutBtn.textContent = "Sign Out";
        
        var self = this;
        signOutBtn.addEventListener("click", function(e) {
          e.preventDefault();
          self.signOut();
        });

        var builderBtn = document.createElement("a");
        builderBtn.href = "/builder/plan-hub.html";
        builderBtn.className = "header-link header-builder";
        builderBtn.textContent = "Builder";

        authButtonsContainer.appendChild(userNameSpan);
        authButtonsContainer.appendChild(builderBtn);
        authButtonsContainer.appendChild(signOutBtn);
      } else {
        var signInBtn = document.createElement("a");
        signInBtn.href = "/login/";
        signInBtn.className = "header-link";
        signInBtn.textContent = "Sign In";

        var signUpBtn = document.createElement("a");
        signUpBtn.href = "/signup/";
        signUpBtn.className = "header-link header-signup-btn";
        signUpBtn.textContent = "Sign Up";

        authButtonsContainer.appendChild(signInBtn);
        authButtonsContainer.appendChild(signUpBtn);
      }
    },

    signUp: function(email, password, fullName, districtName) {
      var self = this;
      
      return this.client.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            district_name: districtName || "",
            plan_tier: "free",
            role: "free"
          }
        }
      }).then(function(result) {
        if (result.error) {
          return {
            success: false,
            error: result.error.message
          };
        }

        return {
          success: true,
          user: result.data.user,
          session: result.data.session
        };
      }).catch(function(error) {
        return {
          success: false,
          error: error.message
        };
      });
    },

    signIn: function(email, password) {
      var self = this;
      
      return this.client.auth.signInWithPassword({
        email: email,
        password: password
      }).then(function(result) {
        if (result.error) {
          return {
            success: false,
            error: result.error.message
          };
        }

        self.currentSession = result.data.session;
        self.currentUser = result.data.user;
        self.updateHeader();

        return {
          success: true,
          user: result.data.user,
          session: result.data.session
        };
      }).catch(function(error) {
        return {
          success: false,
          error: error.message
        };
      });
    },

    signOut: function() {
      var self = this;
      
      return this.client.auth.signOut().then(function(result) {
        self.currentSession = null;
        self.currentUser = null;
        self.updateHeader();
        
        window.location.href = "/";
        
        return {
          success: true
        };
      }).catch(function(error) {
        return {
          success: false,
          error: error.message
        };
      });
    },

    resetPasswordForEmail: function(email) {
      var redirectUrl = window.location.origin + "/reset-password/";
      
      return this.client.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      }).then(function(result) {
        if (result.error) {
          return {
            success: false,
            error: result.error.message
          };
        }

        return {
          success: true
        };
      }).catch(function(error) {
        return {
          success: false,
          error: error.message
        };
      });
    },

    getUser: function() {
      return this.currentUser;
    },

    getSession: function() {
      return this.currentSession;
    },

    getProfile: function() {
      if (!this.currentUser) {
        return Promise.resolve(null);
      }

      var userId = this.currentUser.id;
      
      return this.client
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()
        .then(function(result) {
          if (result.error) {
            console.error("Error fetching profile:", result.error);
            return null;
          }
          return result.data;
        })
        .catch(function(error) {
          console.error("Error fetching profile:", error);
          return null;
        });
    },

    isAuthenticated: function() {
      return this.currentUser !== null;
    },

    onAuthStateChange: function(callback) {
      this.authStateCallbacks.push(callback);
    },

    callAuthStateCallbacks: function(event, session) {
      var self = this;
      this.authStateCallbacks.forEach(function(callback) {
        callback(event, session);
      });
    }
  };

  window.sdAuth = sdAuth;
  window.signOut = function() { return sdAuth.signOut(); };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      sdAuth.init();
    });
  } else {
    sdAuth.init();
  }
})();
