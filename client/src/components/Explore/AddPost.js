import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { startAddPost } from '../../actions/posts';
import { clearErrors } from '../../actions/auth';
import categories from '../../utilities/categories';
import Spinner from '../Spinner/Spinner';


class AddPost extends Component {

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
      }

    state = {
        descriptionError: '',
        description: '',
        category: '',
        imagePreview: '',
        image: null
    }

    componentWillUnmount() {
      this.props.clearErrors();
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = (e) => {
        e.preventDefault();

        const postData = new FormData(); 
        postData.append('category', this.state.category);
        postData.append('description', this.state.description);
        postData.append('image', this.state.image);

        this.props.startAddPost(postData, this.props.history);
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
       
        reader.onload = () => {           //called when its done loading the file
          this.setState({
            imagePreview: reader.result
        });
        };

        if (file) {
          reader.readAsDataURL(file); 
        } else {
          this.setState({
            imagePreview: ''
        });
        }    
    }  

  render() {
    
    const { loading } = this.props.post;
    const { category, description, descriptionError, image, imagePreview } = this.state;
    const shouldDisable = !category || !description || !image;

    let selectOptions = categories.map(c => (
        <option key={c} value={c}>
            {c}
        </option>
    ));

    if (loading) {
      return <Spinner />
    } 

    return (
     <div className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-sm-8 col-md-6 mx-auto">
              <div className="display-4 text-center">Add Post</div>
              <p className="lead text-muted text-center">Share your imagery</p>
              
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                <label htmlFor="description">Description</label>
                <input type="text" id="description" className={`form-control ${descriptionError && 'is-invalid'}`} autoFocus value={description} name="description" onChange={this.onChange}/>
                { descriptionError && <div className="invalid-feedback">{descriptionError}</div> }
                </div>
                <div className="form-group">
                <label>Category</label>
                <select className='form-control' name='category' value={category} onChange={this.onChange}>
                    {selectOptions}
                </select>
                </div>
                <div className='form-group'>
                <button type='button' className='btn btn-secondary' onClick={this.showFileUpload}>Add Image</button>
                <input ref={this.myRef} type="file" className='myFile form-control-file' onChange={this.onImageUpload} />
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

AddPost.propTypes = {
  startAddPost: PropTypes.func.isRequired,
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
  startAddPost: (postData, history) => dispatch(startAddPost(postData, history)),
  clearErrors: () => dispatch(clearErrors())
});

export default connect(mapStateToProps, mapDispatchToProps)(AddPost);



