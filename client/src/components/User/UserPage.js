import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { startGetUserPosts, resetPosts, startToggleLikePost } from '../../actions/posts';
import { startGetUser, clearUser } from '../../actions/user';
import { clearErrors } from '../../actions/posts';
import PostItem from '../Explore/PostItem';
import Moment from 'react-moment';
import Spinner from '../Spinner/Spinner';

class UserPage extends Component {

  componentDidMount() {
    const userId = this.props.match.params.id;
    const { filters } = this.props;
    this.props.startGetUserPosts(userId, 0, filters.limit, false);
    this.props.startGetUser(userId);
  }

  componentWillUnmount() {
    this.props.clearUser(); 
    this.props.resetPosts();
    this.props.clearErrors();
  }

  componentDidUpdate(prevProps) {
      if (this.props.errors.usererror || this.props.post.posts === null) {
        this.props.history.push('/notfound');
       } 
  }

  loadMore = () => {
    const userId = this.props.match.params.id;
    const { filters, post } = this.props;
    this.props.startGetUserPosts(userId, post.posts.length, filters.limit, true);
  }

  onToggleLike = (id) => {
    const userId = this.props.auth.user.id;
    this.props.startToggleLikePost(id, userId);
  }

  render() {
    let pageContent;
    const { auth, post, user, filters } = this.props;

    if (post.loading) {
      pageContent = <Spinner />
    } else if (post.posts && post.posts.length) {
      pageContent = post.posts.map((p, i) => <PostItem key={i} post={p} auth={auth} toggleLike={this.onToggleLike} />)
    } else if (post.posts && post.posts.length === 0) {
      pageContent = <div>This user has no posts...</div>
    }

    let postsLength = post.posts && post.posts.length;
    let button = (postsLength && postsLength !== post.userPostCount) && (postsLength && postsLength % filters.limit === 0) ?
                 <button className='btn btn-info mt-3' onClick={this.loadMore}>Load More</button> : null

    return (
      <div className='container mt-3'>
      {
        user.user && Object.keys(user.user).length ?
      <div className='py-3 text-center'>
      <h2> { user.user.firstName } { user.user.lastName}</h2>
      <div>Member since: { <Moment format="MM/DD/YYYY">{user.user.date}</Moment> }</div>
      <div>Images: { post.userPostCount }</div>
      </div>
      :
      null
      }
      <div className='text-center'>{ user.user.firstName ? <div>Photos by { user.user.firstName }</div> : null }</div>
      <div className='row'>
        { pageContent }
      </div>
        { button }
      <div className='addMarginToTop'></div>
      </div>
    )
  }
}

UserPage.propTypes = {
  startGetUserPosts: PropTypes.func.isRequired,
  clearUser: PropTypes.func.isRequired,
  resetPosts: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  startToggleLikePost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    errors: state.errors,
    post: state.post,
    user: state.user,
    filters: state.filters
  }
};

const mapDispatchToProps = (dispatch) => ({
  startGetUserPosts: (userId, skip, limit, loadMore) => dispatch(startGetUserPosts(userId, skip, limit, loadMore)),
  startGetUser: (userId) => dispatch(startGetUser(userId)),
  startToggleLikePost: (id, userId) => dispatch(startToggleLikePost(id, userId)),
  clearUser: () => dispatch(clearUser()),
  clearErrors: () => dispatch(clearErrors()),
  resetPosts: () => dispatch(resetPosts())
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);

