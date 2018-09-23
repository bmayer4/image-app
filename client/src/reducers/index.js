import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import postReducer from './postReducer';
import userReducer from './userReducer';
import filtersReducer from './filtersReducer';

export default combineReducers({
    auth: authReducer,
    errors: errorReducer,
    post: postReducer,
    user: userReducer,
    filters: filtersReducer
});