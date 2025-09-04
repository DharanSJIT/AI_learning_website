import React, { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';
import { Search, School, Loader2, BookOpen, ArrowRight } from 'lucide-react';

const UdemyResources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUdemyResources();
  }, []);

  const fetchUdemyResources = () => {
    setLoading(true);
    // Simulate a network delay for a better loading experience
    setTimeout(() => {
      const fetchedResources = [
        { title: "React for Beginners", url: "https://www.udemy.com/course/react-for-beginners/", category: "Web Development" },
        { title: "JavaScript Essentials", url: "https://www.udemy.com/course/javascript-essentials/", category: "Programming" },
        { title: "Python Data Science Masterclass", url: "https://www.udemy.com/course/python-data-science/", category: "Data Science" },
        { title: "Java Programming Masterclass", url: "https://www.udemy.com/course/java-the-complete-java-developer-course/", category: "Programming" },
        { title: "CSS - The Complete Guide", url: "https://www.udemy.com/course/css-the-complete-guide/", category: "Web Development" },
        { title: "Node.js - The Complete Guide", url: "https://www.udemy.com/course/nodejs-the-complete-guide/", category: "Backend Development" },
      ];
      setResources(fetchedResources);
      setFilteredResources(fetchedResources);
      setLoading(false);
    }, 800);
  };

  const debouncedSearch = useMemo(() =>
    debounce((query) => {
      if (!query.trim()) {
        setFilteredResources(resources);
      } else {
        const lowercasedQuery = query.toLowerCase();
        setFilteredResources(
          resources.filter(course =>
            course.title.toLowerCase().includes(lowercasedQuery) ||
            course.category.toLowerCase().includes(lowercasedQuery)
          )
        );
      }
    }, 400),
    [resources]
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
          <p className="text-gray-600">Loading courses...</p>
        </div>
      );
    }

    if (filteredResources.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center bg-gray-50/50 rounded-2xl">
          <School className="w-12 h-12 text-gray-400 mb-4" />
          <h4 className="text-lg font-semibold text-gray-700">No Courses Found</h4>
          <p className="text-gray-500">Try adjusting your search query.</p>
        </div>
      );
    }

    return filteredResources.map((resource, index) => (
      <div
        key={index}
        className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100/50 transition-all duration-300 flex flex-col"
      >
        <div className="p-6 flex flex-col flex-grow">
          <span className="inline-block self-start px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-4">
            {resource.category}
          </span>
          <h4 className="font-bold text-xl text-gray-800 mb-3 line-clamp-2 flex-grow">
            {resource.title}
          </h4>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors"
          >
            View Course <ArrowRight size={16} />
          </a>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-auto  pt-12 pb-[40px] px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
<h1 className="text-5xl font-bold text-center mb-2 text-gray-800">🎓 Udemy Courses</h1>
<p className="text-lg text-center mt-4 text-gray-600">Find professional online courses to advance your skills.</p>
</div>

        {/* --- UPDATED SEARCH BAR --- */}
        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for courses by title or category..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full pl-14 pr-5 py-4 text-md bg-white/70 backdrop-blur-md text-gray-800 placeholder-gray-500 rounded-full border border-gray-200 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default UdemyResources;
