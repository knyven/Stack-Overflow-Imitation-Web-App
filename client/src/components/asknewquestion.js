import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./authContext";

/**
 * A form component for users to ask questions.
 *
 * @param {Function} onSubmit - Function to handle submission of the form.
 * @param {Function} setActivePage - Function to set the active page view.
 */
function AskQuestionForm({ onSubmit, setActivePage }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  //const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { currentUser } = useAuth();



  useEffect(() => {
    console.log("This is the current userID: ", currentUser?.user?.id);
  }, [currentUser]); // Logs only when currentUser changes

  /**
   * Validates hyperlinks in the provided text.
   *
   * @param {string} text - The text to validate for hyperlinks.
   * @returns {boolean} True if all hyperlinks are valid, false otherwise.
   */
  const validateHyperlinks = (text) => {
    const hyperlinkPattern = /\[([^\]]+)]\((https?:\/\/[^)]+)\)/g;
    return !Array.from(text.matchAll(hyperlinkPattern)).some((match) => {
      const [, linkName, url] = match;
      return !linkName || !url || !url.startsWith("https://");
    });
  };

  /**
   * Handles the submission of the form.
   *
   * @param {Event} e - The submit event object.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title) {
      setError("Title cannot be empty");
      return;
    }

    if (title.length >= 100) {
      setError("Title cannot be more than 100 characters");
      return;
    }

    if (!text) {
      setError("Question text cannot be empty");
      return;
    }

    if (!validateHyperlinks(text)) {
      setError('Invalid hyperlink format. Ensure links start with "https://".');
      return;
    }

    const formattedTags = tags
      .split(/[\s,]+/)
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    if (formattedTags.length > 5) {
      setError("Cannot have more than 5 tags");
      return;
    }

    if (formattedTags.some((tag) => tag.length > 20)) {
      setError("New tag length cannot be more than 20");
      return;
    }

    console.log("Email "+ currentUser.user._id);

    onSubmit({
      title,
      text,
      tagNames: formattedTags,
      asked_by: currentUser.user.id,
      author_email: currentUser.user.email,
    });

    setActivePage("questions");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        id="formTitleInput"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Question Title"
      />
      <textarea
        id="formTextInput"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Question Description"
      />
      <input
        id="formTagInput"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma or space-separated)"
      />

      <button type="submit">Post Question</button>
      {error && <p>{error}</p>}
    </form>
  );
}

AskQuestionForm.propTypes = {
  question: PropTypes.object,
  answers: PropTypes.array,
  setActivePage: PropTypes.func.isRequired,
  setSelectedTag: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
};

export default AskQuestionForm;
