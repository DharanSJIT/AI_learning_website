import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function QuizGenerator() {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");
  const number = 15;

  const generateQuiz = async () => {
    if (!topic.trim()) {
      setError("⚠️ Please enter a topic to generate quiz.");
      return;
    }

    setLoading(true);
    setAnswers({});
    setQuiz(null);
    setError("");
    setShowResults(false);

    try {
      const prompt = `Generate a ${number}-question multiple-choice quiz on ${topic}.
      Each question should have exactly 4 options and 1 correct answer.
      Return ONLY valid JSON in this format (no extra text, no markdown, no explanations):
      [
        {
          "question": "What is React?",
          "options": ["A library", "A framework", "A language", "A database"],
          "answer": "A library"
        }
      ]`;

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/gemini/generate`, { prompt });

      // Check if response exists and has data
      if (!res.data || !res.data.text) {
        throw new Error("No response received from server");
      }

      let text = res.data.text.trim();
      
      // Check for common error responses
      if (text.includes("No response generated")) {
        throw new Error("AI_NO_RESPONSE");
      } else if (text.includes("rate limit") || text.includes("Rate limit")) {
        throw new Error("RATE_LIMIT");
      } else if (text.includes("error") || text.includes("Error")) {
        throw new Error(`API_ERROR: ${text}`);
      } else if (text.length < 20) {
        throw new Error(`INVALID_RESPONSE: ${text}`);
      }
      
      // Remove markdown formatting if present
      text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
      
      // Remove any leading/trailing non-JSON text
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        text = jsonMatch[0];
      } else if (!text.startsWith('[') && !text.startsWith('{')) {
        throw new Error("Response does not contain valid JSON format");
      }

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (parseError) {
        console.error("JSON Parsing error:", parseError);
        console.error("Raw response:", text);
        
        // Try to provide more helpful error messages
        if (text.includes("No response generated")) {
          throw new Error("The AI service is not responding. Please try again in a moment.");
        } else if (text.includes("rate limit") || text.includes("Rate limit")) {
          throw new Error("Too many requests. Please wait a moment before trying again.");
        } else {
          throw new Error("The AI response was not in the expected format. Please try a different topic or try again.");
        }
      }

      // Validate the parsed data
      if (!Array.isArray(parsed)) {
        throw new Error("Quiz data is not in the expected format (should be an array)");
      }

      if (parsed.length === 0) {
        throw new Error("No questions were generated. Please try a different topic.");
      }

      // Validate each question
      for (let i = 0; i < parsed.length; i++) {
        const question = parsed[i];
        if (!question.question || !question.options || !question.answer) {
          throw new Error(`Question ${i + 1} is missing required fields (question, options, or answer)`);
        }
        if (!Array.isArray(question.options) || question.options.length !== 4) {
          throw new Error(`Question ${i + 1} must have exactly 4 options`);
        }
        if (!question.options.includes(question.answer)) {
          throw new Error(`Question ${i + 1}: The correct answer is not in the options list`);
        }
      }

      setQuiz(parsed);
      setError("");
    } catch (e) {
      console.error("Quiz generation error:", e);
      
      let errorMessage = "";
      let retryable = true;
      
      if (e.message === "AI_NO_RESPONSE") {
        errorMessage = "🤖 The AI service is currently having issues generating content. This might be temporary.";
      } else if (e.message === "RATE_LIMIT") {
        errorMessage = "⏳ Too many requests. Please wait a few moments before trying again.";
        retryable = false;
      } else if (e.message.startsWith("API_ERROR:")) {
        errorMessage = "⚠️ API Error: " + e.message.replace("API_ERROR:", "").trim();
      } else if (e.message.startsWith("INVALID_RESPONSE:")) {
        errorMessage = "📝 Invalid response received: " + e.message.replace("INVALID_RESPONSE:", "").trim();
      } else if (e.response) {
        // Server responded with error status
        if (e.response.status === 429) {
          errorMessage = "⏳ Rate limit exceeded. Please wait a moment and try again.";
          retryable = false;
        } else if (e.response.status >= 500) {
          errorMessage = "🔧 Server error. Please try again later.";
        } else if (e.response.status === 403) {
          errorMessage = "🔒 Access denied. Please check your API configuration.";
        } else if (e.response.status === 401) {
          errorMessage = "🔐 Authentication failed. Please check your API key.";
        } else {
          errorMessage = "🌐 Connection error. Please check your internet connection.";
        }
      } else if (e.request) {
        // Request was made but no response received
        errorMessage = "📡 Unable to connect to server. Please check your internet connection.";
      } else {
        // Something else happened
        errorMessage = "❌ " + (e.message || "An unexpected error occurred. Please try again.");
      }
      
      // Add helpful suggestions based on error type
      if (e.message === "AI_NO_RESPONSE") {
        errorMessage += "\n\n💡 Try:\n• Using a more specific topic\n• Waiting a moment and trying again\n• Using simpler language in your topic";
      }
      
      setError(errorMessage);
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (qIndex, option) => {
    if (answers[qIndex]) return; // Prevent changing answer after selection
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const calculateScore = () => {
    let correct = 0;
    Object.keys(answers).forEach(qIndex => {
      if (quiz[qIndex] && answers[qIndex] === quiz[qIndex].answer) {
        correct++;
      }
    });
    return correct;
  };

  const handleShowResults = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    setQuiz(null);
    setAnswers({});
    setShowResults(false);
    setError("");
    setTopic("");
  };

  const retakeQuiz = () => {
    setAnswers({});
    setShowResults(false);
  };

  const allQuestionsAnswered = quiz && Object.keys(answers).length === quiz.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto p-6 pt-10">
        {/* Back Link */}
        <Link
          to="/home"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline mb-8 font-semibold transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            📝 Quiz Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Generate AI-powered quizzes on any topic with {number} challenging questions
          </p>
        </div>

        {/* Input & Generate Button */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g. JavaScript, Machine Learning, World History)"
              className="
                flex-1
                rounded-xl
                border-2
                border-gray-200
                dark:border-gray-600
                px-5
                py-3
                text-gray-900
                dark:text-white
                bg-white
                dark:bg-gray-700
                placeholder-gray-400
                dark:placeholder-gray-300
                focus:outline-none
                focus:ring-4
                focus:ring-blue-100
                dark:focus:ring-blue-900/50
                focus:border-blue-500
                transition-all
                duration-200
              "
              autoComplete="off"
              onKeyPress={(e) => e.key === 'Enter' && !loading && generateQuiz()}
            />
            <button
              onClick={generateQuiz}
              disabled={loading || !topic.trim()}
              className="
                flex-shrink-0
                rounded-xl
                bg-gradient-to-r
                from-blue-500
                to-purple-500
                hover:from-blue-600
                hover:to-purple-600
                px-8
                py-3
                text-white
                font-semibold
                shadow-lg
                hover:shadow-xl
                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:transform-none
                transition-all
                duration-200
                flex
                items-center
                justify-center
                gap-2
                transform
                hover:scale-105
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
              {loading ? "Generating..." : "Generate Quiz"}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Generating Your Quiz
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Creating {number} questions about "{topic}"...
            </p>
          </div>
        )}

        {/* Results View */}
        {showResults && Array.isArray(quiz) && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">
                  {Math.round((calculateScore() / quiz.length) * 100)}%
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Quiz Complete!
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                You scored {calculateScore()} out of {quiz.length} questions
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={retakeQuiz}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                Retake Quiz
              </button>
              <button
                onClick={resetQuiz}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                Generate New Quiz
              </button>
            </div>
          </div>
        )}

        {/* Quiz Content */}
        {!showResults && Array.isArray(quiz) && quiz.length > 0 && (
          <>
            <div className="space-y-6 mb-8">
              {quiz.map((q, i) => {
                const selected = answers[i];
                const showAnswer = !!selected;
                return (
                  <div
                    key={i}
                    className="
                      p-6
                      bg-white
                      dark:bg-gray-800
                      rounded-2xl
                      shadow-lg
                      border
                      border-gray-200
                      dark:border-gray-700
                      transition-all
                      duration-200
                      hover:shadow-xl
                    "
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{i + 1}</span>
                      </div>
                      <p className="font-semibold text-lg text-gray-900 dark:text-white">
                        {q.question}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-12">
                      {q.options.map((opt, j) => {
                        const isSelected = selected === opt;
                        const isCorrect = showAnswer && opt === q.answer;
                        const isWrong = showAnswer && isSelected && opt !== q.answer;
                        const shouldShowCorrect = showAnswer && opt === q.answer && !isSelected;
                        
                        return (
                          <button
                            key={j}
                            onClick={() => handleAnswer(i, opt)}
                            disabled={!!selected}
                            className={`
                              flex items-center justify-between
                              w-full
                              px-4
                              py-3
                              rounded-xl
                              border-2
                              font-medium
                              transition-all
                              duration-200
                              cursor-pointer
                              select-none
                              ${
                                isCorrect || shouldShowCorrect
                                  ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400"
                                  : isWrong
                                  ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400"
                                  : isSelected
                                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400"
                                  : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
                              }
                              ${!!selected ? "cursor-not-allowed" : "hover:scale-[1.02] hover:shadow-md"}
                            `}
                            aria-pressed={isSelected}
                            aria-disabled={!!selected}
                          >
                            <span className="text-left">{opt}</span>
                            {(isCorrect || shouldShowCorrect) && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0"
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
                                className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0"
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

            {/* Show Results Button */}
            {allQuestionsAnswered && (
              <div className="text-center">
                <button
                  onClick={handleShowResults}
                  className="
                    bg-gradient-to-r
                    from-green-500
                    to-blue-500
                    hover:from-green-600
                    hover:to-blue-600
                    text-white
                    px-8
                    py-4
                    rounded-2xl
                    font-bold
                    text-lg
                    shadow-lg
                    hover:shadow-xl
                    transition-all
                    duration-200
                    transform
                    hover:scale-105
                    flex
                    items-center
                    justify-center
                    gap-2
                    mx-auto
                  "
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Results
                </button>
              </div>
            )}

            {/* Progress Indicator */}
            {quiz && (
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Progress: {Object.keys(answers).length} / {quiz.length} questions answered
                  </span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {Math.round((Object.keys(answers).length / quiz.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(Object.keys(answers).length / quiz.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Error Display */}
        {!loading && error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                  Quiz Generation Failed
                </h3>
                <div className="text-red-700 dark:text-red-400 whitespace-pre-line mb-4">
                  {error}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {setError(""); generateQuiz();}}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-medium transition-colors duration-200"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => {setError(""); setTopic("");}}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-xl font-medium transition-colors duration-200"
                  >
                    Clear Topic
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder message when no quiz */}
        {!loading && quiz === null && !error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Ready to Test Your Knowledge?
            </h3>
            <p className="text-gray-400 dark:text-gray-500">
              Enter a topic above and click generate to create your personalized quiz.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}