import React, { useState, useEffect } from "react";

const GitHubResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchGitHubResources();
  }, []);

  const fetchGitHubResources = async () => {
    setLoading(true);
    // Example placeholder data (replace with GitHub API if needed)
    const fetchedResources = [
      { 
        title: "React Repository", 
        url: "https://github.com/facebook/react",
        desc: "A JavaScript library for building user interfaces.",
        image: "https://raw.githubusercontent.com/facebook/react/main/fixtures/dom/public/react-logo.svg"
      },
      { 
        title: "JavaScript Algorithms", 
        url: "https://github.com/trekhleb/javascript-algorithms",
        desc: "Collection of algorithms and data structures implemented in JS.",
        image: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png"
      },
      { 
        title: "FreeCodeCamp", 
        url: "https://github.com/freeCodeCamp/freeCodeCamp",
        desc: "Learn to code for free with freeCodeCamp.",
        image: "https://cdn-icons-png.flaticon.com/512/5968/5968242.png"
      },
      { 
        title: "TensorFlow", 
        url: "https://github.com/tensorflow/tensorflow",
        desc: "An end-to-end open source machine learning platform.",
        image: "https://cdn.iconscout.com/icon/free/png-512/free-tensorflow-282885.png"
      },
      { 
        title: "Django", 
        url: "https://github.com/django/django",
        desc: "The Web framework for perfectionists with deadlines.",
        image: "https://static.djangoproject.com/img/logos/django-logo-negative.png"
      },
      { 
        title: "Node.js", 
        url: "https://github.com/nodejs/node",
        desc: "JavaScript runtime built on Chrome's V8 engine.",
        image: "https://nodejs.org/static/images/logo.svg"
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
    <div className="p-6 max-w-7xl mx-auto">
      <h3 className="font-extrabold text-4xl text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-300 dark:via-indigo-300 dark:to-blue-300 mb-10 drop-shadow-lg">
         GitHub Resources
      </h3>

      {/* Search Bar */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search for repositories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-2xl px-5 py-3 rounded-full border border-gray-300 dark:border-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md text-gray-800 dark:text-gray-100 text-lg"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin h-10 w-10 border-t-4 border-purple-600 border-solid rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource, index) => (
              <div
                key={index}
                className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md"
              >
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  {/* Thumbnail */}
                  <div className="flex justify-center items-center bg-gray-50 dark:bg-gray-900 h-40 p-4">
                    <img
                      src={resource.image}
                      alt={resource.title}
                      className="max-h-full object-contain"
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 truncate">
                      {resource.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {resource.desc}
                    </p>
                    <span className="text-purple-600 dark:text-purple-400 font-medium text-sm">
                      View on GitHub →
                    </span>
                  </div>
                </a>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No GitHub repositories found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GitHubResources;
