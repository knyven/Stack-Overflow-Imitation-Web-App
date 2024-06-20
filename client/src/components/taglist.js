import React from "react";
import Tag from "./tag";
import PropTypes from "prop-types";
import { useAuth } from "./authContext";

/**
 * TagList component to display a list of tags and the count of questions associated with each tag.
 *
 * @param {Array} tags - The list of tags to be displayed.
 * @param {Array} questions - The list of questions for counting how many questions are associated with a tag.
 * @param {Function} setActivePage - Function to set the current active page/view.
 * @param {Function} setSelectedTag - Function to set the currently selected tag.
 * @returns {JSX.Element} The rendered list of tags.
 */
function TagList({ tags, questions, setActivePage, setSelectedTag }) {
  /**
   * Handles the click event on a tag.
   * Sets the clicked tag as the selected tag and changes the active page/view to 'questionsByTag'.
   *
   * @param {Object} tag - The clicked tag object.
   */

  const { currentUser } = useAuth();

  console.log("Tags:", tags);
  console.log("Questions:", questions);

  const handleClick = (tag) => {
    console.log("Selected tag in TagList:", tag);
    setSelectedTag(tag);
    setActivePage("questionsByTag");
  };

  return (
    <div className="tag-list">
      <div className="row">
        <h2>{tags.length} Tags</h2>
        {/* Show the button only if there is a currentUser */}
        {currentUser && (
          <button onClick={() => setActivePage("askQuestion")}>
            Ask a Question
          </button>
        )}
      </div>
      <h3>All Tags</h3>

      <div className="tags-grid">
        {tags.map((tag) => (
          <div className="tagNode" key={tag._id}>
            <Tag tag={tag} onClick={handleClick} />
            <p>
              {
                questions.filter((question) =>
                  question.tags.some((t) => t._id === tag._id)
                ).length
              }{" "}
              questions
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

TagList.propTypes = {
  tags: PropTypes.array.isRequired,
  questions: PropTypes.array.isRequired,
  setActivePage: PropTypes.func.isRequired,
  setSelectedTag: PropTypes.func.isRequired,
};

export default TagList;
