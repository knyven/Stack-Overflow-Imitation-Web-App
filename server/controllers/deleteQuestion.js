const Question = require("../models/questions");
const Comment = require("../models/comments");
exports.deleteQuestion = async (req, res) => {
    try {
        const questionId = req.params.id; // Assuming the question ID is sent as a parameter
        await Comment.deleteMany({
            "parent.id": questionId,
            "parent.type": "Question"
        });
        const deletedQuestion = await Question.findByIdAndDelete(questionId);
        if (!deletedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json({ message: "Question deleted successfully" });
    } catch (error) {
        res.status(500).send(error);
    }

};
