import React, { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSend = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      setResponse(data.output || JSON.stringify(data));
    } catch (err) {
      console.error("Error:", err);
      setResponse("❌ Error while fetching response.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Chat</h1>
      <input
        style={{ width: "300px", padding: "8px" }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSend} style={{ marginLeft: "10px", padding: "8px 16px" }}>
        Send
      </button>
      <p><strong>Response:</strong> {response}</p>
    </div>
  );
}
