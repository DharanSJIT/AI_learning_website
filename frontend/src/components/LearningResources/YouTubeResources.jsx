import React, {useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';
import { Search, Youtube, Loader2, AlertTriangle } from 'lucide-react';

// Helper function to format the date
const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diffInSeconds = (date.getTime() - Date.now()) / 1000;
  const diffInDays = diffInSeconds / (60 * 60 * 24);

  if (Math.abs(diffInDays) < 30) {
    return formatter.format(Math.round(diffInDays), 'day');
  }
  const diffInMonths = diffInDays / 30;
  if (Math.abs(diffInMonths) < 12) {
    return formatter.format(Math.round(diffInMonths), 'month');
  }
  return formatter.format(Math.round(diffInMonths / 12), 'year');
};

const YouTubeResources = ({ query }) => {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState(query || 'React tutorials');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const maxResults = 6;

  const debouncedSearch = useMemo(() => debounce((q) => {
    setSearchQuery(q);
  }, 600), []);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    if (searchQuery) {
      fetchYouTubeResources(searchQuery);
    } else {
      setResources([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const fetchYouTubeResources = async (currentQuery) => {
    setLoading(true);
    setError(null);

    if (!apiKey) {
      setError("YouTube API key is missing. Please add VITE_YOUTUBE_API_KEY to your .env file.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search", {
          params: {
            part: 'snippet',
            maxResults: maxResults,
            q: currentQuery,
            type: 'video',
            key: apiKey,
          },
        }
      );
      setResources(response.data.items || []);
    } catch (err) {
      setError('⚠️ Failed to fetch YouTube data. The API quota may be exceeded.');
      console.error("Error fetching YouTube data:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-red-500 mb-4" />
          <p className="text-gray-600">Fetching videos...</p>
        </div>
      );
    }
    
    if (error) {
       return (
         <div className="col-span-full flex flex-col items-center justify-center py-16 text-center bg-red-50/50 rounded-2xl">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h4 className="text-lg font-semibold text-red-700">An Error Occurred</h4>
          <p className="text-red-600 max-w-md">{error}</p>
        </div>
       );
    }
    
    if (resources.length === 0) {
      return (
         <div className="col-span-full flex flex-col items-center justify-center py-16 text-center bg-gray-50/50 rounded-2xl">
          <Youtube className="w-12 h-12 text-gray-400 mb-4" />
          <h4 className="text-lg font-semibold text-gray-700">No Resources Found</h4>
          <p className="text-gray-500">Try a different search query to find YouTube videos.</p>
        </div>
      );
    }
    
    return resources.map((resource) => (
      <div
        key={resource.id?.videoId || resource.etag}
        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-red-200 transition-all duration-300 flex flex-col overflow-hidden"
      >
        <div className="relative">
            <img
            src={resource.snippet.thumbnails.high.url}
            alt={resource.snippet.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
            <p className="text-xs text-gray-500 mb-2">{resource.snippet.channelTitle} • {formatDate(resource.snippet.publishedAt)}</p>
            <h4 className="font-bold text-gray-800 mb-3 line-clamp-2 flex-grow">
                {resource.snippet.title}
            </h4>
            <a
            href={`https://www.youtube.com/watch?v=${resource.id.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
            >
            <Youtube size={16} />
            Watch on YouTube
            </a>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Modified as requested */}
        <div className="mb-10">
            <h1 className="font-bold text-4xl text-gray-800 text-center mb-2">
                🎥 Explore YouTube Resources
            </h1>
        </div>
        
        {/* Search Bar */}
<div className="flex justify-center mb-12">
    <div className="relative w-full max-w-2xl">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
            type="text"
            defaultValue={query || "React tutorials"}
            placeholder="Search for videos, tutorials, courses..."
            onChange={(e) => debouncedSearch(e.target.value)}
            className="w-full pl-14 pr-5 py-4 text-md bg-white/70 backdrop-blur-md text-gray-800 placeholder-gray-500 rounded-full border border-gray-200 shadow-md  transition"
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

export default YouTubeResources;
