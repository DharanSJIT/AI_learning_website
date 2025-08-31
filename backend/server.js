// MUST import dotenv first
import dotenv from "dotenv";
dotenv.config(); // <-- loads environment variables immediately

import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import mammoth from "mammoth";
import { exec } from "child_process";
import { promisify } from "util";
import fetch from "node-fetch";

import geminiRouter from "./routes/gemini.js";
import openaiRouter from "./routes/openai.js";

const execAsync = promisify(exec);

// ------------------------
// PDF Parser Function
// ------------------------
async function parsePDF(buffer) {
  try {
    const tempPath = `uploads/temp_${Date.now()}.pdf`;
    fs.writeFileSync(tempPath, buffer);

    let text = "";
    try {
      const { stdout } = await execAsync(`pdftotext "${tempPath}" -`);
      text = stdout;
    } catch {
      const pdfContent = buffer.toString("utf8");
      const textMatches = pdfContent.match(/stream\s*(.*?)\s*endstream/gs);
      if (textMatches) {
        text = textMatches
          .map((match) =>
            match
              .replace(/stream\s*|\s*endstream/g, "")
              .replace(/[^\x20-\x7E\n\r]/g, " ")
              .replace(/\s+/g, " ")
              .trim()
          )
          .join(" ");
      }
      if (!text || text.length < 10) {
        const textObjects = pdfContent.match(/\(\s*([^)]+)\s*\)/g);
        if (textObjects) {
          text = textObjects
            .map((obj) => obj.replace(/[()]/g, ""))
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
        }
      }
    }

    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    if (!text || text.trim().length < 10) {
      throw new Error("Could not extract meaningful text from PDF");
    }

    return { text: text.trim() };
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
}

// ------------------------
// ATS Router Inline
// ------------------------
const atsRouter = express.Router();
const upload = multer({ dest: "uploads/" });

