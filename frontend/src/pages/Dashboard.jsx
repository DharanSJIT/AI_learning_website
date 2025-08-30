import React, { useState } from "react";
import ChatAssistant from "../components/ChatAssistant";
import LearningPath from "../components/LearningPath";
import QuizGenerator from "../components/QuizGenerator";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function Dashboard() {
  const [user, setUser] = useState({
    name: "Learner",
    skills: ["javascript", "react"],
    level: "beginner",
  });

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100 p-6">
      <header className="max-w-5xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-800 drop-shadow-sm">
          🚀 AI-powered Personalized Learning
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          A starter app that uses <span className="font-semibold text-indigo-600">Gemini</span> 
          to power recommendations, quizzes, and chat help.
        </p>
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      <main className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
        <section className="md:col-span-2 space-y-6">
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-100 hover:shadow-xl transition-shadow">
            <LearningPath user={user} />
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-100 hover:shadow-xl transition-shadow">
            <QuizGenerator user={user} />
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-100 hover:shadow-xl transition-shadow">
            <ChatAssistant user={user} />
          </div>
        </aside>
      </main>
    </div>
  );
}
