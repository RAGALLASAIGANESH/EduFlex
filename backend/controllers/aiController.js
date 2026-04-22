const groqClient = require("../config/groq");
const Progress = require("../models/Progress");

// Helper function to call AI (Groq)
async function askAI(systemPrompt, userPrompt, jsonMode = true) {
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ];

  const options = {
    model: "llama-3.3-70b-versatile",
    messages,
    temperature: 0.7,
    max_tokens: 4000,
  };

  if (jsonMode) {
    options.response_format = { type: "json_object" };
  }

  const response = await groqClient.chat.completions.create(options);
  return response.choices[0].message.content;
}

// Helper to safely parse JSON from response
function safeParseJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    // Try to extract JSON from the text
    const jsonMatch = text.match(/[\[{][\s\S]*[\]}]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Failed to parse JSON from AI response");
  }
}

/* ---------- GENERATE LEARNING CONTENT ---------- */
exports.generateContent = async (req, res) => {
  try {
    const { topic, learningStyle } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const style = learningStyle || "visual";

    const systemPrompt = `You are EduFlex AI, an expert educational content creator. You create comprehensive, accurate, and engaging learning materials. Your content must be factually correct, well-structured, and adapted to the student's learning style. Always provide real, substantive educational content — never placeholder text. YOU MUST RETURN A VALID JSON OBJECT ONLY.`;

    const userPrompt = `Create a comprehensive learning guide for the topic: "${topic}"
Learning Style: ${style}

Adapt the content based on the learning style:
- visual: Include detailed diagrams descriptions, use Graphviz DOT language for flowcharts, emphasize visual representations
- auditory: Write in a conversational, lecture-like tone that flows well when read aloud
- reading: Provide detailed notes with definitions, key terms, and references
- kinesthetic: Include hands-on exercises, practical examples, and step-by-step activities

Return a JSON object with this exact structure:
{
  "content": "A highly-detailed markdown lesson formatted with strong hierarchy. DO NOT write paragraphs of text. Every single concept MUST have a dedicated heading or subheading (##, ###, ####), followed by bullet points, numbered lists, and bold text for easy reading. Break everything down chronologically or logically into clean, scannable chunks. Include: an introduction, detailed key concepts, step-by-step mechanisms, practical real-world examples, and a summary.",
  "visuals": {
    "graphviz": "A valid Graphviz (DOT) language declarative diagram. Use 'digraph G { ... }' syntax. Do NOT use PlantUML, Mermaid, D2, or markdown codeblocks. Return strictly ONLY the raw Graphviz code string formatted correctly. Do NOT include ANY comments like // or /*. Do NOT use any HTML-like labels like <br> or <TABLE> or any < or > angle brackets other than standard arrow -> syntax. Start EXACTLY with digraph G {. Example: digraph G { A -> B [label=\"hello\"]; B -> C [label=\"world\"]; }",
    "imageSearchQuery": "A specific image search query to find a relevant educational diagram"
  },
  "videoSearchQuery": "A specific YouTube search query to find the best educational video on this topic",
  "practicalTasks": ["Task 1: A specific, actionable hands-on exercise", "Task 2: Another practical activity", "Task 3: A challenge that tests understanding"],
  "quiz": [
    {"question": "A thoughtful question testing understanding (not just recall)", "options": ["Correct answer", "Plausible wrong answer 1", "Plausible wrong answer 2", "Plausible wrong answer 3"], "correct": 0},
    {"question": "Another well-crafted question", "options": ["Wrong 1", "Correct answer", "Wrong 2", "Wrong 3"], "correct": 1},
    {"question": "Question 3", "options": ["A", "B", "C", "D"], "correct": 2},
    {"question": "Question 4", "options": ["A", "B", "C", "D"], "correct": 0},
    {"question": "Question 5", "options": ["A", "B", "C", "D"], "correct": 1}
  ]
}

IMPORTANT: 
- The quiz must have exactly 5 questions with 4 options each
- The "correct" field is the 0-based index of the correct option
- The diagram must use valid Graphviz DOT syntax and MUST NOT contain any // comments or HTML < > brackets.
- All content must be structured with headers and bullet points
- Do not write massive paragraphs`;

    const responseText = await askAI(systemPrompt, userPrompt, true);
    let responseData = safeParseJSON(responseText);

    // Clean up Graphviz syntax just to be safe
    if (responseData.visuals && responseData.visuals.graphviz) {
      responseData.visuals.graphviz = responseData.visuals.graphviz
        .replace(/```dot\n?/g, "")
        .replace(/```graphviz\n?/g, "")
        .replace(/```\n?/g, "")
        .replace(/\/\*[\s\S]*?\*\//g, "") // remove block comments
        .replace(/^\s*\/\/.*$/gm, "") // remove single-line comments
        .trim();
    }

    // Save progress
    try {
      if (req.userId) {
        await Progress.create({ userId: req.userId, topic, learningStyle });
        console.log(`Progress saved for user ${req.userId} on topic ${topic}`);
      }
    } catch (saveError) {
      console.error("Failed to save progress:", saveError.message);
    }

    res.json(responseData);

  } catch (error) {
    console.error("AI Generation Error:", error.message);

    // Fallback with dynamic mock
    const mockData = generateFallbackContent(req.body.topic, req.body.learningStyle);
    mockData.content += `\n\n> **⚠️ AI temporarily unavailable:** ${error.message}`;

    try {
      if (req.userId) {
        await Progress.create({ userId: req.userId, topic: req.body.topic, learningStyle: req.body.learningStyle });
      }
    } catch (e) {
      console.error("Failed to save progress:", e.message);
    }

    res.json(mockData);
  }
};

/* ---------- AI CHAT TUTOR ---------- */
exports.chatWithTutor = async (req, res) => {
  const { message, topic } = req.body;
  try {
    const systemPrompt = `You are an expert tutor specializing in "${topic}". You give clear, accurate, and concise answers. Keep responses under 3 sentences but make them informative and helpful. Use examples when possible.`;

    const responseText = await askAI(systemPrompt, message, false);
    res.json({ reply: responseText });
  } catch (error) {
    console.error("Chat Error:", error.message);
    res.json({
      reply: `I'm having trouble connecting right now. Regarding "${topic}": try breaking down the concept into smaller parts and focus on understanding the fundamentals first. I'll be back online shortly!`
    });
  }
};

/* ---------- FLASHCARDS GENERATOR ---------- */
exports.generateFlashcards = async (req, res) => {
  const { topic } = req.body;
  try {
    const systemPrompt = `You are an expert educator creating study flashcards. Create flashcards that test understanding, not just memorization. Each card should cover a distinct concept.`;

    const userPrompt = `Create exactly 5 high-quality study flashcards for "${topic}". 

Return a JSON object with this structure:
{
  "cards": [
    {"front": "A clear, concise question or concept name", "back": "A thorough but concise explanation or answer"},
    {"front": "...", "back": "..."},
    {"front": "...", "back": "..."},
    {"front": "...", "back": "..."},
    {"front": "...", "back": "..."}
  ]
}

Make each flashcard educational and accurate. Cover the most important aspects of the topic.`;

    const responseText = await askAI(systemPrompt, userPrompt, true);
    const parsed = safeParseJSON(responseText);

    // Handle both {cards: [...]} and [...] formats
    const cards = parsed.cards || parsed;
    res.json(Array.isArray(cards) ? cards : []);
  } catch (error) {
    console.error("Flashcards Error:", error.message);
    res.json([
      { front: `What is ${topic}?`, back: `${topic} is a key concept in its field. Explore the main learning guide for details.` },
      { front: `Why is ${topic} important?`, back: "It provides foundational knowledge essential for advanced concepts." },
      { front: `Key principle of ${topic}`, back: "Understanding the core mechanism and how it applies in practice." },
      { front: `Common mistake in ${topic}`, back: "Confusing related but distinct concepts. Pay attention to the differences." },
      { front: `How to master ${topic}`, back: "Practice regularly, build projects, and test your understanding with quizzes." }
    ]);
  }
};

/* ---------- SKILL ROADMAP GENERATOR ---------- */
exports.generateRoadmap = async (req, res) => {
  const { skill } = req.body;
  try {
    const systemPrompt = `You are a career coach and learning path expert. Create detailed, practical learning roadmaps that guide learners from beginner to proficient. Each step should build on the previous one logically.`;

    const userPrompt = `Create a detailed 8-step learning roadmap for becoming proficient in "${skill}".

Return a JSON object with this structure:
{
  "roadmap": [
    {
      "step": 1,
      "topic": "Clear topic title",
      "description": "2-3 sentence description of what to learn and why it matters",
      "subtopics": ["Specific subtopic 1", "Specific subtopic 2", "Specific subtopic 3", "Specific subtopic 4"]
    }
  ]
}

Make it practical and actionable. Each step should logically build on the previous ones. Include 3-5 specific subtopics per step.`;

    const responseText = await askAI(systemPrompt, userPrompt, true);
    const parsed = safeParseJSON(responseText);

    const roadmap = parsed.roadmap || parsed;
    res.json(Array.isArray(roadmap) ? roadmap : []);
  } catch (error) {
    console.error("Roadmap Error:", error.message);
    res.json([
      { step: 1, topic: `${skill} Fundamentals`, description: `Master the basics of ${skill}.`, subtopics: ["Core Concepts", "Syntax/Rules", "Basic Tools"] },
      { step: 2, topic: `${skill} Ecosystem`, description: `Learn the software and libraries used in ${skill}.`, subtopics: ["Popular Libraries", "Frameworks", "Environment Setup"] },
      { step: 3, topic: "Intermediate Concepts", description: "Build on the fundamentals with practical skills.", subtopics: ["Design Patterns", "Best Practices", "Debugging"] },
      { step: 4, topic: "Advanced Topics", description: "Deep dive into complex areas.", subtopics: ["Performance", "Security", "Scalability"] },
      { step: 5, topic: "Real World Projects", description: "Apply your skills in practical projects.", subtopics: ["Project 1", "Project 2", "Deployment"] }
    ]);
  }
};

/* ---------- AI INTERVIEW COACH ---------- */
exports.generateInterviewQuestion = async (req, res) => {
  const { role, level } = req.body;
  try {
    const seed = Math.floor(Math.random() * 100000);
    const systemPrompt = `You are an experienced technical interviewer. Generate realistic, challenging interview questions appropriate for the candidate's level. Questions should test real understanding, not just textbook knowledge.`;

    const userPrompt = `Generate a unique interview question for a ${level || "Mid-level"} ${role} position.
Random seed for variety: ${seed}

Return a JSON object:
{
  "question": "A realistic, specific interview question",
  "hint": "A brief, helpful hint (1 sentence) to guide the candidate"
}

Make the question practical and relevant to real-world ${role} work. Avoid generic questions.`;

    const responseText = await askAI(systemPrompt, userPrompt, true);
    const parsed = safeParseJSON(responseText);
    res.json(parsed);
  } catch (error) {
    console.error("Interview Question Error:", error.message);
    const mockQuestions = [
      { question: `Explain a challenging technical problem you solved as a ${role}.`, hint: "Focus on your problem-solving process and the impact." },
      { question: `How would you design a scalable system for a ${role} position?`, hint: "Think about architecture, trade-offs, and real-world constraints." },
      { question: `What's your approach to code review and maintaining quality?`, hint: "Consider both technical and collaborative aspects." }
    ];
    res.json(mockQuestions[Math.floor(Math.random() * mockQuestions.length)]);
  }
};

exports.evaluateInterviewAnswer = async (req, res) => {
  const { question, answer, role } = req.body;
  try {
    const systemPrompt = `You are an expert technical interviewer for ${role} positions. Evaluate answers fairly but rigorously. Provide constructive, specific feedback that helps the candidate improve.`;

    const userPrompt = `Evaluate this interview answer:

Question: "${question}"
Candidate's Answer: "${answer}"

Return a JSON object:
{
  "score": 7,
  "feedback": "Specific, constructive feedback about what was good and what could be improved (2-3 sentences)",
  "improvedAnswer": "A model answer that demonstrates what a strong response would look like (3-4 sentences)"
}

Score from 1-10 where:
- 1-3: Poor (missing key concepts, factually wrong)
- 4-6: Average (correct but lacks depth or specificity)
- 7-8: Good (solid understanding with examples)
- 9-10: Excellent (expert-level with insights)`;

    const responseText = await askAI(systemPrompt, userPrompt, true);
    const parsed = safeParseJSON(responseText);
    res.json(parsed);
  } catch (error) {
    console.error("Evaluation Error:", error.message);
    res.json({
      score: 5,
      feedback: "Good attempt! Try to be more specific and include real-world examples to strengthen your answer.",
      improvedAnswer: "A strong answer would include specific examples from your experience, mention relevant tools or methodologies, and demonstrate depth of understanding."
    });
  }
};

/* ---------- FALLBACK CONTENT GENERATOR ---------- */
function generateFallbackContent(topic, style) {
  const safeTopic = topic || "Learning";
  const safeStyle = style || "General";

  return {
    content: `# ${safeTopic} (${safeStyle} Guide)\n\n**Note: AI Service is temporarily unavailable. Here is structured offline content.**\n\n### 1. Introduction to ${safeTopic}\n${safeTopic} is a pivotal concept in its field. Understanding it requires a grasp of both theoretical foundations and practical applications.\n\n### 2. Core Concepts\n- **Fundamentals**: The building blocks of ${safeTopic}\n- **Applications**: How ${safeTopic} is used in practice\n- **Best Practices**: Industry-standard approaches\n\n### 3. Learning Path\n1. Start with the basics\n2. Practice with examples\n3. Build real projects\n4. Review and iterate`,
    visuals: {
      graphviz: `digraph G {\n  rankdir=LR;\n  A [label="Start ${safeTopic}"];\n  B [label="Understand Basics"];\n  C [label="Practice"];\n  D [label="Review Fundamentals"];\n  E [label="Build Projects"];\n  F [label="Mastery"];\n  A -> B;\n  B -> C [label="Yes"];\n  B -> D [label="No"];\n  C -> E;\n  D -> B;\n  E -> F;\n}`,
      imageSearchQuery: `${safeTopic} concept diagram`
    },
    videoSearchQuery: `${safeTopic} tutorial for beginners`,
    practicalTasks: [
      `Define ${safeTopic} in your own words.`,
      `Create a mind map of ${safeTopic} concepts.`,
      `Find 3 real-world applications of ${safeTopic}.`
    ],
    quiz: [
      { question: `What is the core principle of ${safeTopic}?`, options: ["Efficiency", "Speed", "Cost", "None"], correct: 0 },
      { question: `How does ${safeTopic} impact daily operations?`, options: ["Negatively", "Positively", "No impact", "Unknown"], correct: 1 },
      { question: `Best approach to learning ${safeTopic}?`, options: ["Skip basics", "Practice regularly", "Memorize", "Guess"], correct: 1 },
      { question: `Key benefit of ${safeTopic}?`, options: ["Confusion", "Clarity", "Chaos", "None"], correct: 1 },
      { question: `First step in learning ${safeTopic}?`, options: ["Advanced topics", "Fundamentals", "Skip it", "Random study"], correct: 1 }
    ]
  };
}
