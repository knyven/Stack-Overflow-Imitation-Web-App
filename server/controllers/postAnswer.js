const Question = require("../models/questions");
const Answer = require("../models/answers");
const mongoose = require('mongoose')

exports.postAnswer = async (req, res) => {
  try {
    const { text, ans_by, questionId } = req.body; 

    // Ensure ans_by is correctly cast to an ObjectId
    if (!mongoose.Types.ObjectId.isValid(ans_by)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Create new answer
    const newAnswer = new Answer({
      text,
      ans_by // ans_by should be a valid ObjectId
    });

    console.log("This is the new answer: ", newAnswer);

    await newAnswer.save();

    // Associate the answer with the question
    await Question.findByIdAndUpdate(questionId, {
      $push: { answers: newAnswer._id },
    });

    // Update the Question document
    const question = await Question.findById(questionId);
    await question.save();

    res.status(201).json(newAnswer);
  } catch (error) {
    console.error("Error posting new answer:", error);
    res.status(500).send(error);
  }
};
