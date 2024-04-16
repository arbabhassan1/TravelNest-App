const mongoose = require("mongoose");

const revirwSchema = new mongoose.Schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const Reviews = mongoose.model("Review", revirwSchema);

module.exports = Reviews;
