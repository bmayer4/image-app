import { GET_ERRORS, SET_AUTH, CLEAR_ERRORS } from './types';
import axios from 'axios';
import setAuthToken from '../utilities/setAuthToken'
import jwt_decode from 'jwt-decode';



/* thunks */
export const registerUser = (userData, history) => dispatch => {
    dispatch(clearErrors());
    axios.post('/api/users/register', userData).then(res => {
        history.push('/login');
    })
    .catch(err => dispatch(getErrors(err.response.data)));
};

export const loginUser = (userData) => dispatch => {
    dispatch(clearErrors());
    axios.post('/api/users/login', userData).then(res => {
        const { token } = res.data;
        localStorage.setItem('jwtToken', token);
        setAuthToken(token);
        const decodedToken = jwt_decode(token);
        dispatch(setAuth(decodedToken));
    })
    .catch(err => dispatch(getErrors(err.response.data)));
};

export const logoutUser = () => dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setAuth(null));
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