import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { Lock, Eye, EyeOff, AlertTriangle } from "lucide-react"; // ✨ Icons updated

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✨ State for password visibility
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // ✨ FIX: Pass state to trigger the success notification in App.jsx
      navigate("/dashboard", { state: { message: "Logged in successfully!" } });
    } catch (err) {
      console.error("Login error:", err);
      switch (err.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("Invalid email or password. Please try again.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/too-many-requests":
          setError("Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.");
          break;
        default:
          setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
      // ✨ FIX: Pass state to trigger the success notification in App.jsx
      navigate("/dashboard", { state: { message: "Logged in successfully!" } });
    } catch (err) {
      console.error("Google login error:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError("Failed to sign in with Google. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 relative overflow-hidden max-h-[90vh]">
      {/* Consistent animated background */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-100 dark:bg-indigo-900/30 rounded-full opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-100 dark:bg-purple-900/30 rounded-full opacity-50 translate-x-1/2 translate-y-1/2"></div>
      
      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors z-10"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
        Back to Home
      </Link>
      
      <div className="w-full max-w-md p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-fadeInUp mt-[7vh]">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-2xl">
            <Lock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-center text-slate-900 dark:text-white mb-2 tracking-tight">
          Welcome Back!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-center">
          Enter your credentials to access your dashboard.
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 text-sm flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500 dark:text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Your Email"
              className="w-full p-3 bg-transparent dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all duration-200 outline-none placeholder-slate-400 text-slate-800 dark:text-slate-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* ✨ Password input with visibility toggle */}
          <div className="relative">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 pr-12 bg-transparent dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all duration-200 outline-none placeholder-slate-400 text-slate-800 dark:text-slate-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Signing in...
              </span>
            ) : "Login"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-300 dark:border-slate-600"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">Or continue with</span></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-3 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          disabled={loading}
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5"/>
          Sign in with Google
        </button>

        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200">
            Sign Up
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}