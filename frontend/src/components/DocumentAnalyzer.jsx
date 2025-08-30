import React, { useState, useRef } from "react";
import * as mammoth from "mammoth";
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

export default function DocumentAnalyzer() {
  const [activeTab, setActiveTab] = useState("upload"); // upload, url
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

  // Mock API function to simulate AI analysis
  const simulateAIAnalysis = async (prompt, content) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    
    // Mock analysis based on content
    const wordCount = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    
    return `Document Analysis Summary

Overview
This document contains approximately ${wordCount} words across ${sentences} sentences and ${paragraphs} paragraphs. The content appears to be ${wordCount > 1000 ? 'comprehensive and detailed' : 'concise and focused'}.

Key Themes Identified
- Primary topic appears to be related to the main subject matter discussed
- Secondary themes emerge from supporting arguments and examples
- The document maintains ${sentences / paragraphs > 10 ? 'a detailed' : 'a moderate'} level of depth per section

Content Structure
- Well-organized with clear ${paragraphs > 5 ? 'multiple sections' : 'section divisions'}
- ${wordCount > 500 ? 'Substantial content' : 'Concise presentation'} suitable for ${wordCount > 1000 ? 'in-depth study' : 'quick reference'}
- Estimated reading time: ${Math.ceil(wordCount / 200)} minutes

Important Insights
- The document demonstrates ${wordCount > 800 ? 'comprehensive coverage' : 'focused treatment'} of the subject matter
- Key concepts are presented with ${sentences / paragraphs > 8 ? 'detailed explanations' : 'clear, concise descriptions'}
- The content would benefit readers seeking ${wordCount > 1000 ? 'thorough understanding' : 'quick overview'} of the topic

Recommendations
- Consider this document as ${wordCount > 1500 ? 'primary reference material' : 'supplementary reading'}
- Suitable for ${wordCount > 800 ? 'advanced study' : 'introductory learning'}
- May require ${wordCount > 1200 ? 'multiple review sessions' : 'single focused reading'} for full comprehension

Note: This analysis is generated using content structure and length indicators. For more detailed analysis, please use an actual AI service.`;
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setDocumentInfo({
      name: selectedFile.name,
      type: selectedFile.type,
      size: (selectedFile.size / 1024 / 1024).toFixed(2) + " MB"
    });

    await extractContent(selectedFile);
  };

  const extractContent = async (file) => {
    try {
      // Fix: Use functional update to ensure we get the latest state
      setLoading(prev => ({ ...prev, extract: true }));
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
      // Fix: Use functional update
      setLoading(prev => ({ ...prev, extract: false }));
    }
  };

  const extractFromUrl = async () => {
    if (!url) return;
    
    try {
      // Fix: Use functional update
      setLoading(prev => ({ ...prev, extract: true }));
      
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
      // Fix: Use functional update
      setLoading(prev => ({ ...prev, extract: false }));
    }
  };

  // Mock question generation function
  const simulateQuestionGeneration = async (prompt, content) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
    
    const wordCount = content.split(/\s+/).length;
    const topics = ['main concept', 'key principle', 'important detail', 'supporting evidence', 'conclusion'];
    
    return `Generated Questions

Multiple Choice Questions

1. What is the primary focus of this document?
   a) Basic introduction to the topic
   b) Comprehensive analysis of key concepts
   c) Historical overview
   d) Technical specifications
   Answer: b

2. Based on the content, what would be the estimated reading difficulty?
   a) Beginner level
   b) Intermediate level
   c) Advanced level
   d) Expert level
   Answer: ${wordCount > 1000 ? 'c' : 'b'}

3. The document contains approximately how many words?
   a) Less than 500
   b) 500-1000
   c) 1000-2000
   d) More than 2000
   Answer: ${wordCount < 500 ? 'a' : wordCount < 1000 ? 'b' : wordCount < 2000 ? 'c' : 'd'}

Short Answer Questions

4. Summarize the main theme of this document in 2-3 sentences.
   Students should identify the core subject matter and its primary focus

5. What are the key supporting points mentioned in the content?
   Look for main arguments, evidence, or examples presented

6. How would you categorize the writing style and tone of this document?
   Consider formal vs informal, academic vs casual, technical vs general

Essay Questions

7. Analyze the effectiveness of the document's structure and organization. How does it contribute to the reader's understanding?
   Discuss paragraph organization, logical flow, and clarity of presentation

8. Evaluate the depth of coverage provided in this document. What additional information might be beneficial?
   Consider completeness, gaps in information, and areas for expansion

9. Compare and contrast the main points presented. How do they relate to each other and support the overall message?
   Examine relationships between concepts and their contribution to the whole

10. Based on this document, what would be appropriate follow-up reading or research topics?
    Suggest related areas of study or deeper investigation

Discussion Questions

11. How might the concepts in this document apply to real-world situations?

12. What questions does this document raise that aren't fully addressed?

13. How does this content relate to other materials you've studied on this topic?

Note: These questions are generated based on content analysis. For subject-specific questions, please use an actual AI service with your document.`;
  };

  const runAnalysis = async () => {
    if (!documentContent) return;

    try {
      // Fix: Use functional update and clear response first
      setLoading(prev => ({ ...prev, analysis: true }));
      setAnalysisResponse(""); // Clear previous response

      // Use mock analysis instead of real API
      const analysisResult = await simulateAIAnalysis(analysisPrompt, documentContent);
      setAnalysisResponse(analysisResult);
    } catch (error) {
      console.error("Error analyzing document:", error);
      setAnalysisResponse("❌ Error: Could not analyze document. Please try again.");
    } finally {
      // Fix: Use functional update
      setLoading(prev => ({ ...prev, analysis: false }));
    }
  };

  const generateQuestions = async () => {
    if (!documentContent) return;

    try {
      // Fix: Use functional update and clear response first
      setLoading(prev => ({ ...prev, questions: true }));
      setQuestionsResponse(""); // Clear previous response

      // Use mock question generation instead of real API
      const questionsResult = await simulateQuestionGeneration(questionPrompt, documentContent);
      setQuestionsResponse(questionsResult);
    } catch (error) {
      console.error("Error generating questions:", error);
      setQuestionsResponse("❌ Error: Could not generate questions. Please try again.");
    } finally {
      // Fix: Use functional update
      setLoading(prev => ({ ...prev, questions: false }));
    }
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      // Fix: Use functional update for copied state
      setCopied(prev => ({ ...prev, [type]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [type]: false })), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const clearAll = () => {
    setUrl("");
    setDocumentContent("");
    setAnalysisResponse("");
    setQuestionsResponse("");
    setDocumentInfo({ name: "", type: "", size: "" });
    // Reset loading and copied states
    setLoading({ analysis: false, questions: false, extract: false });
    setCopied({ analysis: false, questions: false });
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
          <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 mt-8">
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

    
        {/* API Key Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Demo Version:</h4>
              <p className="text-sm text-blue-700">
                This is a demo version using mock AI responses. For real AI analysis, you would need to integrate with 
                services like OpenAI GPT, Google Gemini, or Anthropic Claude using their respective APIs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}