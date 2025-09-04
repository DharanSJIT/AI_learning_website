import React, { useState, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { ArrowRightOnRectangleIcon, UserCircleIcon } from "@heroicons/react/24/solid";

// A reusable component for menu items
const DropdownItem = ({ icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
  >
    {icon}
    <span>{text}</span>
  </button>
);

export default function Navbar() {
  const [user] = useAuthState(auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle closing dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setIsDropdownOpen(false); // Close dropdown on logout
  };

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-8 
      flex items-center justify-between h-16 transition-all duration-500 ease-in-out
      ${isScrolled 
        ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-slate-200/70' 
        : 'bg-transparent'
      }
    `}>
      {/* Logo / Title */}
      <a href="/" className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
        🚀 AI-Learn
      </a>

      {/* Right side (Auth buttons) */}
      <div className="flex items-center">
        {!user ? (
          <button
            onClick={handleGoogleSignIn}
            className="group relative inline-flex items-center justify-center px-5 py-2.5 overflow-hidden rounded-lg bg-gradient-to-tr from-indigo-500 to-blue-500 text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
          >
            <span className="font-medium">Login with Google</span>
          </button>
        ) : (
          <div className="relative" ref={dropdownRef}>
            {/* Avatar Trigger */}
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 focus:outline-none"
            >
              <img
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=random`}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-transparent hover:border-indigo-400 transition-all duration-300 shadow-md"
              />
              <span className="hidden md:block text-slate-800 font-medium text-sm">
                {user.displayName || "Learner"}
              </span>
            </button>
            
            {/* Dropdown Menu */}
            <div className={`
              absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none
              transition-all duration-300 ease-in-out
              ${isDropdownOpen 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-95 pointer-events-none'
              }
            `}>
              <div className="py-2">
                <div className="px-4 py-3 border-b border-slate-200">
                  <p className="text-sm text-slate-500">Signed in as</p>
                  <p className="font-semibold text-slate-800 truncate">{user.email}</p>
                </div>
                <div className="py-1">
                  <DropdownItem 
                    icon={<UserCircleIcon className="h-5 w-5 text-slate-500" />}
                    text="Your Profile"
                    onClick={() => alert('Profile page coming soon!')} 
                  />
                  <DropdownItem 
                    icon={<ArrowRightOnRectangleIcon className="h-5 w-5 text-slate-500" />}
                    text="Logout"
                    onClick={handleLogout} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
