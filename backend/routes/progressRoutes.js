const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, progressController.saveProgress);
router.get("/", authMiddleware, progressController.getProgress);
router.get("/due", authMiddleware, progressController.getDueReviews);
router.delete("/:id", authMiddleware, progressController.deleteProgress);

module.exports = router;
