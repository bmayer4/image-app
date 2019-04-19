import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loginUser } from '../../actions/auth';
import { clearErrors } from '../../actions/auth';
import { reduxForm, Field } from 'redux-form';
import { LOGINFIELDS } from '../Forms/AuthFields';
import { LoginField } from '../Forms/AuthField';
import { loginValidate } from '../Forms/validate';


class Login extends Component {


    componentWillUnmount() {
      this.props.clearErrors();
    }

    renderFields = () => 
    <div>
    {
        LOGINFIELDS.map(({name, label, type}) => {
            return <Field
            key={name}
            type={type}
            label={label}
            name={name}
            component={LoginField}
            />
        })
    }
    </div>

onSubmit = (values) => {  
  this.props.loginUser(values);
};

render() {

const { handleSubmit } = this.props

return (
 <div className="py-5">
    <div className="container">
      <div className="row">
        <div className="col-sm-8 col-md-6 m-auto m-auto">
          <h1 className="display-4 text-center">Login</h1>
          <p className="lead text-muted text-center">Share photos and interact with users</p>

          <form noValidate onSubmit={handleSubmit(this.onSubmit)}>
          {this.renderFields()}
          <input type="submit" className="btn btn-info mt-4" />
          </form>

        </div>
      </div>
    </div>
    <div className='addMarginToTop'></div>
  </div>
)
}

}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

const mapDispatchToProps = (dispatch) => ({
  loginUser: (userData) => dispatch(loginUser(userData)),
  clearErrors: () => dispatch(clearErrors())
});


Login = connect(mapStateToProps, mapDispatchToProps)(Login);

export default reduxForm({
  validate: loginValidate,
  form: 'loginForm',
})(Login);

