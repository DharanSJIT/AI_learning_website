import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase"; // Adjust the path if needed
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Award,
  Target,
  BarChart2,
} from "lucide-react";
import { motion } from "framer-motion";

// ------------------------
// 🔹 UPDATED StatsCard Component for a more compact design
// ------------------------
const StatsCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-3">
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}
    >
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-xl font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  </div>
);

// ------------------------
// 🔹 Minimalistic ResultCard Component (No change from last version)
// ------------------------
const ResultCard = ({ result }) => {
  const date = result.createdAt?.toDate().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getScoreColorClass = (percentage) => {
    if (percentage >= 90) return "text-green-600 dark:text-green-400";
    if (percentage >= 70) return "text-blue-600 dark:text-blue-400";
    if (percentage >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getProgressBarColorClass = (percentage) => {
    if (percentage >= 90)
      return "bg-gradient-to-r from-green-400 to-emerald-500";
    if (percentage >= 70) return "bg-gradient-to-r from-blue-400 to-indigo-500";
    if (percentage >= 50)
      return "bg-gradient-to-r from-yellow-400 to-amber-500";
    return "bg-gradient-to-r from-red-400 to-rose-500";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 hover:shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {result.topic}
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={`text-xl font-bold ${getScoreColorClass(
              result.percentage
            )}`}
          >
            {result.percentage}%
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {result.score}/{result.totalQuestions}
          </span>
        </div>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
        <div
          className={`h-2.5 rounded-full ${getProgressBarColorClass(
            result.percentage
          )}`}
          style={{ width: `${result.percentage}%` }}
        />
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <Calendar className="w-3 h-3" />
        <span>{date || "N/A"}</span>
      </div>
    </div>
  );
};

// ------------------------
// 🔹 The Main History Page Component
// ------------------------
export default function QuizHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const resultsCollectionRef = collection(
        db,
        "users",
        user.uid,
        "quizResults"
      );
      const q = query(resultsCollectionRef, orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const historyData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHistory(historyData);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setHistory([]);
      setLoading(false);
    }
  }, [user]);

  const stats = useMemo(() => {
    if (history.length === 0) {
      return { total: 0, average: 0, best: 0 };
    }
    const total = history.length;
    const totalPercentage = history.reduce(
      (sum, result) => sum + result.percentage,
      0
    );
    const average = Math.round(totalPercentage / total);
    const best = Math.max(...history.map((result) => result.percentage));
    return { total, average, best };
  }, [history]);

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="absolute left-[3vw] top-24">
            <Link
              to="/home"
              className="inline-flex items-center text-blue-600 hover:underline mb-4 font-medium"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-center mt-4">
            Quiz History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg text-center">
            A record of all the quizzes you have completed.
          </p>
        </div>

        {/* Content Area */}
        {loading && (
          <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
            Loading history...
          </p>
        )}

        {!loading && !user && (
          <div
            className="flex items-start gap-4 p-6 text-sm text-yellow-800 rounded-lg bg-yellow-100 border-l-4 border-yellow-500 shadow-sm dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-600"
            role="alert"
          >
            <svg // Using inline SVG for the Exclamation Triangle Icon
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>

            <div>
              <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-200">
                Please Log In
              </h3>
              <p className="mt-1">
                Log in to see your saved quiz results and track your
                performance.
              </p>
            </div>
          </div>
        )}

        {!loading && user && history.length === 0 && (
          <div className="text-center bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-lg">
            <BookOpen className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" />
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mt-4">
              No History Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              You haven't completed any quizzes yet. Your results will appear
              here.
            </p>
            <Link
              to="/quiz-generator"
              className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
            >
              Take Your First Quiz
            </Link>
          </div>
        )}

        {!loading && user && history.length > 0 && (
          <div>
            {/* Performance Overview Stats */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                Performance Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {" "}
                {/* Reduced gap-6 to gap-4 */}
                <StatsCard
                  icon={BarChart2}
                  label="Total Quizzes"
                  value={stats.total}
                  color="bg-blue-500"
                />
                <StatsCard
                  icon={Target}
                  label="Average Score"
                  value={`${stats.average}%`}
                  color="bg-indigo-500"
                />
                <StatsCard
                  icon={Award}
                  label="Best Score"
                  value={`${stats.best}%`}
                  color="bg-emerald-500"
                />
              </div>
            </div>

            {/* History List */}
            <motion.div
              className="space-y-3" // Reduced space-y-4 to space-y-3
              initial="hidden"
              animate="visible"
              variants={listVariants}
            >
              {history.map((result) => (
                <motion.div key={result.id} variants={itemVariants}>
                  <ResultCard result={result} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
