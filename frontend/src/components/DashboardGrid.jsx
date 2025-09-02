import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  HelpCircle, 
  StickyNote, 
  FileText, 
  TrendingUp, 
  Users, 
  Bookmark, 
  CheckSquare, 
  Settings,
  Star,
  ChevronRight,
  Zap,
  Brain,
  Target,
  Image as ImageIcon,
  Search,
  UserCheck
} from "lucide-react";

export default function DashboardGrid({ user }) {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 16) return "Good afternoon";
    if (hour < 20) return "Good evening";
    return "Good night";
  };

  const tools = [
    {
      id: 1,
      label: "Learning Path",
      route: "/learning-path",
      gradient: "from-sky-400 to-cyan-500",
      icon: BookOpen,
      description: "Personalized learning journey tailored to your goals",
      badge: "AI-Powered",
      featured: true
    },
    {
      id: 2,
      label: "Quiz Generator",
      route: "/quiz-generator",
      gradient: "from-orange-400 to-red-500",
      icon: HelpCircle,
      description: "Create and take interactive quizzes",
      badge: "Interactive",
      featured: true
    },
    {
      id: 3,
      label: "Learning Resources",
      route: "/notes",
      gradient: "from-teal-400 to-emerald-500",
      icon: StickyNote,
      description: "Organize and manage your study materials",
      badge: "Essential"
    },
    {
      id: 4,
      label: "Summarization",
      route: "/summarization",
      gradient: "from-yellow-400 to-orange-500",
      icon: FileText,
      description: "AI-powered text and document summarization",
      badge: "Smart"
    },
    {
      id: 5,
      label: "Image Analysis",
      route: "/image-analysis",
      gradient: "from-red-400 to-pink-600",
      icon: ImageIcon,
      description: "Analyze and extract insights from images",
      badge: "AI Vision"
    },
    {
      id: 10,
      label: "Document Analyzer",
      route: "/document-analyzer",
      gradient: "from-blue-500 to-indigo-600",
      icon: Search,
      description: "Analyze and extract insights from documents",
      badge: "AI-Powered"
    },
    {
      id: 11,
      label: "ATS Resume Checker",
      route: "/ats-checker",
      gradient: "from-emerald-400 to-teal-600",
      icon: UserCheck,
      description: "Check how well your résumé passes ATS filters",
      badge: "Career",
      featured: true
    },
    {
      id: 6,
      label: "Progress Tracker",
      route: "/progress-tracker",
      gradient: "from-purple-500 to-violet-600",
      icon: TrendingUp,
      description: "Monitor your learning progress and achievements",
      badge: "Analytics"
    },
    {
      id: 8,
      label: "To-Do List",
      route: "/todo-list",
      gradient: "from-indigo-500 to-purple-600",
      icon: CheckSquare,
      description: "Manage tasks and stay organized",
      badge: "Productivity"
    },
    {
      id: 7,
      label: "Bookbank",
      route: "/bookmarks",
      gradient: "from-rose-400 to-pink-500",
      icon: Bookmark,
      description: "Save and organize important resources",
      badge: "Quick Access"
    },
    {
      id: 9,
      label: "AI Mentor",
      route: "/mentor",
      gradient: "from-green-400 to-emerald-600",
      icon: Brain,
      description: "Get personalized AI-powered guidance",
      badge: "24/7 Support"
    },
    {
      id: 12,
      label: "Settings",
      route: "/settings",
      gradient: "from-gray-600 to-gray-800",
      icon: Settings,
      description: "Customize your learning experience",
      badge: "Personalize"
    }
  ];

  const featuredTools = tools.filter(tool => tool.featured);


  const stats = [
    { label: "Tools Available", value: "12", icon: Zap },
    { label: "AI Features", value: "8", icon: Brain },
    { label: "Your Progress", value: "75%", icon: Target }
  ];

  const quickActions = [
    { label: "Continue Learning", action: () => navigate('/learning-path'), color: "bg-blue-500" },
    { label: "Take Quiz", action: () => navigate('/quiz-generator'), color: "bg-orange-500" },
    { label: "Check Resume", action: () => navigate('/ats-checker'), color: "bg-emerald-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Welcome Section */}
              <div className="space-y-3">
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {getGreeting()}, {user?.displayName || "Learner"}! 👋
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                  Ready to continue your learning journey? Explore our comprehensive suite of AI-powered tools designed to enhance your education and career.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span> {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                  <span>🕐 {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`${action.color} hover:opacity-90 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Tools Section - Only 3 Tools */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Featured Tools</h2>
              <div className="h-px bg-gradient-to-r from-yellow-400 to-orange-500 flex-1 ml-4"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {featuredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="group relative"
                  onMouseEnter={() => setHoveredCard(tool.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <button
                    onClick={() => navigate(tool.route)}
                    className={`
                      w-full h-52 rounded-3xl shadow-xl hover:shadow-2xl
                      bg-gradient-to-br ${tool.gradient}
                      transform transition-all duration-500 hover:scale-105 hover:-translate-y-2
                      relative overflow-hidden group
                    `}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

                    {/* Content */}
                    <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
                      <div className="flex justify-between items-start">
                        <tool.icon className="w-8 h-8 mb-2" />
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm font-medium">
                          {tool.badge}
                        </span>
                      </div>
                      
                      <div className="text-left">
                        <h3 className="text-xl font-bold mb-2">{tool.label}</h3>
                        <p className="text-sm opacity-90 mb-3 leading-relaxed">{tool.description}</p>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <span>Explore</span>
                          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                            hoveredCard === tool.id ? 'translate-x-1' : ''
                          }`} />
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* All Tools Grid */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">All Learning Tools</h2>
              <div className="h-px bg-gradient-to-r from-blue-400 to-purple-500 flex-1 ml-4"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className="group relative"
                  onMouseEnter={() => setHoveredCard(tool.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <button
                    onClick={() => navigate(tool.route)}
                    className={`
                      w-full h-40 rounded-2xl shadow-lg hover:shadow-xl
                      bg-gradient-to-br ${tool.gradient}
                      transform transition-all duration-300 hover:scale-105 hover:-translate-y-1
                      relative overflow-hidden group
                    `}
                  >
                    {/* Glass morphism effect */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Content */}
                    <div className="relative z-10 p-4 h-full flex flex-col justify-between text-white">
                      <div className="flex justify-between items-start">
                        <tool.icon className="w-7 h-7" />
                        <div className="flex items-center gap-1">
                          {tool.featured && (
                            <Star className="w-4 h-4 text-yellow-300 fill-current" />
                          )}
                        </div>
                      </div>
                      
                      <div className="text-left">
                        <h3 className="text-lg font-bold mb-1">{tool.label}</h3>
                        <p className="text-xs opacity-80 mb-2 line-clamp-2 leading-relaxed">{tool.description}</p>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium">
                          {tool.badge}
                        </span>
                      </div>
                    </div>

                    {/* Animated arrow */}
                    <div className={`
                      absolute bottom-4 right-4 transform transition-all duration-300
                      ${hoveredCard === tool.id ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'}
                    `}>
                      <ChevronRight className="w-5 h-5 text-white" />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Progress Section */}
          <div className="mt-16 mb-12">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 border border-blue-200 dark:border-gray-600">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Your Learning Journey
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Track your progress across different learning modules and see how far you've come!
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Completed 8 modules</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">3 quizzes passed</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">2 certificates earned</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray="75, 100"
                        className="text-blue-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-800 dark:text-white">75%</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/progress-tracker')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Ready to supercharge your learning?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Join thousands of learners who have transformed their education with our AI-powered platform. 
                  Start your personalized learning journey today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => navigate('/learning-path')}
                    className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Start Learning Journey →
                  </button>
                  <button 
                    onClick={() => navigate('/ats-checker')}
                    className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Check Resume ATS Score
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>
        {`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob { 
            animation: blob 7s infinite; 
          }
          .animation-delay-2000 { 
            animation-delay: 2s; 
          }
          .animation-delay-4000 { 
            animation-delay: 4s; 
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}
      </style>
    </div>
  );
}