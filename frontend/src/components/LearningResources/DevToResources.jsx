import React, { useState, useEffect } from "react";

const DevToResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDevToResources();
  }, []);

  const fetchDevToResources = async () => {
    setLoading(true);
    // Example placeholder - Replace this with actual DevTo API or fetch
    const fetchedResources = [
      {
        title: "Learning React",
        url: "https://dev.to/facebook/learning-react-2b5b",
        author: "Facebook Devs",
        description: "An introductory guide to mastering React step by step.",
      },
      {
        title: "Understanding JavaScript Closures",
        url: "https://dev.to/javascript/understanding-javascript-closures-3hf5",
        author: "JS Community",
        description: "A deep dive into closures and scope in JavaScript.",
      },
      {
        title: "Mastering Async/Await",
        url: "https://dev.to/async/mastering-async-await-5g2d",
        author: "Async Guru",
        description: "Learn how to simplify async code with async/await.",
      },
    ];
    setResources(fetchedResources);
    setLoading(false);
  };

  // Search filter
  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg max-w-6xl mx-auto">
      {/* Title & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h3 className="font-bold text-2xl text-slate-800 dark:text-white mb-4 sm:mb-0">
          Dev.to Resources
        </h3>
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 w-full sm:w-72 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin h-10 w-10 border-t-4 border-indigo-600 border-solid rounded-full"></div>
        </div>
      ) : (
        <div>
          {filteredResources.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, index) => (
                <div
                  key={index}
                  className="bg-indigo-50 dark:bg-indigo-800 rounded-xl shadow-md hover:shadow-2xl transition duration-300 transform hover:scale-[1.03] flex flex-col p-5"
                >
                  <h4 className="font-semibold text-lg text-slate-800 dark:text-white mb-2">
                    {resource.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 flex-grow">
                    {resource.description}
                  </p>
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    By {resource.author}
                  </p>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block px-4 py-2 text-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Read More
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
              No resources found for Dev.to.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DevToResources;
