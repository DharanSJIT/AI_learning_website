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
    // Example placeholder - Replace this with actual Coursera API request if available
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

  // Filter resources based on search term
  const filteredResources = resources.filter((res) =>
    res.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-6xl mx-auto">
      <h3 className="font-semibold text-2xl text-slate-800 dark:text-white mb-6 text-center">
        Coursera Resources
      </h3>

      {/* 🔍 Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search for a course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-2/3 lg:w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin h-10 w-10 border-t-2 border-indigo-600 border-solid rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource, index) => (
              <div
                key={index}
                className="p-5 bg-indigo-50 dark:bg-indigo-900 rounded-xl shadow-md hover:shadow-2xl transition duration-300 transform hover:scale-105"
              >
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <h4 className="font-semibold text-lg text-slate-800 dark:text-white mb-2">
                    {resource.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
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
