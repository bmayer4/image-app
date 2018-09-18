import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loginUser } from '../../actions/auth';


class Login extends Component {

    state = {
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
            email: this.state.email,
            password: this.state.password
        }
        console.log('submitted');
        this.props.loginUser(user);
    }

  render() {

    const { errors, email, password } = this.state;
    const shouldDisable = !email || !password;

    return (
     <div className="py-5 myForm">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-muted text-center">Share photos and interact with users</p>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="text" id="email" className={`form-control ${errors.email && 'is-invalid'}`} autoFocus value={this.state.email} name="email" onChange={this.onChange}/>
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
      </div>
    )
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

const mapDispatchToProps = (dispatch) => ({
  loginUser: (userData) => dispatch(loginUser(userData))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);

