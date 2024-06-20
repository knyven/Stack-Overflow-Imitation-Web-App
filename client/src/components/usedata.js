import { useState, useEffect } from "react";
import axios from "axios";

const useData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const SERVER_URL = "http://localhost:8000";

  // Fetch Questions from the server
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}/questions`);

      //console.log("This if from the fetch quesitons: ", response);

      setData((prevData) => ({ ...prevData, questions: response.data }));
    } catch (err) {
      console.error("Error fetching questions:", err);

      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // fetch answers from the server
  const fetchAnswers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${SERVER_URL}/answers`);

      //console.log("This is from the fetch answers: ", response);

      setData((prevData) => ({ ...prevData, answers: response.data }));
    } catch (err) {
      console.error("Error fetching answers:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // fetch question by specific id
  const fetchQuestionById = async (id) => {
    try {
      const response = await axios.get(`${SERVER_URL}/questions/${id}`);
      console.log("Response data:", response.data);
      console.log("Answers:", response.data.answers);
      console.log("Accepted answer:", response.data.accepted_answer);
      return response.data;
    } catch (err) {
      console.error("Error fetching question by ID:", err);
      throw err;
    }
  };

  // Fetch Tags from the server
  const fetchTags = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/tags`);
      setData((prevData) => ({ ...prevData, tags: response.data }));
    } catch (err) {
      console.error("Error fetching tags:", err);
      setError(err);
    }
  };

  // Add a new question
  const addQuestion = async (question) => {
    try {
      await axios.post(`${SERVER_URL}/questions`, question, {
        withCredentials: true,
      });

      fetchQuestions();
      fetchTags();

    } catch (err) {
      console.error("Error adding a new question:", err);
    }
  };

  // Add a new answer
  const addAnswer = async (qid, answerDetails) => {
    try {
      const payload = {
        ...answerDetails,
        questionId: qid,
      };

      await axios.post(`${SERVER_URL}/answers`, payload, {
        withCredentials: true,
      });

      // Fetch the updated question
      const updatedQuestion = await fetchQuestionById(qid);

      // Update the questions array with the updated question
      setData((prevData) => {
        const updatedQuestions = prevData.questions.map((question) =>
          question._id === qid ? updatedQuestion : question
        );
        return { ...prevData, questions: updatedQuestions };
      });
    } catch (err) {
      console.error("Error adding a new answer:", err);
    }
  };

  // Add a new comment
  const addComment = async (parentId, commentDetails) => {
    try {
      const { userId, parentType, text } = commentDetails;

      const payload = {
        text,
        commented_by: userId,
        parent: {
          type: parentType,
          id: parentId
        }
      };

      console.log('Payload:', payload); // Log the payload

      const endpoint = `${SERVER_URL}/comments`;

      await axios.post(endpoint, payload, {
        withCredentials: true,
      });

      // Fetch the updated question
      const updatedQuestion = await fetchQuestionById(parentId);

      // Update the questions array with the updated question
      setData((prevData) => {
        const updatedQuestions = prevData.questions.map((question) =>
          question._id === parentId ? updatedQuestion : question
        );

        // If the comment is for an answer, update the answers array as well
        let updatedAnswers = prevData.answers;
        if (parentType === 'answer') {
          updatedAnswers = prevData.answers.map((answer) =>
            answer._id === parentId ? updatedQuestion.answers.find(a => a._id === parentId) : answer
          );
        }

        return { ...prevData, questions: updatedQuestions, answers: updatedAnswers };
      });
    } catch (err) {
      console.error("Error adding a new comment:", err);
    }
  };

  const incrementQuestionViews = async (questionId) => {
    try {
      // Make a request to increment the views
      await axios.patch(
        `${SERVER_URL}/questions/${questionId}/increment-views`
      );

      // Fetch the updated question data
      const updatedQuestion = await fetchQuestionById(questionId);

      // Update the questions array with the updated question
      setData((prevData) => {
        const updatedQuestions = prevData.questions.map((question) =>
          question._id === questionId ? updatedQuestion : question
        );
        return { ...prevData, questions: updatedQuestions };
      });
    } catch (err) {
      console.error("Error incrementing question views:", err);
    }
  };

  // fetch answers for a specific question by ID
  const fetchAnswersByQuestionId = async (id) => {
    try {
      const response = await axios.get(`${SERVER_URL}/questions/${id}/answers`);
      return response.data;
    } catch (err) {
      console.error("Error fetching answers by question ID:", err);
      throw err;
    }
  };

  // Function to handle upvoting a question
  const upvoteQuestion = async (questionId) => {
    try {
      await axios.post(`${SERVER_URL}/questions/${questionId}/upvote`, {
        withCredentials: true,
      });
      // optimistically update the UI
    } catch (err) {
      console.error("Error upvoting question:", err);
    }
  };

  // Function to handle downvoting a question
  const downvoteQuestion = async (questionId) => {
    try {
      await axios.post(`${SERVER_URL}/questions/${questionId}/downvote`, {
        withCredentials: true,
      });
      // optimistically update the UI
    } catch (err) {
      console.error("Error downvoting question:", err);
    }
  };

  // Function to handle upvoting an answer
  const upvoteAnswer = async (answerId) => {
    try {
      await axios.post(`${SERVER_URL}/answers/${answerId}/upvote`, {
        withCredentials: true,
      });

      // optimistically update the UI to reflect the new vote count
    } catch (err) {
      console.error("Error upvoting answer:", err);
    }
  };

  // Function to handle downvoting an answer
  const downvoteAnswer = async (answerId) => {
    try {
      await axios.post(`${SERVER_URL}/answers/${answerId}/downvote`, {
        withCredentials: true,
      });

      // optimistically update the UI here
    } catch (err) {
      console.error("Error downvoting answer:", err);
    }
  };

  const acceptAnswer = async (questionId, answerId) => {
    try {
      await axios.patch(
        `${SERVER_URL}/questions/${questionId}/accept-answer`,
        {
          answerId,
        },
        {
          withCredentials: true,
        }
      );

    } catch (err) {
      console.error("Error accepting answer:", err);
    }
  };


const upvoteComment = async (id) => {
  try {
    await axios.post(`${SERVER_URL}/comments/${id}/upvote`, {}, {
      withCredentials: true,
    });
    // Handle the response here
  } catch (err) {
    console.error("Error upvoting comment:", err);
  }
};

const downvoteComment = async (id) => {
  try {
    await axios.post(`${SERVER_URL}/comments/${id}/downvote`, {}, {
      withCredentials: true,
    });
    // Handle the response here
  } catch (err) {
    console.error("Error downvoting comment:", err);
  }
};
  const deleteQuestionById = async (question) => {
    try {
      const answerIdsToDelete = (question.answers || []).map((ans) => ans._id);
      const deletePromises = answerIdsToDelete.map((answerId) =>
          axios.delete(`${SERVER_URL}/answers/${answerId}`)
      );

      // Batch delete all answers
      await Promise.all(deletePromises);

      // Once all answers are deleted, delete the question
      const response = await axios.delete(`${SERVER_URL}/questions/${question._id}`);
      if (response.status === 200) {
        // Update the state directly
        setData((prevData) => {
          // Filter out the deleted question from questions array
          const updatedQuestions = prevData.questions.filter(q => q._id !== question._id);

          // Filter out the deleted answers from answers array
          const updatedAnswers = prevData.answers.filter(ans => !answerIdsToDelete.includes(ans._id));

          return { ...prevData, questions: updatedQuestions, answers: updatedAnswers };
        });
      } else {
        console.log(response.data); // Log response data for debugging
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      // Handle error states if needed
    }
  };



  // Inside the useData hook
  const deleteAnswerById = async (questionId, answerId) => {
    try {
      const response = await axios.delete(`${SERVER_URL}/answers/${answerId}`);
      if (response.status === 200) {
        console.log("Deleted Answer " + answerId);

        // Update the state without fetching answers again
        setData((prevData) => {
          const updatedData = { ...prevData };

          // Remove the answer from the answers array
          const updatedAnswers = (updatedData.answers || []).filter(
              (answer) => answer._id !== answerId
          );
          updatedData.answers = updatedAnswers;

          // Update the corresponding question's answers array
          if (updatedData.questions) {
            const updatedQuestions = updatedData.questions.map((question) => {
              if (question._id === questionId) {
                const updatedQuestion = { ...question };
                updatedQuestion.answers = updatedQuestion.answers.filter(
                    (ans) => ans._id !== answerId
                );
                return updatedQuestion;
              }
              return question;
            });
            updatedData.questions = updatedQuestions;
          }

          return updatedData;
        });
      } else {
        console.log(response.data); // Log response data for debugging
      }
    } catch (error) {
      console.error("Error deleting answer:", error);
      // Handle error states if needed
    }
  };
  const updateAnswerTextById = async (answerId, newText) => {
    try {
      const response = await axios.patch(
          `${SERVER_URL}/answers/${answerId}`,
          { newText: newText },
          {
            withCredentials: true,
          }
      );

      if (response.status === 200) {
        console.log(`Answer text updated for ID ${answerId}`);

        // Update the data state with the updated answer
        setData((prevData) => {
          const updatedData = { ...prevData };
          // Update the answer text in the existing data
          if (updatedData.answers) {
            updatedData.answers = updatedData.answers.map((answer) =>
                answer._id === answerId ? { ...answer, text: newText } : answer
            );
          }
          // Update the text in corresponding questions' answers array
          if (updatedData.questions) {
            const updatedQuestions = updatedData.questions.map((question) => {
              if (question.answers) {
                question.answers = question.answers.map((ans) =>
                    ans._id === answerId ? { ...ans, text: newText } : ans
                );
              }
              return question;
            });
            updatedData.questions = updatedQuestions;
          }
          return updatedData;
        });
      } else {
        console.log(`Error updating answer text for ID ${answerId}`);
      }
    } catch (error) {
      console.error("Error updating answer text:", error);
      throw error;
    }
  };
  const updateQuestionTextById = async (questionId, newText) => {
    try {
      const response = await axios.patch(
          `${SERVER_URL}/questions/${questionId}`,
          { text: newText },
          {
            withCredentials: true,
          }
      );

      if (response.status === 200) {
        console.log(`Question text updated for ID ${questionId}`);

        // Update the data state with the updated text
        setData((prevData) => {
          const updatedData = { ...prevData };

          // Update the text in the existing data
          if (updatedData.questions) {
            updatedData.questions = updatedData.questions.map((question) =>
                question._id === questionId ? { ...question, text: newText } : question
            );
          }

          return updatedData;
        });
      } else {
        console.log(`Error updating question text for ID ${questionId}`);
      }
    } catch (error) {
      console.error("Error updating question text:", error);
      throw error;
    }
  };
  const deleteTagForUser = async (tagId, userId) => {
    try {
      console.log("Payload  ",tagId,userId);
      const response = await axios.delete(`${SERVER_URL}/tags`, {
        data: { tagId, userId }, // Simplified object property shorthand
        withCredentials: true,
      });
      if (response.status === 200) {
        // Filter out the deleted tag from tags array
        setData((prevData) => {
          const updatedTags = prevData.tags.filter(tag => tag._id !== tagId);
          return { ...prevData, tags: updatedTags };
        });

        // Update questions that had the deleted tag
        setData((prevData) => {
          const updatedQuestions = prevData.questions.map((question) => {
            if (question.tags.includes(tagId)) {
              const updatedQuestion = { ...question };
              updatedQuestion.tags = updatedQuestion.tags.filter(tag => tag !== tagId);
              return updatedQuestion;
            }
            return question;
          });
          return { ...prevData, questions: updatedQuestions };
        });
      } else {
        console.log(response.data); // Log response data for debugging
      }
    } catch (error) {
      console.error("Error deleting tag for user:", error);
      // Handle error states if needed
    }
  };
  const updateTagNameById = async (tagId, userId, newTagName) => {
    try {
      const response = await axios.patch(`${SERVER_URL}/tags`, {
        tagId:tagId,
        newTagName: newTagName,
        userId: userId
      }, {
        withCredentials: true // Add this if needed for authentication
      });

      if (response.status === 200) {
        fetchQuestions();
        fetchTags();
        console.log('Tag name updated successfully.');
        // Handle success if needed
      } else {
        console.error('Failed to update tag name:', response.data);
        // Handle failure or error response
      }
    } catch (error) {
      console.error('Error updating tag name:', error);
      // Handle error states if needed
    }

  };



  // Fetch data
  useEffect(() => {
    fetchQuestions();
    fetchTags();
    fetchAnswers();
  }, []);

  return {
    data,
    loading,
    error,
    addQuestion,
    addAnswer,
    addComment, 
    fetchQuestionById,
    fetchAnswersByQuestionId,
    incrementQuestionViews,
    upvoteQuestion,
    downvoteQuestion,
    upvoteAnswer,
    downvoteAnswer,
    acceptAnswer,
    upvoteComment,
    downvoteComment,
    deleteQuestionById,
    deleteAnswerById,
    updateAnswerTextById,
    updateQuestionTextById,
    deleteTagForUser,
    updateTagNameById
  };
};

export default useData;
