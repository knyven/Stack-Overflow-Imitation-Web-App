// CommentForm.js
import React, { useState } from 'react'; // Import useContext
import PropTypes from 'prop-types';
import { useAuth } from "./authContext.js";

function CommentForm({ parentId, parentType, questionId, addComment, closeForm }) {
  const [commentText, setCommentText] = useState('');
  const { currentUser } = useAuth();
  console.log(currentUser.user.id);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (commentText.trim() === "") return;
    await addComment(parentId, { text: commentText, parentType, questionId, userId: currentUser.user.id }); 
    setCommentText('');
    closeForm(); 
  };

  return (
    <form onSubmit={handleAddComment}>
      <input
        type="text"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add a comment"
      />
      <button type="submit">Submit</button>
    </form>
  );
}

CommentForm.propTypes = {
  parentId: PropTypes.string.isRequired,
  parentType: PropTypes.string.isRequired,
  questionId: PropTypes.string.isRequired,
  addComment: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired, // Add this line
};

export default CommentForm;