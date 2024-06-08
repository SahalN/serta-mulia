/** @format */

const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
// Specify the path to the .env file
const envPath = path.resolve(__dirname, "../../.env");

// Load environment variables from the specified file
dotenv.config({ path: envPath });

console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("API key is not defined in the environment variables");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function processResultText(text) {
  const lines = text.split("\n");
  let explanation = "";
  let suggestion = "";
  for (let line of lines) {
    if (line.includes("explanation")) {
      explanation = line.split('"explanation": ')[1].replace(/"/g, "");
    }
    if (line.includes("suggestion")) {
      suggestion = line.split('"suggestion": ')[1].replace(/"/g, "");
    }
  }
  return { explanation, suggestion };
}
const parts = [
  {
    text: "Buatlah penjelasan dari penyakit dari kolom predict dan tampilkan hasilnya di \nkolom result dengan explanation dan suggestion yang \ndibutuhkan dengan menggunakan bahasa indonesia dalam bentuk JSON object.",
  },
  { text: "predict: Melanocytic nevus" },
  {
    text: 'result: "explanation": "Melanocytic nevus adalah kondisi di mana permukaan kulit memiliki bercak warna yang berasal dari sel-sel melanosit, yakni pembentukan warna kulit dan rambut.""suggestion": "Segera konsultasi dengan dokter terdekat jika ukuran semakin membesar dengan cepat, mudah luka atau berdarah.",',
  },
  { text: `predict: ` },
];
async function generateContentWithLabel(label) {
  parts.push({ text: `predict: ${label}` });
  parts.push({ text: "result: " });

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
  });
  console.log(result.response.text());
  const resultText = result.response.text();
  const { explanation, suggestion } = await processResultText(resultText);

  return { explanation, suggestion };
}

module.exports = generateContentWithLabel;
