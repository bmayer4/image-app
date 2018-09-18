import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { startGetPosts } from '../../actions/posts';
import PostItem from './PostItem';

class Explore extends Component {

componentDidMount() {
    this.props.startGetPosts();
}

  render() {

    let { posts, loading } = this.props.post;
    let postContent;
    if (loading) {
        postContent = '...'
    } else if (posts && posts.length) {

        postContent = posts.map((p, i) => <PostItem key={i} post={p} />)
    } else {
        postContent = <h1>No posts yet</h1>
    }

    return (
      <div>
        <div className='container'>
            <div className="row">
                { postContent }
            </div>
        </div>
      </div>
    )
  }
}

Explore.propTypes = {
    post: PropTypes.object.isRequired,
    startGetPosts: PropTypes.func.isRequired
  }
  
  const mapStateToProps = (state) => ({
    post: state.post
  })
  
  const mapDispatchToProps = (dispatch) => ({
    startGetPosts: (posts) => dispatch(startGetPosts(posts))
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(Explore);
