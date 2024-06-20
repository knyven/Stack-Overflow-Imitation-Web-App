
// init express router
const express = require('express');
const router = express.Router();


// import controller 
const { getTags } = require("../controllers/getTags");
const {editTag} = require("../controllers/editTag");
const {deleteTag} = require("../controllers/deleteTag");
// hardcode route



// Get tags
router.get('/', getTags);
router.patch('/',editTag);
router.delete('/',deleteTag);




module.exports = router;