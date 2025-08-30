import express from "express";
import OpenAI from "openai";

const router = express.Router();

router.post("/summarize", async (req, res) => {
  console.log("📝 OpenAI summarize request received");
  
  // Check for API key
  const openaiKey = process.env.OPENAI_API_KEY;
  console.log("🔑 OpenAI Key present:", openaiKey ? "✅ Yes" : "❌ No");
  console.log("🔑 Key length:", openaiKey?.length);
  console.log("🔑 Key starts with sk-:", openaiKey?.startsWith('sk-'));
  
  if (!openaiKey) {
    console.error("❌ No OpenAI API key found");
    return res.status(500).json({ error: "OPENAI_API_KEY is missing in environment variables" });
  }

  const { text } = req.body;
  console.log("📄 Text received:", text ? "✅ Yes" : "❌ No");
  console.log("📄 Text length:", text?.length);
  
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    console.log("🚀 Making request to OpenAI...");
    
    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey: openaiKey });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes text concisely and clearly." },
        { role: "user", content: `Please summarize the following text:\n\n${text}` },
      ],
      max_tokens: 200,
      temperature: 0.3,
    });

    console.log("✅ OpenAI response received");
    const summary = completion.choices[0].message.content.trim();
    console.log("📋 Summary length:", summary.length);
    
    res.json({ summary });
  } catch (err) {
    console.error("❌ OpenAI API Error Details:");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error code:", err.code);
    console.error("Status:", err.status);
    console.error("Response status:", err.response?.status);
    console.error("Response data:", err.response?.data);
    
    // Handle specific OpenAI errors
    if (err.status === 401) {
      return res.status(401).json({ 
        error: "Invalid OpenAI API key",
        details: "Please check your API key"
      });
    }
    
    if (err.status === 403) {
      return res.status(403).json({ 
        error: "OpenAI API access forbidden",
        details: "Check your API key permissions and account status"
      });
    }
    
    if (err.status === 429) {
      return res.status(429).json({ 
        error: "OpenAI rate limit exceeded",
        details: "Please wait before making another request"
      });
    }

    if (err.status === 402) {
      return res.status(402).json({ 
        error: "Insufficient credits",
        details: "Please add credits to your OpenAI account"
      });
    }
    
    res.status(500).json({ 
      error: "Failed to summarize text with OpenAI",
      details: err.message
    });
  }
});

export default router;