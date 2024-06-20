const Tag = require("../models/tags");
const Question = require("../models/questions");

const deleteTag = async (req, res) => {
    const { tagId, userId } = req.body;

    try {

        // Find the tag by ID
        const tagToDelete = await Tag.findById(tagId);
        if (!tagToDelete) {
            return res.status(404).json({ message: 'Tag not found.' });
        }

        // Check if the tag is used by other users in any questions
        const otherUsersQuestionsWithTag = await Question.find({ tags: tagId, asked_by: { $ne: userId } });
        if (otherUsersQuestionsWithTag.size > 0) {
            return res.status(403).json({ message: 'Tag is used by other users and cannot be deleted.' });
        }

        // Find all questions containing the tag
        const questionsToUpdate = await Question.find({ tags: tagId });

        // Remove the tag from all associated questions
        for (let i = 0; i < questionsToUpdate.length; i++) {
            const question = questionsToUpdate[i];
            question.tags = question.tags.filter(tag => tag.toString() !== tagId);
            await question.save();
        }

        // Delete the tag
        await Tag.deleteOne(tagToDelete);

        return res.status(200).json({ message: 'Tag deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

module.exports = { deleteTag };
