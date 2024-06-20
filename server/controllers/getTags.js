
const Tag = require("../models/tags");

exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find({});
    //console.log("These are the tags from the getTags controller: ", tags);

    res.json(tags);
  } catch (error) {
    res.status(500).send(error);
  }
};
