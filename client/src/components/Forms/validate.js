import { JOINFIELDS } from './AuthFields';
import { LOGINFIELDS } from './AuthFields';

export const joinValidate = (values) => {

    const errors = {};
  
    JOINFIELDS.forEach(({name, label}) => {
        if (!values[name]) {
            errors[name] = `${label} required`;
        }
    });

    if (!values.password) {
        errors.password = 'Password required';
    } else if (values.password.length < 4 || values.password.length > 12) {
        errors.password = 'Password must be between 4 and 12 characters';
    } else if (values.password != values.confirmPassword) {
        errors.confirmPassword = 'Passwords must match';
    }

    if (!values.confirmPassword) {  //  so match error doesn't override required
      errors.confirmPassword = 'Confirm Password required';
    }
  
    if (!values.email) {
      errors.email = 'Email required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email';
    }
  
    return errors
  };


  export const loginValidate = (values) => {

    const errors = {};
  
    LOGINFIELDS.forEach(({name, label}) => {
        if (!values[name]) {
            errors[name] = `${label} required`;
        }
    });
  
    return errors
  };
