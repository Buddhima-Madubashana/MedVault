"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
const MenuIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);
const XIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
const MountainIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </svg>
);
const SunIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);
const MoonIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const navLinks = [
    {
      href: "#",
      label: "Doctor Panel",
    },
    {
      href: "#",
      label: "Nurse",
    },
    {
      href: "#",
      label: "Paitents",
    },
    // {
    //   href: "#",
    //   label: "Contact",
    // },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 dark:bg-black/80 backdrop-blur-sm dark:border-gray-700">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center gap-2">
              <MountainIcon className="w-6 h-6 text-gray-900 dark:text-white" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                MedVault
              </span>
            </a>
          </div>

          {}
          <nav className="items-center hidden gap-6 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-500 transition-colors duration-300 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="items-center justify-center hidden h-10 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 bg-gray-900 rounded-md sm:inline-flex dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              Log out
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
