const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middlewares/auth");

// import controllers
const { postAnswer } = require("../controllers/postAnswer");
const { getAnswers } = require("../controllers/getAnswers");

const {
  postUpvoteAnswer,
  postDownvoteAnswer,
} = require("../controllers/answerVote");
const { deleteAnswer } = require("../controllers/deleteAnswer");
const { postAcceptAnswer } = require("../controllers/acceptAnswer");

const { postComment } = require("../controllers/postComment"); // New controller
// const {
//   postUpvoteComment,
//   postDownvoteComment,
// } = require("../controllers/commentVote"); // New controller
const {updateAnswerTextById} = require("../controllers/updateAnswerTextById");

// routing
const UPVOTE_ANSWER_ROUTE = "/:id/upvote";
const DOWNVOTE_ANSWER_ROUTE = "/:id/downvote";
const ACCEPT_ANSWER_ROUTE = "/accept-answer";
const COMMENT_ROUTE = "/:id/comments"; 



const DELETE_ANSWER_ROUTE ='/:id';
const UPDATE_ANSWER =  '/:answerId';
router.delete(DELETE_ANSWER_ROUTE, deleteAnswer);
router.patch(UPDATE_ANSWER, updateAnswerTextById);


// Get all answers
router.get("/", getAnswers);

// Post a new answer
router.post("/", authenticateJWT, postAnswer);

// route to upvote answer
router.post(UPVOTE_ANSWER_ROUTE, authenticateJWT, postUpvoteAnswer);

// route to downvote answer
router.post(DOWNVOTE_ANSWER_ROUTE, authenticateJWT, postDownvoteAnswer);

// Route to accept an answer for a question
router.patch(ACCEPT_ANSWER_ROUTE, authenticateJWT, postAcceptAnswer);

// route to delete answer
router.delete("/:id", authenticateJWT, deleteAnswer);



// Post a new comment to an answer
router.post(COMMENT_ROUTE, authenticateJWT, postComment);

module.exports = router;
