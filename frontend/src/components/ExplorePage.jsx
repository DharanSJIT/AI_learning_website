import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare, // ✨ FIX: Added the missing icon import
  Code,
  BookOpen,
  BarChart2,
  Check,
} from "lucide-react";

// AI benefits section data
const aiBenefits = [
  {
    title: "Personalized Learning",
    description: "AI adapts to your unique learning style, pace, and preferences to create a truly personalized experience.",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "24/7 Assistance",
    description: "Get help whenever you need it with AI tutors that are always available to answer questions.",
    imageUrl: "https://images.unsplash.com/photo-1678483789004-a8e5a371b652?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Efficient Study",
    description: "Save time with AI-powered summarization, note-taking, and content organization tools.",
    imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Knowledge Gaps",
    description: "Identify and address knowledge gaps with intelligent assessment and adaptive quizzes.",
    imageUrl: "https://images.unsplash.com/photo-1588681664899-f142ff2dc3b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
  },
];

// AI Benefit Card
function AIBenefitCard({ benefit }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden group">
      <div className="h-48 relative">
        <img 
          src={benefit.imageUrl}
          alt={benefit.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{benefit.title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
      </div>
    </div>
  );
}

export default function AIExplorePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="relative z-10 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Simple Header */}
          <header className="mb-16 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              The Technology Behind Our Platform
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Learn how our platform leverages artificial intelligence to create a superior learning experience.
            </p>
          </header>

          {/* AI Benefits Section */}
          <section className="mb-16">
            <div className="flex justify-center text-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                  Benefits of AI in Learning
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {aiBenefits.map((benefit, index) => (
                <AIBenefitCard key={index} benefit={benefit} />
              ))}
            </div>
          </section>

          {/* Technology Insights Section */}
          <section className="mb-16">
            <div className="flex justify-center text-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                  Our AI Technology
                </h2>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-12">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    State-of-the-Art Learning AI
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Our platform utilizes cutting-edge artificial intelligence models
                    specifically designed for educational contexts. We combine natural 
                    language processing, computer vision, and adaptive learning algorithms
                    to create a uniquely powerful learning experience.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 mt-1">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Adaptive Learning Algorithms
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Our AI analyzes your learning patterns and adapts content
                          difficulty and presentation style to match your needs.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400 mt-1">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Advanced Natural Language Processing
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Our AI understands context, follows complex reasoning,
                          and communicates in a clear, educational manner.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400 mt-1">
                        <BarChart2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Continuous Learning Improvement
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Our models continuously improve based on educational research
                          and user interactions to provide better learning outcomes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 lg:p-12 text-white flex items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">How Our AI Supports You</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-300 mt-0.5" />
                        <span>Identifies your unique learning style and adapts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-300 mt-0.5" />
                        <span>Provides personalized feedback and practice</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-300 mt-0.5" />
                        <span>Simplifies complex concepts with custom explanations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-300 mt-0.5" />
                        <span>Suggests optimal learning paths for your goals</span>
                      </li>
                    </ul>
                    <button 
                      onClick={() => navigate("/services")}
                      className="mt-6 bg-white text-indigo-600 px-6 py-2 rounded-xl font-medium hover:bg-indigo-50 transition-colors"
                    >
                      Start Your AI Learning Journey
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}