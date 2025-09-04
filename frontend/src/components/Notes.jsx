import React, { useEffect } from "react"; // 1. Import useEffect here
import { Link } from "react-router-dom";
import YouTubeResources from "./LearningResources/YouTubeResources";
import UdemyResources from "./LearningResources/UdemyResources";
import CourseraResources from "./LearningResources/CourseraResources";
import GitHubResources from "./LearningResources/GitHubResources";
import DevToResources from "./LearningResources/DevToResources";
import MediumResources from "./LearningResources/MediumResources";

const Notes = () => {
  // 2. Add this hook to scroll to the top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-[90vh] p-6 w-full sm:w-[90vw] md:w-[70vw] mx-auto mt-[0vh]">

      {/* Back to Dashboard */}
      <div className="absolute left-[3vw] ">
        <Link
          to="/home"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 mb-6 font-medium transition-colors"
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
      </div>

      {/* Title */}
      <h2 className="font-extrabold text-4xl text-center text-transparent bg-clip-text bg-gradient-to-r pt-10 from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-300 dark:via-purple-300 dark:to-pink-300 drop-shadow-lg mb-12">
        Learning Resources
      </h2>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* YouTube */}
        <div className="border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <YouTubeResources query="programming" />
        </div>

        {/* Udemy */}
        <div className="border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <UdemyResources />
        </div>

        {/* Coursera */}
        <div className="border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CourseraResources />
        </div>

        {/* GitHub */}
        <div className="border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <GitHubResources />
        </div>

        {/* Dev.to */}
        <div className="border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <DevToResources />
        </div>

        {/* Medium */}
        <div className="border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <MediumResources />
        </div>
      
      </div>
    </div>
  );
};

export default Notes;
