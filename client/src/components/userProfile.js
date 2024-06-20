import React, { useState } from 'react';
import PropTypes from 'prop-types';
import UserQuestionList from './userQuestionList';
import { useAuth } from './authContext';
import UserAnswers from './userAnswers';
import UserTag from './userTag';

const UserProfile = ({
                         setSelectedTag,
                         questions,
                         setActivePage,
                         onQuestionClick,
                         answers,
                         tags,
                         deleteQuestionById,
                         deleteAnswerById,
                         updateAnswerTextById,
                         updateQuestionTextById,
                         deleteTagForUser,
                         updateTagNameById,
                            data
                     }) => {
    const [childActivePage, setChildActivePage] = useState();
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <div>Please log in to view this page.</div>;
    }

    const renderComponent = () => {
        switch (childActivePage) {
            case 'userQuestionList':
                return (
                    <UserQuestionList
                        setSelectedTag={setSelectedTag}
                        questions={questions}
                        answers={answers}
                        setActivePage={setActivePage}
                        data={data}
                        updateQuestionTextById={updateQuestionTextById}
                        deleteQuestionById={deleteQuestionById}
                        onQuestionClick={onQuestionClick}
                    />
                );
            case 'userAnswers':
                return (
                    <UserAnswers
                        answers={answers}
                        questions={questions}
                        deleteAnswerById={deleteAnswerById}
                        updateAnswerTextById={updateAnswerTextById}
                    />
                );
            case 'userTag':
                return (
                    <UserTag
                        questions={questions}
                        tags={tags}
                        deleteTagForUser={deleteTagForUser}
                        updateTagNameById={updateTagNameById}
                    />
                );
            default:
                return null;
        }
    };

    const handleQuestionsClick = () => {
        setChildActivePage('userQuestionList');
    };

    const handleAnswersClick = () => {
        setChildActivePage('userAnswers');
    };

    const handleTagsClick = () => {
        setChildActivePage('userTag');
    };

    return (
        <div className="user-profile">
            <h1>User Profile</h1>
            <p>Username: {currentUser.user.username}</p>
            <p>Reputation: {currentUser.user.reputation}</p>
            <p>Joined: 0 days</p>
            <div className="user-qat-subheader">
                <div className="qat-filter-buttons">
                    <button onClick={handleQuestionsClick}>Questions</button>
                    <button onClick={handleAnswersClick}>Answers</button>
                    <button onClick={handleTagsClick}>Tags</button>
                </div>
            </div>
            {renderComponent()}
        </div>
    );
};

UserProfile.propTypes = {
    setSelectedTag: PropTypes.func.isRequired,
    questions: PropTypes.array.isRequired,
    tags: PropTypes.array.isRequired,
    setActivePage: PropTypes.func.isRequired,
    onQuestionClick: PropTypes.func.isRequired,
    answers: PropTypes.array.isRequired,
    deleteQuestionById:PropTypes.func.isRequired,
    deleteAnswerById : PropTypes.func.isRequired,
    updateAnswerTextById : PropTypes.func.isRequired,
    updateQuestionTextById:PropTypes.func.isRequired,
    deleteTagForUser: PropTypes.func.isRequired,
    updateTagNameById:PropTypes.func.isRequired,
    data:PropTypes.object.isRequired
};

export default UserProfile;
