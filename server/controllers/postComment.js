const Question = require("../models/questions");
const Answer = require("../models/answers");
const Comment = require("../models/comments");
const mongoose = require('mongoose')

exports.postComment = async (req, res) => {
  try {
    const { text, commented_by, parent } = req.body; 

    console.log('Request body:', req.body); 

    // Ensure commented_by is correctly cast to an ObjectId
    if (!mongoose.Types.ObjectId.isValid(commented_by)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Create new comment
    const newComment = new Comment({
      text,
      commented_by, 
      parent
    });

    console.log('New comment:', newComment); // Log the new comment

    await newComment.save();

    // Associate the comment with the parent (either a question or an answer)
    if (parent.type === 'Question') {
      await Question.findByIdAndUpdate(parent.id, {
        $push: { comments: newComment._id },
      });

      // Update the Question document
      const question = await Question.findById(parent.id);
      question.updatedAt = new Date();
      await question.save();
    } else if (parent.type === 'Answer') {
      await Answer.findByIdAndUpdate(parent.id, {
        $push: { comments: newComment._id },
      });

      // Find the associated question and update its updatedAt field
      const question = await Question.findOne({ answers: parent.id });
      if (question) {
        question.updatedAt = new Date();
        await question.save();
      }
    } else {
      return res.status(400).json({ message: 'Invalid parent type' });
    }

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error posting new comment:", error);
    res.status(500).send(error);
  }
};