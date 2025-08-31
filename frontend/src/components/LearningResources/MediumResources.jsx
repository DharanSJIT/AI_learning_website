import React, { useState, useEffect } from "react";

const MediumResources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMediumResources();
  }, []);

  const fetchMediumResources = async () => {
    setLoading(true);

    const fetchedResources = [
      {
        title: "The Road to Learn React",
        url: "https://medium.com/the-road-to-learn-react",
        description: "A beginner-friendly guide to mastering React step by step.",
        author: "Robin Wieruch",
        tags: ["React", "Frontend", "Web Dev"],
      },
      {
        title: "JavaScript Algorithms",
        url: "https://medium.com/javascript-algorithms",
        description:
          "Deep dive into algorithms using JavaScript for coding interviews.",
        author: "Oleksii Trekhleb",
        tags: ["JavaScript", "DSA", "Coding"],
      },
      {
        title: "Python for Data Science",
        url: "https://medium.com/python-for-data-science",
        description:
          "Learn Python for data analysis, machine learning, and visualization.",
        author: "Jane Doe",
        tags: ["Python", "Data Science", "Machine Learning"],
      },
      {
        title: "CSS Mastery",
        url: "https://medium.com/css-mastery",
        description: "Advanced CSS techniques for modern web development.",
        author: "John Smith",
        tags: ["CSS", "Frontend", "Design"],
      },
      {
        title: "Node.js Guide",
        url: "https://medium.com/nodejs-guide",
        description: "Learn Node.js and build scalable backend applications.",
        author: "Sarah Connor",
        tags: ["Node.js", "Backend", "JavaScript"],
      },
      {
        title: "Machine Learning Basics",
        url: "https://medium.com/machine-learning-basics",
        description:
          "Introduction to machine learning concepts and algorithms.",
        author: "Alan Turing",
        tags: ["Machine Learning", "AI", "Data Science"],
      },
    ];

    setResources(fetchedResources);
    setFilteredResources(fetchedResources);
    setLoading(false);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredResources(resources);
    } else {
      setFilteredResources(
        resources.filter((r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mb-12">
      {/* Title */}
      <h3 className="font-extrabold text-4xl text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-300 dark:via-purple-300 dark:to-pink-300 mb-10 drop-shadow-lg">
        Medium Resources
      </h3>

      {/* Search Bar */}
      <div className="flex mb-10 shadow-md rounded-2xl overflow-hidden">
        <input
          type="text"
          placeholder="Search Medium Articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow pl-4 pr-4 py-3 text-sm bg-white/70 dark:bg-gray-800/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 dark:text-gray-200"
        />
        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin h-10 w-10 border-t-2 border-indigo-600 border-solid rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource, index) => (
              <div
                key={index}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6"
              >
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-2 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors">
                    {resource.title}
                  </h4>
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {resource.description}
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
                  ✍️ {resource.author}
                </p>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-800 dark:to-purple-800 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500 dark:text-gray-400">
              No resources found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MediumResources;
