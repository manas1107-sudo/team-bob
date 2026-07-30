const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Hello",
      config: {
        systemInstruction: "You are a helpful assistant.",
      }
    });
    console.log(response.text);
  } catch (e) {
    console.error(e);
  }
}
test();
