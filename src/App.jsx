import React, { useState } from 'react';
import './App.css';

function App() {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  const handleAddComment = () => {
    if (commentText.trim()) {
      setComments([
        ...comments,
        { id: Date.now(), text: commentText, replies: [] },
      ]);
      setCommentText('');
    }
  };

  const handleReply = (id, replyText) => {
    const addReply = (commentsList) =>
      commentsList.map((comment) => {
        if (comment.id === id) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              { id: Date.now(), text: replyText, replies: [] },
            ],
          };
        }
        if (comment.replies.length > 0) {
          return { ...comment, replies: addReply(comment.replies) };
        }
        return comment;
      });

    setComments(addReply(comments));
  };

  const handleDelete = (id) => {
    const deleteComment = (commentsList) =>
      commentsList
        .map((comment) => ({
          ...comment,
          replies: deleteComment(comment.replies),
        }))
        .filter((comment) => comment.id !== id);

    setComments(deleteComment(comments));
  };

  const handleEdit = (id, newText) => {
    const editComment = (commentsList) =>
      commentsList.map((comment) => {
        if (comment.id === id) {
          return { ...comment, text: newText };
        }
        if (comment.replies.length > 0) {
          return { ...comment, replies: editComment(comment.replies) };
        }
        return comment;
      });

    setComments(editComment(comments));
  };

  return (
    <div className="App">
      <h1>Comment Section</h1>
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add your comment..."
        rows="2"
      ></textarea>
      <button className="primary" onClick={handleAddComment}>
        Post
      </button>
      <CommentList
        comments={comments}
        onReply={handleReply}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}

function CommentList({ comments, onReply, onDelete, onEdit }) {
  return (
    <ul>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onReply={onReply}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

function Comment({ comment, onReply, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(comment.id, editText);
      setIsEditing(false);
    }
  };

  const handleAddReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
      setIsReplying(false);
    }
  };

  return (
    <li>
      <div>
        <div>
          {isEditing ? (
            <div>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows="2"
              />
              <button className="primary" onClick={handleSaveEdit}>
                Save
              </button>
              <button className="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <p className="comment-text">{comment.text}</p>
          )}
          <div className="comment-actions">
            <button className="link" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button className="link" onClick={() => onDelete(comment.id)}>
              Delete
            </button>
            <button className="link" onClick={() => setIsReplying(!isReplying)}>
              Reply
            </button>
          </div>
          {isReplying && (
            <div className="reply-container">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                rows="2"
              />
              <button className="primary" onClick={handleAddReply}>
                Post Reply
              </button>
              <button
                className="secondary"
                onClick={() => setIsReplying(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
      {comment.replies.length > 0 && (
        <ul className="comment-replies">
          <CommentList
            comments={comment.replies}
            onReply={onReply}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </ul>
      )}
    </li>
  );
}

export default App;
