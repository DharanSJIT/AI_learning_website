import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Rocket } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[85vh] bg-white dark:bg-slate-900 ">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center h-screen max-h-[91vh]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text Content & Call to Action */}
          <div className="text-center lg:text-left">
            {/* <div 
              className="animate-fadeInUp" 
              style={{ animationDelay: '0.1s' }}
            >
              <span className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold px-4 py-1 rounded-full text-sm mb-4">
                <Rocket className="w-4 h-4" />
                AI-Powered Learning Platform
              </span>
            </div> */}

            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-6 animate-fadeInUp"
              style={{ animationDelay: '0.2s' }}
            >
              Unlock Your Potential with Personalized AI.
            </h1>
            
            <p 
              className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 mb-8 animate-fadeInUp"
              style={{ animationDelay: '0.3s' }}
            >
              Our platform uses advanced artificial intelligence to create a learning experience tailored just for you. From smart quizzes to instant chat help, we have the tools you need to succeed.
            </p>

            <div 
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6 animate-fadeInUp"
              style={{ animationDelay: '0.4s' }}
            >
              <button
                onClick={() => navigate("/dashboard")}
                className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 ease-in-out hover:bg-indigo-700 hover:shadow-indigo-500/40 focus:outline-none focus:ring-4 focus:ring-indigo-300 transform hover:scale-105"
              >
                Get Started for Free
                <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Social Proof Section */}
            <div 
              className="flex items-center justify-center lg:justify-start animate-fadeInUp"
              style={{ animationDelay: '0.5s' }}
            >
              <div className="flex -space-x-2">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900" src="https://randomuser.me/api/portraits/women/79.jpg" alt="User 1"/>
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900" src="https://randomuser.me/api/portraits/men/32.jpg" alt="User 2"/>
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900" src="https://randomuser.me/api/portraits/women/14.jpg" alt="User 3"/>
              </div>
              <p className="ml-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                Join <span className="text-slate-700 dark:text-white">10,000+</span> happy learners.
              </p>
            </div>
          </div>

          {/* Right Column: Image */}
          <div 
            className="hidden lg:block animate-fadeIn" 
            style={{ animationDelay: '0.2s' }}
          >
            <div className="relative p-5">
               <div className="absolute inset-0 bg-indigo-200 dark:bg-indigo-900/50 rounded-3xl transform -rotate-6 transition-transform duration-500 hover:rotate-0"></div>
               <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS56YA-ZyI000MwdlojPSEd3vdyjRnSsKzbHBZaBoAZl4PHXtY573Iz39zv&s=10"
                alt="AI Learning Platform Visual"
                className="relative w-full h-full object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0; /* Start hidden */
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}