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
    // Example placeholder resources (replace with Dev.to API fetch if needed)
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

  // Apply search filter
  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* 🌟 Heading */}
      <h3 className="font-extrabold text-3xl text-center text-transparent bg-clip-text 
        bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
        dark:from-indigo-300 dark:via-purple-300 dark:to-pink-300 mb-6">
        ✍️ Dev.to Resources
      </h3>

      {/* 🔍 Search Bar */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-3 w-full sm:w-96 border border-gray-300 dark:border-gray-700 
          rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 
          dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* 📦 Loader */}
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
                  className="rounded-xl border border-gray-200 dark:border-gray-700 
                  shadow-md hover:shadow-2xl transition duration-300 transform 
                  hover:-translate-y-1 flex flex-col p-6 
                  bg-white/70 dark:bg-gray-800/70 backdrop-blur-md"
                >
                  <h4 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
                    {resource.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow">
                    {resource.description}
                  </p>
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    ✍️ {resource.author}
                  </p>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block px-4 py-2 text-center 
                    bg-gradient-to-r from-indigo-600 to-purple-600 
                    text-white rounded-lg hover:scale-105 transition-transform"
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
