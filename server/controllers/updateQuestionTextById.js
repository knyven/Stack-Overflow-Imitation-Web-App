const Question = require('../models/questions'); // Import your Question model

// Update the question text by ID
const updateQuestionTextById = async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    try {
        const updatedQuestion = await Question.findByIdAndUpdate(
            id,
            { $set: { text } },
            { new: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.json(updatedQuestion);
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    updateQuestionTextById,
};
