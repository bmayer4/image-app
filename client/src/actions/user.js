import axios from 'axios';
import { GET_USER, GET_ERRORS, CLEAR_ERRORS, CLEAR_USER } from './types';


/* thunks */
export const startGetUser = (userId) => dispatch => {
    dispatch(clearErrors());
    axios.get(`/api/users/${userId}`).then(res => {
        dispatch(getUser(res.data));
    })
    .catch(err => dispatch(getErrors(err.response.data)));
}

/* action creators */
export const getUser = (user) => ({
    type: GET_USER,
    payload: user
});

export const clearUser = () => ({
    type: CLEAR_USER
})

export const getErrors = (errors) => ({
    type: GET_ERRORS,
    payload: errors
});

export const clearErrors = (errors) => ({
    type: CLEAR_ERRORS
});