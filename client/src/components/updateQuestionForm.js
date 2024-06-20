import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const UpdateQuestionForm = ({ question, setActivePage, updateQuestionTextById }) => {
    const [text, setText] = useState("");
    const [error, setError] = useState("");

    // Set initial state from the question data, if available
    useEffect(() => {
        if (question) {
            setText(question.text || "");
        }
    }, [question]);

    // Validate hyperlinks in the provided text
    const validateHyperlinks = (text) => {
        const hyperlinkPattern = /\[([^\]]+)]\((https?:\/\/[^)]+)\)/g;
        return !Array.from(text.matchAll(hyperlinkPattern)).some((match) => {
            const [, linkName, url] = match;
            return !linkName || !url || !url.startsWith("https://");
        });
    };

    // Handle the submission of the form
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!text) {
            setError("Question text cannot be empty");
            return;
        }

        if (!validateHyperlinks(text)) {
            setError('Invalid hyperlink format. Ensure links start with "https://".');
            return;
        }

         updateQuestionTextById(question._id, text);


        // Optionally reset the form field or navigate to another page
        // setText("");
        setActivePage("userQuestionList");
    };

    return (
        <form onSubmit={handleSubmit}>
      <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Question Description"
      />

            <button type="submit">Update Question Text</button>
            {error && <p>{error}</p>}
        </form>
    );
};

UpdateQuestionForm.propTypes = {
    question: PropTypes.object.isRequired,
    setActivePage: PropTypes.func.isRequired,
    updateQuestionTextById: PropTypes.func.isRequired,
};

export default UpdateQuestionForm;
