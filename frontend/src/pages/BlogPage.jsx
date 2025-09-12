import React from 'react';
import { Link } from 'react-router-dom';
import { blogData } from '../blogData';
import { ArrowRight, Calendar, User } from 'lucide-react';

export default function BlogPage() {
  const featuredPost = blogData[0];
  const otherPosts = blogData.slice(1);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-16 sm:py-24 mt-[-5vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Our Blog
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
            Insights, articles, and updates from our team to help you on your learning journey.
          </p>
        </div>
        
        {/* Featured Post */}
        <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <img src={featuredPost.imageUrl} alt={featuredPost.title} className="h-full w-full object-cover" />
          <div className="p-8">
            <p className="text-sm text-blue-500 font-semibold">Featured Article</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              <Link to={`/blog/${featuredPost.id}`} className="hover:underline">{featuredPost.title}</Link>
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">{featuredPost.summary}</p>
            <div className="mt-6 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <User className="w-4 h-4 mr-2" /> {featuredPost.author}
              <span className="mx-2">|</span>
              <Calendar className="w-4 h-4 mr-2" /> {featuredPost.date}
            </div>
          </div>
        </div>

        {/* Other Posts Grid */}
        <div className="mt-16 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {otherPosts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col">
              <img src={post.imageUrl} alt={post.title} className="h-48 w-full object-cover"/>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  <Link to={`/blog/${post.id}`} className="hover:underline">{post.title}</Link>
                </h3>
                <p className="mt-3 text-gray-600 dark:text-gray-300 flex-grow">{post.summary}</p>
                <div className="mt-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                   <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" /> {post.author}
                   </div>
                   <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" /> {post.date}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}