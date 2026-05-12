import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  try {
    const models = await genAI.getGenerativeModel({ model: "gemini-pro" });
    // There is no direct listModels in the standard SDK, but we can try a simple call
    console.log("Testing gemini-pro...");
    const result = await models.generateContent("Hi");
    console.log("Success:", result.response.text());
  } catch (e: any) {
    console.error("Error:", e.message);
    if (e.response) {
       console.error("Response data:", e.response);
    }
  }
}

listModels();
