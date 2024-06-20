import React from "react";
import PropTypes from "prop-types";

/**
 * Sidebar component for navigation between Tags and Questions pages.
 *
 * @param {string} activePage - The current active page ('tags' or 'questions').
 * @param {Function} setActivePage - Function to set the active page.
 * @param {Function} resetSelectedQuestion - Function to reset the currently selected question.
 * @returns {JSX.Element} The rendered sidebar navigation.
 */
function Sidebar({ activePage, setActivePage, resetSelectedQuestion }) {
  return (
    <div id="sideBarNav">
      <button
        className={activePage === "tags" ? "active" : ""}
        onClick={() => {
          setActivePage("tags");
          resetSelectedQuestion();
        }}
      >
        Tags
      </button>
      <button
        className={activePage === "questions" ? "active" : ""}
        onClick={() => {
          setActivePage("questions");
          resetSelectedQuestion();
        }}
      >
        Questions
      </button>
    </div>
  );
}

Sidebar.propTypes = {
  activePage: PropTypes.string,
  setActivePage: PropTypes.func,
  resetSelectedQuestion: PropTypes.func.isRequired,
};

export default Sidebar;
