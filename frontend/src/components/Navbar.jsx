import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

import { 
  ArrowRightOnRectangleIcon, 
  UserCircleIcon, 
  HomeIcon, 
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon
} from "@heroicons/react/24/solid";

// Reusable dropdown item component
const DropdownItem = ({ icon, text, onClick, textColor = "text-slate-700" }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm ${textColor} hover:bg-slate-100 transition-colors duration-200 rounded-md mx-1`}
  >
    {icon}
    <span className="font-medium">{text}</span>
  </button>
);

// Navigation link component
const NavLink = ({ to, children, currentPath, onClick }) => {
  const isActive = currentPath === to;
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-300 ${
        isActive
          ? 'text-blue-600 bg-blue-50 shadow-sm'
          : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      {children}
    </button>
  );
};

export default function Navbar() {
  const [user, loading] = useAuthState(auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigation handlers
  const handleLogin = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handleSignUp = () => {
    navigate("/signup");
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      navigate("/"); 
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const handleLogoClick = () => {
    navigate(user ? "/dashboard" : "/");
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleProfile = () => {
    handleNavigation("/profile");
  };

  const handleSettings = () => {
    handleNavigation("/settings");
  };

  // Navigation items
  const navigationItems = [
    { path: "/dashboard", label: "Home", icon: HomeIcon },
    { path: "/services", label: "Services", icon: Cog6ToothIcon },
    { path: "/explore", label: "Explore", icon: UserCircleIcon },
    { path: "/JharkhandInfo", label: "Overviews", icon: UserCircleIcon },
  ];

  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 bg-white shadow-md">
        <div className="animate-pulse flex space-x-4">
          <div className="h-6 bg-slate-200 rounded w-32"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-8 
        flex items-center justify-between h-16 transition-all duration-500 ease-in-out
        ${isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-slate-200' 
          : 'bg-white shadow-lg'
        }
      `}>
        {/* Logo */}
        <button 
          onClick={handleLogoClick}
          className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
        >
          AI Learning
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              currentPath={location.pathname}
              onClick={() => handleNavigation(item.path)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              {/* Desktop Auth */}
              <div className="hidden sm:flex items-center gap-3">
                <button onClick={handleLogin} className="px-4 py-2.5 font-medium text-slate-700 hover:text-blue-600 transition-colors duration-300">Login</button>
                <button onClick={handleSignUp} className="px-5 py-2.5 rounded-lg bg-gradient-to-tr from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">Sign Up</button>
              </div>
              {/* Mobile Auth Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </>
          ) : (
            <>
              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                    {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-slate-700 font-medium text-sm max-w-32 truncate">
                    {user.displayName || user.email?.split('@')[0] || "User"}
                  </span>
                  <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <div className={`absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-2xl ring-1 ring-black/10 transition-all ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                  <div className="p-2">
                    <div className="px-3 py-3 border-b border-slate-100 mb-2">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="font-semibold">{user.email}</p>
                    </div>
                    <DropdownItem icon={<UserCircleIcon className="h-5 w-5 text-slate-500" />} text="Your Profile" onClick={handleProfile} />
                    <DropdownItem icon={<Cog6ToothIcon className="h-5 w-5 text-slate-500" />} text="Settings" onClick={handleSettings} />
                    <div className="border-t border-slate-100 mt-2 pt-2">
                      <DropdownItem icon={<ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500" />} text="Logout" textColor="text-red-600" onClick={handleLogout} />
                    </div>
                  </div>
                </div>
              </div>
              {/* Mobile Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`
        fixed inset-0 z-40 lg:hidden transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        
        {/* Mobile Menu Panel */}
        <div 
          ref={mobileMenuRef}
          className={`
            absolute top-16 left-4 right-4 bg-white rounded-2xl shadow-2xl ring-1 ring-black/10 overflow-hidden
            transition-all duration-300 ease-in-out transform
            ${isMobileMenuOpen ? 'translate-y-0 scale-100' : '-translate-y-4 scale-95'}
          `}
        >
          <div className="p-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-2 mb-4">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium transition-all duration-200
                      ${isActive
                        ? 'text-blue-600 bg-blue-50 shadow-sm'
                        : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                      }
                    `}
                  >
                    <IconComponent className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile Auth Buttons */}
            {!user && (
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <button
                  onClick={handleLogin}
                  className="w-full px-4 py-3 text-slate-700 font-medium hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={handleSignUp}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
