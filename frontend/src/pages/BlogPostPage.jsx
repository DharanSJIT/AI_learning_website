import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogData } from '../blogData';
import { ArrowLeft, Calendar, User } from 'lucide-react';

export default function BlogPostPage() {
  const { postId } = useParams();
  const post = blogData.find((p) => p.id.toString() === postId);

  if (!post) {
    return (
      <div className="text-center py-24">
        <h1 className="text-2xl font-bold">Post not found!</h1>
        <Link to="/blog" className="text-blue-500 hover:underline mt-4 inline-block">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 py-16 sm:py-24 mt-[-5vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to all articles
        </Link>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {post.title}
        </h1>
        
        <div className="mt-6 flex items-center text-gray-500 dark:text-gray-400 space-x-4">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            <span>Published on {post.date}</span>
          </div>
        </div>

        <img 
          src={post.imageUrl} 
          alt={post.title}
          className="mt-8 w-full rounded-2xl shadow-lg aspect-video object-cover" 
        />
        
        <div 
          className="mt-8 prose prose-lg dark:prose-invert max-w-none prose-h2:font-bold prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

      </div>
    </div>
  );
}