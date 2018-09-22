import React from 'react'
import { Link } from 'react-router-dom';

const postItem = ({ post, toggleLike, auth }) => {

  const isLiked = (likes) => {
    if (auth && auth.user) {
    return likes.filter(l => l.user === auth.user.id)
    } else {
      return [];
    }
  }

  return (
    <div className="col-sm-6 col-md-4 col-xl-3 pt-4">
    <div className='card py-2'>
    <Link to={`/user/${post.user._id}`}><div className='item-user pl-2'><small>{ post.user.firstName } { post.user.lastName.slice(0, 1) + '.' }</small></div></Link>
    <div className='img-container'>
    <Link to={`/posts/${post._id}`}><img className='card-img-top img-fluid mb-1' src={post.imagePath} alt='' /></Link>
      <div className='d-flex justify-content-between'>
        <div className='p-3' onClick={() => {toggleLike(post._id)}}><i className={`fa fa-heart fa-lg ${isLiked(post.likes).length && 'text-info'}`}></i> 16</div>
        <Link to={`/posts/${post._id}`}><div className='p-3'><i className="fa fa-comment-alt fa-lg"></i> 4</div></Link>
      </div> 
    </div>
        <div className='pt-2 pl-1'>{post.description}</div>
    </div>
    </div>
  )
}

export default postItem;
