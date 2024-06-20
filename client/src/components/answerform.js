import React, { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./authContext"; // Ensure correct path

/**
 * A form component for users to answer questions.
 *
 * @param {string} qid - The question ID for which the answer is being posted.
 * @param {Function} onSubmit - Function to handle submission of the form.
 * @param {Function} setActivePage - Function to set the active page view.
 */
function AnswerForm({ qid, onSubmit, setActivePage }) {
  const [text, setText] = useState(""); // Answer text state
  const [textError, setTextError] = useState(""); // Error message for the answer text

  const hyperlinkPattern = /\[([^\]]+)]\((https?:\/\/[^)]+)\)/g; // Regular expression pattern for hyperlinks

  const { currentUser } = useAuth(); // Get the current user

  // Validate hyperlinks in the provided text
  const validateHyperlinks = (text) => {
    let match;
    while ((match = hyperlinkPattern.exec(text)) !== null) {
      const linkName = match[1];
      const url = match[2];
      if (!linkName || !url || !url.startsWith("https://")) {
        return false;
      }
    }
    return true;
  };

  // Handle the submission of the form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateHyperlinks(text)) {
      setTextError("Invalid hyperlink");
      return;
    }

    // Validation for text
    if (!text) {
      setTextError("Answer text cannot be empty");
      return;
    } else {
      setTextError("");
    }

    // Submit the form
    onSubmit(qid, {
      text,
      ans_by: currentUser.user.id, // Use username from currentUser
    });
    console.log("This is the answer detais  from answerForm.js: ", qid, text, currentUser);
    setActivePage("detailedQuestion");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        id="answerTextInput"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Your Answer"
      />
      {textError && <p>{textError}</p>}

      <button type="submit">Post Answer</button>
    </form>
  );
}

AnswerForm.propTypes = {
  qid: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  setActivePage: PropTypes.func.isRequired,
};

export default AnswerForm;
