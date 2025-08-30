import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from "multer";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // ✅ keep file in memory
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Convert uploaded file → plain text
async function fileToText(file) {
  const mimetype = file.mimetype;
  const buffer = file.buffer;

  if (mimetype === "application/pdf") {
    const data = await pdfParse(buffer); // ✅ use buffer, no fs
    return data.text || "";
  }

  if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const { value } = await mammoth.extractRawText({ buffer });
    return value || "";
  }

  // fallback: treat as text
  return buffer.toString("utf8");
}

const SYSTEM_PROMPT = `
You are an ATS (Applicant Tracking System) résumé auditor.
Return JSON only with:
{
  "overallScore": number,
  "keywords": [{"term": string, "status": "covered|partial|missing"}],
  "sectionScores": [{"name": string, "score": number}],
  "redFlags": [string],
  "improvements": [string],
  "bulletRewrites": [string],
  "mdSummary": string
}
`;

router.post("/ats-check", upload.single("resumeFile"), async (req, res) => {
  try {
    const { resumeText = "", jobDescription = "" } = req.body;
    let resume = resumeText;

    if (req.file) {
      resume = await fileToText(req.file);
    }

    if (!resume?.trim() || !jobDescription?.trim()) {
      return res.status(400).json({
        error: "Provide resume text/file AND job description",
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
${SYSTEM_PROMPT}

--- JOB DESCRIPTION ---
${jobDescription}

--- RESUME ---
${resume}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Try to extract JSON from the AI response
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    const jsonStr = text.slice(first, last + 1);

    let payload;
    try {
      payload = JSON.parse(jsonStr);
    } catch (e) {
      console.error("❌ Failed to parse AI response:", text);
      return res.status(500).json({
        error: "AI response was not valid JSON",
        raw: text,
      });
    }

    res.json(payload);
  } catch (err) {
    console.error("ATS check error:", err);
    res.status(500).json({
      error: err.message || "Failed to analyze résumé",
    });
  }
});

export default router;
