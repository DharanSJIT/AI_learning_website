import React from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100 overflow-hidden px-4">
      {/* Abstract decorative shapes */}
      <svg
        className="absolute top-[-100px] left-[-100px] w-72 h-72 opacity-20 text-indigo-300"
        fill="currentColor"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="50" />
      </svg>
      <svg
        className="absolute bottom-[-120px] right-[-80px] w-96 h-96 opacity-15 text-indigo-400"
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
          p-12 
          max-w-lg 
          text-center 
          transform 
          transition 
          duration-700 
          ease-in-out 
          hover:scale-[1.03] 
          animate-fadeIn
          border border-indigo-100
        "
      >
        <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500">
          🎓 Welcome to <br /> AI Learning
        </h1>

        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
          An AI-powered personalized learning platform offering smart
          recommendations, interactive quizzes, and friendly chat assistance
          to boost your skills.
        </p>

        <button
          onClick={() => navigate("/home")}
          className="
            relative
            inline-block
            px-8 
            py-4 
            bg-indigo-600 
            text-white 
            rounded-2xl 
            text-lg 
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
      `}</style>
    </div>
  );
}
