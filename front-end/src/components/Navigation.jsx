"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  Home,
  Users,
  Folder,
  Calendar,
  User,
} from "lucide-react";
export default function Header4() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);
  const user = {
    email: "user@example.com",
    displayName: "User",
    photoURL: "https://placehold.co/100x100/EFEFEF/4A4A4A?text=U",
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsUserDropdownOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsUserDropdownOpen(false);
    }, 150);
  };
  const handleDropdownClick = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };
  const navItems = [
    {
      name: "Dashboard",
      icon: Home,
    },
    {
      name: "Team",
      icon: Users,
    },
    {
      name: "Projects",
      icon: Folder,
    },
    {
      name: "Calendar",
      icon: Calendar,
    },
  ];
  return (
    <div className="mx-4 mt-2 font-sans sm:mx-6">
      <header className="relative">
        <div className="p-4 text-white bg-black border border-gray-800 shadow-2xl rounded-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {}
            <div className="flex items-center space-x-2 sm:space-x-8">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
                <div className="w-4 h-4 transform bg-white rounded-sm rotate-12"></div>
              </div>

              <nav className="hidden space-x-1 lg:flex">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setActiveTab(item.name)}
                      className={`
                        flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300
                        ${
                          activeTab === item.name
                            ? "bg-gray-800 text-white"
                            : "text-gray-400 hover:text-white hover:bg-gray-900"
                        }
                      `}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  );
                })}
              </nav>

              {}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 transition-all duration-300 bg-gray-900 border border-gray-700 lg:hidden rounded-xl hover:bg-gray-800"
              >
                <div className="flex flex-col items-center justify-center w-5 h-5">
                  <div
                    className={`w-4 h-0.5 bg-white transition-all duration-300 ${
                      isMobileMenuOpen ? "rotate-45 translate-y-0.5" : ""
                    }`}
                  ></div>
                  <div
                    className={`w-4 h-0.5 bg-white mt-1 transition-all duration-300 ${
                      isMobileMenuOpen ? "opacity-0" : ""
                    }`}
                  ></div>
                  <div
                    className={`w-4 h-0.5 bg-white mt-1 transition-all duration-300 ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                    }`}
                  ></div>
                </div>
              </button>
            </div>

            {}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative hidden sm:block">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  className="w-40 py-2 pl-10 pr-4 text-white placeholder-gray-500 transition-all duration-300 bg-gray-900 border border-gray-700  rounded-xl md:w-64 focus:outline-none focus:ring-2 focus:ring-gray-600"
                />
              </div>

              <button className="p-2 transition-all duration-300 bg-gray-900 border border-gray-700 sm:hidden rounded-xl hover:bg-gray-800">
                <Search className="w-5 h-5 text-gray-400" />
              </button>

              <button className="relative p-2 transition-all duration-300 bg-gray-900 border border-gray-700  rounded-xl hover:bg-gray-800 group">
                <Bell className="w-5 h-5 text-gray-400 transition-colors group-hover:text-white" />
              </button>

              {}
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center p-2 space-x-1 transition-all duration-300 cursor-pointer sm:space-x-3 hover:bg-gray-900 rounded-xl"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleDropdownClick}
                >
                  <div className="flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-800 border border-gray-700 rounded-full">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="User avatar"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 hidden sm:block transition-transform duration-300 ${
                      isUserDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {}
                {isUserDropdownOpen && (
                  <div
                    className="absolute right-0 z-50 w-64 py-2 mt-2 bg-black border border-gray-800 shadow-2xl rounded-xl"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-800 border border-gray-700 rounded-full">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt="User avatar"
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <User className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">
                            {user.displayName || "User"}
                          </p>
                          <p className="text-sm text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {}
          {isMobileMenuOpen && (
            <div className="pt-4 mt-4 border-t border-gray-800 lg:hidden">
              <nav className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveTab(item.name);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`
                        flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300
                        ${
                          activeTab === item.name
                            ? "bg-gray-800 text-white"
                            : "text-gray-400 hover:text-white hover:bg-gray-900"
                        }
                      `}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
