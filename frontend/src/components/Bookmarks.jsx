import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Bookmarks() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const addBookmark = () => {
    if (!title.trim() || !category.trim()) return;

    const newBookmark = {
      title,
      description,
      category,
      file: file ? URL.createObjectURL(file) : null,
    };

    setBookmarks([...bookmarks, newBookmark]);
    setTitle("");
    setDescription("");
    setCategory("");
    setFile(null);
  };

  const deleteBookmark = (index) => {
    const updatedBookmarks = bookmarks.filter((_, i) => i !== index);
    setBookmarks(updatedBookmarks);
  };

  const filteredBookmarks = bookmarks.filter((bookmark) =>
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 bg-gradient-to-br from-white via-slate-50 to-white rounded-3xl shadow-2xl w-full max-w-5xl mx-auto mt-[50px] mb-[50px]">
      {/* Back to Dashboard */}
      <Link
        to="/home"
        className="inline-block mb-6 text-sm text-indigo-600 hover:underline transition-all"
      >
        ← Back to Dashboard
      </Link>

      <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-2">
        🔖 Bookbank
      </h2>

      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Bookmark Title"
          className="p-4 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="p-4 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={3}
          className="p-4 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition col-span-1 md:col-span-2"
        />
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Upload File (PDF/Notes)
          </label>
          <input
            type="file"
            accept=".pdf,.txt,.docx"
            onChange={handleFileChange}
            className="p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <button
            onClick={addBookmark}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300"
          >
            ➕ Add Bookmark
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-10">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search bookmarks by title..."
          className="p-4 border rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>

      {/* Bookmarks List */}
      {filteredBookmarks.length > 0 ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookmarks.map((bookmark, index) => (
            <div
              key={index}
              className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-xl text-slate-800 mb-2">
                  {bookmark.title}
                </h3>
                <p className="text-sm text-slate-500 mb-2">
                  {bookmark.description}
                </p>
                <span className="inline-block text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full mb-3">
                  📁 {bookmark.category}
                </span>
                {bookmark.file && (
                  <a
                    href={bookmark.file}
                    className="text-blue-500 text-sm hover:text-blue-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📄 View File
                  </a>
                )}
              </div>
              <button
                onClick={() => deleteBookmark(index)}
                className="mt-4 px-4 py-2 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600 transition"
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-sm text-center">
          No bookmarks found. Add some above! ✍️
        </p>
      )}
    </div>
  );
}
