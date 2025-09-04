import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Upload, 
  FileText, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Target,
  Lightbulb,
  Star,
  ArrowRight,
  Shield,
  AlertTriangle,
  Download,
  RefreshCw,
  Wand2,
  Copy,
  Eye
} from "lucide-react";

const ATSResumeChecker = () => {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [generatedResume, setGeneratedResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadMethod, setUploadMethod] = useState("file");
  const [activeTab, setActiveTab] = useState("analysis");

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Please upload a PDF, DOCX, or TXT file");
        setFile(null);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file && !resumeText.trim()) {
      setError("Please upload a resume file or paste your resume text");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const formData = new FormData();
      if (file) {
        formData.append("resume", file);
      }
      if (resumeText.trim()) {
        formData.append("resumeText", resumeText);
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ats/ats-check`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalysis(data.analysis);
      setActiveTab("analysis");
    } catch (err) {
      console.error("ATS check error:", err);
      setError(
        err.message || 
        "Failed to analyze resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateResume = async () => {
    if (!analysis) {
      setError("Please analyze your resume first before generating an improved version");
      return;
    }

    setGenerating(true);
    setError("");

    try {
      const requestData = {
        originalResume: resumeText || "Original resume content",
        analysis: analysis,
        improvements: analysis.recommendations || []
      };

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ats/generate-resume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedResume(data);
      setActiveTab("generator");
    } catch (err) {
      console.error("Resume generation error:", err);
      setError(
        err.message || 
        "Failed to generate resume. Please try again."
      );
    } finally {
      setGenerating(false);
    }
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return "from-green-400 to-emerald-500";
    if (score >= 60) return "from-yellow-400 to-orange-500";
    if (score >= 40) return "from-orange-400 to-red-500";
    return "from-red-400 to-red-600";
  };

  const getRating = (score) => {
    if (score >= 80) return { text: "Excellent", icon: "🏆", color: "text-green-600" };
    if (score >= 60) return { text: "Good", icon: "👍", color: "text-yellow-600" };
    if (score >= 40) return { text: "Fair", icon: "⚠️", color: "text-orange-600" };
    return { text: "Needs Improvement", icon: "🔧", color: "text-red-600" };
  };

  const resetForm = () => {
    setAnalysis(null);
    setGeneratedResume(null);
    setFile(null);
    setResumeText("");
    setError("");
    setActiveTab("analysis");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Resume copied to clipboard!");
    });
  };

  const downloadResume = (content, filename) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Enhanced Card Components
  const StrengthCard = ({ strength}) => (
    <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-green-800 font-medium text-sm leading-relaxed">{strength}</p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Star className="w-4 h-4 text-green-600" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );

  const WeaknessCard = ({ weakness }) => (
    <div className="group relative bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
          <AlertTriangle className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-red-800 font-medium text-sm leading-relaxed">{weakness}</p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Target className="w-4 h-4 text-red-600" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-orange-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );

  const RecommendationCard = ({ recommendation, index }) => (
    <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">{index + 1}</span>
        </div>
        <div className="flex-1">
          <p className="text-blue-900 font-medium leading-relaxed">{recommendation}</p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <ArrowRight className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );

  return (
    <div className="min-h-[90vh]  bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back to Dashboard Link */}
        <Link
          to="/home"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-6 py-3 shadow-lg mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ATS Resume Optimizer
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze your resume and generate an ATS-optimized version with AI
          </p>
        </div>

        {/* Tab Navigation */}
        {analysis && (
          <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-2xl shadow-lg inline-flex">
              <button
                onClick={() => setActiveTab("analysis")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === "analysis"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <Eye className="w-5 h-5" />
                Analysis Results
              </button>
              <button
                onClick={() => setActiveTab("generator")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === "generator"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                <Wand2 className="w-5 h-5" />
                AI Generator
              </button>
            </div>
          </div>
        )}

        {/* Upload Section - Always visible when no analysis */}
        {!analysis && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
            {/* Upload Method Toggle */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-center">
                <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                  <button
                    type="button"
                    onClick={() => setUploadMethod("file")}
                    className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                      uploadMethod === "file"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMethod("text")}
                    className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                      uploadMethod === "text"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <FileText className="w-4 h-4 inline mr-2" />
                    Paste Text
                  </button>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* File Upload */}
              {uploadMethod === "file" && (
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-800 mb-4">
                    Upload Your Resume
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                      dragActive
                        ? "border-blue-500 bg-blue-50"
                        : file
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e.target.files[0])}
                      accept=".pdf,.docx,.txt"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {!file ? (
                      <div className="space-y-4">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-xl font-medium text-gray-700 mb-2">
                            Drop your resume here, or <span className="text-blue-600">browse</span>
                          </p>
                          <p className="text-gray-500">Supports PDF, DOCX, and TXT files</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                        <div>
                          <p className="text-xl font-medium text-green-700 mb-1">
                            {file.name}
                          </p>
                          <p className="text-green-600">Ready to analyze</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Text Input */}
              {uploadMethod === "text" && (
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-800">
                    Paste Your Resume Text
                  </label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume content here..."
                    className="w-full h-64 p-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 resize-none text-gray-700"
                  />
                  <div className="text-right text-sm text-gray-500">
                    {resumeText.length} characters
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || (!file && !resumeText.trim())}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-lg text-white transition-all duration-300 ${
                  loading || (!file && !resumeText.trim())
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-lg hover:shadow-xl"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    <span>Analyzing Your Resume...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>Analyze Resume</span>
                  </div>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Analysis Results Tab */}
        {analysis && activeTab === "analysis" && (
          <div className="space-y-8">
            {/* Score Card */}
            <div className={`bg-gradient-to-r ${getScoreBackground(analysis.score)} rounded-3xl p-8 text-white shadow-2xl`}>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Your ATS Compatibility Score</h3>
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="text-7xl font-bold mb-2">{analysis.score}%</div>
                    <div className="text-xl font-semibold opacity-90">
                      {getRating(analysis.score).icon} {getRating(analysis.score).text}
                    </div>
                  </div>
                  <div className="hidden md:block w-px h-24 bg-white/30"></div>
                  <div className="text-center space-y-3">
                    {analysis.wordCount && (
                      <div className="flex items-center gap-2 justify-center">
                        <FileText className="w-5 h-5" />
                        <span>{analysis.wordCount} words</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Strengths Section */}
              {analysis.strengths && analysis.strengths.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-green-500">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">Strengths</h4>
                        <p className="text-green-100 text-sm">{analysis.strengths.length} strong points identified</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                    {analysis.strengths.map((strength, index) => (
                      <StrengthCard key={index} strength={strength} index={index} />
                    ))}
                  </div>
                </div>
              )}

              {/* Weaknesses Section */}
              {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-red-500">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">Areas to Improve</h4>
                        <p className="text-red-100 text-sm">{analysis.weaknesses.length} areas need attention</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                    {analysis.weaknesses.map((weakness, index) => (
                      <WeaknessCard key={index} weakness={weakness} index={index} />
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations Section */}
              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-blue-500">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Lightbulb className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">Key Improvements</h4>
                        <p className="text-blue-100 text-sm">{analysis.recommendations.length} actionable suggestions</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                    {analysis.recommendations.map((rec, index) => (
                      <RecommendationCard key={index} recommendation={rec} index={index} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Generate Resume Button */}
            <div className="text-center">
              <button
                onClick={handleGenerateResume}
                disabled={generating}
                className={`px-8 py-4 rounded-2xl font-bold text-lg text-white transition-all duration-300 ${
                  generating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 shadow-lg hover:shadow-xl"
                }`}
              >
                {generating ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    <span>Generating Optimized Resume...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Wand2 className="w-6 h-6" />
                    <span>Generate ATS-Optimized Resume</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        {/* AI Generator Tab */}
        {analysis && activeTab === "generator" && (
          <div className="space-y-8">
            {generatedResume ? (
              <div className="space-y-6">
                {/* New Score Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
                    <h3 className="text-lg font-bold text-blue-800 mb-3">Original Score</h3>
                    <div className="text-4xl font-bold text-blue-600">{analysis.score}%</div>
                    <p className="text-blue-600 text-sm mt-1">{getRating(analysis.score).text}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
                    <h3 className="text-lg font-bold text-green-800 mb-3">Estimated New Score</h3>
                    <div className="text-4xl font-bold text-green-600">{generatedResume.estimatedScore || '85'}%</div>
                    <p className="text-green-600 text-sm mt-1">Excellent</p>
                  </div>
                </div>

                {/* Generated Resume Content */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold">Your ATS-Optimized Resume</h3>
                        <p className="text-purple-100">AI-enhanced for better ATS compatibility</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => copyToClipboard(generatedResume.content)}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => downloadResume(generatedResume.content, 'ats-optimized-resume.txt')}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
                          title="Download resume"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="bg-gray-50 rounded-xl p-6 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed font-mono">
                        {generatedResume.content}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Improvements Made */}
                {generatedResume.improvements && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                      <CheckCircle className="w-6 h-6 mr-3" />
                      Improvements Made
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generatedResume.improvements.map((improvement, index) => (
                        <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-green-800 text-sm">{improvement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white rounded-2xl p-12 shadow-lg">
                  <Wand2 className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Generate Your Optimized Resume</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Click the button below to create an ATS-optimized version of your resume based on our analysis.
                  </p>
                  <button
                    onClick={handleGenerateResume}
                    disabled={generating}
                    className={`px-8 py-4 rounded-2xl font-bold text-lg text-white transition-all duration-300 ${
                      generating
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {generating ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Wand2 className="w-6 h-6" />
                        <span>Generate Optimized Resume</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {analysis && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button
              type="button"
              onClick={resetForm}
              className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-5 h-5 inline mr-2" />
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSResumeChecker;