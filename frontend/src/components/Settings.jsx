import React, { useState } from "react";
import { FaMoon, FaSun, FaBell, FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Settings({ onThemeChange }) {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordMismatch, setIsPasswordMismatch] = useState(false);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
    onThemeChange();
  };

  const handleNotificationChange = () => {
    setNotifications(!notifications);
  };

  const handleSaveSettings = () => {
    if (password !== confirmPassword) {
      setIsPasswordMismatch(true);
      return;
    }

    setIsPasswordMismatch(false);
    console.log("Settings saved");

    // Reset form (optional)
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto mt-24 bg-gradient-to-br from-white via-indigo-50 to-purple-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl shadow-xl transition-all duration-300">
      <Link to="/home" className="text-indigo-600 dark:text-indigo-300 hover:underline text-sm mb-6 inline-block">
        ← Back to Dashboard
      </Link>

      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">🔧 Settings</h2>

      {/* Theme & Notification Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Dark Mode */}
        <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-md font-semibold text-slate-700 dark:text-white">Dark Mode</h4>
              <p className="text-sm text-slate-500 dark:text-slate-300">Switch between light and dark themes</p>
            </div>
            <button
              onClick={handleThemeChange}
              className={`p-3 rounded-full transition-all ${
                darkMode ? "bg-yellow-400 hover:bg-yellow-500" : "bg-gray-300 hover:bg-gray-400"
              }`}
              title="Toggle Dark Mode"
            >
              {darkMode ? <FaSun className="text-white" /> : <FaMoon className="text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-5 bg-white dark:bg-gray-700 rounded-xl shadow">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-md font-semibold text-slate-700 dark:text-white">Notifications</h4>
              <p className="text-sm text-slate-500 dark:text-slate-300">Receive important updates</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications}
                onChange={handleNotificationChange}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:bg-indigo-600 relative transition-all duration-300">
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 transform peer-checked:translate-x-5"></span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow">
        <h3 className="text-lg font-bold text-slate-700 dark:text-white mb-6">👤 Account Settings</h3>

        {/* Email Input */}
        <div className="relative mb-5">
          <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="New Email Address"
            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Password Inputs */}
        <div className="relative mb-4">
          <FaLock className="absolute left-3 top-3 text-gray-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="relative mb-3">
          <FaLock className="absolute left-3 top-3 text-gray-400" />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-white"
          />
        </div>
        {isPasswordMismatch && (
          <p className="text-sm text-red-500 mb-4">⚠️ Passwords do not match!</p>
        )}

        <button
          onClick={handleSaveSettings}
          className="w-full mt-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all"
        >
          💾 Save Settings
        </button>
      </div>
    </div>
  );
}
