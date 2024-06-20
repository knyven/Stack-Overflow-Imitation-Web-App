const Tag = require("../models/tags");
const Question = require("../models/questions");
const editTag = async (req, res) => {
  const { tagId, userId, newTagName } = req.body;

  try {
    const tagToUpdate = await Tag.findById(tagId);
    if (!tagToUpdate) {
      return res.status(404).json({ message: 'Tag not found.' });
    }

    // Check if the tag is used by other users in any questions
    const questionsWithTag = await Question.find({ tags: tagId, asked_by: { $ne: userId } });
    if (questionsWithTag.size > 0) {
      return res.status(403).json({ message: 'Tag is used by other users and cannot be edited.' });
    }

    // Update the tag name
    const updatedTag = await Tag.findByIdAndUpdate(tagId, { name: newTagName }, { new: true });
    if (!updatedTag) {
      return res.status(404).json({ message: 'Tag not found.' });
    }


    return res.status(200).json({ message: 'Tag updated successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

module.exports = { editTag };