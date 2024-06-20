import React, { useState } from "react";
import Tag from "./tag.js";
import { timeSince } from "../timeHelper.js";
import PropTypes from "prop-types";
import { useAuth } from "./authContext.js";
import useData from "./usedata.js";
import CommentForm from "./commentForm.js";
import '../stylesheets/answerPage.css';

const hyperlinkPattern = /\[([^\]]+)]\((https?:\/\/[^)]+)\)/g;

function AnswerPage({ question, answers, setActivePage, setSelectedTag }) {
  console.log('Question:', question);
  console.log('Answers:', answers);

  const { currentUser } = useAuth();
  const { upvoteAnswer, downvoteAnswer, acceptAnswer, addComment, upvoteQuestion, downvoteQuestion, upvoteComment } = useData();
  const answersPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentParentId, setCommentParentId] = useState(null);
  const [isCommentForQuestion, setIsCommentForQuestion] = useState(false);

  const commentsPerPage = 3;
  const [currentQuestionCommentPage, setCurrentQuestionCommentPage] = useState(1);

  const [answerList, setAnswerList] = useState(answers);


  const handleQuestionCommentPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(question.comments.length / commentsPerPage)) {
      setCurrentQuestionCommentPage(newPage);
    }
  };

  const acceptedAnswer = answers.find(
    (answer) => answer._id === question.accepted_answer
  );
  const otherAnswers = answers.filter(
    (answer) => answer._id !== question.accepted_answer
  );

  const questionAskerId = question.asked_by._id.toString();

