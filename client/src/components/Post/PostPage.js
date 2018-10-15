import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { startGetPost, getPost, startAddComment, startDeleteComment, startDeletePost } from '../../actions/posts';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import Moment from 'react-moment';
import Spinner from '../Spinner/Spinner';
import RemovePostModal from '../Modal/RemovePostModal';

class PostPage extends Component {

  state = {
    text: '',
    modalOpen: false
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    const post = this.props.post.posts.find(p => p._id === id);
    //finding posts even tho they were cleared when explore unmounted..
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

  componentDidUpdate(prevProps) {
    if (this.props.post.post === null) {
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

  handleModalOpen = () => {
    this.setState({
      modalOpen: true
    })
  }

  onRemovePost = () => {
    this.props.startDeletePost(this.props.post.post._id, this.props.history);
  }

  handleModalClose = () => {
    this.setState({
      modalOpen: false
    })
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
      postContent = <Spinner />
    } else if (post && Object.keys(post).length > 0) {
      getComments = post.comments.map((c, i) => <CommentItem key={i} comment={c} auth={auth} postId={post._id} deleteComment={this.onDeleteComment}></CommentItem>);
      postContent = (
      <div className='container'>
      <div className='row'>
      
      <div className='col-md-2 '>
      <h2 className='py-1 mt-3'>{post.description}</h2>
      <div className='py-1'>By {post.user.firstName} {post.user.lastName}</div>
      <div className='py-1'>Date: {<Moment format="MM/DD/YYYY">{post.date}</Moment>}</div>
      <div className='py-1'>{post.likes.length} Likes</div>
      {
        auth.isAuthenticated && auth.user.id === post.user._id?
      <div>
      <Link to={`/post/edit/${post._id}`}><button className='btn btn-info btn-sm mt-3 my-2'>Edit Post</button></Link>
      <button className='btn btn-secondary btn-sm' onClick={this.handleModalOpen}>Delete Post</button>
      </div>  : null
      }
      </div>

      <div className='col-md-8 mx-auto'>
      <img className='myImage img-fluid rounded' src={post.imagePath} alt=''></img>
      { auth.isAuthenticated ? <CommentForm onCommentChange={this.onChange} onSubmit={this.onSubmit} text={this.state.text} /> : <div className='mt-5 mb-3 text-muted'>Please <Link to={'/login'} className='text-info'>Log in</Link> to comment</div>}
      { post.comments.length ? getComments : <div className='mt-4'>No Comments yet...</div> }
      </div>

      </div>
      <div className='addMarginToTop'></div>
      </div>
      )
    }


    return (
      <div className='py-5' id="myModal">
      { postContent }

      <RemovePostModal modalOpen={this.state.modalOpen} closeModal={this.handleModalClose} removePost={this.onRemovePost}/>
      </div>
    )
}
}

PostPage.propTypes = {
  startGetPost: PropTypes.func.isRequired,
  startAddComment: PropTypes.func.isRequired,
  startDeleteComment: PropTypes.func.isRequired,
  startDeletePost: PropTypes.func.isRequired,
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
  startDeleteComment: (postId, id) => dispatch(startDeleteComment(postId, id)),
  startDeletePost: (id, history) => dispatch(startDeletePost(id, history))
});

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);


