import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  Brain,
  Target,
  ChevronRight,
  BookOpen,
  HelpCircle,
  UserCheck,
  ArrowRight,
  Calculator,
  FileText,
  MessageSquare,
  Users,
  TrendingUp,
  Sparkles,
  Briefcase,
} from "lucide-react";

// --- Firebase Imports ---
import { db } from "../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

// --- Import the LearningJourney component ---
import LearningJourney from "./LearningJourney";

// --- Static Data for Components ---
const websiteFeatures = [
  {
    title: "AI-Powered Learning",
    description:
      "Our platform uses advanced AI to personalize your learning experience, adapt to your pace, and provide intelligent feedback.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWHNzJPH7GljmjgOmHscqnA7AvakdwMtkwBg&s",
    accent: "blue",
  },
  {
    title: "Career Advancement",
    description:
      "Get valuable tools for job seekers including ATS resume checks, interview preparation, and skill-based certification guidance.",
    image:
      "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format=fit=crop&w=600&h=450&q=80",
    accent: "emerald",
  },
  {
    title: "Comprehensive Tools",
    description:
      "Access a suite of tools for note-taking, summarization, quiz generation, document analysis, and more - all in one platform.",
    image:
      "https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format=fit=crop&w=600&h=450&q=80",
    accent: "purple",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your growth with detailed analytics and visualizations that show exactly how your skills are developing over time.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format=fit=crop&w=600&h=450&q=80",
    accent: "amber",
  },
];

const servicesOverview = [
  {
    category: "Learning Tools",
    description:
      "AI-powered educational tools to enhance your learning experience",
    tools: [
      {
        name: "Learning Path",
        icon: BookOpen,
        description: "Personalized learning journey",
      },
      {
        name: "Quiz Generator",
        icon: HelpCircle,
        description: "Interactive quiz creation",
      },
      {
        name: "Document Analyzer",
        icon: FileText,
        description: "Smart document analysis",
      },
    ],
    icon: Brain,
  },
  {
    category: "Career Tools",
    description: "Professional development tools for career advancement",
    tools: [
      {
        name: "ATS Resume Checker",
        icon: UserCheck,
        description: "Resume optimization",
      },
      {
        name: "Interview Prep",
        icon: MessageSquare,
        description: "Interview practice",
      },
      {
        name: "Skill Assessment",
        icon: TrendingUp,
        description: "Skill evaluation",
      },
    ],
    icon: Target,
  },
  {
    category: "Productivity Tools",
    description: "Efficient tools to boost your productivity and organization",
    tools: [
      {
        name: "Note Organizer",
        icon: FileText,
        description: "Smart note management",
      },
      {
        name: "Task Manager",
        icon: Calculator,
        description: "Progress tracking",
      },
      {
        name: "Study Groups",
        icon: Users,
        description: "Collaborative learning",
      },
    ],
    icon: Zap,
  },
];

const keyFeatures = [
  { icon: Sparkles, text: "13+ AI-Powered Tools to accelerate your learning." },
  {
    icon: Target,
    text: "Personalized learning paths tailored to your specific goals.",
  },
  { icon: Zap, text: "Career-focused utilities like the ATS Resume Checker." },
];

const stats = [
  { icon: Users, value: "10,000+", label: "Happy Learners" },
  { icon: Briefcase, value: "90%", label: "Career Improvement" },
  { icon: TrendingUp, value: "4.8/5", label: "Average Rating" },
];

