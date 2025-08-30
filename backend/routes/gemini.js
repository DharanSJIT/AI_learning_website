// import express from 'express';
// import dotenv from 'dotenv';


// dotenv.config();
// const router = express.Router();


// // Using the Google Gen AI SDK
// import { GoogleGenAI } from '@google/genai';


// const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


// // A simple endpoint to generate recommendations / chat responses.
// router.post('/generate', async (req, res) => {
// try {
// const { prompt, mode = 'chat' } = req.body;


// if (!prompt) return res.status(400).json({ error: 'Missing prompt' });


// // Example: a lightweight chat/completion call — adapt model and params as needed
// const response = await client.responses.create({
// model: 'gpt-4o-mini', // replace with the Gemini model name you want (e.g. gemini-2.5) or keep as-is
// input: prompt,
// temperature: 0.2,
// maxOutputTokens: 600
// });


// // `response` shape depends on SDK version; return safe subset
// return res.json({ raw: response, text: response.output?.[0]?.content?.[0]?.text ?? JSON.stringify(response) });
// } catch (err) {
// console.error('Gemini error:', err?.message || err);
// return res.status(500).json({ error: 'Gemini request failed', details: String(err) });
// }
// });


// export default router;

// 




import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Existing generate endpoint - keep as is
router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    // ✅ Extract only the text
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated.";

    // ✅ Send cleaned JSON to frontend
    res.json({ text });
  } catch (error) {
    console.error("Gemini request failed:", error);
    res.status(500).json({ error: "Gemini request failed" });
  }
});

// New summarize endpoint for the Summarization component
router.post("/summarize", async (req, res) => {
  console.log("📝 Gemini summarize request received");
  
  // Check for API key
  const geminiKey = process.env.GEMINI_API_KEY;
  console.log("🔑 Gemini Key present:", geminiKey ? "✅ Yes" : "❌ No");
  
  if (!geminiKey) {
    console.error("❌ No Gemini API key found");
    return res.status(500).json({ error: "GEMINI_API_KEY is missing in environment variables" });
  }

  const { text } = req.body;
  console.log("📄 Text received:", text ? "✅ Yes" : "❌ No");
  console.log("📄 Text length:", text?.length);
  
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    console.log("🚀 Making request to Gemini...");
    
    // Create summarization prompt
    const prompt = `Please provide a concise and clear summary of the following text. Focus on the main points and key information:\n\n${text}`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    console.log("✅ Gemini response received");

    // Extract the summary text
    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary generated.";
    console.log("📋 Summary length:", summary.length);
    
    res.json({ summary });
  } catch (err) {
    console.error("❌ Gemini API Error Details:");
    console.error("Error Message:", err.message);
    console.error("Error:", err);
    
    res.status(500).json({ 
      error: "Failed to summarize text with Gemini",
      details: err.message
    });
  }
});

export default router;