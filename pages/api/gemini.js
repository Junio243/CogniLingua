// pages/api/gemini.js
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // pega do ambiente
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      // contents pode ser string simples ou array com estrutura:
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      // Você pode ajustar parâmetros extras aqui se quiser:
      // maxOutputTokens: 512,
    });

    // Extrai texto (a SDK expõe response.text em exemplos)
    const text = response?.text
      ?? response?.candidates?.[0]?.content?.parts?.[0]?.text
      ?? JSON.stringify(response);

    return res.status(200).json({ text });
  } catch (err) {
    console.error("Gemini error:", err);
    return res.status(500).json({ error: err?.message ?? String(err) });
  }
}
