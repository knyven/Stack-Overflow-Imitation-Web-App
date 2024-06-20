import React, { useEffect, useState } from "react";
import { useAuth } from "./authContext";
import UpdateAnswerForm from "./updateAnswerForm";
import PropTypes from "prop-types";

function UserAnswers({
                         answers,
                         questions,
                         deleteAnswerById,
                         updateAnswerTextById,
                     }) {
    const { currentUser } = useAuth();
    const [displayedAnswers, setDisplayedAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [activePage, setActivePage] = useState("userAnswers");
    const [currentPage, setCurrentPage] = useState(1);
    const answersPerPage = 5;

    useEffect(() => {
        const sortByNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

        const filteredAnswers = answers
            .filter((answer) => answer.ans_by._id === currentUser.user.id)
            .sort(sortByNewest);

        setDisplayedAnswers(filteredAnswers);
    }, [answers, currentUser.user.id]);

    const handleDelete = async (_id) => {
        const q_id = findQuestionIdByAnswerId(questions, _id);
        try {
            await deleteAnswerById(q_id, _id);
        } catch (error) {
            console.error("Error handling delete question:", error);
            // Handle error states if needed
        }
    };

    const handleUpdate = (_id) => {
        const selectedAnswer = answers.find((answer) => answer._id === _id);
        if (selectedAnswer) {
            setSelectedAnswer(selectedAnswer);
            setActivePage("updateAnswer");
        } else {
            console.error("Selected answer not found");
        }
    };

    const findQuestionIdByAnswerId = (questionsArray, answerId) => {
        for (const question of questionsArray) {
            if (
                question.answers &&
                question.answers.some((answer) => answer._id === answerId)
            ) {
                return question._id;
            }
        }
        return null;
    };

    const indexOfLastAnswer = currentPage * answersPerPage;
    const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
    const currentAnswers = displayedAnswers.slice(
        indexOfFirstAnswer,
        indexOfLastAnswer
    );

    const totalPages = Math.ceil(displayedAnswers.length / answersPerPage);

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
            {activePage === "userAnswers" && (
                <div className="useAnswerList">
                    {currentAnswers.map((answer) => (
                        <div key={answer._id} className="answerBlock">
                            <a href={`#${answer._id}`} className="answerLink">
                                {answer.text.length > 50
                                    ? `${answer.text.substring(0, 50)}...`
                                    : answer.text}
                            </a>
                            <div className="buttons">
                                <button onClick={() => handleDelete(answer._id)}>Delete</button>
                                <button onClick={() => handleUpdate(answer._id)}>Update</button>
                            </div>
                        </div>
                    ))}
                    {/* Pagination controls */}
                    <div className="pagination">
                        <button onClick={handlePrevPage}>Previous</button>
                        <span>{`Page ${currentPage} of ${totalPages}`}</span>
                        <button onClick={handleNextPage}>Next</button>
                    </div>
                </div>
            )}

            {activePage === "updateAnswer" && (
                <UpdateAnswerForm
                    answer={selectedAnswer}
                    setDisplayedAnswers={setDisplayedAnswers}
                    setActivePage={setActivePage}
                    updateAnswerTextById={updateAnswerTextById}
                />
            )}
        </div>
    );
}

UserAnswers.propTypes = {
    answers: PropTypes.array.isRequired,
    questions: PropTypes.array.isRequired,
    deleteAnswerById: PropTypes.func.isRequired,
    updateAnswerTextById: PropTypes.func.isRequired,
};

export default UserAnswers;
