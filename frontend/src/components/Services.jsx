import React, { useState, useMemo } from "react";
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
  UserCheck,
  History,
  Filter,
} from "lucide-react";

// Tools data
const tools = [
  {
    id: 1,
    label: "Learning Path",
    route: "/learning-path",
    gradient: "from-sky-400 to-cyan-500",
    icon: BookOpen,
    description: "Personalized learning journey tailored to your goals",
    badge: "AI-Powered",
    featured: true,
    category: "Learning",
  },
  {
    id: 2,
    label: "Quiz Generator",
    route: "/quiz-generator",
    gradient: "from-orange-400 to-red-500",
    icon: HelpCircle,
    description: "Create and take interactive quizzes",
    badge: "Interactive",
    featured: true,
    category: "Assessment",
  },
  {
    id: 3,
    label: "Learning Resources",
    route: "/notes",
    gradient: "from-teal-400 to-emerald-500",
    icon: StickyNote,
    description: "Organize and manage your study materials",
    badge: "Essential",
    category: "Organization",
  },
  {
    id: 4,
    label: "Summarization",
    route: "/summarization",
    gradient: "from-yellow-400 to-orange-500",
    icon: FileText,
    description: "AI-powered text and document summarization",
    badge: "Smart",
    category: "AI Tools",
  },
  {
    id: 5,
    label: "Image Analysis",
    route: "/image-analysis",
    gradient: "from-red-400 to-pink-600",
    icon: ImageIcon,
    description: "Analyze and extract insights from images",
    badge: "AI Vision",
    category: "AI Tools",
  },
  {
    id: 6,
    label: "Document Analyzer",
    route: "/document-analyzer",
    gradient: "from-blue-500 to-indigo-600",
    icon: Search,
    description: "Analyze and extract insights from documents",
    badge: "AI-Powered",
    category: "AI Tools",
  },
  {
    id: 7,
    label: "ATS Resume Checker",
    route: "/ats-checker",
    gradient: "from-emerald-400 to-teal-600",
    icon: UserCheck,
    description: "Check how well your résumé passes ATS filters",
    badge: "Career",
    featured: true,
    category: "Career",
  },
  {
    id: 8,
    label: "Progress Tracker",
    route: "/progress-tracker",
    gradient: "from-purple-500 to-violet-600",
    icon: TrendingUp,
    description: "Monitor your learning progress and achievements",
    badge: "Analytics",
    category: "Analytics",
  },
  {
    id: 9,
    label: "To-Do List",
    route: "/todo-list",
    gradient: "from-indigo-500 to-purple-600",
    icon: CheckSquare,
    description: "Manage tasks and stay organized",
    badge: "Productivity",
    category: "Organization",
  },
  {
    id: 10,
    label: "Bookbank",
    route: "/bookmarks",
    gradient: "from-rose-400 to-pink-500",
    icon: Bookmark,
    description: "Save and organize important resources",
    badge: "Quick Access",
    category: "Organization",
  },
  {
    id: 11,
    label: "AI Mentor",
    route: "/mentor",
    gradient: "from-indigo-500 to-violet-600",
    icon: Brain,
    description: "Get personalized AI-powered guidance",
    badge: "24/7 Support",
    category: "AI Tools",
  },
  {
    id: 12,
    label: "Quiz History",
    route: "/quiz-history",
    gradient: "from-teal-400 to-cyan-600",
    icon: History,
    description: "Review your past quiz scores and performance",
    badge: "Review",
    category: "Assessment",
  },
  {
    id: 13,
    label: "Settings",
    route: "/settings",
    gradient: "from-gray-600 to-gray-800",
    icon: Settings,
    description: "Customize your learning experience",
    badge: "Personalize",
    category: "System",
  },
];

// --- Reusable Tool Card Component ---
function ToolCard({
  tool,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  isFeatured = false,
}) {
  const navigate = useNavigate();
  const Icon = tool.icon;
  const cardClasses = isFeatured
    ? "h-52 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2"
    : "h-40 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1";

  return (
    <div
      className="group relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        onClick={() => navigate(tool.route)}
        className={`w-full bg-gradient-to-br ${tool.gradient} transform transition-all duration-500 hover:scale-105 relative overflow-hidden group ${cardClasses}`}
        aria-label={`Go to ${tool.label}`}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        {isFeatured && (
          <>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          </>
        )}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 p-4 md:p-6 h-full flex flex-col justify-between text-white text-left">
          <div className="flex justify-between items-start">
            <Icon className={isFeatured ? "w-8 h-8 mb-2" : "w-7 h-7"} />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm font-medium">
              {tool.badge}
            </span>
          </div>
          <div>
            <h3
              className={`font-bold ${
                isFeatured ? "text-xl mb-2" : "text-lg mb-1"
              }`}
            >
              {tool.label}
            </h3>
            <p
              className={`opacity-90 leading-relaxed ${
                isFeatured ? "text-sm mb-3" : "text-xs mb-2 line-clamp-2"
              }`}
            >
              {tool.description}
            </p>
            {isFeatured && (
              <div className="flex items-center gap-2 text-sm font-medium">
                <span>Explore</span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isHovered ? "translate-x-1" : ""
                  }`}
                />
              </div>
            )}
          </div>
        </div>
        {!isFeatured && (
          <div
            className={`absolute bottom-4 right-4 transform transition-all duration-300 ${
              isHovered
                ? "translate-x-0 opacity-100"
                : "translate-x-2 opacity-0"
            }`}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        )}
      </button>
    </div>
  );
}

export default function Services() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = useMemo(() => {
    const cats = tools.map(tool => tool.category);
    return ["All", ...Array.from(new Set(cats))];
  }, []);

  const featuredTools = useMemo(
    () => tools.filter((tool) => tool.featured),
    []
  );
  
  const filteredTools = useMemo(
    () =>
      tools.filter(
        (tool) => {
          const matchesSearch = 
            tool.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchTerm.toLowerCase());
          
          const matchesCategory = 
            categoryFilter === "All" || tool.category === categoryFilter;
          
          return matchesSearch && matchesCategory;
        }
      ),
    [searchTerm, categoryFilter]
  );

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
          {/* Header Section */}
          <header className="mb-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Our Learning Services
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Explore our comprehensive suite of AI-powered tools designed to enhance
                your education and career journey. From personalized learning paths to
                resume checking, we've got you covered.
              </p>
            </div>
          </header>

          {/* Featured Tools Section */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Featured Tools
              </h2>
              <div className="h-px bg-gradient-to-r from-yellow-400 to-orange-500 flex-1 ml-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {featuredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFeatured={true}
                  isHovered={hoveredCard === tool.id}
                  onMouseEnter={() => setHoveredCard(tool.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                />
              ))}
            </div>
          </section>

          {/* All Tools Section */}
          <section>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  All Learning Tools
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all duration-300 outline-none"
                  />
                </div>
                <div className="relative flex-1 sm:w-48">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full appearance-none pl-10 pr-10 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all duration-300 outline-none"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90" />
                </div>
              </div>
            </div>

            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isHovered={hoveredCard === tool.id}
                    onMouseEnter={() => setHoveredCard(tool.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl">
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  No tools found matching your search.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Try a different keyword or category filter.
                </p>
              </div>
            )}
          </section>

          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">
                  Ready to supercharge your learning?
                </h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Join thousands of learners who have transformed their
                  education with our AI-powered platform. Start your
                  personalized learning journey today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate("/learning-path")}
                    className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Start Learning Journey →
                  </button>
                  <button
                    onClick={() => navigate("/ats-checker")}
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
