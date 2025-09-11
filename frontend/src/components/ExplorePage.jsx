import React from "react";

// AI benefits section data
const aiBenefits = [
  {
    title: "Personalized Learning",
    description: "AI adapts to your unique learning style, pace, and preferences to create a truly personalized experience.",
    imageUrl: "data:image/jpeg;base64,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",
    color: "blue",
  },
  {
    title: "24/7 Assistance",
    description: "Get help whenever you need it with AI tutors that are always available to answer questions.",
    imageUrl: "data:image/jpeg;base64,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",
    color: "emerald",
  },
  {
    title: "Efficient Study",
    description: "Save time with AI-powered summarization, note-taking, and content organization tools.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTQvZflyCzQIRZnptC_x9N5NuOUovNVSANVA&s",
    color: "purple",
  },
  {
    title: "Knowledge Gaps",
    description: "Identify and address knowledge gaps with intelligent assessment and adaptive quizzes.",
    imageUrl: "data:image/jpeg;base64,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",
    color: "orange",
  },
];

// AI Benefit Card
function AIBenefitCard({ benefit }) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    emerald: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
    purple: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    orange: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group border border-gray-100 dark:border-gray-700">
      <div className="relative">
        <div className="h-48 relative overflow-hidden">
          <img 
            src={benefit.imageUrl}
            alt={benefit.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
        </div>
        
      </div>
      <div className="p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
          {benefit.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {benefit.description}
        </p>
      </div>
    </div>
  );
}

export default function AIExplorePage() {
  const handleNavigate = () => {
    // This would normally use useNavigate() hook
    console.log("Navigate to services page");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 mt-[-3vh]">
      <div className="relative z-10 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <header className="mb-20 text-center">
            {/* <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI-Powered Education</span>
            </div> */}
            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">
              The Technology Behind{" "}
              <span className="relative">
                Our Platform
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Discover how our cutting-edge artificial intelligence transforms education by creating personalized, 
              adaptive learning experiences tailored specifically for you.
            </p>
          </header>

          {/* AI Benefits Section */}
          <section className="mb-24">
            <div className="text-center mb-16">
              <div className="inline-block mb-6">
                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
                  Benefits of AI in Learning
                </h2>
                <div className="w-24 h-1 bg-indigo-600 dark:bg-indigo-400 mx-auto rounded-full"></div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Experience the power of artificial intelligence designed specifically for education
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {aiBenefits.map((benefit, index) => (
                <AIBenefitCard key={index} benefit={benefit} />
              ))}
            </div>
          </section>

          {/* Technology Insights Section */}
          <section className="mb-16">
            <div className="text-center mb-16">
              <div className="inline-block mb-6">
                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
                  Our AI Technology
                </h2>
                <div className="w-24 h-1 bg-indigo-600 dark:bg-indigo-400 mx-auto rounded-full"></div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Built with state-of-the-art machine learning models and educational expertise
              </p>
            </div>
            <div className="bg-white dark:bg-gray-200 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-12 lg:p-16">
                  <div className="mb-8">
                    <div className="inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                      <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">Advanced Technology</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                      State-of-the-Art Learning AI
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-10 text-lg leading-relaxed">
                    Our platform utilizes cutting-edge artificial intelligence models
                    specifically designed for educational contexts. We combine natural 
                    language processing, computer vision, and adaptive learning algorithms
                    to create a uniquely powerful learning experience.
                  </p>
                  <div className="space-y-8">
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                        Adaptive Learning Algorithms
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Our AI analyzes your learning patterns and adapts content
                        difficulty and presentation style to match your unique needs and preferences.
                      </p>
                    </div>
                    <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                        Advanced Natural Language Processing
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Our AI understands context, follows complex reasoning,
                        and communicates in a clear, educational manner that adapts to your level.
                      </p>
                    </div>
                    <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                        Continuous Learning Improvement
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Our models continuously improve based on educational research
                        and user interactions to provide increasingly better learning outcomes.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-indigo-500 dark:bg-indigo-700 p-12 lg:p-16 text-white flex items-center">
                  <div className="w-full">
                    <div className="mb-8">
                      <div className="inline-block px-4 py-2 bg-white/20 rounded-full mb-4">
                        <span className="text-sm font-bold">AI Support</span>
                      </div>
                      <h3 className="text-3xl font-bold">How Our AI Supports You</h3>
                    </div>
                    <div className="space-y-6">
                      <div className="p-4 bg-white/10 rounded-xl">
                        <span className="text-lg leading-relaxed font-medium">Identifies your unique learning style and adapts content accordingly</span>
                      </div>
                      <div className="p-4 bg-white/10 rounded-xl">
                        <span className="text-lg leading-relaxed font-medium">Provides personalized feedback and targeted practice exercises</span>
                      </div>
                      <div className="p-4 bg-white/10 rounded-xl">
                        <span className="text-lg leading-relaxed font-medium">Simplifies complex concepts with custom explanations and examples</span>
                      </div>
                      <div className="p-4 bg-white/10 rounded-xl">
                        <span className="text-lg leading-relaxed font-medium">Suggests optimal learning paths tailored to your specific goals</span>
                      </div>
                    </div>
                    <button 
                      onClick={handleNavigate}
                      className="mt-10 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-colors text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                    >
                      Start Your AI Learning Journey
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Showcase */}
          <section className="mb-24">
            <div className="text-center mb-16">
              <div className="inline-block mb-6">
                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
                  Advanced AI Features
                </h2>
                <div className="w-24 h-1 bg-indigo-600 dark:bg-indigo-400 mx-auto rounded-full"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Smart Content Generation */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
                <div className="mb-6">
                  <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                    <span className="text-sm font-bold text-blue-700 dark:text-blue-300">Content AI</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Smart Content Generation</h3>
                  <p className="text-gray-600 dark:text-gray-400">Dynamic learning materials</p>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Our AI creates custom quizzes, practice problems, and study materials based on your learning progress and areas that need improvement.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">Personalized practice questions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">Interactive learning modules</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">Adaptive difficulty scaling</span>
                  </div>
                </div>
              </div>

              {/* Real-time Analytics */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
                <div className="mb-6">
                  <div className="inline-block px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Analytics AI</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Real-time Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-400">Track your progress instantly</p>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Monitor your learning journey with detailed analytics that show strengths, weaknesses, and personalized recommendations for improvement.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">Performance tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">Learning pattern analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">Progress predictions</span>
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