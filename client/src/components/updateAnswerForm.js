import React, { useState } from "react";
import PropTypes from "prop-types";
//import { useAuth } from "./authContext"; // Ensure correct path

const UpdateAnswerForm = ({  answer,setActivePage, updateAnswerTextById }) =>{
    const [text, setText] = useState(""); // Answer text state
    const [textError, setTextError] = useState(""); // Error message for the answer text

    // const { currentUser } = useAuth(); // Get the current user

    // Extract the selected answer details from location state


    // Set the initial text value from the selected answer, if available
    useState(() => {
        if (answer && answer.text) {
            setText(answer.text);
        }
    }, [answer]);

    // Validate hyperlinks in the provided text
    const validateHyperlinks = (text) => {
        // Regular expression pattern for hyperlinks
        const hyperlinkPattern = /\[([^\]]+)]\((https?:\/\/[^)]+)\)/g;

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

        // Submit the updated answer text
        updateAnswerTextById(answer._id, text); // Pass answer ID and updated text

        // Reset the text state after submission if needed
        setText("");

        setActivePage("userAnswers");
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

            <button type="submit">Update Answer</button>
        </form>
    );
}

UpdateAnswerForm.propTypes = {

    setActivePage: PropTypes.func.isRequired,
    answer: PropTypes.object.isRequired,
    updateAnswerTextById:PropTypes.func.isRequired

};

export default UpdateAnswerForm;
