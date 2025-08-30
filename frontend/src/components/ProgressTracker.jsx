import React, { useState } from "react";
import { Link } from "react-router-dom"; // <-- Import

export default function ProgressTracker() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(0);

  // Add a new task
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

  // Delete a task
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    calculateProgress(updatedTasks);
  };

  // Edit a task
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

  // Toggle task completion
  const toggleCompletion = (index) => {
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    calculateProgress(updatedTasks);
  };

  // Add a subtask
  const addSubtask = (index, subtask) => {
    const updatedTasks = tasks.map((t, i) =>
      i === index
        ? { ...t, subtasks: [...t.subtasks, { name: subtask, completed: false }] }
        : t
    );
    setTasks(updatedTasks);
    calculateProgress(updatedTasks);
  };

  // Mark a subtask as completed
  const toggleSubtaskCompletion = (taskIndex, subtaskIndex) => {
    const updatedTasks = tasks.map((t, i) =>
      i === taskIndex
        ? {
            ...t,
            subtasks: t.subtasks.map((sub, si) =>
              si === subtaskIndex ? { ...sub, completed: !sub.completed } : sub
            ),
          }
        : t
    );
    setTasks(updatedTasks);
    calculateProgress(updatedTasks);
  };

  // Calculate progress percentage
  const calculateProgress = (tasks) => {
    const completed = tasks.filter((task) => task.completed).length;
    setCompletedTasks(completed);
  };

  // Calculate the progress bar width
  const progress = tasks.length === 0 ? 0 : (completedTasks / tasks.length) * 100;


  return (

    <div className="p-6 bg-white rounded-2xl shadow-lg w-[70vw] mx-auto mt-[70px]">
        <Link
                to="/home"
                className="inline-block mb-4 text-sm text-blue-600 hover:underline"
              >
                ← Back to Dashboard
              </Link>
      <h2 className="font-bold text-xl text-slate-800 mb-4">📈 Progress Tracker</h2>

      {/* Back to Dashboard Button */}
     
      {/* Input Section */}
      <div className="flex flex-col gap-3 mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a task..."
          className="p-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Add task description..."
          className="p-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="p-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>
        <button
          onClick={isEditing ? saveEdit : addTask}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
        >
          {isEditing ? "Save Task" : "Add Task"}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
        <div
          className="h-full bg-green-600 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-slate-600">
        {completedTasks} / {tasks.length} tasks completed ({progress.toFixed(0)}%)
      </p>

      {/* Task List */}
      {tasks.length > 0 ? (
        <ul className="space-y-3 text-sm text-slate-700 mt-4">
          {tasks.map((t, i) => (
            <li key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border">
              <div className="flex-1">
                <p className={`${t.completed ? "line-through text-gray-500" : ""}`}>
                  <strong>{t.name}</strong> - {t.priority}
                </p>
                <p className="text-xs text-slate-500">{t.description}</p>
                <p className="text-xs text-slate-500">Due: {t.dueDate}</p>
                <div>
                  {t.subtasks.length > 0 && (
                    <ul className="pl-4">
                      {t.subtasks.map((sub, si) => (
                        <li
                          key={si}
                          className={`${sub.completed ? "line-through text-gray-500" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={sub.completed}
                            onChange={() => toggleSubtaskCompletion(i, si)}
                          />
                          {sub.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleCompletion(i)}
                  className={`px-2 py-1 ${t.completed ? "bg-gray-400 text-white" : "bg-green-500 text-white"} rounded hover:bg-green-600 text-xs`}
                >
                  {t.completed ? "Undo" : "Complete"}
                </button>
                <button
                  onClick={() => startEditing(i)}
                  className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(i)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                >
                  Delete
                </button>
                <button
                  onClick={() => addSubtask(i, "New Subtask")}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                >
                  Add Subtask
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-500 text-sm">No tasks yet. Add one above! ✍️</p>
      )}
    </div>
  );
}
