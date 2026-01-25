// front-end/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds the full user object (including _id)
  const [role, setRole] = useState(null);

  // Check Local Storage on Load
  useEffect(() => {
    const storedUser = localStorage.getItem("medvault_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setRole(parsedUser.role);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save to state and local storage
        setRole(data.user.role);
        setUser(data.user);
        localStorage.setItem("medvault_token", data.token);
        localStorage.setItem("medvault_user", JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Server error" };
    }
  };

  const logout = () => {
    setRole(null);
    setUser(null);
    localStorage.removeItem("medvault_token");
    localStorage.removeItem("medvault_user");
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
