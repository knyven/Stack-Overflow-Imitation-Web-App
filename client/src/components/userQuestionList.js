import React, { useEffect, useState } from "react";
import { timeSince } from "../timeHelper";
import PropTypes from "prop-types";
import UpdateQuestionForm from "./updateQuestionForm";
import {useAuth} from "./authContext";

const UserQuestionList = ({
                              questions,
    answers,
                              deleteQuestionById,
                              updateQuestionTextById
                          }) => {
    const {currentUser} = useAuth();
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [displayedQuestions, setDisplayedQuestions] = useState([]);
    const [sortMode, setSortMode] = useState("newest");
    const [activePage, setActivePage] = useState("userQuestionList");
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 5;

    useEffect(() => {
        const filtered = questions.filter(
            (question) => question.author_email === currentUser.user.email
        );
        setFilteredQuestions(filtered);
    }, [questions, answers,currentUser.user.email]);

    useEffect(() => {
        let updatedQuestions = [...filteredQuestions];

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

        setDisplayedQuestions(updatedQuestions);
    }, [sortMode, filteredQuestions]);

    const sortByNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
    const sortByActive = (a, b) => b.views - a.views;

    const handleDeleteQuestion = async (questionId) => {
        try {
            const filteredQuestions = displayedQuestions.filter(
                (question) => question._id !== questionId._id

            );
            console.log("Deleting question "+questionId._id);
            setDisplayedQuestions(filteredQuestions);
            await deleteQuestionById(questionId);
            // Call deleteQuestionById with the questionId
            // setChildActivePage("userQuestionList");
        } catch (error) {
            console.error('Error handling delete question:', error);
            // Handle error states if needed
        }
    };

    function handleUpdateQuestion(question) {
        setSelectedQuestion(question);
        setActivePage("updateQuestionForm");
    }

    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = displayedQuestions.slice(
        indexOfFirstQuestion,
        indexOfLastQuestion
    );

    const totalPages = Math.ceil(displayedQuestions.length / questionsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div className="container">
            {activePage === "userQuestionList" && (
                <div className="userQuestionList">
                    <div className="question-list-subheader">
                        <span>{displayedQuestions.length} questions</span>
                        <div className="question-filter-buttons">
                            <button onClick={() => setSortMode("newest")}>Newest</button>
                            <button onClick={() => setSortMode("active")}>Active</button>
                            <button onClick={() => setSortMode("unanswered")}>Unanswered</button>
                        </div>
                    </div>
                    {currentQuestions.map((question) => {
                        const timeInfo = timeSince(new Date(question.createdAt), "question");

                        return (
                            <div key={question._id} className="question">
                                {/* Question details */}
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
                                    </div>
                                    <div className="question-post-details lastActivity">
                    <span>
                      Posted {timeInfo.time}
                        {timeInfo.addAgo ? " ago" : ""}
                    </span>
                                    </div>
                                </div>
                                {/* Question actions */}
                                <div className="question-actions">
                                    <button onClick={() => handleDeleteQuestion(question)}>
                                        Delete
                                    </button>
                                    <button onClick={() => handleUpdateQuestion(question)}>
                                        Update
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {/* Pagination controls */}
                    <div className="pagination">
                        <button onClick={handlePrevPage}>Previous</button>
                        <span>{`Page ${currentPage} of ${totalPages}`}</span>
                        <button onClick={handleNextPage}>Next</button>
                    </div>
                </div>
            )}
            {activePage === "updateQuestionForm" && (
                <UpdateQuestionForm
                    setActivePage={setActivePage}
                    question={selectedQuestion}
                    updateQuestionTextById={updateQuestionTextById}
                />
            )}
        </div>
    );
};

UserQuestionList.propTypes = {
    questions: PropTypes.array.isRequired,
    deleteQuestionById: PropTypes.func.isRequired,
    updateQuestionTextById: PropTypes.func.isRequired,
    answers: PropTypes.array.isRequired,
};

export default UserQuestionList;
