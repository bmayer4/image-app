import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { startGetPosts, startToggleLikePost, resetPosts } from '../../actions/posts';
import { clearFilters } from '../../actions/filters';
import PostItem from './PostItem';
import PostFilters from '../Filters/PostFilters';
import Spinner from '../Spinner/Spinner';;


class Explore extends Component {

componentDidMount() {
    const { filters } = this.props;
    this.props.startGetPosts(filters.category, 0, filters.limit, false); 
}

componentWillUnmount() {
  this.props.resetPosts();
  this.props.clearFilters();
}

onToggleLike = (id) => {
  this.props.startToggleLikePost(id);
}

loadMore = () => {
  const { filters, post } = this.props;
  this.props.startGetPosts(filters.category, post.posts.length, filters.limit, true);
}

  render() {
    let { auth, filters } = this.props;
    let { posts, loading } = this.props.post;
    let postContent;
    if (loading) {
        postContent = <Spinner />
    } else if (posts && posts.length) {
        postContent = posts.map((p, i) => <PostItem key={i} post={p} toggleLike={this.onToggleLike} auth={auth} />)
    } else {
        postContent = <h4 className='mt-5 ml-3'>No posts yet</h4>
    }

    let postsLength = this.props.post.posts.length;
    let button = (postsLength && postsLength !== this.props.post.count) && (postsLength && postsLength % filters.limit === 0) ?
                 <button className='btn btn-info mt-3' onClick={this.loadMore}>Load More</button> : null

    return (
            <div className='container mt-3'>
            <PostFilters getPosts={this.props.startGetPosts} />
            <div className='row'>
            { postContent }
            </div>
            { button }
            <div className='addMarginToTop'></div>
           </div>
    )
  }
}

Explore.propTypes = { 
    post: PropTypes.object.isRequired,
    startGetPosts: PropTypes.func.isRequired,
    startToggleLikePost: PropTypes.func.isRequired,
    clearFilters: PropTypes.func.isRequired,
    resetPosts: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired
  }
  
  const mapStateToProps = (state) => ({
    post: state.post,
    auth: state.auth,
    filters: state.filters
  })
  
  const mapDispatchToProps = (dispatch) => ({
    startGetPosts: (cat, skip, limit, loadMore) => dispatch(startGetPosts(cat, skip, limit, loadMore)),
    startToggleLikePost: (id) => dispatch(startToggleLikePost(id)),
    clearFilters: () => dispatch(clearFilters()),
    resetPosts: () => dispatch(resetPosts())
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(Explore);


  //TODO**
  //errors
  //fix likes reload