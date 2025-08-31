import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Upload,
  Image,
  Loader2,
  Sparkles,
  Eye,
  Copy,
  Check,
} from "lucide-react";

export default function ImageExplanation() {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState(
    "Analyze this image and provide a detailed explanation of what you see, including objects, people, activities, and context."
  );
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  // Use VITE_ prefix for environment variables with Vite
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(selectedFile);
      setUrl(""); // Clear URL if file is uploaded
    }
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    if (e.target.value) {
      setFile(null);
      setPreviewUrl(e.target.value);
    }
  };

  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const fetchImageAsBase64 = async (imageUrl) => {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error("Failed to fetch image");
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        resolve({ base64String, mimeType: blob.type || "image/jpeg" });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const runExplain = async () => {
    try {
      setLoading(true);
      setResponse("");

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      let imageData;
      let mimeType;

      if (file) {
        imageData = await convertFileToBase64(file);
        mimeType = file.type;
      } else if (url) {
        const { base64String, mimeType: type } = await fetchImageAsBase64(url);
        imageData = base64String;
        mimeType = type;
      } else {
        throw new Error("No image provided");
      }

      const result = await model.generateContent([
        { text: prompt },
        {
          inlineData: {
            mimeType,
            data: imageData,
          },
        },
      ]);

      const rawText = await result.response.text();

      // Clean response text from markdown and bullets
      const cleanedText = rawText
        .replace(/^\s*[*-]\s?/gm, "")
        .replace(/\*\*(.*?)\*\*/g, "$1");

      setResponse(cleanedText);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setResponse(
        "❌ Error: Could not process image. Please check your API key and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const clearAll = () => {
    setUrl("");
    setFile(null);
    setPreviewUrl("");
    setResponse("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const quickPrompts = [
    "Analyze this image and provide a detailed explanation",
    "Describe the objects, people, and activities in this image",
    "What is the context and setting of this image?",
    "Identify and explain the main elements in this image",
    "Provide a creative interpretation of this image",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back to Dashboard Link */}
        <Link
          to="/home" // update this route to your dashboard path if different
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Image Analyzer
          </h1>
          <p className="text-gray-600 text-lg">
            Upload an image or paste a URL to get detailed AI-powered analysis
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="space-y-6">
            {/* Image Input */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-indigo-600" />
                Image Input
              </h3>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image File
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-400 mt-1">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* URL Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or Enter Image URL
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="https://example.com/image.jpg"
                  value={url}
                  onChange={handleUrlChange}
                />
              </div>
            </div>

            {/* Prompt Input */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-600" />
                Analysis Prompt
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Prompts
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((quickPrompt, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(quickPrompt)}
                      className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
                    >
                      {quickPrompt.split(" ").slice(0, 4).join(" ")}...
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                rows="4"
                placeholder="Enter your custom prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={runExplain}
                disabled={loading || (!url && !file) || !prompt}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze Image
                  </>
                )}
              </button>
              <button
                onClick={clearAll}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Preview */}
            {previewUrl && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Image Preview
                </h3>
                <div className="rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                    onError={() => setPreviewUrl("")}
                  />
                </div>
              </div>
            )}

            {/* AI Response */}
            {(response || loading) && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    AI Analysis
                  </h3>
                  {response && !loading && (
                    <button
                      onClick={copyToClipboard}
                      className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
                      <p className="text-gray-600">AI is analyzing your image...</p>
                      <p className="text-sm text-gray-400 mt-1">
                        This may take a few seconds
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                      <pre className="whitespace-pre-wrap text-gray-800 text-sm font-normal">
                        {response}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
