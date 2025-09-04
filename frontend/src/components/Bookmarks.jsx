import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  Trash2,
  FileText,
  Search,
  Upload,
  FolderArchive,
} from "lucide-react";

export default function Bookmarks() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const addBookmark = () => {
    if (!title.trim() || !category.trim()) return;

    const newBookmark = {
      id: Date.now(), // Add a unique id for better key prop
      title,
      description,
      category,
      file: file ? URL.createObjectURL(file) : null,
      fileName: file ? file.name : null,
    };

    setBookmarks([newBookmark, ...bookmarks]); // Add new bookmarks to the top
    setTitle("");
    setDescription("");
    setCategory("");
    setFile(null);
    setFileName("");
  };

  const deleteBookmark = (id) => {
    const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
    setBookmarks(updatedBookmarks);
  };

  const filteredBookmarks = bookmarks.filter(
    (bookmark) =>
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back to Dashboard Button */}
        <Link
          to="/home"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 font-medium transition-colors group"
        >
          <svg
            className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </Link>

        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            BookBank
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personal space to save, categorize, and manage important
            resources.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Input Form Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 md:p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
              <Bookmark className="w-6 h-6 text-indigo-500" />
              Add a New Bookmark
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Bookmark Title (e.g., React Hooks Guide)"
                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition"
              />
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category (e.g., Web Development)"
                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description..."
                rows={3}
                className="md:col-span-2 w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition"
              />
              <div className="md:col-span-2">
                <label
                  htmlFor="file-upload"
                  className="w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 hover:border-indigo-400 transition"
                >
                  <Upload className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600 font-medium">
                    {fileName || "Upload a related file (PDF, TXT, DOCX)"}
                  </span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.txt,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  onClick={addBookmark}
                  disabled={!title.trim() || !category.trim()}
                  className="w-full mt-2 py-4 px-6 rounded-xl font-semibold text-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  Add Bookmark
                </button>
              </div>
            </div>
          </div>

          {/* Bookmarks List Section */}
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                Your Collection
              </h3>
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bookmarks..."
                  className="w-full md:w-80 pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition"
                />
              </div>
            </div>

            {filteredBookmarks.length > 0 ? (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-transparent hover:border-indigo-300 transition-all duration-300 flex flex-col"
                  >
                    <div className="p-6 flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-gray-800 mb-2 flex-1 pr-2">
                          {bookmark.title}
                        </h3>
                        <button
                          onClick={() => deleteBookmark(bookmark.id)}
                          className="p-2 text-gray-400 rounded-full hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {bookmark.description || "No description provided."}
                      </p>
                    </div>
                    <div className="px-6 py-4 bg-slate-50/50 rounded-b-2xl border-t border-slate-100 flex items-center justify-between gap-4">
                      <span className="inline-flex items-center gap-2 text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full font-medium">
                        <FolderArchive className="w-3 h-3" />{" "}
                        {bookmark.category}
                      </span>
                      {bookmark.file && (
                        <a
                          href={bookmark.file}
                          className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium transition"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="w-4 h-4" />
                          View File
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white/50 rounded-2xl border border-dashed">
                <Bookmark className="mx-auto w-16 h-16 text-gray-300" />
                <h3 className="mt-4 text-xl font-semibold text-gray-700">
                  No Bookmarks Found
                </h3>
                <p className="mt-2 text-gray-500">
                  {searchQuery
                    ? "Try adjusting your search query."
                    : "Add your first bookmark using the form above!"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
