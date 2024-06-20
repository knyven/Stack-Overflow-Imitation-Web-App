const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true, maxlength: 140 },
  commented_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  votes: { type: Number, default: 0 },
  parent: { 
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    type: { type: String, required: true } // can be 'Question' or 'Answer'
  }
}, { timestamps: true }); // Enable automatic timestamps

module.exports = mongoose.model("Comment", commentSchema);




