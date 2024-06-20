const Question = require("../models/questions");

exports.postAcceptAnswer = async (req, res) => {
  try {
    const questionId = req.params.id; 
    const { answerId } = req.body;     

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).send("Question not found");

    question.accepted_answer = answerId;
    await question.save();

    res.status(200).json({ message: "Answer accepted successfully", question });
  } catch (error) {
    console.error("Error accepting answer:", error);
    res.status(500).send(error);
  }
};
