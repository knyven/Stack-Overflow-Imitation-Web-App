const Answer = require("../models/answers");
const Question = require("../models/questions");

exports.postUpvoteAnswer = async (req, res) => {
  try {
    const answerId = req.params.id;
    const answer = await Answer.findById(answerId).populate("ans_by");

    if (!answer) return res.status(404).send("Answer not found");

    // Increment score by one for an upvote
    answer.score += 1;
    await answer.save();

    // Update user's reputation
    if (answer.ans_by) {
      // Increment user's reputation by 5 for an upvote
      answer.ans_by.reputation += 5;
      await answer.ans_by.save();
    }

    // Find the associated question and update its updatedAt field
    const question = await Question.findOne({ answers: answerId });
    if (question) {
      question.updatedAt = new Date();
      await question.save();
    }

    res.status(200).json(answer);
  } catch (error) {
    console.error("Error upvoting answer:", error);
    res.status(500).send(error);
  }
};

exports.postDownvoteAnswer = async (req, res) => {
  try {
    const answerId = req.params.id;
    const answer = await Answer.findById(answerId).populate("ans_by");

    if (!answer) return res.status(404).send("Answer not found");

    // Decrement score by one for a downvote
    answer.score -= 1;
    await answer.save();

    // Update user's reputation
    if (answer.ans_by) {
      // Decrement user's reputation by 10 for a downvote
      answer.ans_by.reputation -= 10;
      await answer.ans_by.save();
    }

    // Find the associated question and update its updatedAt field
    const question = await Question.findOne({ answers: answerId });
    if (question) {
      question.updatedAt = new Date();
      await question.save();
    }

    res.status(200).json(answer);
  } catch (error) {
    console.error("Error downvoting answer:", error);
    res.status(500).send(error);
  }
};