const handleAcceptAnswer = async (answerId) => {
  await acceptAnswer(question._id, answerId);
  const acceptedIndex = answerList.findIndex((answer) => answer._id === answerId);
  const acceptedAnswer = answerList[acceptedIndex];
  let newAnswerList = [...answerList];
  newAnswerList.splice(acceptedIndex, 1); 
  newAnswerList = [acceptedAnswer, ...newAnswerList]; 
  setAnswerList(newAnswerList);
};

  const handleQuestionVote = async (event, voteType) => {
    event.stopPropagation();

    // Check if the user's reputation is 50 or higher
    if (currentUser.user.reputation < 50) {
      alert("Your reputation must be 50 or higher to vote.");
      return;
    }

    if (voteType === "upvote") {
      await upvoteQuestion(question._id);
    } else {
      await downvoteQuestion(question._id);
    }
  };

  const totalPages = Math.ceil(
    (acceptedAnswer ? otherAnswers.length : answers.length) / answersPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const startIndex = acceptedAnswer
    ? (currentPage - 1) * answersPerPage
    : currentPage * answersPerPage - answersPerPage;
  const paginatedAnswers = acceptedAnswer
    ? currentPage === 1
      ? [acceptedAnswer, ...otherAnswers.slice(0, answersPerPage - 1)]
      : otherAnswers.slice((currentPage - 2) * answersPerPage + 1, (currentPage - 1) * answersPerPage + 1)
    : answers.slice(startIndex, startIndex + answersPerPage);

  const handleAnswerVote = async (event, answerId, voteType) => {
    event.stopPropagation();

    // Check if the user's reputation is 50 or higher
    if (currentUser.user.reputation < 50) {
      alert("Your reputation must be 50 or higher to vote.");
      return;
    }

    if (voteType === "upvote") {
      await upvoteAnswer(answerId);
    } else {
      await downvoteAnswer(answerId);
    }
  };

  const handleCommentVote = async (event, id, voteType) => {
    event.stopPropagation();
    console.log('ID:', id);
    console.log('Vote type:', voteType);
    if (voteType === "upvote") {
      await upvoteComment(id);
    }
  };

  const handleShowCommentForm = (parentId, isForQuestion) => {
    setCommentParentId(parentId);
    setIsCommentForQuestion(isForQuestion);
    setShowCommentForm(true);
  };

  const handleClickTag = (tag, event) => {
    event.stopPropagation();
    setSelectedTag(tag);
    setActivePage("questionsByTag");
  };

  const renderWithLinks = (text) => {
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = hyperlinkPattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <a href={match[2]} target="_blank" rel="noopener noreferrer">
          {match[1]}
        </a>
      );
      lastIndex = match.index + match[0].length;
    }
    parts.push(text.substring(lastIndex));

    return parts;
  };

  return (
    <div className="answer-page">
      {showCommentForm ? (
        <CommentForm
          parentId={commentParentId}
          parentType={isCommentForQuestion ? "Question" : "Answer"}
          questionId={question._id}
          addComment={addComment}
          closeForm={() => setShowCommentForm(false)}
        />
      ) : (
        <>
          <div className="question-score-section question">
            {currentUser && (
              <div className="vote-section">
                <button
                  onClick={(event) =>
                    handleQuestionVote(event, "upvote")
                  }
                >
                  Upvote
                </button>
                <span className="question-score">Score: {question.score}</span>
                <button
                  onClick={(event) =>
                    handleQuestionVote(event, "downvote")
                  }
                >
                  Downvote
                </button>
              </div>
            )}
          </div>

          <div id="answersHeader" className="row">
            <span>{answers.length} answers</span>
            <h2>{question.title}</h2>
            {currentUser && (
              <button onClick={() => setActivePage("askQuestion")}>
                Ask a Question
              </button>
            )}
          </div>

          <div id="questionBody" className="row question">
            <span>{question.views} views</span>
            <p>{renderWithLinks(question.text)}</p>
            <small>
              {question.asked_by?.username || "Unknown User"}{" "}
              {timeSince(new Date(question.createdAt), "question").time}
              {timeSince(new Date(question.createdAt), "question").addAgo
                ? " ago"
                : ""}
            </small>
          </div>

          <div className="question-comments">
            {question.comments.slice((currentQuestionCommentPage - 1) * commentsPerPage, currentQuestionCommentPage * commentsPerPage).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((comment) => {
              console.log('Comment:', comment);
              return (
                <div key={comment._id} className="comment">
                  <p>{comment.text}</p>
                  <small>
                    {comment.commented_by.username}{" "}
                    {timeSince(new Date(comment.createdAt), "comment").time}
                    {timeSince(new Date(comment.createdAt), "comment").addAgo
                      ? " ago"
                      : ""}
                  </small>
                  {currentUser && (
                    <div className="comment-vote-section">
                      <button
                        onClick={(event) =>
                          handleCommentVote(event, comment._id, "upvote")
                        }
                      >
                        Upvote
                      </button>
                      <span className="comment-score">Score: {comment.votes}</span>
                    </div>
                  )}
                </div>
              );
            })}
            {currentUser && (
              <button onClick={() => handleShowCommentForm(question._id, true)}>
                Add a comment
              </button>
            )}
            <button onClick={() => handleQuestionCommentPageChange(currentQuestionCommentPage - 1)} disabled={currentQuestionCommentPage === 1}>Previous</button>
            <button onClick={() => handleQuestionCommentPageChange(currentQuestionCommentPage + 1)} disabled={currentQuestionCommentPage === Math.ceil(question.comments.length / commentsPerPage)}>Next</button>
          </div>

          <div className="tags-row">
            <hr style={{ borderStyle: "dotted" }} />
            {question.tags.map((tag) => {
              console.log('Tag:', tag);
              return (
                <Tag key={tag._id} tag={tag} onClick={handleClickTag} />
              );
            })}
            <hr style={{ borderStyle: "dotted" }} />
          </div>

          <div className="answers">
            {paginatedAnswers.map((answer) => {
              console.log('Paginated answer:', answer);
              return (
                <div key={answer._id} className="answer">
                  {currentUser && (
                    <div className="vote-section">
                      <button
                        onClick={(event) =>
                          handleAnswerVote(event, answer._id, "upvote")
                        }
                      >
                        Upvote
                      </button>
                      <span className="answer-score">Score: {answer.score}</span>
                      <button
                        onClick={(event) =>
                          handleAnswerVote(event, answer._id, "downvote")
                        }
                      >
                        Downvote
                      </button>
                    </div>
                  )}
                  <p className="answerText">{renderWithLinks(answer.text)}</p>
                  <small className="answerAuthor">
                    {answer.ans_by.username}{" "}
                    {timeSince(new Date(answer.createdAt), "answer").time}
                    {timeSince(new Date(answer.createdAt), "answer").addAgo
                      ? " ago"
                      : ""}
                  </small>
                  {currentUser && currentUser.user.id === questionAskerId && (
                    <button onClick={() => handleAcceptAnswer(answer._id)}>
                      Accept Answer
                    </button>
                  )}
                  {question.accepted_answer &&
                    question.accepted_answer._id === answer._id.toString() && (
                      <div className="accepted-answer-indicator">
                        <strong>Accepted Answer</strong>
                      </div>
                    )}
                  <div className="answer-comments">
                    {answer.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((comment) => {
                      console.log('Comment:', comment);
                      console.log('Commented by:', comment.commented_by);
                      console.log('Created at:', comment.createdAt);
                      return (
                        <div key={comment._id} className="comment">
                          <p>{comment.text}</p>
                          <small>
                            Commented by {comment.commented_by ? comment.commented_by.username : "Unknown User"}{" "}
                            {timeSince(new Date(comment.createdAt), "comment").time}
                            {timeSince(new Date(comment.createdAt), "comment").addAgo
                              ? " ago"
                              : ""}
                          </small>
                          {currentUser && (
                            <div className="comment-vote-section">
                              <button
                                onClick={(event) =>
                                  handleCommentVote(event, comment._id, "upvote")
                                }
                              >
                                Upvote
                              </button>
                              <span className="comment-score">Score: {comment.votes}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {currentUser && (
                      <button onClick={() => handleShowCommentForm(answer._id, false)}>
                        Add a comment
                      </button>
                    )}
                  </div>
                  <hr style={{ borderStyle: "dotted" }} />
                </div>
              );
            })}
          </div>

          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          {currentUser && (
            <button onClick={() => setActivePage("answerQuestion")}>
              Answer Question
            </button>
          )}
        </>
      )}
    </div>
  );
}

AnswerPage.propTypes = {
  question: PropTypes.object.isRequired,
  answers: PropTypes.array.isRequired,
  setActivePage: PropTypes.func.isRequired,
  setSelectedTag: PropTypes.func.isRequired,
};

export default AnswerPage;
