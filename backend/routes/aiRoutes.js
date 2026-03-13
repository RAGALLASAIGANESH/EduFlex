const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/generate", authMiddleware, aiController.generateContent);
router.post("/chat", authMiddleware, aiController.chatWithTutor);
router.post("/flashcards", authMiddleware, aiController.generateFlashcards);
router.post("/roadmap", authMiddleware, aiController.generateRoadmap);
router.post("/interview/question", authMiddleware, aiController.generateInterviewQuestion);
router.post("/interview/evaluate", authMiddleware, aiController.evaluateInterviewAnswer);

module.exports = router;
