import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { startGetPosts, startToggleLikePost, resetPosts, addLikeToPost, clearErrors } from '../../actions/posts';
import { clearFilters } from '../../actions/filters';
import PostItem from './PostItem';
import PostFilters from '../Filters/PostFilters';
import Spinner from '../Spinner/Spinner';
import alertify from 'alertifyjs';


class Explore extends Component {

componentDidMount() {
    this.props.startGetPosts(); 
}

componentDidUpdate(prevProps) {
  if (this.props.errors.getPostsError) {
    alertify.error('Error retrieving posts');
    this.props.history.push('/notfound');
  }
}

componentWillUnmount() {
  this.props.resetPosts();
  this.props.clearErrors();
}

onToggleLike = (id) => {
  const userId = this.props.auth.user.id;
  this.props.startToggleLikePost(id, userId);
}

loadMore = () => {
  const { filters, post } = this.props;
  this.props.startGetPosts(filters.category, post.posts.length, filters.limit, true);
}

  render() {
    let { auth, filters, post: { posts, loading, count } } = this.props;
    //let { posts, loading, count } = post;
    let postContent;
    if (loading) {
        postContent = <Spinner />
    } else if (posts && posts.length) {
        postContent = posts.map((p, i) => <PostItem key={i} post={p} toggleLike={this.onToggleLike} auth={auth} />)
    } else {
        postContent = <h4 className='mt-5 ml-3'>No posts yet</h4>
    }

    let postsLength = posts && posts.length;
    let button = (postsLength && postsLength !== count) && (postsLength && postsLength % filters.limit === 0) ?
                 <button className='btn btn-info mt-3' onClick={this.loadMore}>Load More</button> : null

    return (
            <div className='container mt-3'>
            <PostFilters getPosts={this.props.startGetPosts} />
            <div className="my-3">Total images: { this.props.post.count }</div>
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
    addLikeToPost: PropTypes.func.isRequired,
    clearFilters: PropTypes.func.isRequired,
    resetPosts: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired
  }
  
  const mapStateToProps = (state) => ({
    post: state.post,
    auth: state.auth,
    errors: state.errors,
    filters: state.filters
  })
  
  const mapDispatchToProps = (dispatch) => ({
    startGetPosts: (cat, skip, limit, loadMore) => dispatch(startGetPosts(cat, skip, limit, loadMore)),
    startToggleLikePost: (id, userId) => dispatch(startToggleLikePost(id, userId)),
    addLikeToPost: (id) => dispatch(addLikeToPost(id)),
    clearFilters: () => dispatch(clearFilters()),
    resetPosts: () => dispatch(resetPosts()),
    clearErrors: () => dispatch(clearErrors())
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(Explore);