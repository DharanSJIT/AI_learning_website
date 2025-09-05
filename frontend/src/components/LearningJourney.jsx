import React from "react";
import { useNavigate } from "react-router-dom";
// --- Ensure these icons are imported in your DashboardGrid or relevant parent component ---
import { ListChecks, BrainCircuit, Target } from "lucide-react";

// A smaller, more compact version of the stat item
const JourneyStat = ({ icon: Icon, value, label, color }) => (
  <div className="flex items-center gap-3">
    <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${color.bg}`}>
      <Icon className={`w-4 h-4 ${color.text}`} />
    </div>
    <div>
      <span className="font-semibold text-gray-800 dark:text-white">{value}</span>
      <span className="ml-1.5 text-sm text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  </div>
);

// This is the main component with adjusted sizes
export default function LearningJourney({ stats }) {
  const navigate = useNavigate();

  if (!stats) return null;

  return (
    <div className="mt-16 mb-12">
      <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Side: Text Content & Stats */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your Learning Journey
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-5 max-w-lg">
              Here’s a snapshot of your achievements so far. Keep up the great work!
            </p>
            <div className="space-y-3">
              <JourneyStat
                icon={ListChecks}
                value={stats.completedTasks}
                label="tasks completed"
                color={{ bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400" }}
              />
              <JourneyStat
                icon={BrainCircuit}
                value={stats.quizzesTaken}
                label="quizzes passed"
                color={{ bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" }}
              />
              <JourneyStat
                icon={Target}
                value={`${stats.averageScore}%`}
                label="average quiz score"
                color={{ bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" }}
              />
            </div>
          </div>

          {/* Right Side: Progress Circle & Button */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60A5FA" /> {/* blue-400 */}
                    <stop offset="100%" stopColor="#A78BFA" /> {/* violet-400 */}
                  </linearGradient>
                </defs>
                {/* Background Circle */}
                <path
                  d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-gray-200 dark:text-gray-700"
                />
                {/* Progress Circle */}
                <path
                  d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="3"
                  strokeDasharray={`${stats.overallProgress}, 100`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 0.7s ease-in-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800 dark:text-white">
                  {stats.overallProgress}%
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/progress-tracker")}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            >
              View Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}