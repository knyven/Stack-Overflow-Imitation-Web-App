// question schema
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  asked_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  author_email:{type:String, required:true},

  views: { type: Number, default: 0 },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
  score: { type: Number, default: 0 },
  accepted_answer: { type: mongoose.Schema.Types.ObjectId, ref: "Answer" },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true }); // Enable automatic timestamps

module.exports = mongoose.model("Question", questionSchema);