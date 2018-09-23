import { GET_USER, CLEAR_USER } from '../actions/types';

const initialState = {
    user: {}
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USER:
            return {
                ...state,
                user: action.payload
            }
        case CLEAR_USER:
            return {
                ...initialState
            }
        default:
            return state;
    }
}

export default userReducer;