import React from 'react'
import { Link } from 'react-router-dom';

const postItem = ({ post, toggleLike, auth }) => {

  const isLiked = (likes) => {
    if (auth.isAuthenticated) {
    return likes.filter(l => l.user === auth.user.id)
    } else {
      return [];
    }
  }

  return (
    <div className="col-sm-6 col-md-4 col-xl-3 pt-4">
    <div className='card py-1'>
    <Link to={`/user/${post.user._id}`}><div className='item-user pl-2 pb-1'><small>{ post.user.firstName } { post.user.lastName.slice(0, 1) + '.' }</small></div></Link>
    <div className='img-container'>
    <Link to={`/posts/${post._id}`}><img className='card-img-top img-fluid mb-1' src={post.imagePath} alt='' /></Link>
      <div className='d-flex justify-content-between'>
         <div className='py-1 px-2 d-flex align-items-center' onClick={auth.isAuthenticated ? () => {toggleLike(post._id)} : null}>{ isLiked(post.likes).length ? <i className='fa fa-heart text-info pr-1'></i> : <i className='far fa-heart text-muted pr-1'></i>}<small>{ post.likes.length}</small></div>
         <Link to={`/posts/${post._id}`}><div className='py-1 px-2 d-flex align-items-center'><i className="far text-muted fa-comment-alt pr-1"></i><small>{ post.comments.length}</small></div></Link>
      </div> 
    </div>
        <div className='p-2'>{post.description}</div>
    </div>
    </div>
  )
}
//  <div className='py-1 px-2' onClick={auth.isAuthenticated ? () => {toggleLike(post._id)} : null}><i className={`fa fa-heart ${isLiked(post.likes).length && 'text-info'}`}></i> { post.likes.length}</div>
export default postItem;
