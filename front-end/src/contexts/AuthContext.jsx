import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Helper to safely check token validity
  const checkTokenExpiration = (token) => {
    // 1. Safety Check: Must be a string
    if (!token || typeof token !== "string") return null;

    try {
      // 2. Decode
      const decoded = jwtDecode(token);
      if (!decoded || !decoded.exp) return null;

      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        // Token expired
        console.warn("Token expired, logging out.");
        logout();
      } else {
        // Token valid, set auto-logout timer
        const timeLeft = (decoded.exp - currentTime) * 1000;

        // Cap max timeout to avoid integer overflow (approx 24 days)
        const safeTimeLeft = Math.min(timeLeft, 2147483647);

        console.log(
          `Session valid. Expires in ${(safeTimeLeft / 1000 / 60).toFixed(1)} mins`,
        );

        const timer = setTimeout(() => {
          setSessionExpired(true);
          setTimeout(() => {
            setSessionExpired(false);
            logout();
          }, 5000);
        }, safeTimeLeft);

        return timer;
      }
    } catch (err) {
      // 3. Catch invalid token errors (garbage data)
      console.error("Invalid Token Data:", err.message);
      logout(); // Clear bad data immediately
    }
    return null;
  };

  useEffect(() => {
    let timer;
    if (token) {
      try {
        // 1. Initial Load from LocalStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setRole(parsedUser.role);
        }

        // 2. Fetch Fresh Profile (to handle Temp Admin status)
        fetch(`http://localhost:5000/api/users/${jwtDecode(token).id}`, {
             headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(updatedUser => {
           if (updatedUser && updatedUser._id) {
               setUser(updatedUser);
               // Promote role if Temp Admin
               if (updatedUser.role === "Doctor" && updatedUser.isTempAdmin && updatedUser.tempAdminExpiresAt) {
                   const expiry = new Date(updatedUser.tempAdminExpiresAt).getTime();
                   if (expiry > Date.now()) {
                       setRole("Admin"); // PROMOTE TO ADMIN
                       // Update LocalStorage to persist across refreshes
                       localStorage.setItem("user", JSON.stringify({...updatedUser, role: "Admin"}));
                   }
               } else {
                   setRole(updatedUser.role);
                   localStorage.setItem("user", JSON.stringify(updatedUser)); // Sync DB changes
               }
           }
        })
        .catch(err => console.error("Failed to refresh profile:", err));

        // 3. Initialize Timer
        timer = checkTokenExpiration(token);
      } catch (e) {
        console.error("Error restoring session:", e);
        logout();
      }
    }
    setLoading(false);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [token]);

  const login = (userData, authToken) => {
    if (!authToken || typeof authToken !== "string") {
      console.error("Login failed: Invalid token received", authToken);
      return;
    }
    setUser(userData);
    setRole(userData.role);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, role, token, login, logout, loading }}>
      {!loading && children}

      {/* Session Expired Overlay */}
      {sessionExpired && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-md"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center space-y-5"
            style={{ animation: "scaleIn 0.35s ease-out" }}
          >
            {/* Clock Icon */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Session Expired
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Your session has timed out for security reasons. You will be redirected to the login page shortly.
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full"
                style={{ animation: "shrink 5s linear forwards", width: "100%" }}
              />
            </div>

            <button
              onClick={() => {
                setSessionExpired(false);
                logout();
              }}
              className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md cursor-pointer"
            >
              Return to Login
            </button>
          </div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleIn {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
            }
            @keyframes shrink {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
