const Progress = require("../models/Progress");

exports.saveProgress = async (req, res) => {
  try {
    const { topic, learningStyle } = req.body;

    const progress = await Progress.create({
      userId: req.userId,
      topic,
      learningStyle
    });

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: "Failed to save progress" });
  }
};

exports.getProgress = async (req, res) => {
  try {
    console.log("Fetching progress for user:", req.userId);
    const progress = await Progress.find({ userId: req.userId }).sort({ createdAt: -1 });
    console.log(`Found ${progress.length} progress entries for user ${req.userId}`);
    res.json(progress);
  } catch (err) {
    console.error("Get Progress Error:", err);
    res.status(500).json({ message: "Failed to load progress" });
  }
};

exports.getDueReviews = async (req, res) => {
  try {
    const today = new Date();
    const dueReviews = await Progress.find({
      userId: req.userId,
      nextReviewDate: { $lte: today }
    });
    res.json(dueReviews);
  } catch (err) {
    console.error("Due Reviews Error:", err);
    res.status(500).json({ message: "Failed to load due reviews" });
  }
};

exports.deleteProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProgress = await Progress.findOneAndDelete({
      _id: id,
      userId: req.userId
    });

    if (!deletedProgress) {
      return res.status(404).json({ message: "Progress entry not found or unauthorized" });
    }

    res.json({ message: "Progress deleted successfully" });
  } catch (err) {
    console.error("Delete Progress Error:", err);
    res.status(500).json({ message: "Failed to delete progress" });
  }
};
