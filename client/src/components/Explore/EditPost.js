import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { startUpdatePost } from '../../actions/posts';


class EditPost extends Component {

    state = {
        description: '',
        category: '',
        image: {},
        errors: {}
    }

    // componentWillReceiveProps(nextProps) {
    //   if (nextProps.auth.isAuthenticated) {
    //     this.props.history.push('/dashboard');
    //   }

    //   if (nextProps.errors) {
    //     this.setState({
    //       errors: nextProps.errors
    //     })
    //   }
    // }

    // componentDidMount() {
    //   if (this.props.auth.isAuthenticated) {
    //     this.props.history.push('/dashboard');
    //   }
    // }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        const postData = {
            category: this.state.category,
            description: this.state.description,
            image: this.state.image
        }

        this.props.startUpdatePost(postData, this.props.history);
    }

  render() {

    const { errors, post } = this.props;
    const { category, description, image } = this.state;
    const shouldDisable = !category || !description || !image;

    const selectOptions = post.categories.map(c => (
        <option key={c} value={c}>
            {c}
        </option>
    ));

    return (
     <div className="py-5 myForm">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Add Post</h1>
              <p className="lead text-muted text-center">Share your imagery</p>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                <label htmlFor="description">Description</label>
                <input type="text" id="description" className={`form-control ${errors.description && 'is-invalid'}`} autoFocus value={this.state.description} name="description" onChange={this.onChange}/>
                <div className="invalid-feedback">{errors.description}</div>
                </div>
                <div className="form-group">
                <label htmlFor="password">Category</label>
                <select className='form-control' name='category' value={this.state.category} onChange={this.onChange}>
                    {selectOptions}
                </select>
                </div>
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
  startUpdatePost: PropTypes.func.isRequired,
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
  startUpdatePost: (postData, history) => dispatch(startUpdatePost(postData, history))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditPost);

