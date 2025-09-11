import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

// --- 👇 CORRECTED IMPORT PATH FOR NAVBAR 👇 ---
import Navbar from "./components/Navbar"; 

// --- Import all your page and feature components ---
import Welcome from "./pages/Welcome";
import Chat from "./pages/Chat";
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

// Placeholder components for the new routes
const Profile = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-slate-800">Profile Page</h1>
    <p className="mt-2 text-slate-600">User profile information will be displayed here.</p>
  </div>
);

const Services = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-slate-800">Services Page</h1>
    <p className="mt-2 text-slate-600">Details about the services offered will be here.</p>
  </div>
);

const Explore = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-slate-800">Explore Page</h1>
    <p className="mt-2 text-slate-600">Content to explore will be available here.</p>
  </div>
);

const Overviews = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-slate-800">Overviews Page</h1>
    <p className="mt-2 text-slate-600">This is the page for general overviews.</p>
  </div>
);

function AppWrapper() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-xl font-medium text-slate-600">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-16">
        <Routes>
          {/* Auth & Public Routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
           {/* <Route path="/home" element={<Navigate to="/dashboard" />} /> */}
          {/*  */}
          {/* Main App Routes from Navbar */}
          <Route path="/dashboard" element={<DashboardGrid user={user} />} />
          <Route path="/services" element={<Services />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/overviews" element={<Overviews />} />
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
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>
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