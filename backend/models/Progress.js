const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  topic: String,
  learningStyle: String,
  score: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  nextReviewDate: {
    type: Date,
    default: function () {
      return new Date(+new Date() + 1 * 24 * 60 * 60 * 1000); // Default: review in 1 day
    }
  }
});

module.exports = mongoose.model("Progress", progressSchema);
