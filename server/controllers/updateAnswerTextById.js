const Answer = require('../models/answers');

exports.updateAnswerTextById = async (req, res) => {
    try {
        const { answerId } = req.params;
        const { newText } = req.body;

        if (!answerId || !newText) {
            return res.status(400).json({ message: 'Answer ID or new text is missing' });
        }

        const updatedAnswer = await Answer.findByIdAndUpdate(
            answerId,
            { $set: { text: newText } },
            { new: true }
        );

        if (!updatedAnswer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        res.status(200).json({ message: 'Answer text updated successfully', updatedAnswer });
    } catch (error) {
        console.error('Error updating answer text:', error);
        res.status(500).send(error);
    }
};
