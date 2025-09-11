import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

// --- Import Layout Components ---
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";
import Notification from "./components/Notification";

// --- Import all your page and feature components ---
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardGrid from "./components/DashboardGrid";
import LearningPath from "./components/LearningPath";
import QuizGenerator from "./components/QuizGenerator";
import QuizHistory from "./components/QuizHistory";
import Notes from "./components/Notes";
import TodoList from "./components/TodoList";
import ChatAssistant from "./components/ChatAssistant";
import ProgressTracker from "./components/ProgressTracker";
import Bookmarks from "./components/Bookmarks";
import Settings from "./components/Settings";
import Summarization from "./components/Summarization";
import ImageExplanation from "./components/ImageExplanation";
import DocumentAnalyzer from "./components/DocumentAnalyzer";
import ATSResumeChecker from "./components/ATSResumeChecker";
import ServicesComponent from "./components/Services"; 
import ExplorePage from "./components/ExplorePage";

// ... (Profile, Services, Explore, Overviews components remain the same)
const Profile = () => ( <div className="pt-8"><div className="max-w-7xl mx-auto px-6 lg:px-8"><div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"><h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Profile</h1><p className="text-gray-600 dark:text-gray-300">User profile information and account settings will be displayed here.</p></div></div></div> );
const Services = () => ( <div className="pt-8"><ServicesComponent /></div> );
const Explore = () => ( <div className="pt-8"><ExplorePage /></div> );
const Overviews = () => ( <div className="pt-8"><div className="max-w-7xl mx-auto px-6 lg:px-8"><div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"><h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Overviews</h1><p className="text-gray-600 dark:text-gray-300">General overviews, summaries, and analytical insights are available here.</p></div></div></div> );


function AppWrapper() {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });
  
  // ✨ FIX: Use a ref to track the previous user state to detect a true logout
  const previousUser = useRef(user);

  const pathsWithoutFooter = ['/', '/login', '/signup'];

  // ✨ FIX: This useEffect is now more robust for handling notifications
  useEffect(() => {
    // 1. Don't show any notifications while the auth state is loading
    if (loading) {
      return;
    }

    // 2. Detect a true LOGOUT event (had a user, but now doesn't)
    if (previousUser.current && !user) {
      setNotification({ message: 'Logged out successfully!', type: 'error', visible: true });
    }

    // 3. Detect a LOGIN/SIGNUP event from navigation state
    if (location.state?.message) {
      setNotification({ message: location.state.message, type: 'success', visible: true });
      // Clear the state so the message doesn't reappear
      navigate(location.pathname, { replace: true, state: {} });
    }

    // 4. Update the ref for the next render
    previousUser.current = user;

  }, [user, loading, location, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <div className="text-xl font-medium text-gray-600 dark:text-gray-300">Loading...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <Notification 
        notification={notification} 
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      
      <main className="flex-grow pt-16">
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Main App Routes */}
          <Route path="/dashboard" element={<DashboardGrid user={user} />} />
          <Route path="/services" element={<Services />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/JharkhandInfo" element={<Overviews />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Feature Routes */}
          <Route path="/learning-path" element={<LearningPath />} />
          <Route path="/quiz-generator" element={<QuizGenerator />} />
          <Route path="/quiz-history" element={<QuizHistory />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/todo-list" element={<TodoList />} />
          <Route path="/mentor" element={<ChatAssistant user={user} />} />
          <Route path="/progress-tracker" element={<ProgressTracker />} />
          <Route path="/ats-checker" element={<ATSResumeChecker />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/summarization" element={<Summarization />} />
          <Route path="/image-analysis" element={<ImageExplanation />} />
          <Route path="/document-analyzer" element={<DocumentAnalyzer />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>

      {!pathsWithoutFooter.includes(location.pathname) && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}