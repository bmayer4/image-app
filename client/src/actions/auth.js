import { GET_ERRORS, SET_AUTH, CLEAR_ERRORS } from './types';
import axios from 'axios';
import setAuthToken from '../utilities/setAuthToken'
import jwt_decode from 'jwt-decode';
import alertify from 'alertifyjs';


/* thunks */
export const registerUser = (userData) => dispatch => {
    dispatch(clearErrors());
    axios.post('/api/users/register', userData).then(res => {
        dispatch(loginUser({ email: userData.email, password: userData.password }));
    })
    .catch(err => {
        if (err.response.data && err.response.data.emailExists) { 
            dispatch(getErrors({ emailExists: err.response.data.emailExists }));
        } else { 
            dispatch(getErrors({ registerError: 'There was a problem registering' })); 
        }
    });
};

export const loginUser = (userData) => dispatch => {
    dispatch(clearErrors());
    axios.post('/api/users/login', userData).then(res => {
        const { token } = res.data;
        localStorage.setItem('jwtToken', token);
        setAuthToken(token);
        const decoded = jwt_decode(token);
        alertify.success(`Welcome ${decoded.firstName}!`);
        dispatch(setAuth(decoded));
    })
    .catch(err => dispatch(getErrors({ loginError: 'Invalid email or password' })));
};

export const logoutUser = () => dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setAuth(null));
    alertify.success('Successfully loggged out');
};


/* action creators */
export const getErrors = (errors) => ({
    type: GET_ERRORS,
    payload: errors
});

export const clearErrors = () => ({
    type: CLEAR_ERRORS
});

export const setAuth = (status) => ({
    type: SET_AUTH,
    payload: status
});