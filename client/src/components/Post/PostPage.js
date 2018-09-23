import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { startGetPost, getPost, startAddComment, startDeleteComment } from '../../actions/posts';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import Moment from 'react-moment';

class PostPage extends Component {

  state = {
    text: ''
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    const post = this.props.post.posts.find(p => p._id === id);
    if (post) {
      this.props.getPost(post);
    } else {
      this.props.startGetPost(id);
    }
  }

  componentWillUnmount() {
    this.props.getPost({});
  }

  onChange = (e) => {
    const name = e.target.name;
    this.setState({
        [name]: e.target.value
    })
}

  componentWillReceiveProps(nextProps) {   //method being removed by react?
    if (!nextProps.post.post && !nextProps.post.loading) {
        this.props.history.push('/notfound');
    }
  }

    onSubmit = (e) => {
      e.preventDefault();

      const newComment = {
          text: this.state.text,
          firstName: this.props.auth.user.firstName,
          lastName: this.props.auth.user.lastName
      };

      this.props.startAddComment(this.props.match.params.id, newComment);
      this.setState({ text: '' });
  }

  onDeleteComment = (postId, id) => {
    this.props.startDeleteComment(postId, id);
}

  render() {

    const { post } = this.props.post;   //if we had to load post from db
    const { auth } = this.props;
    let postContent;
    let getComments;
    if (this.props.post.loading) {
      postContent = <div>Loading...</div>
    } else if (post && Object.keys(post).length > 0) {
      getComments = post.comments.map((c, i) => <CommentItem key={i} comment={c} auth={auth} postId={post._id} deleteComment={this.onDeleteComment}></CommentItem>);
      postContent = (
      <div className='container'>
      <div className='row'>

      <div className='col-md-2 '>
      <h2 className='py-1 mt-3'>{post.description}</h2>
      <div className='py-1'>By {post.user.firstName} {post.user.lastName}</div>
      <div className='py-1 mb-3'>Date: {<Moment format="MM/DD/YYYY">{post.date}</Moment>}</div>
      <div className='py-1'>{post.likes.length} Likes</div>
      </div>

      <div className='col-md-8 mx-auto'>
      <img className='myImage img-fluid rounded' src={post.imagePath} alt=''></img>
      { auth.isAuthenticated ? <CommentForm onCommentChange={this.onChange} onSubmit={this.onSubmit} /> : <div className='mt-5 mb-3 text-muted'>Please <Link to={'/login'} className='text-info'>Log in</Link> to comment</div>}
      { post.comments.length ? getComments : <div className='mt-4'>No Comments yet...</div> }
      </div>
  
      </div>
      <div className='addMarginToTop'></div>
      </div>
      )
    }


    return (
      <div className='py-5'>
      { postContent }
      </div>
    )
}
}

PostPage.propTypes = {
  startGetPost: PropTypes.func.isRequired,
  startAddComment: PropTypes.func.isRequired,
  startDeleteComment: PropTypes.func.isRequired,
  getPost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    errors: state.errors,
    post: state.post
  }
};

const mapDispatchToProps = (dispatch) => ({
  startGetPost: (id) => dispatch( startGetPost(id)),
  getPost: (post) => dispatch(getPost(post)),
  startAddComment: (postId, commentData) => dispatch(startAddComment(postId, commentData)),
  startDeleteComment: (postId, id) => dispatch(startDeleteComment(postId, id))
});

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);
