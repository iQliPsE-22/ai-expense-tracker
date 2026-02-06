import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.models) {
      console.log("Available Models:");
      data.models.forEach((m: any) => console.log(`- ${m.name}`));
    } else {
      console.log("No models found. Response:", JSON.stringify(data, null, 2));
    }
  } catch (error: any) {
    console.error("Error fetching models:", error.message);
  }
}

listModels();
