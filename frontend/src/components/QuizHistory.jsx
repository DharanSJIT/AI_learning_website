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
  X,
  Clock,
  FileText,
  ArrowLeft,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ------------------------
// 🔹 Quiz Viewer Modal Component
// ------------------------
const QuizViewerModal = ({ isOpen, onClose, result }) => {
  if (!isOpen || !result || !result.questions) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {result.topic}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {result.score}/{result.totalQuestions} correct ({result.percentage}%)
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Quiz Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {result.questions.map((question, index) => {
                  const userAnswer = result.userAnswers ? result.userAnswers[index] : null;
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border-l-4 border-blue-500"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {question.question}
                        </h3>
                      </div>

                      <div className="space-y-2 ml-11">
                        {question.options && question.options.map((option, optionIndex) => {
                          const isSelected = userAnswer === option;
                          const isCorrectOption = option === question.correctAnswer;
                          
                          let optionClass = "p-3 rounded-lg border transition-colors ";
                          
                          if (isSelected && isCorrect) {
                            optionClass += "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:border-green-500 dark:text-green-300";
                          } else if (isSelected && !isCorrect) {
                            optionClass += "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-500 dark:text-red-300";
                          } else if (isCorrectOption) {
                            optionClass += "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:border-green-500 dark:text-green-300";
                          } else {
                            optionClass += "bg-white border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300";
                          }

                          return (
                            <div key={optionIndex} className={optionClass}>
                              <div className="flex items-center justify-between">
                                <span className="font-medium">
                                  {String.fromCharCode(65 + optionIndex)}. {option}
                                </span>
                                <div className="flex items-center gap-2">
                                  {isSelected && (
                                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                      Your Answer
                                    </span>
                                  )}
                                  {isCorrectOption && (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {question.explanation && (
                        <div className="mt-4 ml-11 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                            Explanation:
                          </h4>
                          <p className="text-blue-700 dark:text-blue-400">
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-center p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ------------------------
// 🔹 UPDATED StatsCard Component for a more compact design
// ------------------------
const StatsCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-3">
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}
    >
      <Icon className="w-4 h-4 text-white" />
    </div>
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-lg font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  </div>
);

// ------------------------
// 🔹 Enhanced ResultCard Component with Original Button Layout
// ------------------------
const ResultCard = ({ result, onViewQuiz }) => {
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

  const hasQuestions = result.questions && result.questions.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 hover:shadow-md">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            {result.topic}
          </h3>
          <div className="flex items-center gap-2 mb-2">
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
        
        {hasQuestions && (
          <button
            onClick={() => onViewQuiz(result)}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Quiz
          </button>
        )}
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
  const [selectedResult, setSelectedResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleViewQuiz = (result) => {
    setSelectedResult(result);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedResult(null);
  };

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
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="absolute left-[3vw] top-24">
            <Link
              to="/services"
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
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-center mt-4">
            Quiz History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-base text-center">
            Track your quiz performance and review past attempts
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
            className="flex items-start gap-4 p-4 text-sm text-yellow-800 rounded-lg bg-yellow-100 border-l-4 border-yellow-500 shadow-sm dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-600"
            role="alert"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="font-bold text-yellow-900 dark:text-yellow-200">
                Please Log In
              </h3>
              <p className="mt-1">
                Log in to see your saved quiz results and track your performance.
              </p>
            </div>
          </div>
        )}

        {!loading && user && history.length === 0 && (
          <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <BookOpen className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mt-3">
              No History Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              You haven't completed any quizzes yet. Your results will appear here.
            </p>
            <Link
              to="/quiz-generator"
              className="mt-4 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
            >
              Take Your First Quiz
            </Link>
          </div>
        )}

        {!loading && user && history.length > 0 && (
          <div>
            {/* Performance Overview Stats */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                Performance Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
              className="space-y-2"
              initial="hidden"
              animate="visible"
              variants={listVariants}
            >
              {history.map((result) => (
                <motion.div key={result.id} variants={itemVariants}>
                  <ResultCard result={result} onViewQuiz={handleViewQuiz} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>

      {/* Quiz Viewer Modal */}
      <QuizViewerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        result={selectedResult}
      />
    </div>
  );
}