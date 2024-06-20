const Answer = require("../models/answers");

const Question = require("../models/questions");
const Comment= require("../models/comments")
exports.deleteAnswer = async (req, res) => {
    try {
        const answerId = req.params.id; // Extract answerId from request parameters

        // Check if the answerId is valid
        if (!answerId) {
            return res.status(400).json({ message: 'Answer ID is missing' });
        }

        // Check if the answer with the given ID exists
        const answer = await Answer.findById(answerId);
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        // Find the corresponding question that contains this answer
        const question = await Question.findOneAndUpdate(
            { answers: answerId }, // Find question that contains the answer
            { $pull: { answers: answerId } }, // Remove the answer from the question's answers array
            { new: true } // Return the updated question
        );
        await Comment.deleteMany({
            "parent.id": answerId,
            "parent.type": "Answer"
        });
        // Delete the answer
        await Answer.findByIdAndDelete(answerId);

        res.status(200).json({ message: 'Answer deleted successfully', question });
    } catch (error) {
        console.error("Error deleting answer:", error);
        res.status(500).send(error);
    }

};
