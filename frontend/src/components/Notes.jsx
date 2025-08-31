import React from "react";
import { Link } from "react-router-dom";
import YouTubeResources from "./LearningResources/YouTubeResources";
import UdemyResources from "./LearningResources/UdemyResources";
import CourseraResources from "./LearningResources/CourseraResources";
import GitHubResources from "./LearningResources/GitHubResources";
import DevToResources from "./LearningResources/DevToResources";
import MediumResources from "./LearningResources/MediumResources";

const Notes = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-black rounded-2xl shadow-2xl w-full sm:w-[90vw] md:w-[70vw] mx-auto mt-10">
      
      {/* Back to Dashboard */}
      <Link
        to="/home"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium transition-colors"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
        </svg>
        Back to Dashboard
      </Link>

      {/* Title */}
      <h2 className="font-extrabold text-4xl text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-300 dark:via-purple-300 dark:to-pink-300 drop-shadow-lg mb-12">
         Learning Resources
      </h2>

      {/* Grid Layout (Responsive) */}
      <div className="grid grid-cols-1  gap-8">
        
        {/* YouTube Resources */}
        <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
          {/* <h3 className="text-lg font-bold mb-4 text-red-600 dark:text-red-400">🎥 YouTube</h3> */}
          <YouTubeResources query="programming" />
        </div>

        {/* Udemy Resources */}
        <div className="bg-gradient-to-br from-blue-100/70 to-blue-200/70 dark:from-blue-800/80 dark:to-blue-700/80 backdrop-blur-md border border-blue-300/40 dark:border-blue-600/40 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all">
          {/* <h3 className="text-lg font-bold mb-4 text-blue-700 dark:text-blue-300">📘 Udemy</h3> */}
          <UdemyResources />
        </div>

        {/* Coursera Resources */}
        <div className="bg-gradient-to-br from-green-100/70 to-green-200/70 dark:from-green-800/80 dark:to-green-700/80 backdrop-blur-md border border-green-300/40 dark:border-green-600/40 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all">
          {/* <h3 className="text-lg font-bold mb-4 text-green-700 dark:text-green-300">🎓 Coursera</h3> */}
          <CourseraResources />
        </div>

        {/* GitHub Resources */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all">
          {/* <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">💻 GitHub</h3> */}
          <GitHubResources />
        </div>

        {/* DevTo Resources */}
        <div className="bg-gradient-to-br from-yellow-100/70 to-yellow-200/70 dark:from-yellow-700/80 dark:to-yellow-600/80 backdrop-blur-md border border-yellow-300/40 dark:border-yellow-600/40 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all">
          {/* <h3 className="text-lg font-bold mb-4 text-yellow-700 dark:text-yellow-300">✍️ Dev.to</h3> */}
          <DevToResources />
        </div>

        {/* Medium Resources */}
        <div className="bg-gradient-to-br from-purple-100/70 to-purple-200/70 dark:from-purple-800/80 dark:to-purple-700/80 backdrop-blur-md border border-purple-300/40 dark:border-purple-600/40 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all">
          {/* <h3 className="text-lg font-bold mb-4 text-purple-700 dark:text-purple-300">📰 Medium</h3> */}
          <MediumResources />
        </div>
      
      </div>
    </div>
  );
};

export default Notes;
