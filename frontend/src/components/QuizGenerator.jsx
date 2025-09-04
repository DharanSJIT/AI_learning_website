import React, { useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function QuizGenerator() {
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(10);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Improved error handling with specific error types
  const handleApiError = (error) => {
    console.error("Quiz generation error:", error);
    
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return "⏰ Request timed out. The server is taking too long to respond. Please try again.";
    }
    
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 400:
          return "❌ Bad request. Please check your topic and try again.";
        case 401:
          return "🔐 Authentication failed. Please check your API configuration.";
        case 403:
          return "🔒 Access denied. Please verify your API permissions.";
        case 404:
          return "🔍 API endpoint not found. Please contact support.";
        case 429:
          return "⏳ Rate limit exceeded. Please wait a moment and try again.";
        case 500:
        case 502:
        case 503:
        case 504:
          return "🔧 Server error. Please try again in a few moments.";
        default:
          return `🌐 API Error (${status}): ${data?.message || "Unknown server error"}`;
      }
    }
    
    if (error.request) {
      return "📡 Unable to connect to server. Please check your internet connection and try again.";
    }
    
    return `❌ ${error.message || "An unexpected error occurred. Please try again."}`;
  };

  // Improved JSON parsing with better error detection
  const parseQuizResponse = (text) => {
    if (!text || typeof text !== 'string') {
      throw new Error("Empty or invalid response received");
    }

    // Clean the response
    let cleanText = text.trim();
    
    // Remove markdown formatting
    cleanText = cleanText.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    // Check for common error indicators
    const errorIndicators = [
      'error', 'Error', 'ERROR',
      'failed', 'Failed', 'FAILED',
      'rate limit', 'Rate limit', 'RATE_LIMIT',
      'no response', 'No response', 'NO_RESPONSE',
      'timeout', 'Timeout', 'TIMEOUT'
    ];
    
    const hasError = errorIndicators.some(indicator => 
      cleanText.toLowerCase().includes(indicator.toLowerCase())
    );
    
    if (hasError && cleanText.length < 100) {
      throw new Error(`API returned error: ${cleanText}`);
    }
    
    // Extract JSON from response
    const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanText = jsonMatch[0];
    } else if (!cleanText.startsWith('[') && !cleanText.startsWith('{')) {
      throw new Error("Response does not contain valid JSON format");
    }

    // Parse JSON
    let parsed;
    try {
      parsed = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw text:", cleanText);
      throw new Error("Invalid JSON format received from API");
    }

    return parsed;
  };

  // Improved quiz validation
  const validateQuiz = (quizData) => {
    if (!Array.isArray(quizData)) {
      throw new Error("Quiz data must be an array of questions");
    }

    if (quizData.length === 0) {
      throw new Error("No questions were generated. Please try a different topic.");
    }

    // Validate each question
    quizData.forEach((question, index) => {
      const questionNum = index + 1;
      
      if (!question || typeof question !== 'object') {
        throw new Error(`Question ${questionNum}: Invalid question format`);
      }
      
      if (!question.question || typeof question.question !== 'string' || !question.question.trim()) {
        throw new Error(`Question ${questionNum}: Missing or empty question text`);
      }
      
      if (!Array.isArray(question.options)) {
        throw new Error(`Question ${questionNum}: Options must be an array`);
      }
      
      if (question.options.length !== 4) {
        throw new Error(`Question ${questionNum}: Must have exactly 4 options (found ${question.options.length})`);
      }
      
      // Check for empty options
      const hasEmptyOption = question.options.some(opt => !opt || typeof opt !== 'string' || !opt.trim());
      if (hasEmptyOption) {
        throw new Error(`Question ${questionNum}: All options must be non-empty strings`);
      }
      
      // Check for duplicate options
      const uniqueOptions = new Set(question.options.map(opt => opt.trim().toLowerCase()));
      if (uniqueOptions.size !== question.options.length) {
        throw new Error(`Question ${questionNum}: Options must be unique`);
      }
      
      if (!question.answer || typeof question.answer !== 'string' || !question.answer.trim()) {
        throw new Error(`Question ${questionNum}: Missing or empty correct answer`);
      }
      
      if (!question.options.includes(question.answer)) {
        throw new Error(`Question ${questionNum}: Correct answer "${question.answer}" is not in the options list`);
      }
    });

    return true;
  };

  // Main quiz generation function with improved error handling
  const generateQuiz = useCallback(async () => {
    if (!topic.trim()) {
      setError("⚠️ Please enter a topic to generate the quiz.");
      return;
    }

    // Reset state
    setLoading(true);
    setAnswers({});
    setQuiz(null);
    setError("");
    setShowResults(false);
    setQuizSubmitted(false);

    try {
      const prompt = `Generate a ${questionCount}-question multiple-choice quiz on "${topic}".
      
      Requirements:
      - Each question must have exactly 4 unique options
      - Only one option should be correct
      - Questions should be clear and unambiguous
      - Options should be plausible but distinct
      
      Return ONLY valid JSON in this exact format (no extra text, no markdown, no explanations):
      [
        {
          "question": "What is React?",
          "options": ["A JavaScript library", "A programming language", "A database", "An operating system"],
          "answer": "A JavaScript library"
        }
      ]`;

      // Make API request with timeout
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/gemini/generate`,
        { prompt },
        {
          timeout: 30000, // 30 second timeout
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      // Validate response structure
      if (!response.data) {
        throw new Error("No data received from server");
      }

      if (!response.data.text) {
        throw new Error("No text content in server response");
      }

      // Parse and validate the quiz
      const quizData = parseQuizResponse(response.data.text);
      validateQuiz(quizData);

      // Limit questions to requested count (in case API returns more)
      const limitedQuiz = quizData.slice(0, questionCount);
      
      setQuiz(limitedQuiz);
      setError("");
      
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  }, [topic, questionCount]);

  // Handle answer selection
  const handleAnswer = useCallback((qIndex, option) => {
    if (quizSubmitted) return;
    setAnswers(prev => ({ ...prev, [qIndex]: option }));
  }, [quizSubmitted]);

  // Calculate score
  const calculateScore = useCallback(() => {
    if (!quiz) return 0;
    
    return Object.keys(answers).reduce((correct, qIndex) => {
      const questionIndex = parseInt(qIndex);
      if (quiz[questionIndex] && answers[qIndex] === quiz[questionIndex].answer) {
        return correct + 1;
      }
      return correct;
    }, 0);
  }, [quiz, answers]);

  // Submit quiz
  const handleSubmitQuiz = useCallback(() => {
    setQuizSubmitted(true);
    setShowResults(true);
  }, []);

  // Reset entire quiz
  const resetQuiz = useCallback(() => {
    setQuiz(null);
    setAnswers({});
    setShowResults(false);
    setError("");
    setTopic("");
    setQuizSubmitted(false);
  }, []);

  // Retake current quiz
  const retakeQuiz = useCallback(() => {
    setAnswers({});
    setShowResults(false);
    setQuizSubmitted(false);
  }, []);

  // Check if all questions are answered
  const allQuestionsAnswered = quiz && Object.keys(answers).length === quiz.length;
  const progress = quiz ? Object.keys(answers).length : 0;
  const progressPercentage = quiz ? Math.round((progress / quiz.length) * 100) : 0;

  return (
    <div className="min-h-[90vh]  bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto p-6 pt-10">
        {/* Back Link */}
        <div className="absolute left-[3vw] top-[12vh]">
          <Link
            to="/home"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline mb-[15px] font-semibold transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8 mt-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Quiz Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Generate AI-powered quizzes on any topic with customizable number of questions
          </p>
        </div>

        {/* Input & Generate Button */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quiz Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic (e.g. JavaScript, Machine Learning, World History)"
                className="
                  w-full
                  rounded-xl
                  border-2
                  border-gray-200
                  dark:border-gray-600
                  px-4
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
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !loading && topic.trim()) {
                    generateQuiz();
                  }
                }}
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Questions
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  border-2
                  border-gray-200
                  dark:border-gray-600
                  px-4
                  py-3
                  text-gray-900
                  dark:text-white
                  bg-white
                  dark:bg-gray-700
                  focus:outline-none
                  focus:ring-4
                  focus:ring-blue-100
                  dark:focus:ring-blue-900/50
                  focus:border-blue-500
                  transition-all
                  duration-200
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
                <option value={25}>25 Questions</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={generateQuiz}
            disabled={loading || !topic.trim()}
            className="
              w-full
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
              focus:outline-none
              focus:ring-4
              focus:ring-blue-200
              dark:focus:ring-blue-800
            "
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {loading ? "Generating..." : `Generate ${questionCount} Question Quiz`}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Generating Your Quiz
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Creating {questionCount} questions about "{topic}"...
            </p>
            <div className="mt-4 max-w-md mx-auto">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {!loading && error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8">
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
                    onClick={() => {
                      setError("");
                      generateQuiz();
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-medium transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-red-200"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => {
                      setError("");
                      setTopic("");
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-xl font-medium transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-gray-200"
                  >
                    Clear Topic
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results View */}
        {showResults && Array.isArray(quiz) && quiz.length > 0 && (
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
              
              {/* Score interpretation */}
              <div className="mt-4">
                {(() => {
                  const percentage = Math.round((calculateScore() / quiz.length) * 100);
                  if (percentage >= 90) return <p className="text-green-600 dark:text-green-400 font-semibold">🌟 Excellent work!</p>;
                  if (percentage >= 70) return <p className="text-blue-600 dark:text-blue-400 font-semibold">👍 Good job!</p>;
                  if (percentage >= 50) return <p className="text-yellow-600 dark:text-yellow-400 font-semibold">📚 Keep practicing!</p>;
                  return <p className="text-red-600 dark:text-red-400 font-semibold">💪 Don't give up, try again!</p>;
                })()}
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-4 mb-8">
              {quiz.map((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.answer;
                
                return (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        {isCorrect ? (
                          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                          {index + 1}. {question.question}
                        </h4>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Your answer: </span>
                            <span className={isCorrect ? 'text-green-600 dark:text-green-400 font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>
                              {userAnswer || "Not answered"}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Correct answer: </span>
                              <span className="text-green-600 dark:text-green-400 font-medium">
                                {question.answer}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={retakeQuiz}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                Retake Quiz
              </button>
              <button
                onClick={resetQuiz}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-gray-200"
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
              {quiz.map((question, index) => {
                const selected = answers[index];
                return (
                  <div
                    key={index}
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
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <p className="font-semibold text-lg text-gray-900 dark:text-white">
                        {question.question}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-12">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = selected === option;
                        
                        return (
                          <button
                            key={optionIndex}
                            onClick={() => handleAnswer(index, option)}
                            disabled={quizSubmitted}
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
                              focus:outline-none
                              focus:ring-4
                              ${
                                isSelected
                                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400 ring-blue-200 dark:ring-blue-800"
                                  : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 ring-gray-200 dark:ring-gray-600"
                              }
                              ${quizSubmitted ? "cursor-not-allowed opacity-60" : "hover:scale-[1.02] hover:shadow-md"}
                            `}
                            aria-pressed={isSelected}
                            aria-disabled={quizSubmitted}
                          >
                            <span className="text-left">{option}</span>
                            {isSelected && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit Quiz Button */}
            {allQuestionsAnswered && !quizSubmitted && (
              <div className="text-center mb-8">
                <button
                  onClick={handleSubmitQuiz}
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
                    focus:outline-none
                    focus:ring-4
                    focus:ring-green-200
                  "
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Submit Quiz
                </button>
              </div>
            )}

            {/* Progress Indicator */}
            {quiz && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Progress: {progress} / {quiz.length} questions answered
                  </span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                {quiz && !allQuestionsAnswered && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Please answer all questions to submit the quiz
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* Placeholder message when no quiz */}
        {!loading && quiz === null && !error && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Ready to Test Your Knowledge?
            </h3>
            <p className="text-gray-400 dark:text-gray-500 mb-6">
              Enter a topic and select the number of questions to create your personalized quiz.
            </p>
            
            {/* Popular topics suggestion */}
            <div className="max-w-md mx-auto">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Popular topics:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["JavaScript", "Python", "Machine Learning", "React", "Data Science", "History"].map((suggestedTopic) => (
                  <button
                    key={suggestedTopic}
                    onClick={() => setTopic(suggestedTopic)}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
                  >
                    {suggestedTopic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty quiz state (if quiz generation returns empty array) */}
        {!loading && Array.isArray(quiz) && quiz.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No Questions Generated
            </h3>
            <p className="text-gray-400 dark:text-gray-500 mb-6">
              The AI couldn't generate questions for this topic. Try a different or more specific topic.
            </p>
            <button
              onClick={resetQuiz}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              Try Different Topic
            </button>
          </div>
        )}
      </div>
    </div>
  );
}