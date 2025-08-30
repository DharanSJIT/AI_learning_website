import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function QuizGenerator() {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const number = 15;

  const generateQuiz = async () => {
    if (!topic.trim()) {
      setQuiz("⚠️ Please enter a topic to generate quiz.");
      return;
    }

    setLoading(true);
    setAnswers({});
    setQuiz(null);

    try {
      const prompt = `Generate a ${number}-question multiple-choice quiz on ${topic}.
      Each question should have exactly 4 options and 1 correct answer.
      Return ONLY valid JSON in this format (no extra text, no markdown):
      [
        {
          "question": "What is React?",
          "options": ["A library", "A framework", "A language", "A database"],
          "answer": "A library"
        }
      ]`;

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/gemini/generate`, { prompt });

      let text = res.data.text.trim();
      text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        console.error("Parsing error:", err, text);
        setQuiz("⚠️ Failed to parse quiz. Try again.");
        setLoading(false);
        return;
      }

      setQuiz(parsed);
    } catch (e) {
      console.error("Quiz error:", e);
      setQuiz("❌ Failed to generate quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (qIndex, option) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      {/* Back Link */}
      <Link
        to="/home"
        className="inline-flex items-center text-blue-600 hover:underline mb-8 font-semibold"
      >
        ← Back to Dashboard
      </Link>

      {/* Header */}
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
        <span className="text-2xl">📝</span> Quiz Generator
      </h2>

      {/* Input & Generate Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g. JavaScript, Machine Learning)"
          className="
            flex-1
            rounded-xl
            border
            border-gray-300
            px-5
            py-3
            text-gray-900
            placeholder-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-green-500
            focus:border-transparent
            transition
          "
          autoComplete="off"
        />
        <button
          onClick={generateQuiz}
          disabled={loading}
          className="
            flex-shrink-0
            rounded-xl
            bg-green-600
            px-6
            py-3
            text-white
            font-semibold
            shadow-md
            hover:bg-green-700
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition
            flex
            items-center
            justify-center
            gap-2
          "
          aria-label="Generate Quiz"
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* Quiz Content */}
      {Array.isArray(quiz) && quiz.length > 0 && (
        <div className="space-y-8">
          {quiz.map((q, i) => {
            const selected = answers[i];
            return (
              <div
                key={i}
                className="
                  p-6
                  bg-white
                  rounded-2xl
                  shadow-lg
                  border
                  border-gray-200
                  transition
                  hover:shadow-xl
                "
              >
                <p className="font-semibold text-lg text-gray-900 mb-4">
                  {i + 1}. {q.question}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {q.options.map((opt, j) => {
                    const isCorrect = selected && opt === q.answer;
                    const isWrong = selected === opt && selected !== q.answer;
                    const disabled = !!selected;
                    return (
                      <button
                        key={j}
                        onClick={() => handleAnswer(i, opt)}
                        disabled={disabled}
                        className={`
                          flex items-center justify-between
                          w-full
                          px-5
                          py-3
                          rounded-xl
                          border
                          font-medium
                          transition
                          cursor-pointer
                          select-none
                          ${
                            isCorrect
                              ? "bg-green-100 border-green-500 text-green-700"
                              : isWrong
                              ? "bg-red-100 border-red-500 text-red-700"
                              : "bg-white border-gray-300 text-gray-800 hover:bg-gray-50"
                          }
                          ${disabled ? "cursor-not-allowed opacity-70" : "hover:scale-[1.03]"}
                        `}
                        aria-pressed={selected === opt}
                        aria-disabled={disabled}
                      >
                        <span>{opt}</span>
                        {isCorrect && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        {isWrong && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Message / Error */}
      {!loading && typeof quiz === "string" && (
        <div
          className="
            mt-6
            p-4
            rounded-lg
            bg-red-50
            border
            border-red-200
            text-red-700
            font-medium
            text-center
          "
          role="alert"
        >
          {quiz}
        </div>
      )}

      {/* Placeholder message when no quiz */}
      {!loading && quiz === null && (
        <p className="text-center text-gray-400 mt-8 select-none">
          Enter a topic above and click generate to get a quiz.
        </p>
      )}
    </div>
  );
}
