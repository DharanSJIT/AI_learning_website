import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { Search } from "lucide-react"; // icon for search

const YouTubeResources = ({ query }) => {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API key (move to .env in real projects)
const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
// ...existing code...
  const maxResults = 6;

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((q) => {
        setSearchQuery(q);
      }, 500),
    []
  );

  // Cleanup debounce timers
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Fetch resources
  useEffect(() => {
    if (searchQuery) {
      fetchYouTubeResources(searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const fetchYouTubeResources = async (searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            maxResults: maxResults,
            q: searchQuery,
            type: "video",
            key: apiKey,
          },
        }
      );
      setResources(response.data.items || []);
    } catch (error) {
      setError("⚠️ Failed to fetch YouTube data. Please try again later.");
      console.error("Error fetching YouTube data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl max-w-5xl mx-auto transition-all duration-500">
      <h3 className="font-extrabold text-3xl text-slate-800 dark:text-white mb-8 text-center tracking-tight">
        🎥 Explore YouTube Resources
      </h3>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-3.5 text-slate-400 dark:text-gray-300" />
        <input
          type="text"
          placeholder="Search YouTube Courses..."
          onChange={(e) => debouncedSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white shadow-sm transition-all duration-300"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center mb-6">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500 font-medium">{error}</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {resources.length > 0 ? (
            resources.map((resource) => (
              <a
                key={resource.id?.videoId || resource.etag}
                href={`https://www.youtube.com/watch?v=${resource.id.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 duration-300"
              >
                {/* Thumbnail */}
                <img
                  src={resource.snippet.thumbnails.high.url}
                  alt={resource.snippet.title}
                  className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition duration-300"></div>

                {/* Content */}
                <div className="absolute bottom-0 p-4 text-white">
                  <h4 className="font-bold text-lg mb-1 line-clamp-2">
                    {resource.snippet.title}
                  </h4>
                  <p className="text-xs opacity-80 mb-1">
                    {resource.snippet.channelTitle}
                  </p>
                  <p className="text-sm opacity-90 line-clamp-2">
                    {resource.snippet.description.length > 80
                      ? `${resource.snippet.description.substring(0, 80)}...`
                      : resource.snippet.description}
                  </p>
                </div>
              </a>
            ))
          ) : (
            <p className="text-center text-slate-500 dark:text-gray-400 col-span-2">
              No resources found. Try another search! 🔍
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default YouTubeResources;
