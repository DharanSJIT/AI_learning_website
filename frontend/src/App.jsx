import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

// --- Import Navbar component ---
import Navbar from "./components/Navbar"; 

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
import ServicesComponent from "./components/services"; 
import ExplorePage from "./components/ExplorePage"; // This is your detailed Explore page
import Footer from "./components/Footer";


// --- Page Wrapper Components for Main Routes ---

const Profile = () => (
  <div className="pt-8"> {/* Adjusted padding for consistency */}
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Profile</h1>
        <p className="text-gray-600 dark:text-gray-300">
          User profile information and account settings will be displayed here.
        </p>
      </div>
    </div>
  </div>
);

// ✨ FIX: This wrapper correctly uses your detailed ServicesComponent
const Services = () => (
  <div className="pt-8">
    <ServicesComponent />
  </div>
);

// ✨ FIX: This wrapper now correctly uses your detailed ExplorePage component
const Explore = () => (
  <div className="pt-8">
    <ExplorePage />
  </div>
);

const Overviews = () => (
  <div className="pt-8">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Overviews</h1>
        <p className="text-gray-600 dark:text-gray-300">
          General overviews, summaries, and analytical insights are available here.
        </p>
      </div>
    </div>
  </div>
);


function AppWrapper() {
  const [user, loading] = useAuthState(auth);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* ✨ FIX: Removed <ExplorePage /> from here to stop it from appearing on every page */}

      <main className="pt-16"> {/* This padding prevents content from hiding under the fixed navbar */}
        <Routes>
          {/* Auth & Public Routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Main App Routes from Navbar */}
          <Route path="/dashboard" element={<DashboardGrid user={user} />} />
          {/* ✨ FIX: These routes now use the wrapper components for consistent UI */}
          <Route path="/services" element={<Services />} />
          <Route path="/explore" element={<Explore />} />
          {/* ✨ FIX: Path changed to match the Navbar link */}
          <Route path="/JharkhandInfo" element={<Overviews />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* All Feature Routes */}
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
      <Footer />
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