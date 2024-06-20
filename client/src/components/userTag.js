import {useEffect, useState} from "react";
import {useAuth} from "./authContext";
import PropTypes from "prop-types";

const UserTag = ({ tags, questions, deleteTagForUser,updateTagNameById }) => {
    const { currentUser } = useAuth();
    const [filteredTags, setFilteredTags] = useState([]);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [updatedTagName, setUpdatedTagName] = useState("");
    const [selectedTagId, setSelectedTagId] = useState("");

    useEffect(() => {
        const filteredQuestions = questions.filter((question) => {
            return question.author_email === currentUser.user.email;
        });

        const userTagIds = filteredQuestions.reduce((acc, question) => {
            question.tags.forEach((tag) => {
                if (!acc.includes(tag._id)) {
                    acc.push(tag._id);
                }
            });
            return acc;
        }, []);

        const userTags = tags.filter((tag) => userTagIds.includes(tag._id));

        setFilteredTags(userTags);
    }, [questions, tags, currentUser]);
    const handleDelete = (tagId) => {
        deleteTagForUser(tagId,currentUser.user.id);
        setFilteredTags((prevTags) => prevTags.filter((tag) => tag._id !== tagId));
    };


    const openUpdateDialog = (tagId, tagName) => {
        setSelectedTagId(tagId);
        setUpdatedTagName(tagName);
        setShowUpdateDialog(true);
    };

    const handleUpdate = () => {
        if (updatedTagName.trim() !== "") {
            updateTagNameById(selectedTagId, currentUser.user.id,updatedTagName);
            setFilteredTags((prevTags) =>
                prevTags.map((tag) =>
                    tag._id === selectedTagId ? { ...tag, name: updatedTagName } : tag
                )
            );
            setShowUpdateDialog(false);
            setShowUpdateDialog(false);
        }
    };

    return (
        <div className="tags-grid">
            {filteredTags.map((tag) => (
                <div className="tagNode" key={tag._id}>
                    <h2>{tag.name}</h2>
                    <div className="tagButtons">
                        <button onClick={() => handleDelete(tag._id)}>Delete</button>
                        <button onClick={() => openUpdateDialog(tag._id,tag.name)}>Update</button>
                    </div>
                </div>
            ))}

            {showUpdateDialog && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Update Tag</h2>
                        <input
                            type="text"
                            value={updatedTagName}
                            onChange={(e) => setUpdatedTagName(e.target.value)}
                        />
                        <button onClick={handleUpdate}>Update</button>
                        <button onClick={() => setShowUpdateDialog(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

UserTag.propTypes = {
    tags: PropTypes.array.isRequired,
    questions: PropTypes.array.isRequired,
    deleteTagForUser:PropTypes.func.isRequired,
    updateTagNameById:PropTypes.func.isRequired
};

export default UserTag;
