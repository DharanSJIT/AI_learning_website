import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

// A new clipboard icon component for registration
const ClipboardListIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-slate-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
);

// Google G Logo SVG
const GoogleIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M46.995 24.3c0-1.56-.135-3.12-.405-4.635H24v8.775h12.915c-.54 2.835-2.115 5.265-4.635 6.93v5.67h7.29c4.275-3.96 6.75-9.945 6.75-16.74z"
      fill="#4285F4"
    />
    <path
      d="M24 48c6.435 0 11.88-2.115 15.84-5.715l-7.29-5.67c-2.115 1.44-4.86 2.3-7.56 2.3-5.805 0-10.71-3.915-12.465-9.18H4.05v5.85C7.965 42.48 15.435 48 24 48z"
      fill="#34A853"
    />
    <path
      d="M11.535 28.98c-.45-.9-.72-2.25-.72-3.15s.27-2.25.72-3.15v-5.85H4.05C2.835 19.8 2 21.825 2 24.015c0 2.19.84 4.23 2.055 5.85l7.485-5.865z"
      fill="#FBBC05"
    />
    <path
      d="M24 9.48c3.465 0 6.57 1.17 9.045 3.645l6.435-6.48C35.835 2.88 30.435 0 24 0 15.435 0 7.965 5.52 4.05 13.005l7.485 5.85c1.755-5.265 6.66-9.18 12.465-9.18z"
      fill="#EA4335"
    />
  </svg>
);

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email address is already in use.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/weak-password":
          setError("Password is too weak. Please choose a stronger one.");
          break;
        default:
          setError("Failed to create an account. Please try again.");
          break;
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (err) {
      setError("Failed to sign up with Google. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-slate-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-700">
        <div className="absolute left-[4vw] top-[12vh]">
          <Link
            to="/home"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <ClipboardListIcon /> {/* <-- UPDATED ICON */}
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Create an Account
          </h1>
          <p className="mt-2 text-slate-500 dark:text-gray-400">
            Join our community to start your learning journey.
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg dark:bg-red-900/30 dark:text-red-300 dark:border-red-500/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-slate-600 dark:text-gray-300"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-slate-600 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="•••••••• (min. 6 characters)"
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block mb-2 text-sm font-medium text-slate-600 dark:text-gray-300"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg active:scale-95" // <-- UPDATED COLOR
          >
            Create Account
          </button>
        </form>

        <div className="flex items-center">
          <hr className="flex-grow border-slate-200 dark:border-gray-600" />
          <span className="mx-4 text-sm font-medium text-slate-400 dark:text-gray-500">
            OR
          </span>
          <hr className="flex-grow border-slate-200 dark:border-gray-600" />
        </div>

        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-white font-semibold py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-600 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md active:scale-95"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-600 font-semibold hover:underline dark:text-emerald-500"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
