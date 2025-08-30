import React, { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  Upload, 
  FileText, 
  Link, 
  Loader2, 
  Brain, 
  Copy, 
  Check, 
  Download,
  Trash2,
  HelpCircle,
  BookOpen,
  Target,
  Zap,
  Globe
} from "lucide-react";
import * as mammoth from "mammoth";

export default function DocumentAnalyzer() {
  const [activeTab, setActiveTab] = useState("upload"); // upload, url
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [analysisPrompt, setAnalysisPrompt] = useState("Analyze this document and provide a comprehensive summary including key points, main themes, and important insights.");
  const [questionPrompt, setQuestionPrompt] = useState("Generate 10 diverse questions based on this content including multiple choice, short answer, and essay questions with varying difficulty levels.");
  const [analysisResponse, setAnalysisResponse] = useState("");
  const [questionsResponse, setQuestionsResponse] = useState("");
  const [loading, setLoading] = useState({ analysis: false, questions: false, extract: false });
  const [copied, setCopied] = useState({ analysis: false, questions: false });
  const [documentInfo, setDocumentInfo] = useState({ name: "", type: "", size: "" });
  const fileInputRef = useRef(null);

  // Initialize Gemini API
  // const genAI = new GoogleGenerativeAI("AIzaSyDPn2YCGI44VPAbMyLNYCHzpVnsoe2xtKs");
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setDocumentInfo({
      name: selectedFile.name,
      type: selectedFile.type,
      size: (selectedFile.size / 1024 / 1024).toFixed(2) + " MB"
    });

    await extractContent(selectedFile);
  };

  const extractContent = async (file) => {
  try {
    setLoading({ ...loading, extract: true });
    let content = "";

    if (file.type === "application/pdf") {
      // For PDF files - needs setup
      content = "PDF content extraction requires additional setup. Please use text files or URLs for now.";
    } else if (file.type.includes("word") || file.name.endsWith('.docx')) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      content = result.value;
    } else if (file.type === "text/plain") {
      content = await file.text();
    } else {
      content = "Unsupported file type. Please use PDF, Word, or text files.";
    }

    // Clean up asterisks and normalize bullet points
    const cleanedContent = content
      .replace(/^\*\s?/gm, "- ") // Replace lines starting with "* " to "- "
      .replace(/\*/g, "");       // Remove remaining asterisks

    setDocumentContent(cleanedContent);
  } catch (error) {
    console.error("Error extracting content:", error);
    setDocumentContent("Error extracting content from file.");
  } finally {
    setLoading({ ...loading, extract: false });
  }
};


  const extractFromUrl = async () => {
    if (!url) return;
    
    try {
      setLoading({ ...loading, extract: true });
      
      // Simple URL content extraction (you might need a proxy for CORS)
      const response = await fetch(url);
      const text = await response.text();
      
      // Basic HTML content extraction
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const content = doc.body?.textContent || text;
      
      setDocumentContent(content.substring(0, 10000)); // Limit content
      setDocumentInfo({
        name: url.split('/').pop() || "Web Content",
        type: "URL",
        size: (content.length / 1024).toFixed(2) + " KB"
      });
    } catch (error) {
      console.error("Error fetching URL:", error);
      setDocumentContent("Error: Could not fetch content from URL. Please check CORS settings or use a different URL.");
    } finally {
      setLoading({ ...loading, extract: false });
    }
  };

  const runAnalysis = async () => {
  if (!documentContent) return;

  try {
    setLoading({ ...loading, analysis: true });
    setAnalysisResponse("");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      { text: `${analysisPrompt}\n\nDocument Content:\n${documentContent}` }
    ]);

    const rawText = result.response.text();

    // Clean unwanted * characters
    const cleanedText = rawText
      .replace(/^\*\s?/gm, "- ") // Convert "* " bullets to "- "
      .replace(/\*/g, "");       // Remove remaining asterisks

    setAnalysisResponse(cleanedText);
  } catch (error) {
    console.error("Error analyzing document:", error);
    setAnalysisResponse("❌ Error: Could not analyze document. Please check your API key and try again.");
  } finally {
    setLoading({ ...loading, analysis: false });
  }
};

