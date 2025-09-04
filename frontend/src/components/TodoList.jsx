import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaCheck, FaTrash, FaRobot, FaSync, FaEdit, FaSave, FaTimes, FaSignOutAlt, FaRedo } from "react-icons/fa";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query as firestoreQuery, 
  where, 
  orderBy, 
  onSnapshot,
  getDocs,
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout, signInWithGoogle } from "../firebase";

export default function AI_TodoList() {
  const [user, loading, error] = useAuthState(auth);
  const [taskText, setTaskText] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [editAiPrompt, setEditAiPrompt] = useState("");
  const [tasksLoading, setTasksLoading] = useState(false);
  const [indexError, setIndexError] = useState(null);
  const [backendUrl, setBackendUrl] = useState("");
  const [useRealtimeListener, setUseRealtimeListener] = useState(true);
  
  // Local state for AI content (not stored in Firestore)
  const [aiContent, setAiContent] = useState({}); // taskId -> aiContent
  const [loadingStates, setLoadingStates] = useState({}); // taskId -> loading message

  // Check backend URL on component mount
  useEffect(() => {
    const url = import.meta.env.VITE_BACKEND_URL;
    setBackendUrl(url || "Backend URL not configured");
    console.log("Backend URL:", url);
  }, []);

  // Improved fallback method to fetch tasks
  const fetchTasksManually = useCallback(async () => {
    if (!user) return;
    
    setTasksLoading(true);
    try {
      console.log("Fetching tasks manually for user:", user.uid);
      
      // Simple query without orderBy to avoid index requirement
      const tasksQuery = firestoreQuery(
        collection(db, "tasks"),
        where("userId", "==", user.uid)
      );
      
      const snapshot = await getDocs(tasksQuery);
      const tasksData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dueDate: data.dueDate?.toDate() || null,
          createdAt: data.createdAt?.toDate() || new Date()
        };
      });
      
      // Sort on client side by creation date (newest first)
      tasksData.sort((a, b) => b.createdAt - a.createdAt);
      
      setTasks(tasksData);
      setIndexError(null);
      console.log("Tasks fetched manually:", tasksData.length, tasksData);
    } catch (error) {
      console.error("Error fetching tasks manually:", error);
      setIndexError(`Manual fetch error: ${error.message}`);
    } finally {
      setTasksLoading(false);
    }
  }, [user]);

  // Setup real-time listener with better error handling
  useEffect(() => {
    if (!user) return;

    let unsubscribe = null;

    const setupListener = async () => {
      if (!useRealtimeListener) {
        // Use manual fetch instead
        await fetchTasksManually();
        return;
      }

      setTasksLoading(true);

      try {
        // Try with real-time listener first
        const tasksQuery = firestoreQuery(
          collection(db, "tasks"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        unsubscribe = onSnapshot(
          tasksQuery, 
          (snapshot) => {
            console.log("Real-time update received");
            const tasksData = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                dueDate: data.dueDate?.toDate() || null,
                createdAt: data.createdAt?.toDate() || new Date()
              };
            });
            setTasks(tasksData);
            setTasksLoading(false);
            setIndexError(null);
            console.log("Real-time tasks loaded:", tasksData.length, tasksData);
          },
          (error) => {
            console.error("Real-time listener error:", error);
            setTasksLoading(false);
            
            if (error.code === 'failed-precondition' || error.message.includes('index')) {
              setIndexError(`Index required: ${error.message}`);
              setUseRealtimeListener(false);
              // Fallback to manual fetching
              fetchTasksManually();
            } else {
              setIndexError(`Real-time error: ${error.message}`);
            }
          }
        );
      } catch (error) {
        console.error("Error setting up listener:", error);
        setTasksLoading(false);
        setIndexError(`Setup error: ${error.message}`);
        setUseRealtimeListener(false);
        await fetchTasksManually();
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, useRealtimeListener, fetchTasksManually]);

  // Refresh tasks manually
  const refreshTasks = useCallback(async () => {
    console.log("Manual refresh triggered");
    await fetchTasksManually();
  }, [fetchTasksManually]);

  // Add task to Firestore with immediate UI update
  const addTask = async () => {
    if (!taskText.trim() || !user) return;

    try {
      console.log("Adding task for user:", user.uid);
      
      // Create optimistic update
      const tempTask = {
        id: `temp-${Date.now()}`,
        userId: user.uid,
        text: taskText.trim(),
        aiPrompt: aiPrompt.trim(),
        imageUrl: imageUrl.trim(),
        dueDate: dueDate ? new Date(dueDate) : null,
        completed: false,
        createdAt: new Date()
      };

      // Add to UI immediately
      setTasks(prevTasks => [tempTask, ...prevTasks]);

      const docRef = await addDoc(collection(db, "tasks"), {
        userId: user.uid,
        text: taskText.trim(),
        aiPrompt: aiPrompt.trim(),
        imageUrl: imageUrl.trim(),
        dueDate: dueDate ? Timestamp.fromDate(new Date(dueDate)) : null,
        completed: false,
        createdAt: serverTimestamp()
      });

      console.log("Task added with ID:", docRef.id);

      // Clear form
      setTaskText("");
      setAiPrompt("");
      setImageUrl("");
      setDueDate("");

      // Remove temp task and refresh if not using real-time
      setTasks(prevTasks => prevTasks.filter(task => task.id !== tempTask.id));
      
      if (!useRealtimeListener) {
        setTimeout(() => refreshTasks(), 1000);
      }
    } catch (error) {
      console.error("Error adding task:", error);
      // Remove temp task on error
      setTasks(prevTasks => prevTasks.filter(task => !task.id.startsWith('temp-')));
      alert(`Failed to add task: ${error.message}`);
    }
  };

  // Delete task from Firestore with optimistic update
  const deleteTask = async (id) => {
    if (!user || !id) {
      alert("Invalid task or user");
      return;
    }

    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      console.log("Attempting to delete task:", id);
      
      // Optimistic update - remove from UI immediately
      const taskToDelete = tasks.find(task => task.id === id);
      if (!taskToDelete) {
        throw new Error("Task not found");
      }
      
      if (taskToDelete.userId !== user.uid) {
        throw new Error("Unauthorized: Task doesn't belong to current user");
      }

      // Remove from UI immediately
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      
      // Clear local AI content and loading state
      setAiContent(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      setLoadingStates(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      await deleteDoc(doc(db, "tasks", id));
      console.log("Task deleted successfully");
      
      if (editTaskId === id) cancelEdit();
      
      if (!useRealtimeListener) {
        setTimeout(() => refreshTasks(), 500);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      // Restore task on error
      setTimeout(() => refreshTasks(), 500);
      alert(`Failed to delete task: ${error.message}`);
    }
  };

  // Toggle task completion with optimistic update
  const toggleCompletion = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      console.log("Toggling completion for task:", id);
      
      // Optimistic update
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );

      await updateDoc(doc(db, "tasks", id), {
        completed: !task.completed
      });
      
      if (!useRealtimeListener) {
        setTimeout(() => refreshTasks(), 500);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      // Revert optimistic update on error
      setTimeout(() => refreshTasks(), 500);
      alert(`Failed to update task: ${error.message}`);
    }
  };

  // Update task AI prompt in Firestore
  const updateTaskAiPrompt = async (id, newPrompt) => {
    try {
      // Optimistic update
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === id ? { ...t, aiPrompt: newPrompt } : t
        )
      );

      await updateDoc(doc(db, "tasks", id), {
        aiPrompt: newPrompt
      });
    } catch (error) {
      console.error("Error updating task AI prompt:", error);
      setTimeout(() => refreshTasks(), 500);
    }
  };

  // Update local AI content (not stored in Firestore)
  const updateLocalAIContent = (id, content) => {
    setAiContent(prev => ({
      ...prev,
      [id]: content
    }));
  };

  // Update local loading state (not stored in Firestore)
  const updateLocalLoadingState = (id, loadingState) => {
    setLoadingStates(prev => ({
      ...prev,
      [id]: loadingState
    }));
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

  // Timer for updating remaining time display
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(currentTasks => [...currentTasks]);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Mock AI functions for testing when backend is not available
  const mockAnalyzeTask = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.aiPrompt?.trim()) {
      alert("Please add an AI prompt for this task first.");
      return;
    }

    updateLocalLoadingState(taskId, "Analyzing...");
    
    // Simulate API delay
    setTimeout(() => {
      const mockResponse = `Mock AI Analysis for: "${task.aiPrompt}"\n\nThis is a simulated response. Here are some suggestions:\n• Break down the task into smaller steps\n• Set specific deadlines for each part\n• Consider potential challenges and solutions\n• Gather necessary resources before starting\n\nPriority Level: Medium\nEstimated Time: 2-4 hours\nRecommended approach: Start with research phase`;
      updateLocalAIContent(taskId, mockResponse);
      updateLocalLoadingState(taskId, "");
    }, 2000);
  };

  const mockSummarizeTask = async (taskId) => {
    const currentContent = aiContent[taskId];
    if (!currentContent) {
      alert("No AI content to summarize for this task.");
      return;
    }

    updateLocalLoadingState(taskId, "Summarizing...");
    
    // Simulate API delay
    setTimeout(() => {
      const mockSummary = `Summary: ${currentContent.substring(0, 100)}...\n\nKey points:\n• Main task identified and analyzed\n• Action items and steps suggested\n• Timeline considerations noted\n• Resources and challenges identified`;
      updateLocalAIContent(taskId, mockSummary);
      updateLocalLoadingState(taskId, "");
    }, 1500);
  };

  const analyzeTask = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.aiPrompt?.trim()) {
      alert("Please add an AI prompt for this task first.");
      return;
    }

    // Check if backend URL is configured
    if (!import.meta.env.VITE_BACKEND_URL) {
      console.log("Backend URL not configured, using mock response");
      return mockAnalyzeTask(taskId);
    }

    updateLocalLoadingState(taskId, "Analyzing...");

    try {
      console.log("Sending request to:", `${import.meta.env.VITE_BACKEND_URL}/api/gemini/generate`);
      console.log("Payload:", { prompt: task.aiPrompt });

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/gemini/generate`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: task.aiPrompt })
      });
      
      console.log("Response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error Response:", errorText);
        throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
      }
      
      const data = await res.json();
      console.log("API Response:", data);
      
      const cleanText = data.text ? data.text.replace(/\*/g, "") : "No response received";
      
      updateLocalAIContent(taskId, cleanText);
      updateLocalLoadingState(taskId, "");
    } catch (err) {
      console.error("Gemini API Error:", err);
      updateLocalLoadingState(taskId, `Error: ${err.message}`);
      
      // Offer to use mock response
      if (window.confirm("API request failed. Would you like to see a mock response instead?")) {
        mockAnalyzeTask(taskId);
      }
    }
  };

  const summarizeTask = async (taskId) => {
    const currentContent = aiContent[taskId];
    if (!currentContent) {
      alert("No AI content to summarize for this task.");
      return;
    }

    // Check if backend URL is configured
    if (!import.meta.env.VITE_BACKEND_URL) {
      console.log("Backend URL not configured, using mock response");
      return mockSummarizeTask(taskId);
    }

    updateLocalLoadingState(taskId, "Summarizing...");

    try {
      console.log("Sending summarize request to:", `${import.meta.env.VITE_BACKEND_URL}/api/gemini/summarize`);
      
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/gemini/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentContent })
      });
      
      console.log("Summarize response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Summarize API Error Response:", errorText);
        throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
      }
      
      const data = await res.json();
      console.log("Summarize API Response:", data);
      
      const cleanSummary = data.summary ? data.summary.replace(/\*/g, "") : "No summary generated";
      
      updateLocalAIContent(taskId, cleanSummary);
      updateLocalLoadingState(taskId, "");
    } catch (err) {
      console.error("Gemini Summarize Error:", err);
      updateLocalLoadingState(taskId, `Error: ${err.message}`);
      
      // Offer to use mock response
      if (window.confirm("Summarize request failed. Would you like to see a mock summary instead?")) {
        mockSummarizeTask(taskId);
      }
    }
  };

  // Start editing a task
  const startEdit = (task) => {
    setEditTaskId(task.id);
    setEditTaskText(task.text);
    setEditAiPrompt(task.aiPrompt || "");
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditTaskId(null);
    setEditTaskText("");
    setEditAiPrompt("");
  };

  // Save edited task to Firestore
  const saveEdit = async () => {
    if (!editTaskText.trim()) {
      alert("Task title cannot be empty.");
      return;
    }

    try {
      // Optimistic update
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === editTaskId ? { ...t, text: editTaskText.trim(), aiPrompt: editAiPrompt.trim() } : t
        )
      );

      await updateDoc(doc(db, "tasks", editTaskId), {
        text: editTaskText.trim(),
        aiPrompt: editAiPrompt.trim()
      });
      
      cancelEdit();
      
      if (!useRealtimeListener) {
        setTimeout(() => refreshTasks(), 500);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setTimeout(() => refreshTasks(), 500);
      alert(`Failed to update task: ${error.message}`);
    }
  };

  // Handle login with Google
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login error:", error);
      alert(`Failed to login: ${error.message}`);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      // Clear local AI content when logging out
      setAiContent({});
      setLoadingStates({});
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Handle Enter key press for adding tasks
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addTask();
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome to AI Todo List</h2>
          <p className="text-gray-600 mb-6">Please sign in to access your personalized todo list with AI features.</p>
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors font-medium mb-4"
          >
            🚀 Sign in with Google
          </button>
          <p className="text-sm text-gray-500">
            Your data is securely stored and only accessible to you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-4xl font-bold text-gray-800">
              AI-Powered To-Do List
            </h2>
            <p className="text-gray-600 mt-1">Welcome, {user.displayName || user.email}</p>
            {/* Task Count */}
            <div className="flex gap-4 mt-2 text-sm">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                Total: {tasks.length}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                Completed: {tasks.filter(task => task.completed).length}
              </span>
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium">
                Pending: {tasks.filter(task => !task.completed).length}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={refreshTasks}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors"
              title="Refresh tasks"
            >
              <FaRedo /> Refresh
            </button>
            
          </div>
        </div>

        {/* Index Warning */}
        {indexError && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-700 font-medium">
                  {indexError.includes('Index required') ? 'Database Index Required' : 'Database Issue'}
                </p>
                <p className="text-yellow-600 text-sm mt-1">
                  {indexError.includes('Index required') ? (
                    <>
                      Please create the required index in Firebase Console. 
                      <a 
                        href="https://console.firebase.google.com/v1/r/project/fir-35d06/firestore/indexes?create_composite=Ckdwcm9qZWN0cy9maXItMzVkMDYvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3Rhc2tzL2luZGV4ZXMvXxABGgoKBnVzZXJJZBABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 underline ml-1"
                      >
                        Click here to create index
                      </a>
                    </>
                  ) : (
                    indexError
                  )}
                </p>
                <p className="text-yellow-600 text-xs mt-1">
                  Using fallback method - tasks will update when you refresh.
                </p>
              </div>
              <button
                onClick={refreshTasks}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* Backend Status */}
        {!import.meta.env.VITE_BACKEND_URL && (
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6 rounded">
            <p className="text-blue-700 font-medium">Development Mode</p>
            <p className="text-blue-600 text-sm mt-1">
              Backend URL not configured. AI features will use mock responses for testing.
            </p>
          </div>
        )}

        {/* Task Input Form */}
        <div className="bg-white shadow-2xl rounded-xl p-6 mb-10 space-y-4">
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter task title..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
          />
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Optional: Ask AI about the task..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
          />
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Optional: Paste image URL"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
          />
          <button
            onClick={addTask}
            disabled={!taskText.trim()}
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          >
            ➕ Add Task
          </button>
        </div>

        {/* Loading State */}
        {tasksLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading tasks...</p>
          </div>
        )}

        {/* Task List */}
        {!tasksLoading && (
          <ul className="space-y-6">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`group bg-white border-l-4 transition-all hover:shadow-xl rounded-xl p-5 ${
                  task.completed ? "border-green-400 opacity-70" : "border-indigo-400"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  {editTaskId === task.id ? (
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={editTaskText}
                        onChange={(e) => setEditTaskText(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                        placeholder="Task title..."
                      />
                      <input
                        type="text"
                        value={editAiPrompt}
                        onChange={(e) => setEditAiPrompt(e.target.value)}
                        placeholder="Edit AI prompt..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <h3 className={`text-xl font-semibold mb-1 ${
                          task.completed ? "line-through text-gray-400" : "text-gray-800"
                        }`}>
                          {task.text}
                        </h3>
                        {task.aiPrompt && (
                          <p className="text-sm text-gray-500 italic">
                            AI Prompt: {task.aiPrompt}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => toggleCompletion(task.id)}
                          title="Toggle complete"
                          className={`p-2 rounded-full transition-colors ${
                            task.completed 
                              ? "bg-green-500 hover:bg-green-600" 
                              : "bg-gray-300 hover:bg-green-500"
                          } text-white`}
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => startEdit(task)}
                          title="Edit task"
                          className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full transition-colors"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          title="Delete task"
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {task.imageUrl && (
                  <div className="mb-3">
                    <img 
                      src={task.imageUrl} 
                      alt="Task reference" 
                      className="rounded-xl max-h-64 object-cover w-full shadow-sm"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="text-sm text-gray-500 mb-3">
                  ⏱ <strong>Due in:</strong> {getRemainingTime(task.dueDate)}
                </div>

                {editTaskId === task.id ? (
                  <div className="flex gap-3">
                    <button
                      onClick={saveEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                    >
                      <FaSave /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition-colors"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={task.aiPrompt || ""}
                        onChange={(e) => updateTaskAiPrompt(task.id, e.target.value)}
                        placeholder="Update AI prompt..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                      />
                      <button
                        onClick={() => analyzeTask(task.id)}
                        disabled={loadingStates[task.id] === "Analyzing..." || !task.aiPrompt?.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        <FaRobot /> Analyze
                      </button>
                      {aiContent[task.id] && (
                        <button
                          onClick={() => summarizeTask(task.id)}
                          disabled={loadingStates[task.id] === "Summarizing..."}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                          <FaSync /> Summarize
                        </button>
                      )}
                    </div>

                    {loadingStates[task.id] && (
                      <div className="text-sm text-yellow-600 italic font-medium">
                        {loadingStates[task.id]}
                      </div>
                    )}

                    {aiContent[task.id] && (
                      <div className="bg-gradient-to-r from-gray-50 to-indigo-50 border border-gray-200 rounded-xl p-4 text-sm leading-relaxed">
                        <span className="block mb-2 text-indigo-600 font-semibold">🤖 AI Response:</span>
                        <div className="whitespace-pre-wrap text-gray-700">
                          {aiContent[task.id]}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Empty State */}
        {!tasksLoading && tasks.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <div className="text-gray-600 text-xl mb-2">No tasks yet</div>
            <div className="text-gray-500">Add your first task above to get started!</div>
          </div>
        )}
      </div>
    </div>
  );
}