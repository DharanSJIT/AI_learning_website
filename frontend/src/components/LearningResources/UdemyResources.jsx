import React, { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { FaSpinner } from "react-icons/fa";
import { Search } from "lucide-react";

const UdemyResources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUdemyResources();
  }, []);

  const fetchUdemyResources = async () => {
    setLoading(true);

    // Example placeholder - Replace with Udemy API call if available
    // const fetchedResources = [
    //   {
    //     title: "React for Beginners",
    //     url: "https://www.udemy.com/course/react-for-beginners/",
    //     category: "Web Development",
    //   },
    //   {
    //     title: "JavaScript Essentials",
    //     url: "https://www.udemy.com/course/javascript-essentials/",
    //     category: "Programming",
    //   },
    //   {
    //     title: "Python Data Science Masterclass",
    //     url: "https://www.udemy.com/course/python-data-science/",
    //     category: "Data Science",
    //   },
    //   {
    //     title: "Java Programming Masterclass",
    //     url: "https://www.udemy.com/course/java-the-complete-java-developer-course/",
    //     category: "Programming",
    //   },
    // ];

    const fetchedResources = [
  {
    title: "React for Beginners",
    url: "https://www.udemy.com/course/react-for-beginners/",
    category: "Web Development",
  },
  {
    title: "JavaScript Essentials",
    url: "https://www.udemy.com/course/javascript-essentials/",
    category: "Programming",
  },
  {
    title: "Python Data Science Masterclass",
    url: "https://www.udemy.com/course/python-data-science/",
    category: "Data Science",
  },
  {
    title: "Java Programming Masterclass",
    url: "https://www.udemy.com/course/java-the-complete-java-developer-course/",
    category: "Programming",
  },
  {
    title: "CSS - The Complete Guide",
    url: "https://www.udemy.com/course/css-the-complete-guide/",
    category: "Web Development",
  },
  {
    title: "Node.js - The Complete Guide",
    url: "https://www.udemy.com/course/nodejs-the-complete-guide/",
    category: "Backend Development",
  },
];


    setResources(fetchedResources);
    setFilteredResources(fetchedResources);
    setLoading(false);
  };

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce((q) => {
        if (q.trim() === "") {
          setFilteredResources(resources);
        } else {
          setFilteredResources(
            resources.filter((course) =>
              course.title.toLowerCase().includes(q.toLowerCase())
            )
          );
        }
      }, 400),
    [resources]
  );

  return (
    <div className="p-6 sm:p-8 bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl max-w-6xl mx-auto transition-all duration-500">
      <h3 className="font-extrabold text-2xl sm:text-3xl text-slate-800 dark:text-white mb-6 sm:mb-8 text-center tracking-tight">
        🎓 Explore Udemy Resources
      </h3>

      {/* Search Bar */}
      <div className="relative mb-6 sm:mb-8">
        <Search className="absolute left-4 top-3.5 text-slate-400 dark:text-gray-300 w-5 h-5" />
        <input
          type="text"
          placeholder="Search Udemy Courses..."
          onChange={(e) => debouncedSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white shadow-sm transition-all duration-300"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center space-x-2 py-10">
          <FaSpinner className="animate-spin text-orange-600 dark:text-orange-400 text-3xl" />
          <span className="text-orange-600 dark:text-orange-400">Loading...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 duration-300"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/30 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition duration-300"></div>

                {/* Content */}
                <div className="p-6 relative z-10">
                  <h4 className="font-bold text-lg sm:text-xl text-slate-800 dark:text-white mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                    {resource.title}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-3">
                    {resource.category}
                  </p>
                  <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-700 text-orange-600 dark:text-white text-xs sm:text-sm rounded-full font-medium group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                    View Course
                  </span>
                </div>
              </a>
            ))
          ) : (
            <p className="text-center text-slate-500 dark:text-gray-400 col-span-1 sm:col-span-2 lg:col-span-3">
              No Udemy resources found. Try another search! 🔍
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UdemyResources;
