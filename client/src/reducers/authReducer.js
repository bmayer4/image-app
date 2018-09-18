import { SET_AUTH } from '../actions/types';

const initialState = {
    isAuthenticated: false,
    user: null
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTH:
            return {
                ...state,
                isAuthenticated: !!action.payload,
                user: action.payload
            };
        default: 
            return state
    }
};

export default authReducer;