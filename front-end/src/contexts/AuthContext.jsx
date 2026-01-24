"use client";
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null); // null, "Admin", "Doctor", "Nurse"

  const login = (email) => {
    const lowerEmail = email.toLowerCase().trim();

    if (lowerEmail === "admin@medvault.com") {
      setRole("Admin");
    } else if (lowerEmail === "doctor@medvault.com") {
      setRole("Doctor");
    } else if (lowerEmail === "nurse@medvault.com") {
      setRole("Nurse");
    } else {
      setRole(null); // Invalid
    }
  };

  const logout = () => {
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
