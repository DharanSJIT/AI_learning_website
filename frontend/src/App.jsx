import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

// Pages
import Welcome from "./pages/Welcome";
import Chat from "./pages/Chat";   // 👈 Added Chat page

// Components
import DashboardGrid from "./components/DashboardGrid";
import LearningPath from "./components/LearningPath";
import QuizGenerator from "./components/QuizGenerator";
import Notes from "./components/Notes";
import TodoList from "./components/TodoList";
import ChatAssistant from "./components/ChatAssistant";
import ProgressTracker from "./components/ProgressTracker";
import Bookmarks from "./components/Bookmarks";
import Settings from "./components/Settings";
import Summarization from "./components/Summarization";
import ImageExplanation from "./components/ImageExplanation";
import DocumentAnalyzer from "./components/DocumentAnalyzer";
import ATSResumeChecker from "./components/ATSResumeChecker";

export default function App() {
  const [user] = useAuthState(auth);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toast helper
  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  // Auth handlers
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      showToast("✅ Login successful!", "success");
    } catch (error) {
      console.error(error);
      showToast("❌ Login failed", "error");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToast("🚪 Logout successful!", "error");
    } catch (error) {
      console.error(error);
      showToast("❌ Logout failed", "error");
    }
  };

  // Theme toggle
  const handleThemeChange = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <Router>
      {/* Navbar */}
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 h-20
          flex justify-between items-center px-6
          transition-all duration-300
          ${
            isScrolled
              ? "bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700"
              : "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md"
          }
        `}
      >
        <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400">
          🚀 AI-powered Personalized Learning
        </h1>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              {/* User Info */}
              <span className="hidden md:block text-gray-700 dark:text-gray-300 font-medium">
                Hello, {user.displayName || "Learner"} 👋
              </span>

              {/* Avatar */}
              <div className="relative">
                <img
                  src={user.photoURL || "https://via.placeholder.com/32"}
                  alt="avatar"
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-indigo-200 dark:border-indigo-400 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-300 transition-all duration-300"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
            >
              Login / Signup
            </button>
          )}
        </div>
      </nav>

      {/* Toast */}
      {toast.message && (
        <div
          className={`fixed right-4 top-24 px-4 py-2 rounded-lg shadow-lg text-white transition-all duration-500 ease-in-out z-50
          ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {toast.message}
        </div>
      )}

      {/* Main */}
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<DashboardGrid user={user} />} />
          {/* Tool Routes */}
          <Route path="/learning-path" element={<LearningPath />} />
          <Route path="/quiz-generator" element={<QuizGenerator />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/todo-list" element={<TodoList />} />
          <Route path="/mentor" element={<ChatAssistant user={user} />} />
          <Route path="/progress-tracker" element={<ProgressTracker />} />
          <Route path="/ats-checker" element={<ATSResumeChecker />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          {/* Learning Resources */}
          <Route path="/summarization" element={<Summarization />} />
          <Route path="/image-analysis" element={<ImageExplanation />} />
          <Route path="/document-analyzer" element={<DocumentAnalyzer />} />
          <Route path="/settings" element={<Settings onThemeChange={handleThemeChange} />} />
          {/* New Chat Page */}
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>

      {/* Theme Toggle */}
      <button
        onClick={handleThemeChange}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none transition-all duration-300 transform hover:scale-110"
        title="Toggle Dark Mode"
      >
        {darkMode ? <span className="text-xl">🌙</span> : <span className="text-xl">🌞</span>}
      </button>
    </Router>
  );
}
