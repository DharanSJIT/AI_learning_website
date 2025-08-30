import React, { useState } from "react";
import axios from "axios";
import { Clipboard, ClipboardCheck, FileText, Sparkles, Zap } from "lucide-react";

const Summarization = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini');
  const [wordCount, setWordCount] = useState(0);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    setWordCount(newText.trim().split(/\s+/).filter(word => word.length > 0).length);
  };

  const summarizeText = async () => {
    setLoading(true);
    setError("");
    setSummary("");
    
    try {
      const endpoint = selectedModel === 'openai' 
        ? `${import.meta.env.VITE_BACKEND_URL}/api/openai/summarize`
        : `${import.meta.env.VITE_BACKEND_URL}/api/gemini/summarize`;

      console.log(`Making request to: ${endpoint}`);
      
      const response = await axios.post(endpoint, {
        text: text
      });

      setSummary(response.data.summary);
    } catch (err) {
      console.error('Error summarizing text:', err);
      
      let errorMessage = "⚠️ Error while summarizing. ";
      
      if (err.response?.status === 403) {
        errorMessage += "API access forbidden - check your API keys and credits.";
      } else if (err.response?.status === 429) {
        errorMessage += "Quota exceeded. Try using Gemini instead or add credits to your OpenAI account.";
      } else if (err.response?.status === 402) {
        errorMessage += "Insufficient credits. Please add credits to your OpenAI account.";
      } else if (err.response?.status === 401) {
        errorMessage += "Invalid API key.";
      } else if (err.response?.data?.error) {
        errorMessage += err.response.data.error;
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage += "Cannot connect to server. Make sure your backend is running on port 4000.";
      } else {
        errorMessage += "Please try again later.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearText = () => {
    setText("");
    setWordCount(0);
    setSummary("");
    setError("");
  };

  return (
    <div className="p-8 bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl max-w-5xl mx-auto mt-12 transition-all duration-500 border border-white/20 backdrop-blur-sm">
      {/* Header with animated gradient text */}
      <div className="text-center mb-8">
        <h3 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2 animate-pulse">
          ✨ AI Note Summarizer
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Transform lengthy text into concise, meaningful summaries
        </p>
      </div>

      {/* Enhanced Model Selection with glassmorphism */}
      <div className="mb-8 flex justify-center gap-6">
        <div className="flex gap-4 p-2 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
          <label className="flex items-center gap-3 cursor-pointer px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/40 dark:hover:bg-gray-700/40">
            <input
              type="radio"
              value="gemini"
              checked={selectedModel === 'gemini'}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
              selectedModel === 'gemini' 
                ? 'border-emerald-500 bg-emerald-500 shadow-emerald-500/50 shadow-lg' 
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              {selectedModel === 'gemini' && (
                <div className="w-2 h-2 bg-white rounded-full m-0.5 animate-pulse" />
              )}
            </div>
            <Sparkles className={`w-5 h-5 ${selectedModel === 'gemini' ? 'text-emerald-600' : 'text-gray-500'}`} />
            <span className={`font-semibold ${selectedModel === 'gemini' ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-600 dark:text-gray-400'}`}>
              Google Gemini
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/40 dark:hover:bg-gray-700/40">
            <input
              type="radio"
              value="openai"
              checked={selectedModel === 'openai'}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
              selectedModel === 'openai' 
                ? 'border-blue-500 bg-blue-500 shadow-blue-500/50 shadow-lg' 
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              {selectedModel === 'openai' && (
                <div className="w-2 h-2 bg-white rounded-full m-0.5 animate-pulse" />
              )}
            </div>
            <Zap className={`w-5 h-5 ${selectedModel === 'openai' ? 'text-blue-600' : 'text-gray-500'}`} />
            <span className={`font-semibold ${selectedModel === 'openai' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}`}>
              OpenAI GPT
            </span>
          </label>
        </div>
      </div>

      {/* Enhanced Input Section */}
      <div className="mb-6">
        <div className="relative group">
          {/* Input Label and Stats */}
          <div className="flex justify-between items-center mb-3">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
              <FileText className="w-5 h-5 text-indigo-500" />
              Your Text
            </label>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                {wordCount} words
              </span>
              {text && (
                <button
                  onClick={clearText}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Enhanced Textarea with custom scrollbar */}
          <div className="relative">
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="✍️ Paste or type your long text here... (articles, notes, documents, etc.)"
              rows="8"
              className="
                w-full p-6 rounded-2xl 
                border-2 border-transparent
                bg-white/70 dark:bg-gray-800/70 
                backdrop-blur-md
                text-gray-800 dark:text-gray-200 
                placeholder-gray-500 dark:placeholder-gray-400
                text-base leading-relaxed
                focus:outline-none 
                focus:ring-4 focus:ring-indigo-500/20 
                focus:border-indigo-400/50
                resize-none 
                shadow-lg
                transition-all duration-300
                hover:bg-white/80 dark:hover:bg-gray-800/80
                hover:shadow-xl
                
                /* Custom Scrollbar Styles */
                scrollbar-thin 
                scrollbar-track-transparent 
                scrollbar-thumb-indigo-300 dark:scrollbar-thumb-gray-600
                hover:scrollbar-thumb-indigo-400 dark:hover:scrollbar-thumb-gray-500
              "
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#a5b4fc transparent'
              }}
            />
            
            {/* Gradient border effect on focus */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none -z-10 blur-sm" />
          </div>

          {/* Character limit indicator */}
          {text.length > 0 && (
            <div className="mt-2 flex justify-end">
              <div className={`text-xs px-2 py-1 rounded-full ${
                text.length > 10000 
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                  : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
              }`}>
                {text.length.toLocaleString()} characters
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Summarize Button with animated gradient */}
      <button
        onClick={summarizeText}
        disabled={loading || !text}
        className={`
          mt-6 w-full py-4 rounded-2xl font-bold text-white text-lg
          transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98]
          shadow-lg hover:shadow-2xl
          relative overflow-hidden group
          ${loading || !text
            ? "bg-gray-400 cursor-not-allowed shadow-none"
            : "bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-700"
          }
        `}
      >
        {/* Animated background gradient */}
        {!loading && text && (
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}
        
        <span className="relative z-10">
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full"></div>
              <span>Summarizing with {selectedModel.toUpperCase()}...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              Summarize with {selectedModel.toUpperCase()}
            </span>
          )}
        </span>
      </button>

      {/* Enhanced Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-red-600 dark:text-red-400 font-medium text-center">{error}</p>
        </div>
      )}

      {/* Enhanced Summary Box with glassmorphism */}
      {summary && (
        <div className="mt-8 p-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-2xl relative border border-white/20 transition-all duration-500 hover:bg-white/70 dark:hover:bg-gray-800/70">
          <h4 className="font-bold text-xl text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            Summary 
            <span className="text-sm bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 px-3 py-1 rounded-full font-normal">
              via {selectedModel.toUpperCase()}
            </span>
          </h4>
          
          <div className="relative">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base whitespace-pre-wrap">
              {summary}
            </p>
          </div>

          {/* Enhanced Copy Button */}
          <button
            onClick={handleCopy}
            className={`absolute top-4 right-4 p-3 rounded-xl transition-all duration-300 ${
              copied 
                ? 'bg-green-500 text-white shadow-green-500/25' 
                : 'bg-white/80 dark:bg-gray-700/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-600'
            } shadow-lg hover:shadow-xl`}
            title="Copy to clipboard"
          >
            {copied ? (
              <ClipboardCheck className="w-5 h-5" />
            ) : (
              <Clipboard className="w-5 h-5" />
            )}
          </button>
        </div>
      )}

      {/* Add custom CSS for webkit scrollbar */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #a5b4fc;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #8b5cf6;
        }
        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #4b5563;
        }
        .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default Summarization;