// --- Helper Components ---
function FeatureCard({ feature }) {
  const accentColors = {
    blue: "border-blue-200 dark:border-blue-800",
    emerald: "border-emerald-200 dark:border-emerald-800",
    purple: "border-purple-200 dark:border-purple-800",
    amber: "border-amber-200 dark:border-amber-800",
  };
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 ${
        accentColors[feature.accent]
      }`}
    >
      <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={feature.image}
          alt={feature.title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          {feature.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

function ServiceCategoryCard({ category, onExplore }) {
  const Icon = category.icon;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <button
          onClick={onExplore}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {category.category}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        {category.description}
      </p>
      <div className="space-y-2">
        {category.tools.map((tool, index) => {
          const ToolIcon = tool.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <ToolIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {tool.name}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {tool.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EnhancedCTA() {
  const navigate = useNavigate();
  return (
    <section className="mt-16">
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">
        Ready to Unlock Your Full Potential?
      </h3>
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="absolute inset-0 opacity-50 dark:opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px]"></div>
        </div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8">
          <div className="text-center lg:text-left">
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              From AI-powered learning paths to professional resume checkers, we
              have everything you need to succeed.
            </p>
            <div className="space-y-4 mb-8">
              {keyFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-left"
                  >
                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/services")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Browse All Tools →
              </button>
              <button
                onClick={() => navigate("/learning-path")}
                className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Learning
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center"
                >
                  <div className="flex justify-center mb-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full text-white">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Main Dashboard Component ---
export default function DashboardGrid({ user }) {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user?.uid) {
      const tasksQuery = query(collection(db, "users", user.uid, "tasks"));
      const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) =>
        setTasks(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      );
      const quizQuery = query(collection(db, "users", user.uid, "quizResults"));
      const unsubscribeQuizzes = onSnapshot(quizQuery, (snapshot) =>
        setQuizHistory(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        )
      );
      return () => {
        unsubscribeTasks();
        unsubscribeQuizzes();
      };
    }
  }, [user]);

  const dynamicStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const overallProgress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    return [
      {
        label: "Tools Available",
        value: 12,
        icon: Zap,
        color: "bg-blue-500",
        path: "/services",
      },
      {
        label: "AI Features",
        value: 5,
        icon: Brain,
        color: "bg-emerald-500",
        path: "/services",
      },
      {
        label: "Your Progress",
        value: `${overallProgress}%`,
        icon: Target,
        color: "bg-purple-500",
        path: "/progress-tracker",
      },
    ];
  }, [tasks]);

  const journeyStats = useMemo(() => {
    const completedTasks = tasks.filter((task) => task.completed).length;
    const totalTasks = tasks.length;
    const overallProgress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const quizzesTaken = quizHistory.length;
    const totalPercentage = quizHistory.reduce(
      (sum, result) => sum + (result.percentage || 0),
      0
    );
    const averageScore =
      quizzesTaken > 0 ? Math.round(totalPercentage / quizzesTaken) : 0;
    return { completedTasks, quizzesTaken, averageScore, overallProgress };
  }, [tasks, quizHistory]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formattedDate = useMemo(
    () =>
      currentTime.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [currentTime]
  );
  const formattedTime = useMemo(
    () =>
      currentTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [currentTime]
  );

  const quickActions = [
    {
      label: "Continue Learning",
      action: () => navigate("/learning-path"),
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      label: "Take Quiz",
      action: () => navigate("/quiz-generator"),
      color: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      label: "Image Analyzer",
      action: () => navigate("/image-analysis"),
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 mt-[3vh]">
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-3">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                  {getGreeting()}, {user?.displayName || "Learner"}! 👋
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                  Ready to continue your learning journey? Explore our suite of
                  AI-powered tools.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{formattedDate}</span>
                  <span>🕐 {formattedTime}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {dynamicStats.map((stat) => (
                  <button
                    key={stat.label}
                    onClick={() => navigate(stat.path)}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 ${stat.color} rounded-lg`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800 dark:text-white">
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`${action.color} text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </header>
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Our Services
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Discover the tools available to enhance your learning.
                </p>
              </div>
              <button
                onClick={() => navigate("/services")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                View All Services <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {servicesOverview.map((category, index) => (
                <ServiceCategoryCard
                  key={index}
                  category={category}
                  onExplore={() => navigate("/services")}
                />
              ))}
            </div>
          </section>
          <section className="mb-16">
            <div className="flex justify-center text-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Platform Overview
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Key features that make our platform unique and powerful.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-[75vw] mx-auto">
                {websiteFeatures.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} />
                ))}
              </div>
            </div>
          </section>
          {user && <LearningJourney stats={journeyStats} />}
          <EnhancedCTA />
        </div>
      </div>
    </div>
  );
}
