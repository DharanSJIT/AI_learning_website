import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  CalendarDaysIcon,
  FlagIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";

// Firebase Imports
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";

// Task Item Component (No changes needed)
const TaskItem = ({ task, onToggle, onEdit, onDelete }) => {
  const priorityStyles = {
    High: "border-l-red-500",
    Medium: "border-l-yellow-500",
    Low: "border-l-green-500",
  };
  const priorityBadgeStyles = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={clsx(
        "group flex items-start gap-4 p-4 bg-white rounded-lg border border-l-4 border-gray-200 shadow-sm transition-all hover:shadow-md",
        priorityStyles[task.priority]
      )}
    >
      <button onClick={onToggle} className="mt-1 flex-shrink-0">
        <CheckCircleIcon
          className={clsx(
            "h-6 w-6 transition-colors",
            task.completed
              ? "text-green-500"
              : "text-gray-300 group-hover:text-gray-400"
          )}
        />
      </button>
      <div className="flex-1">
        <p
          className={clsx(
            "font-medium text-slate-800 transition-colors",
            task.completed && "line-through text-gray-400"
          )}
        >
          {task.name}
        </p>
        <p className="text-sm text-slate-600 mt-1">{task.description}</p>
        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
          {task.dueDate && (
            <div className="flex items-center gap-1.5">
              <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
              <span>{task.dueDate}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <FlagIcon className="h-4 w-4 text-gray-400" />
            <span
              className={clsx(
                "px-2 py-0.5 rounded-full font-semibold",
                priorityBadgeStyles[task.priority]
              )}
            >
              {task.priority}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-100 rounded-md"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-md"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </motion.li>
  );
};

// Main Component
export default function ProgressTracker() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      // User is logged in, use Firestore
      const tasksCollectionRef = collection(db, "users", user.uid, "tasks");
      const q = query(tasksCollectionRef, orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tasksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData); // Overwrites local tasks with saved ones
      });
      return () => unsubscribe();
    } else {
      // User is logged out, tasks will be managed locally.
      // If there were any saved tasks, clear them. Local tasks remain.
      // This logic intentionally does not clear the `tasks` state on logout,
      // allowing the demo tasks to persist until a user logs in.
    }
  }, [user]);

  const openModalForNew = () => {
    setIsEditing(false);
    setCurrentTask(null);
    setName("");
    setDescription("");
    setDueDate("");
    setPriority("Medium");
    setIsModalOpen(true);
  };

  const openModalForEdit = (task) => {
    setIsEditing(true);
    setCurrentTask(task);
    setName(task.name);
    setDescription(task.description);
    setDueDate(task.dueDate || "");
    setPriority(task.priority);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // --- MODIFIED C-R-U-D FUNCTIONS ---

  const handleSubmit = async () => {
    if (!name.trim()) return;

    if (user) {
      // --- Logged-in logic (Firestore) ---
      const tasksCollectionRef = collection(db, "users", user.uid, "tasks");
      if (isEditing && currentTask) {
        const taskDocRef = doc(db, "users", user.uid, "tasks", currentTask.id);
        await updateDoc(taskDocRef, { name, description, dueDate, priority });
      } else {
        await addDoc(tasksCollectionRef, {
          name,
          description,
          dueDate,
          priority,
          completed: false,
          createdAt: serverTimestamp(),
        });
      }
    } else {
      // --- Logged-out logic (Local State for Demo) ---
      if (isEditing && currentTask) {
        setTasks(
          tasks.map((t) =>
            t.id === currentTask.id
              ? { ...t, name, description, dueDate, priority }
              : t
          )
        );
      } else {
        const newTask = {
          id: Date.now(),
          name,
          description,
          dueDate,
          priority,
          completed: false,
        };
        setTasks([...tasks, newTask]);
      }
    }
    closeModal();
  };

  const deleteTask = async (taskId) => {
    if (user) {
      // --- Logged-in logic (Firestore) ---
      const taskDocRef = doc(db, "users", user.uid, "tasks", taskId);
      await deleteDoc(taskDocRef);
    } else {
      // --- Logged-out logic (Local State for Demo) ---
      setTasks(tasks.filter((t) => t.id !== taskId));
    }
  };

  const toggleCompletion = async (task) => {
    if (user) {
      // --- Logged-in logic (Firestore) ---
      const taskDocRef = doc(db, "users", user.uid, "tasks", task.id);
      await updateDoc(taskDocRef, { completed: !task.completed });
    } else {
      // --- Logged-out logic (Local State for Demo) ---
      setTasks(
        tasks.map((t) =>
          t.id === task.id ? { ...t, completed: !t.completed } : t
        )
      );
    }
  };

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const progress =
    tasks.length === 0 ? 0 : (completedTasksCount / tasks.length) * 100;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[90vh]">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="h-[90vh] overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="absolute left-[3vw] top-24">
            <Link
              to="/home"
              className="inline-flex items-center text-blue-600 hover:underline mb-4 font-medium"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Dashboard
            </Link>
          </div>

          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-800 mt-8">
                Task Progress
              </h1>
              <p className="text-slate-600 mt-1">
                Stay organized and keep your projects on track.
              </p>
            </div>
            <button
              onClick={openModalForNew}
              className="flex items-center gap-2 px-4 mt-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 active:scale-95"
            >
              <PlusIcon className="h-5 w-5 " />
              Add New Task
            </button>
          </header>

          {!user && (
            <div
              className="my-6 flex items-center gap-4 p-4 text-sm text-yellow-800 rounded-lg bg-yellow-100 border-l-4 border-yellow-500 shadow-sm"
              role="alert"
            >
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 flex-shrink-0" />
              <div>
                <span className="font-bold">You are not logged in.</span> Your
                tasks are part of a demo and will not be saved.
              </div>
            </div>
          )}

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-600">
                Overall Progress
              </span>
              <span className="text-sm font-bold text-slate-800">
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 h-2.5 rounded-full">
              <motion.div
                className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "circOut" }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {completedTasksCount} of {tasks.length} tasks completed
            </p>
          </div>

          <main>
            <AnimatePresence>
              {tasks.length > 0 ? (
                <ul className="space-y-3">
                  {tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={() => toggleCompletion(task)}
                      onEdit={() => openModalForEdit(task)}
                      onDelete={() => deleteTask(task.id)}
                    />
                  ))}
                </ul>
              ) : (
                <div className="text-center py-16 px-6 bg-white border-2 border-dashed border-gray-200 rounded-xl">
                  <h3 className="text-lg font-semibold text-slate-700">
                    No Tasks Yet!
                  </h3>
                  <p className="text-slate-500 mt-1 mb-4">
                    Click "Add New Task" to get started.
                  </p>
                  <button
                    onClick={openModalForNew}
                    className="text-indigo-600 font-semibold text-sm hover:underline"
                  >
                    Create your first task
                  </button>
                </div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Modal JSX remains the same */}
      <Transition appear show={isModalOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {isEditing ? "Edit Task" : "Add a New Task"}
                  </Dialog.Title>
                  <div className="mt-4 space-y-4">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Task name"
                      className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description..."
                      className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-900 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      />
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                    >
                      {isEditing ? "Save Changes" : "Add Task"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
