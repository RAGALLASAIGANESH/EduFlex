require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
    console.log("API Key present:", !!process.env.GEMINIAI_API_KEY);
    console.log("API Key length:", process.env.GEMINIAI_API_KEY ? process.env.GEMINIAI_API_KEY.length : 0);

    const genAI = new GoogleGenerativeAI(process.env.GEMINIAI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
        const result = await model.generateContent("Hello");
        console.log("Result:", result.response.text());
    } catch (error) {
        console.error("Error:", error);
    }
}

run();
