// server.js
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { parseInvoiceResponse } from "./helpers/parseResponse.js";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json({ limit: "50mb" }));

// Handler for Claude API
const handleClaudeRequest = async (req) => {
  const response = await axios.post(
    "https://api.anthropic.com/v1/messages",
    {
      model: req.body.model || "claude-3-opus-20240229",
      max_tokens: 1024,
      ...req.body,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
    }
  );
  return response.data;
};

// Handler for OpenAI API
const handleOpenAIRequest = async (req) => {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: req.body.model || "gpt-4",
      ...req.body,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );
  return response.data;
};

// Handler for Gemini API
const handleGeminiRequest = async (req) => {
  console.log("using gemini");
  // Format messages into Gemini's expected structure
  const formattedContent = req.body.messages.map((msg) => ({
    parts: [{ text: msg.content }],
    role: msg.role === "system" ? "user" : msg.role,
  }));

  // const response = await axios.post(
  //   `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
  //   {
  //     contents: [
  //       {
  //         parts: [{ text: "Explain how AI works" }],
  //       },
  //     ],
  //   },
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: formattedContent,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        key: process.env.GOOGLE_API_KEY,
      },
    }
  );

  // Parse Gemini's response to match our expected format
  try {
    const textResponse = response.data.candidates[0].content.parts[0].text;
    // Try to parse the response as JSON if it matches our expected format
    try {
      console.log("textResponse", textResponse);
      const parsedResponse=parseInvoiceResponse(textResponse)
      console.log("textResponse", textResponse);

      return parsedResponse;
    } catch(e) {
      console.log("error", e)
      // If not valid JSON, return in our standard format
      return {
        reply: textResponse,
        invoiceUpdates: {},
      };
    }
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    throw new Error("Failed to parse Gemini response");
  }
};

// Model router function
const routeModelRequest = (modelName) => {
  if (modelName.includes("claude")) {
    return handleClaudeRequest;
  } else if (modelName.includes("gpt")) {
    return handleOpenAIRequest;
  } else if (modelName.includes("gemini")) {
    return handleGeminiRequest;
  }
  throw new Error(`Unsupported model: ${modelName}`);
};

app.post("/api/chat", async (req, res) => {
  try {
    const modelName = req.body.model || "gemini-1.5-flash";
    console.log(`Processing request for model: ${modelName}`);

    const handler = routeModelRequest(modelName);
    const response = await handler(req);
    res.json(response);
  } catch (error) {
    console.error("API Error:", {
      model: req.body.model,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Failed to process request",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
