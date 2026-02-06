import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function testModel() {
  try {
    console.log("Testing gemini-pro...");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Hello");
    console.log("SUCCESS: gemini-pro works!");
  } catch (error: any) {
    console.error("FAIL: gemini-pro error:", error.message.substring(0, 200));
  }
}

testModel();
