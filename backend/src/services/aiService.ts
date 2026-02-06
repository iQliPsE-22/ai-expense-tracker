import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface ParsedExpense {
  amount: number;
  currency: string;
  category: string;
  description: string;
  merchant: string | null;
}

export const parseExpense = async (input: string): Promise<ParsedExpense> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
    const prompt = `
      You are an expense parser. Extract expense information from natural language input.

      RULES:
      1. Extract the amount as a number (no currency symbols)
      2. Default currency is INR unless explicitly mentioned (USD, EUR, etc.)
      3. Categorize into EXACTLY one of these categories:
         - Food & Dining (restaurants, cafes, food delivery, groceries)
         - Transport (uber, ola, taxi, fuel, parking, metro)
         - Shopping (clothes, electronics, amazon, flipkart)
         - Entertainment (movies, netflix, spotify, games)
         - Bills & Utilities (electricity, water, internet, phone)
         - Health (medicine, doctor, gym, pharmacy)
         - Travel (flights, hotels, trips)
         - Other (anything that doesn't fit above)
      4. Description should be a clean summary (not the raw input)
      5. Merchant is the company/store name if mentioned, null otherwise

      RESPOND ONLY WITH VALID JSON, no other text:
      {
        "amount": <number>,
        "currency": "<string>",
        "category": "<string>",
        "description": "<string>",
        "merchant": "<string or null>"
      }

      If the input is invalid or you cannot extract an amount, respond:
      {
        "error": "Could not parse expense. Please include an amount.",
        "amount": null
      }
      
      Input: "${input}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown code blocks if present
    const jsonStr = text.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(jsonStr);

    // Validation
    if (parsed.error) {
      throw new Error(parsed.error);
    }

    if (!parsed.amount) {
      throw new Error("Could not extract amount. Try saying 'Lunch 200'");
    }

    return {
      amount: parsed.amount,
      currency: parsed.currency || "INR",
      category: parsed.category || "Other",
      description: parsed.description || input,
      merchant: parsed.merchant || null,
    };
  } catch (error: any) {
    console.error("AI Parsing Error:", error);
    throw new Error(error.message || "Failed to parse expense");
  }
};
