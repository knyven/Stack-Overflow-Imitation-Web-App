import React, { useState, useEffect } from "react";
import Tag from "./tag.js";
import { timeSince } from "../timeHelper.js";
import PropTypes from "prop-types";
import { useAuth } from "./authContext.js";
import useData from "./usedata.js";

/**
 * Component that displays a list of questions, with options to sort and filter.
 *
 * @param {Function} setSelectedTag - Function to set the selected tag.
 * @param {Array} questions - Array of all available questions.
 * @param {Array} tags - Array of all available tags.
 * @param {Function} setActivePage - Function to change the active page.
 * @param {Function} onQuestionClick - Function called when a question is clicked.
 * @returns {JSX.Element} The rendered list of questions.
 */
function QuestionList({
  setSelectedTag,
  questions,
  setActivePage,
  onQuestionClick,
  incrementQuestionViews,
}) {
  // State for sorting and displaying questions
  const [sortMode, setSortMode] = useState("newest");
  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const { currentUser } = useAuth();
  const { upvoteQuestion, downvoteQuestion } = useData();

  const [isMounted, setIsMounted] = useState(true);

  const questionsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setTotalPages(Math.ceil(displayedQuestions.length / questionsPerPage));
  }, [displayedQuestions]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const paginatedQuestions = displayedQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  useEffect(() => {
    // Set isMounted to true on mount
    setIsMounted(true);

    // Cleanup function to run when the component unmounts
    return () => {
      setIsMounted(false); // Set isMounted to false when the component unmounts
    };
  }, []);

  const handleVote = async (event, questionId, voteType) => {
    event.stopPropagation();

    if (!isMounted) return;

    // Check if the user's reputation is 50 or higher
    if (currentUser.user.reputation < 50) {
      alert("Your reputation must be 50 or higher to vote.");
      return;
    }

    if (voteType === "upvote") {
      await upvoteQuestion(questionId);
    } else {
      await downvoteQuestion(questionId);
    }
    // Optionally refresh the question list or optimistically update the UI
    if (isMounted) {
      //update ui since the component is still mounted and visable by user
    }
  };

  // Handler for when a question is clicked. Increments its view count.
  const handleQuestionClick = (question) => {
    // Call the backend to increment the view count, but don't wait for it

    incrementQuestionViews(question._id);

    // Call the onQuestionClick function with the updated question
    onQuestionClick({ ...question, views: question.views + 1 });
  };

  // Handler for tag click. Navigates to the tag-specific questions page.
  const handleTagClick = (tag, event) => {
    event.stopPropagation();
    setSelectedTag(tag);
    setActivePage("questionsByTag");
  };

  // Sorting functions
  const sortByNewest = (a, b) =>
    new Date(b.updatedAt) - new Date(a.updatedAt);
  const sortByActive = (a, b) => b.views - a.views;

  useEffect(() => {
    if (questions) {
      let updatedQuestions = [...questions];
      switch (sortMode) {
        case "newest":
          updatedQuestions.sort(sortByNewest);
          break;
        case "active":
          updatedQuestions.sort(sortByActive);
          break;
        case "unanswered":
          updatedQuestions = updatedQuestions.filter(
            (q) => Array.isArray(q.answers) && q.answers.length === 0
          );
          break;
        default:
          break;
      }

      if (
        JSON.stringify(updatedQuestions) !== JSON.stringify(displayedQuestions)
      ) {
        setDisplayedQuestions(updatedQuestions);
      }
    }
  }, [sortMode, questions]);

  return (
    <div className="question-list">
      <div className="question-list-header">
        <h2>All Questions</h2>
        {currentUser && (
          <button
            className="ask-new-question"
            onClick={() => setActivePage("askQuestion")}
          >
            Ask a Question
          </button>
        )}
      </div>
      <div className="question-list-subheader">
        <span>{displayedQuestions.length} questions</span>
        <div className="question-filter-buttons">
          <button onClick={() => setSortMode("newest")}>Newest</button>
          <button onClick={() => setSortMode("active")}>Active</button>
          <button onClick={() => setSortMode("unanswered")}>Unanswered</button>
        </div>
      </div>
      {paginatedQuestions.map((question) => {
        const timeInfo = timeSince(new Date(question.createdAt), "question");

        return (
          <div
            key={question._id}
            className="question"
            onClick={() => handleQuestionClick(question)}
          >
            <div className="question-header">
              <div className="question-stats postStats">
                <span>{question.views} views</span>
                <span>
                  {Array.isArray(question.answers)
                    ? question.answers.length
                    : 0}{" "}
                  answers
                </span>
              </div>
              <div className="question-title">
                <h3 className="postTitle">{question.title}</h3>
                <h4 className="postBody">{question.text}</h4>
              </div>
              <div className="question-post-details lastActivity">
                <span>
                  {question.asked_by?.username} {timeInfo.time}
                  {timeInfo.addAgo ? " ago" : ""}
                </span>
              </div>
            </div>
            <div className="question-tags">
               {question.tags.map((tag) => (
                <Tag key={tag._id} tag={tag} onClick={handleTagClick} />
              ))}
            </div>
            <div className="question-voting">
              {currentUser && (
                <div className="question-vote-buttons">
                  <button
                    onClick={(event) =>
                      handleVote(event, question._id, "upvote")
                    }
                  >
                    Upvote
                  </button>
                  <button
                    onClick={(event) =>
                      handleVote(event, question._id, "downvote")
                    }
                  >
                    Downvote
                  </button>
                </div>
              )}
              <span className="question-score">Score: {question.score}</span>
            </div>
          </div>
        );
      })}
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
    </div>
  );
}

QuestionList.propTypes = {
  setSelectedTag: PropTypes.func.isRequired,
  questions: PropTypes.array.isRequired,
  tags: PropTypes.array,
  setActivePage: PropTypes.func.isRequired,
  onQuestionClick: PropTypes.func.isRequired,
  incrementQuestionViews: PropTypes.func.isRequired,
};

export default QuestionList;
