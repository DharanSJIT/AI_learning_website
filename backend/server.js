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

import geminiRouter from "./routes/gemini.js";
import openaiRouter from "./routes/openai.js";

const execAsync = promisify(exec);

// ------------------------
// PDF Parser Function (using pdftotext if available, fallback to basic extraction)
// ------------------------
async function parsePDF(buffer) {
  try {
    // Write buffer to temporary file
    const tempPath = `uploads/temp_${Date.now()}.pdf`;
    fs.writeFileSync(tempPath, buffer);
    
    let text = '';
    
    try {
      // Try using pdftotext (if available)
      const { stdout } = await execAsync(`pdftotext "${tempPath}" -`);
      text = stdout;
    } catch (error) {
      // Fallback: Basic text extraction (limited but works)
      console.log('pdftotext not available, using basic extraction');
      const pdfContent = buffer.toString('utf8');
      
      // Very basic PDF text extraction - looks for text between stream markers
      const textMatches = pdfContent.match(/stream\s*(.*?)\s*endstream/gs);
      if (textMatches) {
        text = textMatches
          .map(match => {
            // Remove PDF formatting and extract readable text
            return match
              .replace(/stream\s*|\s*endstream/g, '')
              .replace(/[^\x20-\x7E\n\r]/g, ' ') // Keep only printable ASCII + newlines
              .replace(/\s+/g, ' ')
              .trim();
          })
          .join(' ');
      }
      
      // If no text found, try alternative method
      if (!text || text.length < 10) {
        // Look for text objects in PDF
        const textObjects = pdfContent.match(/\(\s*([^)]+)\s*\)/g);
        if (textObjects) {
          text = textObjects
            .map(obj => obj.replace(/[()]/g, ''))
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
        }
      }
    }
    
    // Clean up temp file
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    
    if (!text || text.trim().length < 10) {
      throw new Error('Could not extract meaningful text from PDF');
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

// Multer setup for uploads
const upload = multer({ dest: "uploads/" });

// POST /api/ats/ats-check
atsRouter.post("/ats-check", upload.single("resume"), async (req, res) => {
  try {
    let text = "";

    // 1️⃣ File upload handling
    if (req.file) {
      const filePath = req.file.path;
      const mimeType = req.file.mimetype;

      try {
        if (mimeType === "application/pdf") {
          const dataBuffer = fs.readFileSync(filePath);
          const pdfData = await parsePDF(dataBuffer);
          text = pdfData.text;
        } else if (
          mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          const result = await mammoth.extractRawText({ path: filePath });
          text = result.value;
        } else if (mimeType === "text/plain") {
          text = fs.readFileSync(filePath, "utf-8");
        } else {
          fs.unlinkSync(filePath);
          return res.status(400).json({ error: "Unsupported file type. Please upload PDF, DOCX, or TXT files." });
        }
      } catch (parseError) {
        console.error("File parsing error:", parseError);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        return res.status(400).json({ error: "Failed to parse the uploaded file. Please ensure it's a valid document." });
      }

      // Clean up uploaded file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // 2️⃣ Direct text input from frontend
    if (req.body.resumeText) {
      text += "\n" + req.body.resumeText;
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "No resume content provided" });
    }

    // --- ATS Analysis ---
    const analysis = analyzeResume(text);

    res.json({
      success: true,
      analysis
    });
  } catch (err) {
    console.error("ATS analysis error:", err);
    res.status(500).json({ 
      error: "Failed to analyze resume",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Simple ATS analysis function
function analyzeResume(text) {
  const originalText = text;
  text = text.toLowerCase();

  const keywords = [
    "javascript", "react", "node", "css", "html", "python", "java",
    "typescript", "angular", "vue", "mongodb", "sql", "git", "docker",
    "aws", "azure", "kubernetes", "microservices", "api", "rest"
  ];
  
  let score = 0;
  const strengths = [];
  const weaknesses = [];
  const foundKeywords = [];

  // Keyword scoring
  keywords.forEach((kw) => {
    if (text.includes(kw)) {
      foundKeywords.push(kw);
      strengths.push(`Contains technical keyword: ${kw}`);
    }
  });
  score += foundKeywords.length * 5;

  // Section checks
  const sections = {
    experience: ["experience", "work history", "employment", "professional experience"],
    education: ["education", "academic", "degree", "university", "college"],
    skills: ["skills", "technical skills", "competencies", "technologies"],
    contact: ["email", "@", "phone", "contact", "linkedin"]
  };

  Object.entries(sections).forEach(([section, keywords]) => {
    const hasSection = keywords.some(keyword => text.includes(keyword));
    if (hasSection) {
      strengths.push(`Has ${section.charAt(0).toUpperCase() + section.slice(1)} section`);
      score += 10;
    } else {
      weaknesses.push(`Missing ${section.charAt(0).toUpperCase() + section.slice(1)} section`);
    }
  });

  // Length check
  const wordCount = originalText.split(/\s+/).length;
  if (wordCount >= 200) {
    strengths.push("Good resume length");
    score += 10;
  } else {
    weaknesses.push("Resume might be too short");
  }

  // Basic formatting checks
  if (/[A-Z]/.test(originalText)) {
    strengths.push("Uses proper capitalization");
    score += 5;
  }

  // Normalize score (0-100)
  score = Math.min(score, 100);
  
  // Determine overall rating
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
    recommendations: generateRecommendations(weaknesses, score)
  };
}

function generateRecommendations(weaknesses, score) {
  const recommendations = [];
  
  if (score < 50) {
    recommendations.push("Consider adding more relevant technical keywords");
    recommendations.push("Expand on your work experience with specific achievements");
  }
  
  if (weaknesses.some(w => w.includes("Skills"))) {
    recommendations.push("Add a dedicated Skills section with relevant technologies");
  }
  
  if (weaknesses.some(w => w.includes("Experience"))) {
    recommendations.push("Include detailed work experience with job titles and dates");
  }
  
  if (weaknesses.some(w => w.includes("Education"))) {
    recommendations.push("Add education background or relevant certifications");
  }

  if (recommendations.length === 0) {
    recommendations.push("Your resume looks good! Consider tailoring it for specific job descriptions.");
  }
  
  return recommendations;
}

// ------------------------
// Main Server
// ------------------------
const app = express();
const PORT = process.env.PORT || 4000;

// Configure CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000", // React dev server
      "http://localhost:5173", // Vite dev server
      "http://localhost:5174", // Vite dev server (alternative port)
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// JSON middleware
app.use(express.json({ limit: "10mb" })); // Increased limit for larger resumes

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Routes
app.use("/api/gemini", geminiRouter);
app.use("/api/openai", openaiRouter);
app.use("/api/ats", atsRouter); // ✅ ATS résumé checker

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ 
    error: "Internal server error",
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
  console.log(
    "Gemini API Key loaded:",
    process.env.GEMINI_API_KEY ? "✅ Yes" : "❌ No"
  );
  console.log(
    "OpenAI API Key loaded:",
    process.env.OPENAI_API_KEY ? "✅ Yes" : "❌ No"
  );
  
  // Create uploads directory if it doesn't exist
  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
    console.log('📁 Created uploads directory');
  }
});