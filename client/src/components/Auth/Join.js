import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { registerUser } from '../../actions/auth';
import { clearErrors } from '../../actions/auth';
import { reduxForm, Field } from 'redux-form';
import { JOINFIELDS } from '../Forms/AuthFields';
import { JoinField } from '../Forms/AuthField';
import { joinValidate } from '../Forms/validate';

class Join extends Component {

  componentWillUnmount() {
    this.props.clearErrors();
  }

  renderFields = () => 
        <div>
        {
            JOINFIELDS.map(({name, label, type}) => {
                return <Field
                key={name}
                type={type}
                label={label}
                name={name}
                err={this.props.errors.emailExists}
                component={JoinField}
                />
            })
        }
        </div>

  displayError = () => {
    const { errors: { registerError } } = this.props;
    if (registerError) {
      return <div className="text-center registerError">{ registerError }</div>
    }
  }

onSubmit = (values) => {  // will only submit if valid validation
  this.props.registerUser(values);
};

  render() {

    return (
     <div className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-sm-8 col-md-6 m-auto">
              <h1 className="display-4 text-center">Join</h1>
              <p className="lead text-muted text-center">Share photos and interact with users</p>
              { this.displayError() }

              <form noValidate onSubmit={this.props.handleSubmit(this.onSubmit)}>
              { this.renderFields() }
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

Join.propTypes = {
  registerUser: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

const mapDispatchToProps = (dispatch) => ({
    registerUser: (userData, history) => dispatch(registerUser(userData, history)),
    clearErrors: () => dispatch(clearErrors())
});

Join = connect(mapStateToProps, mapDispatchToProps)(Join);

export default reduxForm({
  validate: joinValidate,
  form: 'joinForm',
})(Join);


