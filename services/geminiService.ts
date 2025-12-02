import { GoogleGenAI } from "@google/genai";

// NOTE: In a real app, never expose API keys on the client. 
// This is for demonstration purposes within the sandboxed environment requirements.
// The system prompt injects process.env.API_KEY automatically.

export const generateBlogContent = async (topic: string, tone: string = 'professional'): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Write a comprehensive, engaging, and SEO-optimized blog post about "${topic}".
    Tone: ${tone}.
    Format: Markdown.
    Structure:
    - Catchy Title (do not label it "Title")
    - Engaging Introduction
    - 3-4 Clear Main Headings (H2)
    - Bullet points where appropriate
    - Strong Conclusion
    
    Do not include any preamble like "Here is the blog post". Just start writing.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content. Please check your API key.");
  }
};