atsRouter.post("/ats-check", upload.single("resume"), async (req, res) => {
  try {
    let text = "";
    if (req.file) {
      const filePath = req.file.path;
      const mimeType = req.file.mimetype;
      try {
        if (mimeType === "application/pdf") {
          const dataBuffer = fs.readFileSync(filePath);
          const pdfData = await parsePDF(dataBuffer);
          text = pdfData.text;
        } else if (
          mimeType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          const result = await mammoth.extractRawText({ path: filePath });
          text = result.value;
        } else if (mimeType === "text/plain") {
          text = fs.readFileSync(filePath, "utf-8");
        } else {
          fs.unlinkSync(filePath);
          return res.status(400).json({
            error:
              "Unsupported file type. Please upload PDF, DOCX, or TXT files.",
          });
        }
      } catch (parseError) {
        console.error("File parsing error:", parseError);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return res.status(400).json({
          error:
            "Failed to parse the uploaded file. Please ensure it's a valid document.",
        });
      }
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    if (req.body.resumeText) text += "\n" + req.body.resumeText;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "No resume content provided" });
    }

    const analysis = analyzeResume(text);
    res.json({ success: true, analysis });
  } catch (err) {
    console.error("ATS analysis error:", err);
    res.status(500).json({
      error: "Failed to analyze resume",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

function analyzeResume(text) {
  const originalText = text;
  text = text.toLowerCase();

  const keywords = [
    "javascript","react","node","css","html","python","java","typescript",
    "angular","vue","mongodb","sql","git","docker","aws","azure","kubernetes",
    "microservices","api","rest",
  ];

  let score = 0;
  const strengths = [];
  const weaknesses = [];
  const foundKeywords = [];

  keywords.forEach((kw) => {
    if (text.includes(kw)) {
      foundKeywords.push(kw);
      strengths.push(`Contains technical keyword: ${kw}`);
    }
  });
  score += foundKeywords.length * 5;

  const sections = {
    experience: ["experience","work history","employment","professional experience"],
    education: ["education","academic","degree","university","college"],
    skills: ["skills","technical skills","competencies","technologies"],
    contact: ["email","@","phone","contact","linkedin"],
  };

  Object.entries(sections).forEach(([section, keywords]) => {
    const hasSection = keywords.some((keyword) => text.includes(keyword));
    if (hasSection) {
      strengths.push(`Has ${section} section`);
      score += 10;
    } else {
      weaknesses.push(`Missing ${section} section`);
    }
  });

  const wordCount = originalText.split(/\s+/).length;
  if (wordCount >= 200) {
    strengths.push("Good resume length");
    score += 10;
  } else {
    weaknesses.push("Resume might be too short");
  }

  if (/[A-Z]/.test(originalText)) {
    strengths.push("Uses proper capitalization");
    score += 5;
  }

  score = Math.min(score, 100);
  let rating = "Poor";
  if (score >= 80) rating = "Excellent";
  else if (score >= 60) rating = "Good";
  else if (score >= 40) rating = "Fair";

  return {
    score,
    rating,
    strengths,
    weaknesses,
    foundKeywords,
    wordCount,
    recommendations: generateRecommendations(weaknesses, score),
  };
}

function generateRecommendations(weaknesses, score) {
  const recommendations = [];
  if (score < 50) {
    recommendations.push("Consider adding more relevant technical keywords");
    recommendations.push("Expand on your work experience with specific achievements");
  }
  if (weaknesses.some((w) => w.includes("Skills"))) {
    recommendations.push("Add a dedicated Skills section with relevant technologies");
  }
  if (weaknesses.some((w) => w.includes("Experience"))) {
    recommendations.push("Include detailed work experience with job titles and dates");
  }
  if (weaknesses.some((w) => w.includes("Education"))) {
    recommendations.push("Add education background or relevant certifications");
  }
  if (recommendations.length === 0) {
    recommendations.push(
      "Your resume looks good! Consider tailoring it for specific job descriptions."
    );
  }
  return recommendations;
}

// ------------------------
// API Key Checker Functions
// ------------------------
async function checkGeminiKey() {
  if (!process.env.GEMINI_API_KEY) return "❌ Not set";
  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1/models?key=" +
        process.env.GEMINI_API_KEY
    );
    if (res.ok) return "✅ Active";
    return "❌ Invalid (" + res.status + ")";
  } catch (err) {
    return "❌ Error: " + err.message;
  }
}

async function checkOpenAIKey() {
  if (!process.env.OPENAI_API_KEY) return "❌ Not set";
  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    });
    if (res.ok) return "✅ Active";
    return "❌ Invalid (" + res.status + ")";
  } catch (err) {
    return "❌ Error: " + err.message;
  }
}

// ------------------------
// Main Server
// ------------------------
const app = express();
const PORT = process.env.PORT || 4000;

// ---------- CORS Setup ----------
app.use(
  cors({
    origin: "https://ai-powered-learning-webs.vercel.app", // allow your frontend
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

// ---------- Health Check ----------
app.get("/health", async (req, res) => {
  const geminiStatus = await checkGeminiKey();
  const openaiStatus = await checkOpenAIKey();
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    geminiKey: geminiStatus,
    openaiKey: openaiStatus,
  });
});

// ---------- Routes ----------
app.use("/api/gemini", geminiRouter);
app.use("/api/openai", openaiRouter);
app.use("/api/ats", atsRouter);

// ---------- Error Handling ----------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ---------- Graceful Shutdown ----------
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server gracefully...");
  process.exit(0);
});
process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down server gracefully...");
  process.exit(0);
});

// ---------- Start Server ----------
app.listen(PORT, async () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`🏥 Health check at http://localhost:${PORT}/health`);

  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
    console.log("📁 Created uploads directory");
  }

  console.log("🔑 Checking API keys...");
  console.log("Gemini API Key:", await checkGeminiKey());
  console.log("OpenAI API Key:", await checkOpenAIKey());
});
