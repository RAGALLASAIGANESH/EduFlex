const client = require("../config/groq");

exports.generateQuiz = async (req, res) => {
    try {
        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({ message: "Topic is required" });
        }

        const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are an expert quiz creator. Generate well-crafted multiple choice questions that test genuine understanding, not just memorization. Questions should be clear, accurate, and educational."
                },
                {
                    role: "user",
                    content: `Generate a quiz for the topic "${topic}".

Return a JSON object with this structure:
{
  "quiz": [
    {
      "question": "A clear, well-crafted question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    }
  ]
}

Requirements:
- Exactly 5 questions
- Each question has exactly 4 options
- "correct" is the 0-based index of the correct answer (0-3)
- Questions should test understanding, not just recall
- All options should be plausible
- Questions should cover different aspects of the topic`
                }
            ],
            temperature: 0.7,
            max_tokens: 2000,
            response_format: { type: "json_object" }
        });

        const text = response.choices[0].message.content;
        const parsed = JSON.parse(text);

        // Handle both {quiz: [...]} and [...] formats
        const quiz = parsed.quiz || parsed;
        res.json(Array.isArray(quiz) ? quiz : []);

    } catch (error) {
        console.error("Quiz Generation Error:", error.message);
        res.status(500).json({ message: "Failed to generate quiz" });
    }
};
