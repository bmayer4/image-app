import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { startGetUserPosts } from '../../actions/posts';
import { startGetUser } from '../../actions/user';
import PostItem from '../Explore/PostItem';
import Moment from 'react-moment';

class UserPage extends Component {

  componentDidMount() {
    const userId = this.props.match.params.id;
    this.props.startGetUserPosts(userId);
    this.props.startGetUser(userId);

  }

  componentWillReceiveProps(nextProps) {   //method being removed by react?
    if (!nextProps.post.userPosts && !nextProps.post.loading) {
        this.props.history.push('/notfound');
    }
  }

  render() {

    let pageContent;
    const { auth, post, user } = this.props;

    if (post.loading) {
      pageContent = 'Loading...';
    } else if (post.userPosts && post.userPosts.length) {
      pageContent = post.userPosts.map((p, i) => <PostItem key={i} post={p} auth={auth} />)
    } else if (post.userPosts && post.userPosts.length === 0) {
      pageContent = <div>This user has no posts...</div>
    }

    return (
      <div className='container mt-3'>
      {
        user.user && Object.keys(user.user).length ?
      <div className='py-3 text-center'>
      <h2> { user.user.firstName } { user.user.lastName}</h2>
      <div>Member since: { <Moment format="MM/DD/YYYY">{user.user.date}</Moment> }</div>
      <div>Images: { post.userPosts && post.userPosts.length }</div>
      </div>
      :
      null
      }
      <div className='text-center'>{ user.user.firstName ? <div>Photos by { user.user.firstName }</div> : null }</div>
      <div className='row'>
        { pageContent }
      </div>
      <div className='addMarginToTop'></div>
      </div>
    )
  }
}

UserPage.propTypes = {
  startGetUserPosts: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

const mapStateToProps = (state, props) => {
  return {
    auth: state.auth,
    errors: state.errors,
    post: state.post,
    user: state.user
  }
};

const mapDispatchToProps = (dispatch) => ({
  startGetUserPosts: (userId) => dispatch( startGetUserPosts(userId)),
  startGetUser: (userId) => dispatch(startGetUser(userId)),
  getUser: (userId) => dispatch(startGetUser(userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);

