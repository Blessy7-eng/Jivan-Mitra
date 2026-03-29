import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the API with your Key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Select the model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      // This acts like the system_instruction in the Python Client
      systemInstruction: "You are Jivan-Mitra, a medical assistant. Be concise and empathetic."
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini Route Error:", error);
    return NextResponse.json({ error: "Failed to fetch response" }, { status: 500 });
  }
}