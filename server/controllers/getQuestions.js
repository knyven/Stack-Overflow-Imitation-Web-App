const Question = require("../models/questions");


exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({})
      .populate({
        path: 'answers',
        populate: { path: 'ans_by', select: 'username' }
      })
      .populate('tags')
      .populate({ 
        path: 'asked_by', 
        select: 'username reputation'
      })
      .populate({
        path: 'comments', 
        populate: { path: 'commented_by', select: 'username' }
      })
      .select('title text tags asked_by views score createdAt updatedAt author_email');
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error); // Added this line
    res.status(500).send(error);
  }
};
