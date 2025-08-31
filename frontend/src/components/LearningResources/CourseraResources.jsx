import React, { useState, useEffect } from 'react';

const CourseraResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourseraResources();
  }, []);

  const fetchCourseraResources = async () => {
    setLoading(true);
    // Example placeholder - Replace with Coursera API if available
    const fetchedResources = [
      { title: 'Machine Learning by Stanford', url: 'https://www.coursera.org/learn/machine-learning' },
      { title: 'Deep Learning Specialization', url: 'https://www.coursera.org/specializations/deep-learning' },
      { title: 'Python for Everybody', url: 'https://www.coursera.org/specializations/python' },
      { title: 'Data Science Specialization', url: 'https://www.coursera.org/specializations/jhu-data-science' },
      { title: 'Google IT Automation with Python', url: 'https://www.coursera.org/professional-certificates/google-it-automation' },
      { title: 'AI For Everyone by Andrew Ng', url: 'https://www.coursera.org/learn/ai-for-everyone' },
    ];
    setResources(fetchedResources);
    setLoading(false);
  };

  // Filter resources by search term
  const filteredResources = resources.filter((res) =>
    res.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Title */}
      <h3 className="font-extrabold text-3xl text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-300 dark:via-indigo-300 dark:to-purple-300 drop-shadow-md">
        🎓 Coursera Resources
      </h3>

      {/* Search Bar */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search for a course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-2/3 lg:w-1/2 px-5 py-3 rounded-full border border-gray-300 dark:border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md text-gray-800 dark:text-gray-100 text-lg"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin h-10 w-10 border-t-4 border-blue-600 border-solid rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md"
              >
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    {resource.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Click to explore this course on Coursera.
                  </p>
                </a>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No courses match your search.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseraResources;
