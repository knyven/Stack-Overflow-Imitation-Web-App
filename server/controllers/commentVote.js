const Comment = require("../models/comments");
const Question = require("../models/questions"); // Import the Question model

exports.postUpvoteComment = async (req, res) => {
  try {
    const commentId = req.params.id; 
    const comment = await Comment.findById(commentId).populate("commented_by");

    if (!comment) return res.status(404).send("Comment not found");

    // Increment votes by one for an upvote
    comment.votes += 1;
    await comment.save();

    // Update user's reputation
    if (comment.commented_by) {
      // Increment user's reputation
      comment.commented_by.reputation += 1;
      await comment.commented_by.save();
    }

    // Update the Question document
    if (comment.parent.type === 'Question') {
      const question = await Question.findById(comment.parent.id);
      await question.save();
    }

    res.status(200).json(comment);
  } catch (error) {
    console.error("Error upvoting comment:", error);
    res.status(500).send(error);
  }
};

exports.postDownvoteComment = async (req, res) => {
  try {
    const commentId = req.params.id; 
    const comment = await Comment.findById(commentId).populate("commented_by");

    if (!comment) return res.status(404).send("Comment not found");

    // Decrement votes by one for a downvote
    comment.votes -= 1;
    await comment.save();

    // Update user's reputation
    if (comment.commented_by) {
      // Decrement user's reputation
      comment.commented_by.reputation -= 1;
      await comment.commented_by.save();
    }

    // Update the Question document
    if (comment.parent.type === 'Question') {
      const question = await Question.findById(comment.parent.id);
      await question.save();
    }

    res.status(200).json(comment);
  } catch (error) {
    console.error("Error downvoting comment:", error);
    res.status(500).send(error);
  }
};