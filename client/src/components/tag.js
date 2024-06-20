import React from "react";
import PropTypes from "prop-types";

/**
 * Tag component to display a tag and handle its click event.
 *
 * @param {Object} tag - The tag object with a name property to display.
 * @param {Function} [onClick] - Optional callback function to be called when the tag is clicked.
 * @returns {JSX.Element|null} The rendered tag element or null if the tag prop is not defined.
 */
function Tag({ tag, onClick }) {
  if (!tag) {
    console.warn("Tag component received an undefined or null tag prop.");
    return null;
  }

  /**
   * Handles the click event on the tag.
   * Stops the event propagation and calls the provided onClick function if it's a function.
   *
   * @param {Event} event - The triggered click event.
   */
  const handleClick = (event) => {
    event.stopPropagation();
    console.log("Tag clicked:", tag);

    if (typeof onClick === "function") {
      onClick(tag, event);
    }
  };

  return (
    <span className="tag" onClick={handleClick}>
      {tag.name}
    </span>
  );
}

Tag.propTypes = {
  tag: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Tag;
