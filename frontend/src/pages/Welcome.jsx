import React from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="relative flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100 overflow-hidden px-4 py-4 sm:py-6 absolute top-[0vh] max-h-[90vh]">
      {/* Abstract decorative shapes - adjusted for mobile */}
      <svg
        className="absolute top-[-50px] left-[-50px] w-48 h-48 sm:top-[-100px] sm:left-[-100px] sm:w-72 sm:h-72 opacity-20 text-indigo-300"
        fill="currentColor"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="50" />
      </svg>
      <svg
        className="absolute bottom-[-60px] right-[-40px] w-64 h-64 sm:bottom-[-120px] sm:right-[-80px] sm:w-96 sm:h-96 opacity-15 text-indigo-400"
        fill="currentColor"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="100" height="100" rx="30" />
      </svg>

      <div
        className="
          relative
          bg-white 
          shadow-2xl 
          rounded-3xl 
          p-6
          sm:p-8
          md:p-10
          lg:p-12
          w-full
          max-w-sm
          sm:max-w-md
          lg:max-w-lg
          mx-auto
          text-center 
          transform 
          transition 
          duration-700 
          ease-in-out 
          hover:scale-[1.03] 
          animate-fadeIn
          border border-indigo-100
          max-h-[60vh]
          flex
          flex-col
          justify-center
        "
      >
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 leading-tight">
            🎓 Welcome to <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>AI Learning
          </h1>

          <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 lg:mb-10 leading-relaxed px-2 sm:px-0">
            An AI-powered personalized learning platform offering smart
            recommendations, interactive quizzes, and friendly chat assistance
            to boost your skills.
          </p>

          <button
            onClick={() => navigate("/home")}
            className="
              relative
              inline-block
              w-full
              sm:w-auto
              sm:px-8 
              px-6
              py-3
              sm:py-4 
              bg-indigo-600 
              text-white 
              rounded-2xl 
              text-base
              sm:text-lg 
              font-semibold 
              shadow-lg 
              transition 
              duration-300 
              ease-in-out 
              hover:bg-indigo-700 
              hover:shadow-indigo-500/50
              focus:outline-none
              focus:ring-4
              focus:ring-indigo-300
              active:scale-95
              transform
            "
          >
            Continue →
            <span
              aria-hidden="true"
              className="
                absolute 
                inset-0 
                rounded-2xl 
                ring-2 ring-indigo-500 ring-opacity-30 
                opacity-0 
                transition 
                duration-300 
                group-hover:opacity-100
              "
            />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0; 
            transform: translateY(10px);
          }
          to {
            opacity: 1; 
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }

        /* Additional mobile-specific styles */
        @media (max-height: 600px) {
          .animate-fadeIn h1 {
            font-size: 1.75rem;
            margin-bottom: 1rem;
          }
          .animate-fadeIn p {
            font-size: 0.9rem;
            margin-bottom: 1.5rem;
          }
          .animate-fadeIn button {
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
          }
        }

        /* Ensure no horizontal scroll on mobile */
        @media (max-width: 640px) {
          html, body {
            overflow-x: hidden;
          }
        }
      `}</style>
    </div>
  );
}