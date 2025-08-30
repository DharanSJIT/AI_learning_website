import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

export default function Navbar() {
  const [user] = useAuthState(auth);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
  };

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50 w-full px-6 py-4 
      flex items-center justify-between transition-all duration-300
      ${isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-white/90 backdrop-blur-sm shadow-md'
      }
    `}>
      {/* Logo / Title */}
      <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
        🚀 AI-powered Personalized Learning
      </h1>

      {/* Right side (Auth buttons) */}
      <div className="flex items-center">
        {!user ? (
          <button
            onClick={handleGoogleSignIn}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
          >
            Login / Signup
          </button>
        ) : (
          <div className="flex items-center space-x-3 lg:space-x-4">
            {/* Welcome Text - Hidden on small screens */}
            <span className="hidden md:block text-slate-700 font-medium">
              Hello, {user.displayName || "Learner"} 👋
            </span>
            
            {/* User Avatar */}
            <div className="relative">
              <img
                src={user.photoURL || "https://via.placeholder.com/32"}
                alt="avatar"
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-indigo-200 shadow-sm hover:border-indigo-400 transition-all duration-300"
              />
              {/* Online indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-3 lg:px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium text-sm lg:text-base"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
