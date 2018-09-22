import React from 'react'

const CommentForm = ({ onSubmit, onCommentChange }) => {  //IF LOGGED IN PRESENT THIS 
  return (
    <div>
      <form onSubmit={onSubmit}>   
      <div className='form-group mt-4'>
      <input type='textarea' name='text' placeholder='Comment on image' className='form-control' onChange={ onCommentChange } />
      </div>
      <button type='submit' className='myCommentButton btn btn-info mb-2'>Add Comment</button>
      </form>
    </div>
  )
}

export default CommentForm;
