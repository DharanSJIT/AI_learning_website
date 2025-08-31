import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircleIcon, PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";

export default function ProgressTracker() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(0);

  const addTask = () => {
    if (!task.trim()) return;
    const newTask = {
      name: task,
      description: taskDescription,
      completed: false,
      dueDate: dueDate,
      priority: priority,
      subtasks: [],
    };
    setTasks([...tasks, newTask]);
    setTask("");
    setTaskDescription("");
    setDueDate("");
    setPriority("Medium");
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    calculateProgress(updatedTasks);
  };

  const startEditing = (index) => {
    setIsEditing(true);
    setEditingIndex(index);
    setTask(tasks[index].name);
    setTaskDescription(tasks[index].description);
    setDueDate(tasks[index].dueDate);
    setPriority(tasks[index].priority);
  };

  const saveEdit = () => {
    const updatedTasks = tasks.map((t, i) =>
      i === editingIndex
        ? { ...t, name: task, description: taskDescription, dueDate, priority }
        : t
    );
    setTasks(updatedTasks);
    setIsEditing(false);
    setTask("");
    setTaskDescription("");
    setDueDate("");
    setPriority("Medium");
    calculateProgress(updatedTasks);
  };

  const toggleCompletion = (index) => {
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    calculateProgress(updatedTasks);
  };

  const calculateProgress = (tasks) => {
    const completed = tasks.filter((task) => task.completed).length;
    setCompletedTasks(completed);
  };

  const progress =
    tasks.length === 0 ? 0 : (completedTasks / tasks.length) * 100;

  // Priority badge styling
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-600";
      case "Medium":
        return "bg-yellow-100 text-yellow-600";
      case "Low":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 rounded-2xl shadow-xl w-[70vw] mx-auto mt-[70px]">
      {/* Back Button */}
      <Link
        to="/home"
        className="inline-block mb-6 text-blue-600 font-medium hover:underline"
      >
        ← Back to Dashboard
      </Link>

      {/* Title */}
      <h2 className="font-extrabold text-2xl text-slate-800 mb-6 tracking-tight">
        📈 Task Progress Tracker
      </h2>

      {/* Input Section */}
      <div className="flex flex-col gap-3 mb-6 bg-white p-5 rounded-xl shadow-sm">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a task..."
          className="p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Task description..."
          className="p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex gap-3 flex-wrap">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Low">Low 🌱</option>
            <option value="Medium">Medium ⚡</option>
            <option value="High">High 🚨</option>
          </select>
        </div>
        <button
          onClick={isEditing ? saveEdit : addTask}
          className="px-5 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
        >
          {isEditing ? "💾 Save Task" : "➕ Add Task"}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-3 rounded-full mb-4">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-md transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-slate-600 font-medium mb-4">
        ✅ {completedTasks} / {tasks.length} completed ({progress.toFixed(0)}%)
      </p>

      {/* Task List */}
      {tasks.length > 0 ? (
        <ul className="space-y-4">
          {tasks.map((t, i) => (
            <li
              key={i}
              className="flex justify-between items-start p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p
                    className={`font-semibold text-base ${
                      t.completed ? "line-through text-gray-400" : "text-gray-800"
                    }`}
                  >
                    {t.name}
                  </p>
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getPriorityStyle(
                      t.priority
                    )}`}
                  >
                    {t.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{t.description}</p>
                <p className="text-xs text-gray-400 mt-1">📅 Due: {t.dueDate}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleCompletion(i)}
                  className="p-2 rounded-full hover:bg-green-100"
                  title="Complete / Undo"
                >
                  <CheckCircleIcon
                    className={`h-6 w-6 ${
                      t.completed ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                </button>
                <button
                  onClick={() => startEditing(i)}
                  className="p-2 rounded-full hover:bg-yellow-100"
                  title="Edit"
                >
                  <PencilIcon className="h-6 w-6 text-yellow-500" />
                </button>
                <button
                  onClick={() => deleteTask(i)}
                  className="p-2 rounded-full hover:bg-red-100"
                  title="Delete"
                >
                  <TrashIcon className="h-6 w-6 text-red-500" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-500 text-center text-sm mt-6">
          No tasks yet 🚀 Start by adding one above!
        </p>
      )}
    </div>
  );
}
