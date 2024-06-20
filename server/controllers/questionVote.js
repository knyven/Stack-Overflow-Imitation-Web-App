const Question = require("../models/questions");


exports.postUpvoteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findById(questionId).populate('asked_by');

    if (!question) return res.status(404).send("Question not found");

    // Increment score by one for an upvote
    question.score += 1; 
    await question.save();

    // Update user's reputation
    if (question.asked_by) {
      question.asked_by.reputation += 1; 
      await question.asked_by.save();
    }

    res.status(200).json(question);
  } catch (error) {
    console.error("Error upvoting question:", error);
    res.status(500).send(error);
  }
};

exports.postDownvoteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findById(questionId).populate('asked_by');
    
    if (!question) return res.status(404).send("Question not found");

    // Decrement score by one for a downvote
    question.score -= 1; 
    await question.save();

    // Update user's reputation
    if (question.asked_by) {
      question.asked_by.reputation -= 1; 
      await question.asked_by.save();
    }

    res.status(200).json(question);
  } catch (error) {
    console.error("Error downvoting question:", error);
    res.status(500).send(error);
  }
};
