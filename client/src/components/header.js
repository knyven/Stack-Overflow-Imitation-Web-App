import React, { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./authContext";

/**
 * Header component containing the site title and search functionality.
 *
 * @param {Function} onSearch - Callback function to be called with search results.
 * @param {Array} questions - List of all available questions.
 * @param {Array} tags - List of all available tags.
 * @param {Array} answers - List of all available answers.
 * @returns {JSX.Element} The rendered header with a search bar.
 */
function Header({
  onSearch,
  questions,
  tags,
  answers,
  onLoginClick,
  onRegisterClick,
  onProfileClick
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [logoutMessage, setLogoutMessage] = useState(""); // New state for logout message
  const auth = useAuth();

  // Early return in case the context is not available
  if (!auth) {
    return null;
  }

  // Now that we've checked that auth is valid, we can destructure it safely
  const { currentUser, logout } = auth;

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

   const handleLogout = () => {
    logout();
    setLogoutMessage("You have been logged out."); 
  };


  /**
   * Handles the search functionality when user presses 'Enter'.
   *
   * @param {Event} e - The triggered keyboard event.
   */
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const currentSearchTerm = e.target.value;
      const tagMatches = currentSearchTerm.match(/\[([^\]]+)\]/g) || [];
      const tagsToSearch = tagMatches.map((tag) =>
        tag.slice(1, -1).toLowerCase()
      );
      const words = currentSearchTerm
        .replace(/\[([^\]]+)\]/g, "")
        .split(/\s+/)
        .map((word) => word.toLowerCase());

      // Prioritize word matches over tags
      let wordMatchedQuestions = questions.filter((question) => {
        const titleWords = question.title.toLowerCase().split(/\s+/);
        const textWords = question.text
          ? question.text.toLowerCase().split(/\s+/)
          : [];

        return words.some(
          (word) => titleWords.includes(word) || textWords.includes(word)
        );
      });

      // If we have results from word matches
      if (wordMatchedQuestions.length > 0) {
        onSearch(wordMatchedQuestions);
        return;
      }

      // Otherwise use tag search logic
      const searchResults = questions.filter((question) => {
        const questionTags = question.tags
          ? question.tags.map((tagId) => {
              const actualId = tagId._id; // Extract the actual ID
              const tag = tags.find((tag) => tag._id === actualId.toString());
              return tag ? tag.name : null;
            })
          : [];

        const doesTagMatch = tagsToSearch.some((tag) =>
          questionTags.includes(tag)
        );

        const questionAnswers = question.answers
          ? question.answers.map((ansId) => {
              const answer = answers.find((answer) => answer._id === ansId);
              return answer ? answer.text.toLowerCase() : null;
            })
          : [];

        const doesWordMatchInAnswers = questionAnswers.some((answerText) =>
          answerText && words.some((word) => answerText.includes(word))
        );

        return doesTagMatch || doesWordMatchInAnswers;
      });

      onSearch(searchResults);
    }
  };

  return (
    <div className="header">
      <h1>Fake Stack Overflow</h1>
      <input
        id="searchBar"
        type="text"
        placeholder="Search ..."
        className="search-bar"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyUp={handleSearch}
      />

      {currentUser ? (
        <>
          <span>
            Welcome, {currentUser.user.username}! (Reputation:{" "}
            {currentUser.user.reputation})
          </span>
          <button onClick={onProfileClick}>Profile</button>

          <button onClick={handleLogout}>Logout</button>
           {logoutMessage && <p className="logout-message">{logoutMessage}</p>}
        </>
      ) : (
        <>
          <button onClick={onLoginClick}>Login</button>
          <button onClick={onRegisterClick}>Register</button>
        </>
      )}
    </div>
  );
}

Header.propTypes = {
  onSearch: PropTypes.func.isRequired,
  questions: PropTypes.array,
  tags: PropTypes.array,
  answers: PropTypes.array,
  onLoginClick: PropTypes.func.isRequired,
  onRegisterClick: PropTypes.func.isRequired,
  onProfileClick: PropTypes.func.isRequired
};

export default Header;


