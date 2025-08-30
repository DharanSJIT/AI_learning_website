import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCheck, FaTrash, FaRobot, FaSync, FaEdit, FaSave, FaTimes } from "react-icons/fa";

export default function AI_TodoList() {
  const [taskText, setTaskText] = useState("");
  const [query, setQuery] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [editQuery, setEditQuery] = useState("");

  const addTask = () => {
    if (!taskText.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: taskText,
        query,
        imageUrl,
        dueDate: dueDate ? new Date(dueDate) : null,
        aiContent: "",
        completed: false,
        loading: "",
      },
    ]);
    setTaskText("");
    setQuery("");
    setImageUrl("");
    setDueDate("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    if (editTaskId === id) cancelEdit();
  };

  const toggleCompletion = (id) => {
    setTasks(tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const getRemainingTime = (due) => {
    if (!due) return "No deadline";
    const now = new Date();
    const diff = new Date(due) - now;
    if (diff <= 0) return "Overdue";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  useEffect(() => {
    const interval = setInterval(() => setTasks((t) => [...t]), 60000);
    return () => clearInterval(interval);
  }, []);

  const analyzeTask = async (taskId) => {
    setTasks(tasks.map((t) =>
      t.id === taskId ? { ...t, loading: "Analyzing..." } : t
    ));

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/gemini/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: task.query })
      });
      const data = await res.json();
      const cleanText = data.text.replace(/\*/g, "");
      setTasks(tasks.map((t) =>
        t.id === taskId ? { ...t, aiContent: cleanText, loading: "" } : t
      ));
    } catch (err) {
      console.error("Gemini API Error:", err);
      setTasks(tasks.map((t) =>
        t.id === taskId ? { ...t, loading: "Error" } : t
      ));
    }
  };

  const summarizeTask = async (taskId) => {
    setTasks(tasks.map((t) =>
      t.id === taskId ? { ...t, loading: "Summarizing..." } : t
    ));

    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.aiContent) return;

    try {
      const res = await fetch("http://localhost:4000/api/gemini/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: task.aiContent })
      });
      const data = await res.json();
      const cleanSummary = data.summary.replace(/\*/g, "");
      setTasks(tasks.map((t) =>
        t.id === taskId ? { ...t, aiContent: cleanSummary, loading: "" } : t
      ));
    } catch (err) {
      console.error("Gemini Summarize Error:", err);
      setTasks(tasks.map((t) =>
        t.id === taskId ? { ...t, loading: "Error" } : t
      ));
    }
  };

  // Start editing a task
  const startEdit = (task) => {
    setEditTaskId(task.id);
    setEditTaskText(task.text);
    setEditQuery(task.query);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditTaskId(null);
    setEditTaskText("");
    setEditQuery("");
  };

  // Save edited task
  const saveEdit = () => {
    setTasks(tasks.map(t =>
      t.id === editTaskId ? { ...t, text: editTaskText.trim(), query: editQuery.trim() } : t
    ));
    cancelEdit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-5xl mx-auto">
        <Link to="/home" className="text-indigo-600 hover:underline text-lg font-medium inline-block mb-4">
          ← Back to Dashboard
        </Link>
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">
          AI-Powered To-Do List
        </h2>

        {/* Task Input Form */}
        <div className="bg-white shadow-2xl rounded-xl p-6 mb-10 space-y-4">
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Enter task title..."
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Optional: Ask AI about the task..."
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          />
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Optional: Paste image URL"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          />
          <button
            onClick={addTask}
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all"
          >
            ➕ Add Task
          </button>
        </div>

        {/* Task List */}
        <ul className="space-y-6">
          {tasks.map((t) => (
            <li
              key={t.id}
              className={`group bg-white border-l-4 transition-shadow hover:shadow-xl rounded-xl p-5 ${
                t.completed ? "border-green-400 opacity-70" : "border-indigo-400"
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                {editTaskId === t.id ? (
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                      type="text"
                      value={editTaskText}
                      onChange={(e) => setEditTaskText(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <input
                      type="text"
                      value={editQuery}
                      onChange={(e) => setEditQuery(e.target.value)}
                      placeholder="Edit AI query..."
                      className="flex-1 px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className={`text-xl font-semibold flex-1 ${t.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                      {t.text}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleCompletion(t.id)}
                        title="Toggle complete"
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => startEdit(t)}
                        title="Edit task"
                        className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteTask(t.id)}
                        title="Delete task"
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {t.imageUrl && (
                <img src={t.imageUrl} alt="Task" className="rounded-xl max-h-64 object-cover w-full mb-3 shadow-sm" />
              )}

              <div className="text-sm text-gray-500">
                ⏱ <strong>Due in:</strong> {getRemainingTime(t.dueDate)}
              </div>

              {editTaskId === t.id ? (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={saveEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
                  >
                    <FaSave /> Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition-all"
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <input
                    type="text"
                    value={t.query}
                    onChange={(e) =>
                      setTasks(tasks.map(taskItem =>
                        taskItem.id === t.id ? { ...taskItem, query: e.target.value } : taskItem
                      ))
                    }
                    placeholder="Update AI prompt..."
                    className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                  />
                  <button
                    onClick={() => analyzeTask(t.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                  >
                    <FaRobot /> Analyze
                  </button>
                  {t.aiContent && (
                    <button
                      onClick={() => summarizeTask(t.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all"
                    >
                      <FaSync /> Summarize
                    </button>
                  )}
                </div>
              )}

              {t.loading && (
                <div className="mt-2 text-sm text-yellow-500 italic">{t.loading}</div>
              )}

              {t.aiContent && (
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap">
                  <span className="block mb-2 text-indigo-600 font-semibold">🤖 AI says:</span>
                  {t.aiContent}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
