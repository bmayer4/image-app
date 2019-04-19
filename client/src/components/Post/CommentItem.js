import React from 'react'
import Moment from 'react-moment';

const CommentItem = ({ comment, postId, auth, deleteComment }) => {
  return (
    <div className='commentCard card mt-1'>
    <div className="mb-2 d-flex justify-content-between text-muted">
    <small className="text-info">{comment.firstName} {comment.lastName.slice(0, 1)}</small>
    <small>{<Moment format="MM/DD/YYYY">{comment.date}</Moment>}</small>
    </div>

    <div className='d-flex justify-content-between'>
    <div className="commentText">{comment.text}</div>
    {
       auth.isAuthenticated && comment.user === auth.user.id ? 
       <button className='btn btn-sm btn-light' onClick={() => deleteComment(postId, comment._id)}>Delete</button>
        : null
    }
    </div>
    </div>
  )
}

export default CommentItem;
