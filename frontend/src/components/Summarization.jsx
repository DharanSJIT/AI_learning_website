import React, { useState } from "react";
import axios from "axios";
import { Clipboard, ClipboardCheck, FileText, Sparkles, Zap, Trash2, BarChart3 } from "lucide-react";

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

  const summaryWordCount = summary ? summary.trim().split(/\s+/).filter(word => word.length > 0).length : 0;
  const compressionRate = wordCount > 0 ? Math.round(((wordCount - summaryWordCount) / wordCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Back to Dashboard Button */}
        <div className="mb-6">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 group"
          >
            <svg 
              className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>
        
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Text Summarizer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform lengthy documents into concise, meaningful summaries using advanced AI technology
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Model Selection Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Choose AI Model
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`
                flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 border-2
                ${selectedModel === 'gemini' 
                  ? 'bg-green-50 border-green-300 text-green-800' 
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }
              `}>
                <input
                  type="radio"
                  value="gemini"
                  checked={selectedModel === 'gemini'}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="hidden"
                />
                <div className={`
                  w-4 h-4 rounded-full border-2 transition-all
                  ${selectedModel === 'gemini' 
                    ? 'border-green-500 bg-green-500' 
                    : 'border-gray-300'
                  }
                `}>
                  {selectedModel === 'gemini' && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                  )}
                </div>
                <Sparkles className={`w-5 h-5 ${selectedModel === 'gemini' ? 'text-green-600' : 'text-gray-500'}`} />
                <div>
                  <div className="font-semibold">Google Gemini</div>
                  <div className="text-xs opacity-70">Advanced & Free</div>
                </div>
              </label>

              <label className={`
                flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 border-2
                ${selectedModel === 'openai' 
                  ? 'bg-blue-50 border-blue-300 text-blue-800' 
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }
              `}>
                <input
                  type="radio"
                  value="openai"
                  checked={selectedModel === 'openai'}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="hidden"
                />
                <div className={`
                  w-4 h-4 rounded-full border-2 transition-all
                  ${selectedModel === 'openai' 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                  }
                `}>
                  {selectedModel === 'openai' && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                  )}
                </div>
                <Zap className={`w-5 h-5 ${selectedModel === 'openai' ? 'text-blue-600' : 'text-gray-500'}`} />
                <div>
                  <div className="font-semibold">OpenAI GPT</div>
                  <div className="text-xs opacity-70">Powerful & Precise</div>
                </div>
              </label>
            </div>
          </div>

          {/* Input Text Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                Input Text
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 text-sm">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    {wordCount} words
                  </span>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                    {text.length} chars
                  </span>
                </div>
                {text && (
                  <button
                    onClick={clearText}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors font-medium text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="relative">
              <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="📝 Paste your article, document, or any long text here...&#10;&#10;Perfect for:&#10;• Research papers and articles&#10;• Meeting notes and reports&#10;• News articles and blogs&#10;• Academic papers&#10;• Any lengthy content you need summarized"
                className="
                  w-full p-6 
                  bg-gradient-to-br from-gray-50 to-white
                  border-2 border-gray-200
                  rounded-xl
                  focus:outline-none 
                  focus:ring-4 focus:ring-blue-500/20
                  focus:border-blue-400
                  text-gray-800
                  placeholder-gray-500
                  resize-none
                  transition-all duration-200
                  font-mono text-sm
                  leading-relaxed
                "
                style={{ 
                  minHeight: '400px',
                  height: 'auto'
                }}
                rows="20"
              />
              
              {/* Character limit indicator */}
              {text.length > 0 && (
                <div className="absolute bottom-4 right-4">
                  <div className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${text.length > 10000 
                      ? 'bg-red-100 text-red-600' 
                      : text.length > 5000
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-600'
                    }
                  `}>
                    {text.length > 10000 ? '⚠️ ' : text.length > 5000 ? '⚡ ' : '✅ '}
                    {text.length.toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={summarizeText}
              disabled={loading || !text.trim()}
              className={`
                w-full mt-6 py-4 px-6 rounded-xl font-semibold text-lg
                transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                shadow-lg hover:shadow-xl
                flex items-center justify-center gap-3
                ${loading || !text.trim()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  : selectedModel === 'gemini'
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                }
              `}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Analyzing with {selectedModel.charAt(0).toUpperCase() + selectedModel.slice(1)}...
                </>
              ) : (
                <>
                  {selectedModel === 'gemini' ? <Sparkles className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                  Summarize with {selectedModel.charAt(0).toUpperCase() + selectedModel.slice(1)}
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">!</span>
                </div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Processing Your Text</h3>
                <p className="text-gray-600">AI is analyzing and condensing your content...</p>
              </div>
            </div>
          )}

          {/* Summary Result */}
          {summary && !loading && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
              
              {/* Summary Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Summary Generated</h3>
                    <p className="text-sm text-gray-500">via {selectedModel.charAt(0).toUpperCase() + selectedModel.slice(1)} AI</p>
                  </div>
                </div>
                
                <button
                  onClick={handleCopy}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${copied 
                      ? 'bg-green-100 text-green-700 shadow-green-500/20' 
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200 shadow-blue-500/20'
                    } shadow-lg
                  `}
                >
                  {copied ? (
                    <>
                      <ClipboardCheck className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{wordCount}</div>
                  <div className="text-xs text-blue-500 font-medium">Original Words</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{summaryWordCount}</div>
                  <div className="text-xs text-green-500 font-medium">Summary Words</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{compressionRate}%</div>
                  <div className="text-xs text-purple-500 font-medium">Compressed</div>
                </div>
              </div>

              {/* Summary Content - Shows entirely without scrollbars */}
              <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-xl p-6">
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap select-text text-base">
                  {summary}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!summary && !loading && !error && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl mb-6">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">Ready for Summarization</h3>
                <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                  Paste your text above and click summarize to see your AI-generated summary here.
                </p>
                
                {/* Feature highlights */}
                <div className="grid grid-cols-1 gap-3 mt-8 text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Supports articles, papers, and documents</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Multiple AI models available</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>One-click copy functionality</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Summarization;