const generateQuestions = async () => {
  if (!documentContent) return;

  try {
    setLoading({ ...loading, questions: true });
    setQuestionsResponse("");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      { text: `${questionPrompt}\n\nDocument Content:\n${documentContent}` }
    ]);

    const rawText = result.response.text();

    const cleanedText = rawText
      .replace(/^\*\s?/gm, "- ") // Convert "* " bullets to "- "
      .replace(/\*/g, "");       // Remove remaining asterisks

    setQuestionsResponse(cleanedText);
  } catch (error) {
    console.error("Error generating questions:", error);
    setQuestionsResponse("❌ Error: Could not generate questions. Please check your API key and try again.");
  } finally {
    setLoading({ ...loading, questions: false });
  }
};

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied({ ...copied, [type]: true });
      setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const clearAll = () => {
    setFile(null);
    setUrl("");
    setDocumentContent("");
    setAnalysisResponse("");
    setQuestionsResponse("");
    setDocumentInfo({ name: "", type: "", size: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadResults = () => {
    const content = `Document Analysis Results
==========================

Document: ${documentInfo.name}
Type: ${documentInfo.type}
Size: ${documentInfo.size}

ANALYSIS:
${analysisResponse}

QUESTIONS:
${questionsResponse}
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${documentInfo.name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const quickAnalysisPrompts = [
    "Analyze this document and provide a comprehensive summary",
    "Extract key points and main themes from this content",
    "Identify important concepts and explain their significance",
    "Provide critical analysis and insights from this document",
    "Summarize the methodology and findings if this is a research paper"
  ];

  const quickQuestionPrompts = [
    "Generate 10 diverse questions with multiple choice, short answer, and essay questions",
    "Create 15 questions ranging from basic recall to advanced analysis",
    "Generate quiz questions for different difficulty levels (easy, medium, hard)",
    "Create comprehension questions that test understanding of key concepts",
    "Generate questions suitable for exam preparation with answers"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Document AI Analyzer
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Upload documents or analyze web content to get AI-powered insights and automatically generate questions
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8 border border-gray-100">
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === "upload" 
                  ? "bg-white text-blue-600 shadow-md" 
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload File
            </button>
            <button
              onClick={() => setActiveTab("url")}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === "url" 
                  ? "bg-white text-blue-600 shadow-md" 
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <Globe className="w-4 h-4" />
              Web URL
            </button>
          </div>

          {/* Upload Tab */}
          {activeTab === "upload" && (
            <div className="space-y-6">
              <div 
                className="border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-all cursor-pointer bg-blue-50 hover:bg-blue-100"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-blue-100 rounded-full mb-4">
                    <FileText className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Drop your document here
                  </h3>
                  <p className="text-gray-600 mb-1">or click to browse files</p>
                  <p className="text-sm text-gray-500">
                    Supports PDF, Word (.docx), PowerPoint (.pptx), and Text files
                  </p>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                className="hidden"
              />
            </div>
          )}

          {/* URL Tab */}
          {activeTab === "url" && (
            <div className="space-y-4">
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  placeholder="https://example.com/document or Google Docs link"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <button
                onClick={extractFromUrl}
                disabled={!url || loading.extract}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading.extract ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Extracting Content...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Extract Content
                  </>
                )}
              </button>
            </div>
          )}

          {/* Document Info */}
          {documentInfo.name && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Document Loaded
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-green-600 font-medium">Name:</span>
                  <p className="text-green-800 truncate">{documentInfo.name}</p>
                </div>
                <div>
                  <span className="text-green-600 font-medium">Type:</span>
                  <p className="text-green-800">{documentInfo.type}</p>
                </div>
                <div>
                  <span className="text-green-600 font-medium">Size:</span>
                  <p className="text-green-800">{documentInfo.size}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Preview */}
        {documentContent && (
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                Document Preview
              </h3>
              <button
                onClick={clearAll}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto border">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {documentContent.substring(0, 1000)}
                {documentContent.length > 1000 && "..."}
              </pre>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Showing first 1000 characters • Total: {documentContent.length} characters
            </p>
          </div>
        )}

        {/* Analysis & Questions Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Document Analysis */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              Document Analysis
            </h3>

            {/* Analysis Prompt */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analysis Instructions
              </label>
              
              {/* Quick Prompts */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {quickAnalysisPrompts.map((quickPrompt, index) => (
                    <button
                      key={index}
                      onClick={() => setAnalysisPrompt(quickPrompt)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      {quickPrompt.split(' ').slice(0, 5).join(' ')}...
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                rows="3"
                value={analysisPrompt}
                onChange={(e) => setAnalysisPrompt(e.target.value)}
              />
            </div>

            <button
              onClick={runAnalysis}
              disabled={loading.analysis || !documentContent}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mb-6"
            >
              {loading.analysis ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Analyze Document
                </>
              )}
            </button>

            {/* Analysis Results */}
            {(analysisResponse || loading.analysis) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800">Analysis Results</h4>
                  {analysisResponse && !loading.analysis && (
                    <button
                      onClick={() => copyToClipboard(analysisResponse, 'analysis')}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Copy analysis"
                    >
                      {copied.analysis ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {loading.analysis ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
                      <p className="text-gray-600">AI is analyzing your document...</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 max-h-80 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-gray-800 text-sm">
                      {analysisResponse}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Question Generation */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-purple-600" />
              Question Generator
            </h3>

            {/* Question Prompt */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Generation Instructions
              </label>
              
              {/* Quick Prompts */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {quickQuestionPrompts.map((quickPrompt, index) => (
                    <button
                      key={index}
                      onClick={() => setQuestionPrompt(quickPrompt)}
                      className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                    >
                      {quickPrompt.split(' ').slice(0, 5).join(' ')}...
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                rows="3"
                value={questionPrompt}
                onChange={(e) => setQuestionPrompt(e.target.value)}
              />
            </div>

            <button
              onClick={generateQuestions}
              disabled={loading.questions || !documentContent}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mb-6"
            >
              {loading.questions ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Target className="w-5 h-5" />
                  Generate Questions
                </>
              )}
            </button>

            {/* Questions Results */}
            {(questionsResponse || loading.questions) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800">Generated Questions</h4>
                  {questionsResponse && !loading.questions && (
                    <button
                      onClick={() => copyToClipboard(questionsResponse, 'questions')}
                      className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Copy questions"
                    >
                      {copied.questions ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {loading.questions ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-3" />
                      <p className="text-gray-600">AI is generating questions...</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 max-h-80 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-gray-800 text-sm">
                      {questionsResponse}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        {(analysisResponse || questionsResponse) && (
          <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={downloadResults}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
              >
                <Download className="w-5 h-5" />
                Download Results
              </button>
              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                <Trash2 className="w-5 h-5" />
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Help Section */}
        {!documentContent && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100 mt-8">
            <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <HelpCircle className="w-6 h-6" />
              How it works:
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-blue-700 mb-2">Supported Formats:</h4>
                <ul className="space-y-1 text-blue-600">
                  <li>• PDF documents</li>
                  <li>• Word documents (.docx)</li>
                  <li>• PowerPoint presentations (.pptx)</li>
                  <li>• Plain text files (.txt)</li>
                  <li>• Web URLs and articles</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-700 mb-2">Features:</h4>
                <ul className="space-y-1 text-blue-600">
                  <li>• AI-powered content analysis</li>
                  <li>• Automatic question generation</li>
                  <li>• Customizable prompts</li>
                  <li>• Export results</li>
                  <li>• Copy to clipboard</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* API Key Notice */}
        {/* <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <HelpCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Setup Required:</h4>
              <p className="text-sm text-yellow-700">
                Make sure to set your Gemini API key in your environment variables as 
                <code className="bg-yellow-100 px-2 py-1 rounded mx-1 font-mono">REACT_APP_GEMINI_API_KEY</code>
                or replace "YOUR_GEMINI_API_KEY" in the code.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}