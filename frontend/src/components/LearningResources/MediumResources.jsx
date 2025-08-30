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
      { title: "The Road to Learn React", url: "https://medium.com/the-road-to-learn-react", description: "A beginner-friendly guide to mastering React step by step.", author: "Robin Wieruch", tags: ["React", "Frontend", "Web Dev"] },
      { title: "JavaScript Algorithms", url: "https://medium.com/javascript-algorithms", description: "Deep dive into algorithms using JavaScript for coding interviews.", author: "Oleksii Trekhleb", tags: ["JavaScript", "DSA", "Coding"] },
      { title: "Python for Data Science", url: "https://medium.com/python-for-data-science", description: "Learn Python for data analysis, machine learning, and visualization.", author: "Jane Doe", tags: ["Python", "Data Science", "Machine Learning"] },
      { title: "CSS Mastery", url: "https://medium.com/css-mastery", description: "Advanced CSS techniques for modern web development.", author: "John Smith", tags: ["CSS", "Frontend", "Design"] },
      { title: "Node.js Guide", url: "https://medium.com/nodejs-guide", description: "Learn Node.js and build scalable backend applications.", author: "Sarah Connor", tags: ["Node.js", "Backend", "JavaScript"] },
      { title: "Machine Learning Basics", url: "https://medium.com/machine-learning-basics", description: "Introduction to machine learning concepts and algorithms.", author: "Alan Turing", tags: ["Machine Learning", "AI", "Data Science"] },
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
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg max-w-7xl mx-auto mb-12">
      <h3 className="font-bold text-3xl text-slate-800 dark:text-white mb-8 text-center">
        Medium Resources
      </h3>

      {/* Search Bar */}
      <div className="flex mb-6">
        <input
          type="text"
          placeholder="Search Medium Articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow pl-4 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white shadow-sm"
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-4 py-3 rounded-r-2xl hover:bg-indigo-700 transition-colors duration-300"
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
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105 p-5"
              >
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h4 className="font-semibold text-lg text-slate-800 dark:text-white mb-2 hover:text-indigo-600 dark:hover:text-indigo-300">
                    {resource.title}
                  </h4>
                </a>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
                  {resource.description}
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
                  ✍️ {resource.author}
                </p>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-indigo-100 text-indigo-600 dark:bg-indigo-800 dark:text-indigo-300 rounded-full text-xs font-medium"
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
