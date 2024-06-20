const Question = require("../models/questions");



exports.postIncrementViews = async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findById(questionId);

    
    if (!question) {
      return res.status(404).send("Question not found");
    }

    question.views = question.views + 1; 
    await question.save();

    res.status(200).send(question);
  } catch (error) {
    console.error("Error updating question views:", error);
    res.status(500).send(error);
  }
}; 