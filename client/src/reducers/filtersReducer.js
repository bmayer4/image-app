import { SORT_BY_CATEGORY, SET_LIMIT, CLEAR_FILTERS } from '../actions/types';

const initialState = {
    category: '',
    limit: 3
}

const filtersReducer = (state = initialState, action) => {
    switch (action.type) {
        case SORT_BY_CATEGORY:
            return {
                ...state,
                category: action.payload
            }
        case SET_LIMIT:
            return {
                ...state,
                limit: action.payload
            }
        case CLEAR_FILTERS:
            return {
                ...initialState
            }
        default:
            return state;
    }
}

export default filtersReducer;