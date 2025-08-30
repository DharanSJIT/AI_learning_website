import React from "react";
import YouTubeResources from "./LearningResources/YouTubeResources";
import UdemyResources from "./LearningResources/UdemyResources";
import CourseraResources from "./LearningResources/CourseraResources";
import GitHubResources from "./LearningResources/GitHubResources";
import DevToResources from "./LearningResources/DevToResources";
import MediumResources from "./LearningResources/MediumResources";

const Notes = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full sm:w-[80vw] md:w-[60vw] mx-auto mt-10">

        
      <h2 className="font-bold text-3xl text-slate-800 dark:text-white mb-6 text-center">
        📚 Learning Resources
      </h2>

      {/* Grid Layout for 6 Learning Resources */}
      <div className="grid grid-cols-1   gap-8">
        
        {/* YouTube Resources */}
        <div className="flex flex-col bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
          <YouTubeResources query="programming" />
        </div>

        {/* Udemy Resources */}
        <div className="flex flex-col bg-blue-50 dark:bg-blue-700 text-gray-900 dark:text-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
          <UdemyResources />
        </div>

        {/* Coursera Resources */}
        <div className="flex flex-col bg-green-50 dark:bg-green-700 text-gray-900 dark:text-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
          <CourseraResources />
        </div>

        {/* GitHub Resources */}
        <div className="flex flex-col bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
          <GitHubResources />
        </div>

        {/* DevTo Resources */}
        <div className="flex flex-col bg-yellow-50 dark:bg-yellow-600 text-gray-900 dark:text-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
          <DevToResources />
        </div>

        {/* Medium Resources */}
        <div className="flex flex-col bg-purple-50 dark:bg-purple-700 text-gray-900 dark:text-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
          <MediumResources />
        </div>
      </div>
    </div>
  );
};

export default Notes;
