import React from 'react'
import Moment from 'react-moment';

const CommentItem = ({ comment, postId, auth, deleteComment }) => {
  return (
    <div className='myCard card mt-2'>
    <div className="mb-3 d-flex justify-content-between text-muted">
    <small>{comment.firstName} {comment.lastName.slice(0, 1)}</small>
    <small>{<Moment format="MM/DD/YYYY">{comment.date}</Moment>}</small>
    </div>

    <div className='lead d-flex justify-content-between'>
    <div> {comment.text}</div>
    {
       auth.isAuthenticated && comment.user === auth.user.id ? 
       <button className='btn btn-sm btn-danger' onClick={() => deleteComment(postId, comment._id)}>Delete</button>
        : null
    }
    </div>
    </div>
  )
}

export default CommentItem;
