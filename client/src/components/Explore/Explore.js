import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { startGetPosts, startToggleLikePost } from '../../actions/posts';
import PostItem from './PostItem';

class Explore extends Component {

componentDidMount() {
    this.props.startGetPosts(); 
}

onToggleLike = (id) => {
  this.props.startToggleLikePost(id);
}

  render() {
    let { auth } = this.props;
    let { posts, loading } = this.props.post;
    let postContent;
    if (loading) {
        postContent = '...'
    } else if (posts && posts.length) {
        postContent = posts.map((p, i) => <PostItem key={i} post={p} toggleLike={this.onToggleLike} auth={auth} />)
    } else {
        postContent = <h1>No posts yet</h1>
    }

    return (
            <div className='container mt-3'>
            <div className='row'>
            { postContent }
            </div>
            <div className='addMarginToTop'></div>
      </div>
    )
  }
}

Explore.propTypes = {
    post: PropTypes.object.isRequired,
    startGetPosts: PropTypes.func.isRequired,
    startToggleLikePost: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  }
  
  const mapStateToProps = (state) => ({
    post: state.post,
    auth: state.auth
  })
  
  const mapDispatchToProps = (dispatch) => ({
    startGetPosts: (posts) => dispatch(startGetPosts(posts)),
    startToggleLikePost: (id) => dispatch(startToggleLikePost(id))
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(Explore);
