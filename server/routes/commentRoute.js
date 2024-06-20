const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middlewares/auth");

const {
  postUpvoteComment,
  postDownvoteComment,
} = require("../controllers/commentVote");
const { postComment } = require("../controllers/postComment"); 

const UPVOTE_COMMENT_ROUTE = "/:id/upvote";
const DOWNVOTE_COMMENT_ROUTE = "/:id/downvote";
const COMMENT_ROUTE = "/"; 

// route to upvote comment
router.post(UPVOTE_COMMENT_ROUTE, authenticateJWT, postUpvoteComment);

// route to downvote comment
router.post(DOWNVOTE_COMMENT_ROUTE, authenticateJWT, postDownvoteComment);

// Post a new comment
router.post(COMMENT_ROUTE, authenticateJWT, postComment); 

module.exports = router;
