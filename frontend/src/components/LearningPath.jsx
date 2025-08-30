import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

export default function LearningPath() {
  const [course, setCourse] = useState("");
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(false);

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
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(path, 180);
    doc.text(lines, 10, 20);
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
    <div className="max-w-4xl mx-auto p-6 mt-10">
      {/* Back Link */}
      <Link
        to="/home"
        className="inline-flex items-center text-blue-600 hover:underline mb-6 font-medium"
      >
        ← Back to Dashboard
      </Link>

      {/* Card Container */}
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
          <span className="text-2xl">📚</span> Personalized Learning Path
        </h2>

        {/* Input & Generate Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="Enter a course (e.g. Python, Data Science)"
              className="
                w-full 
                rounded-xl 
                border 
                border-gray-300 
                px-5 
                py-3 
                text-gray-900 
                placeholder-gray-400 
                focus:outline-none 
                focus:ring-2 
                focus:ring-blue-500 
                focus:border-transparent
                transition
              "
            />
            <svg
              className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16h6"
              ></path>
            </svg>
          </div>

          <button
            onClick={generatePath}
            disabled={loading}
            className={`
              flex items-center justify-center
              rounded-xl
              bg-blue-600 
              px-6 
              py-3 
              text-white 
              font-semibold 
              shadow-md
              hover:bg-blue-700
              disabled:opacity-50
              disabled:cursor-not-allowed
              transition
            `}
          >
            {loading && (
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* Result / Output */}
        <div>
          {path && (
            <div
              className="
                bg-gray-50 
                border 
                border-gray-200 
                rounded-xl 
                p-6 
                text-gray-700 
                whitespace-pre-wrap 
                leading-relaxed
                select-text
                shadow-inner
              "
            >
              {path}

              {/* Export Buttons */}
              <div className="mt-6 flex flex-wrap gap-4 justify-center sm:justify-start">
                <button
                  onClick={exportPDF}
                  className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition"
                  title="Export as PDF"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 20h9M12 4h9M12 12h9M3 6h.01M3 18h.01M3 12h.01"
                    />
                  </svg>
                  Export PDF
                </button>
                <button
                  onClick={exportWord}
                  className="flex items-center gap-2 px-5 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl shadow-md transition"
                  title="Export as Word Document"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v16h16M8 4v16M8 12h8"
                    />
                  </svg>
                  Export Word
                </button>
              </div>
            </div>
          )}
          {!path && !loading && (
            <p className="text-center text-gray-400 mt-4">
              Your generated learning path will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
