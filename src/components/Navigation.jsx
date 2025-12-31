import React, { useState } from "react";
import { Scissors, Menu, LogOut, Lock } from "lucide-react";

export default function Navigation({
  activeSection,
  scrollToSection,
  isAdminMode,
  onAdminClick,
  isAuthenticated,
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (section) => {
    scrollToSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => scrollToSection("home")}
          >
            <Scissors className="w-8 h-8 text-pink-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              The Pebbles Unisex Salon
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {[
              "home",
              "services",
              "booking",
              "reviews",
              "contact",
              "status",
            ].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`capitalize transition-colors ${
                  activeSection === section
                    ? "text-pink-600 font-semibold"
                    : "text-gray-700 hover:text-pink-600"
                }`}
              >
                {section === "status" ? "Check Status" : section}
              </button>
            ))}

            {/* Admin Button */}
            {!isAuthenticated ? (
              <button
                onClick={onAdminClick}
                className="flex items-center space-x-1 text-gray-700 hover:text-pink-600 transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>Admin</span>
              </button>
            ) : (
              <>
                <button
                  onClick={onAdminClick}
                  className={`flex items-center space-x-1 transition-colors ${
                    isAdminMode
                      ? "text-pink-600 font-semibold"
                      : "text-gray-700 hover:text-pink-600"
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>{isAdminMode ? "Close Panel" : "Admin Panel"}</span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {[
              "home",
              "services",
              "booking",
              "reviews",
              "contact",
              "status",
            ].map((section) => (
              <button
                key={section}
                onClick={() => handleNavClick(section)}
                className={`block w-full text-left px-4 py-2 capitalize rounded transition-colors ${
                  activeSection === section
                    ? "bg-pink-50 text-pink-600 font-semibold"
                    : "hover:bg-pink-50"
                }`}
              >
                {section === "status" ? "Check Status" : section}
              </button>
            ))}

            {!isAuthenticated ? (
              <button
                onClick={() => {
                  onAdminClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full text-left px-4 py-2 hover:bg-pink-50 rounded"
              >
                <Lock className="w-4 h-4" />
                <span>Admin Login</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    onAdminClick();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 w-full text-left px-4 py-2 rounded ${
                    isAdminMode
                      ? "bg-pink-50 text-pink-600 font-semibold"
                      : "hover:bg-pink-50"
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isAdminMode ? "Close Admin Panel" : "Open Admin Panel"}
                  </span>
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
