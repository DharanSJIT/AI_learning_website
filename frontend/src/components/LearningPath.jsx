import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

export default function LearningPath() {
  const [course, setCourse] = useState("");
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading && course.trim()) {
      generatePath();
    }
  };

  // Add event listener for Enter key
  useEffect(() => {
    const handleGlobalKeyPress = (e) => {
      if (e.key === "Enter" && document.activeElement.type === "text" && !loading && course.trim()) {
        generatePath();
      }
    };

    document.addEventListener("keypress", handleGlobalKeyPress);
    return () => document.removeEventListener("keypress", handleGlobalKeyPress);
  }, [course, loading]);

  const generatePath = async () => {
    if (!course.trim()) {
      setPath("⚠️ Please enter a course name.");
      return;
    }

    setLoading(true);
    setPath(null);

    try {
      const prompt = `Create a clean, step-by-step learning path for learning ${course}.
For each step include: Title, Duration, Objective, and Suggested Resources.
Do NOT use markdown (** or *), just plain text.`;

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/gemini/generate`,
        { prompt },
        { headers: { "Content-Type": "application/json" } }
      );

      const rawText =
        res.data?.text ||
        res.data?.output ||
        res.data?.result ||
        res.data?.data?.text ||
        (res.data?.choices?.[0]?.text ?? "");

      if (!rawText) {
        throw new Error("Backend did not return any text");
      }

      const cleaned = rawText.replace(/\*/g, "").trim();
      setPath(cleaned);
    } catch (e) {
      console.error("Error generating learning path:", e);
      setPath("❌ Failed to generate learning path. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    if (!path) return;
    
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    const maxLineWidth = pageWidth - (margin * 2);
    const lineHeight = 7;
    let yPosition = margin;

    // Set font
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);

    // Add title
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    const title = `Learning Path: ${course}`;
    doc.text(title, margin, yPosition);
    yPosition += 15;

    // Reset font for content
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);

    // Split content into lines that fit the page width
    const lines = doc.splitTextToSize(path, maxLineWidth);

    // Process each line and add page breaks when needed
    lines.forEach((line) => {
      // Check if we need a new page
      if (yPosition + lineHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      // Add the line to current page
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    });

    // Save the PDF
    doc.save(`${course || "learning-path"}.pdf`);
  };

  const exportWord = async () => {
    if (!path) return;
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun({ text: path, size: 24 })],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${course || "learning-path"}.docx`);
  };

  return (
    <div className="min-h-[90vh] max-h-[90vh] bg-gray-50 py-6 px-4">
      {/* <div className="min-h-[90vh] max-h-[90vh] bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 mt-[-15px]"></div> */}
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📚 Learning Path Generator
            </h1>
            <p className="text-gray-600">
              Generate personalized learning paths for any subject
            </p>
          </div>

          {/* Input Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a course or topic (e.g., Python, Data Science, Web Development)"
                className="
                  flex-1
                  px-4 
                  py-3 
                  border 
                  border-gray-300 
                  rounded-lg
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-blue-500 
                  focus:border-transparent
                  text-gray-900
                  placeholder-gray-500
                "
              />
              <button
                onClick={generatePath}
                disabled={loading || !course.trim()}
                className="
                  px-6 
                  py-3 
                  bg-blue-600 
                  text-white 
                  rounded-lg 
                  font-medium
                  hover:bg-blue-700 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-blue-500 
                  focus:ring-offset-2
                  disabled:opacity-50 
                  disabled:cursor-not-allowed
                  transition-colors
                  min-w-[120px]
                  flex
                  items-center
                  justify-center
                "
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin mr-2 h-4 w-4"
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
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Generating...
                  </>
                ) : (
                  "Generate Path"
                )}
              </button>
            </div>
           
          </div>

          {/* Results Section */}
          {path && (
            <div className="space-y-6">
              {/* Learning Path Content - No scroll, full height */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🎯</span>
                  Your Learning Path for "{course}"
                </h3>
                <div
                  className="
                    text-gray-700 
                    whitespace-pre-wrap 
                    leading-relaxed
                    select-text
                  "
                >
                  {path}
                </div>
              </div>

              {/* Export Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={exportPDF}
                  className="
                    flex items-center gap-2 
                    px-4 py-2 
                    bg-red-600 
                    text-white 
                    rounded-lg 
                    hover:bg-red-700 
                    transition-colors
                    font-medium
                  "
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export PDF
                </button>

                <button
                  onClick={exportWord}
                  className="
                    flex items-center gap-2 
                    px-4 py-2 
                    bg-blue-600 
                    text-white 
                    rounded-lg 
                    hover:bg-blue-700 
                    transition-colors
                    font-medium
                  "
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export Word
                </button>

                <button
                  onClick={() => navigator.clipboard.writeText(path)}
                  className="
                    flex items-center gap-2 
                    px-4 py-2 
                    bg-green-600 
                    text-white 
                    rounded-lg 
                    hover:bg-green-700 
                    transition-colors
                    font-medium
                  "
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy Text
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!path && !loading && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🚀</div>
              <p className="text-lg">Ready to start your learning journey?</p>
              <p className="mt-2">Enter any topic and we'll create a structured learning path for you.</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg
                  className="animate-spin h-8 w-8 text-blue-600"
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
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-700">Creating your learning path...</p>
              <p className="text-gray-500 mt-1">This may take a few moments</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}