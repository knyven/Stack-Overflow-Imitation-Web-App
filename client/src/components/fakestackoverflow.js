import React, {useState, useEffect, useCallback, useMemo} from "react";
import AskQuestionForm from "./asknewquestion.js";
import AnswerForm from "./answerform.js";
import Header from "./header.js";
import Sidebar from "./sidebar.js";
import QuestionList from "./questionList.js";
import TagList from "./taglist.js";
import useData from "./usedata.js";
import AnswerPage from "./answerpage.js";
import LoginForm from "./loginForm.js";
import RegistrationForm from "./registrationForm.js";
import useAuthApi from "./useAuthApi.js";
import UserProfile from "./userProfile.js";
import { useAuth } from "./authContext.js";


function FakeStackOverflow() {
  const {
    data,
    loading,
    error,
    addQuestion,
    addAnswer,
    incrementQuestionViews,
      deleteQuestionById,
      deleteAnswerById,
      updateAnswerTextById,
      updateQuestionTextById,
      deleteTagForUser,
      updateTagNameById
  } = useData();

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [activePage, setActivePage] = useState("questions");
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [activeForm, setActiveForm] = useState(null);
  const { registerUser, loginUser, authError } = useAuthApi();
  const { login } = useAuth();

  // const questions = data ? data.questions : [];
  const tags = data ? data.tags : [];
  const answers = data ? data.answers : [];
  const questions = useMemo(() => {
    return data ? data.questions : [];
  }, [data]);

  const handleLoginClick = () => {
    setActiveForm("login");
    setActivePage(null);
  };

  const handleRegisterClick = () => {
    setActiveForm("register");
    setActivePage(null);
  };

  const handleProfileClick = () => {
    setActivePage("profile");
  };

  const handleSearch = useCallback((searchResults) => {
    setFilteredQuestions(searchResults);
    setActivePage("search");
  }, []);

  useEffect(() => {
    if (activePage !== "search" && questions && questions.length > 0) {
      setFilteredQuestions(questions);
    }
  }, [activePage, questions]);

  const handleAddAnswer = async (qid, answer) => {
    try {
      await addAnswer(qid, answer);
    } catch (error) {
      console.error("Error adding a new answer: ", error);
    }
  };

  useEffect(() => {
    if (selectedQuestion) {
      const updatedQuestion = questions.find(
        (q) => q._id === selectedQuestion._id
      );
      setSelectedQuestion(updatedQuestion);
    }
  }, [questions, selectedQuestion]);

  const handleSetActivePage = (page) => {
    if (page === "questions" || page ==="userQuestionList") {
      console.log("Resetting selected tag");
      setSelectedTag(null);
      setFilteredQuestions(questions);
    }
    setSelectedQuestion(null);
    console.log("Setting active page to:", page);
    setActivePage(page);
    setActiveForm(null);
  };

  useEffect(() => {
    if (selectedTag) {
      console.log("selectedTag updated:", selectedTag);
    }
  }, [selectedTag, questions]);

  let displayedQuestions = selectedTag
    ? questions.filter((q) =>
        q.tags.map((t) => t._id).includes(selectedTag._id)
      )
    : filteredQuestions;

const handleRegisterPost = async (userData) => {
  const response = await registerUser(userData);
  return response && !authError; // Return true if registration was successful, false otherwise
};

  const handleLoginPost = async (credentials) => {
    const responseData = await loginUser(credentials);
    if (responseData) {
      console.log(
        "This is the data from useAuthApi: ",
        JSON.stringify(responseData, null, 2)
      );
      login(responseData);
      window.location.href = "/welcome";
    } else {
      // Handle unsuccessful login
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="fake-stack-overflow">
      <Header
        onSearch={handleSearch}
        questions={questions}
        tags={tags}
        answers={answers}
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
        onProfileClick={handleProfileClick}
      />

      <div className="main-content">
        <Sidebar
          activePage={activePage}
          setActivePage={handleSetActivePage}
          resetSelectedQuestion={() => setSelectedQuestion(null)}
        />

        {activeForm === "login" && <LoginForm onLogin={handleLoginPost} />}
        {activeForm === "register" && (
          <RegistrationForm onRegister={handleRegisterPost} />
        )}

        {!activeForm && (
          <>
            {activePage === "askQuestion" && (
              <AskQuestionForm
                onSubmit={addQuestion}
                setActivePage={setActivePage}
              />
            )}
            {activePage === "tags" && (
              <TagList
                tags={tags}
                questions={questions}
                setActivePage={setActivePage}
                setSelectedTag={setSelectedTag}
              />
            )}
            {activePage === "answerQuestion" && selectedQuestion && (
              <AnswerForm
                qid={selectedQuestion._id}
                onSubmit={handleAddAnswer}
                setActivePage={setActivePage}
              />
            )}
            {activePage === "detailedQuestion" && selectedQuestion && (
              <AnswerPage
                question={selectedQuestion}
                tags={tags}
                answers={selectedQuestion.answers}
                setActivePage={setActivePage}
                setSelectedTag={setSelectedTag}
              />
            )}
            {activePage === "profile" &&

                <UserProfile
                    setSelectedTag={setSelectedTag}
                    questions={displayedQuestions}
                    tags={tags}
                    setActivePage={setActivePage}
                    data={data}
                    answers ={answers}
                    deleteQuestionById = {deleteQuestionById}
                    deleteAnswerById = {deleteAnswerById}
                    updateAnswerTextById ={updateAnswerTextById}
                    updateQuestionTextById = {updateQuestionTextById}
                    deleteTagForUser = {deleteTagForUser}
                    updateTagNameById = {updateTagNameById}
                    onQuestionClick={(question) => {
                      setSelectedQuestion(question);
                      setActivePage("detailedQuestion");
                    }}
                />

            }



            {(activePage === "questions" ||
              activePage === "questionsByTag" ||
              activePage === "search") && (
              <QuestionList
                setSelectedTag={setSelectedTag}
                questions={displayedQuestions}
                tags={tags}
                setActivePage={setActivePage}
                incrementQuestionViews={incrementQuestionViews}
                onQuestionClick={(question) => {
                  setSelectedQuestion(question);
                  setActivePage("detailedQuestion");
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FakeStackOverflow;
