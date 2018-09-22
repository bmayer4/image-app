import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { registerUser } from '../../actions/auth';


class Join extends Component {

    state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
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
        const user = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password
        }
        this.props.registerUser(user, this.props.history);
    }

  render() {

    const { errors, email, password, firstName, lastName } = this.state;
    const shouldDisable = !email || !password || !firstName || !lastName;


    return (
     <div className="py-5 myForm">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Join</h1>
              <p className="lead text-muted text-center">Share photos and interact with users</p>
              <form noValidate onSubmit={this.onSubmit}>
              <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" className={`form-control ${errors.firstName && 'is-invalid'}`} autoFocus value={this.state.firstName} name="firstName" onChange={this.onChange}/>
              <div className="invalid-feedback">{errors.firstName}</div>
              </div>
              <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" className={`form-control ${errors.lastName && 'is-invalid'}`} value={this.state.lastName} name="lastName" onChange={this.onChange}/>
              <div className="invalid-feedback">{errors.lastName}</div>
              </div>              
                <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="text" id="email" className={`form-control ${errors.email && 'is-invalid'}`} value={this.state.email} name="email" onChange={this.onChange}/>
                <div className="invalid-feedback">{errors.email}</div>
                </div>
                <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" className={`form-control ${errors.password && 'is-invalid'}`} value={this.state.password} name="password" onChange={this.onChange}/>
                <div className="invalid-feedback">{ errors.password }</div>
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

Join.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

const mapDispatchToProps = (dispatch) => ({
    registerUser: (userData, history) => dispatch(registerUser(userData, history))
});

export default connect(mapStateToProps, mapDispatchToProps)(Join);

