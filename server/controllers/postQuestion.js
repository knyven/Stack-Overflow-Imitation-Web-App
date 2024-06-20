const mongoose = require('mongoose');
const Question = require("../models/questions");
const Tag = require("../models/tags");

exports.postQuestion = async (req, res) => {
  try {
    // Extract the tag names and other question details from the request body
    let { tagNames, ...questionDetails } = req.body;
    console.log("Request Body" + req.body);

    // Ensure asked_by is correctly cast to an ObjectId
    if (mongoose.Types.ObjectId.isValid(questionDetails.asked_by)) {
      questionDetails.asked_by = new mongoose.Types.ObjectId(questionDetails.asked_by);
    } else {
      return res.status(400).json({ message: 'Invalid user ID' });
    }


    // Convert tag names to lowercase for consistent handling
    tagNames = tagNames.map((tag) => tag.toLowerCase());

    // Find existing tags (case-insensitive)
    const existingTags = await Tag.find({
      name: { $in: tagNames },
    });

    // Extract the names of existing tags
    const existingTagNames = existingTags.map((tag) => tag.name);

    // Determine which tags need to be created
    const newTagNames = tagNames.filter(
      (tagName) => !existingTagNames.includes(tagName)
    );

    // Create new tags and save them
    const newTags = newTagNames.map((tagName) => new Tag({ name: tagName }));
    await Tag.insertMany(newTags);

    // Combine existing and new tags
    const combinedTags = [...existingTags, ...newTags];

    // Extract tag IDs
    const tagIds = combinedTags.map((tag) => tag._id);

    // Combine tag ObjectIds with the rest of the question details
    const questionData = {
      ...questionDetails,
      tags: tagIds
    };

    // Create a new question document
    const newQuestion = new Question(questionData);

    // Save the new question
    await newQuestion.save();

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("Error posting new question:", error);
    res.status(500).send(error);
  }
};
