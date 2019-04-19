import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { startGetPost, getPost, startUpdatePost } from '../../actions/posts';
import { clearErrors } from '../../actions/auth';
import categories from '../../utilities/categories';
import Spinner from '../Spinner/Spinner';


class EditPost extends Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {
      const id = this.props.match.params.id;
      const post = this.props.post.post._id === id ? this.props.post.post : null;
      // finding posts even tho they were cleared when explore unmounted..
      if (post) {
        this.props.getPost(post);
      } else {
        this.props.startGetPost(id);
      }
    }

    state = {  // if post found already below runs and componentDidUpdate is not ran (if block fails), otherwise state is set by componentDidUpdate
        description: this.props.post.post && this.props.post.post.description,
        category: this.props.post.post && this.props.post.post.category,
        imagePreview: this.props.post.post && this.props.post.post.imagePath,
        image: null,
        imagePath: this.props.post.post && this.props.post.post.imagePath
    }

    componentWillUnmount() {
      this.props.clearErrors();
    }

    componentDidUpdate(prevProps) {  //wouldn't do anything if post was the same before and going to this page
      if (prevProps.post.post !== this.props.post.post) {
        const post = (this.props.post.post);
        if (post) {
          const { description, category, imagePath } = post;
          this.setState({
            description, 
            category, 
            imagePreview: imagePath, 
            imagePath
          });
        }
      } 
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        let postData;
        if (typeof(this.state.image) === 'object') {
          postData = new FormData(); 
          postData.append('category', this.state.category);
          postData.append('description', this.state.description);
          postData.append('image', this.state.image);
        } else {
          postData = {
            category: this.state.category,
            description: this.state.description,
            imagePath: this.state.imagePath
        }
    }

        const { history } = this.props;
        const id = this.props.match.params.id;
        this.props.startUpdatePost(id, postData, history);
    }

  showFileUpload = () => {
    this.myRef.current.click();
  }

  onImageUpload = (e) => {
      const file = e.target.files[0];
      this.setState({
          image: file
      });
  
      const reader = new FileReader();  
     
      // called when its done loading the file
      reader.onload = () => {           
        this.setState({
          imagePreview: reader.result,
          imagePath: reader.result
        });
      };
  
      if (file) {
        reader.readAsDataURL(file); 
      } else {
        this.setState({
          image: null,
          imagePreview: '',
          imagePath: ''
      });
      }    
  }

  render() {

    const { description, imagePath, imagePreview } = this.state;
    const category = this.state.category && this.state.category.slice(0, 1).toUpperCase() + this.state.category.slice(1);
    const shouldDisable = !category || !description || !imagePath;

    const selectOptions = categories.map(c => (
        <option key={c} value={c}>
            {c}
        </option>
    ));

    if (this.props.post.loading) {
      return <Spinner />
    } 

    return (
     <div className="py-5 myForm">
        <div className="container">
          <div className="row">
            <div className="col-sm-8 col-md-6 mx-auto">
              <div className="display-4 text-center my-4">Edit Post</div>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                <label htmlFor="description">Description</label>
                <input type="text" id="description" className='form-control' autoFocus value={description || ''} name="description" onChange={this.onChange}/>
                </div>
                <div className="form-group">
                <label>Category</label>
                <select className='form-control' name='category' value={category} onChange={this.onChange}>
                    {selectOptions}
                </select>
                </div>

                <div className='form-group'>
                <button type='button' className='btn btn-secondary' onClick={this.showFileUpload}>Change Image</button>
                <input ref={this.myRef} className='myFile form-control-file' onChange={this.onImageUpload} type="file"/>
                </div>
                {
                    this.state.imagePreview ? (
                        <div className='imagePreview'>
                        <img className='img-fluid' src={imagePreview} alt='' />
                    </div>
                    ) : null
                }

                <input disabled={shouldDisable} type="submit" className="btn btn-info mt-4" />
              </form>
            </div>
          </div>
        </div>
        <div className='addMarginToTop'></div>
      </div>
    )
  }
}

EditPost.propTypes = {
  startGetPost: PropTypes.func.isRequired,
  getPost: PropTypes.func.isRequired,
  startUpdatePost: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
  post: state.post
});

const mapDispatchToProps = (dispatch) => ({
  startGetPost: (id) => dispatch(startGetPost(id)),
  getPost: (post) => dispatch(getPost(post)),
  startUpdatePost: (id, postData, history) => dispatch(startUpdatePost(id, postData, history)),
  clearErrors: () => dispatch(clearErrors())
});

export default connect(mapStateToProps, mapDispatchToProps)(EditPost);

