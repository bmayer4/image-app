import React from 'react'

const postItem = ({ post }) => {
  return (
    <div className="col-sm-6 col-md-4 col-xl-3 pt-4">
    <div className='card py-2'>

    <div className='img-container'>
    <img className='card-img-top img-fluid' src={post.imagePath} alt='' />
      <div className='card-icons'>
        <div><button className='btn btn-primary'><i className="fa fa-user"></i></button></div>
        <div><button className='btn btn-primary'><i className="fa fa-heart"></i></button></div>
        <div><button className='btn btn-primary'><i className="fa fa-comment-alt"></i></button></div>
      </div> 
    </div>
        <div className='text-center py-2'>{post.description}</div>
    </div>
    </div>
  )
}

export default postItem;
