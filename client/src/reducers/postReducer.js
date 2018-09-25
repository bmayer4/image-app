import { ADD_POST, POST_LOADING, GET_POSTS, GET_POST, DELETE_POST, GET_USER_POSTS, RESET_POSTS, GET_MORE_POSTS, GET_MORE_USER_POSTS } from '../actions/types';

const initialState = {
    posts: [],
    post:  {},
    count: null,
    userPostCount: null,
    categories: ['', 'Sports', 'Outdoors', 'Cooking', 'Fashion', 'Holidays', 'Travel', 'Entertainment', 'Friends', 'Selfie', 'Love', 'Animals', 'Business', 'Home'],
    loading: false 
}

const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_POST:
            return {
                ...state,
                posts: [action.payload, ...state.posts]
            }
        case GET_POSTS:
        return {
            ...state,
            posts: action.payload.posts,
            count: action.payload.count,
            loading: false
        }
        case GET_MORE_POSTS:
        return {
            ...state,
            posts: [...state.posts, ...action.payload.posts]
        }
        case RESET_POSTS:
        return {
            ...state,
            posts: []
        }
        case GET_POST: 
            return {
                ...state,
                post: action.payload,
                loading: false
            }
        case GET_USER_POSTS: 
        return {
            ...state,
            posts: action.payload.posts,
            userPostCount: action.payload.count,
            loading: false
        }
        case GET_MORE_USER_POSTS: 
        return {
            ...state,
            posts: [...state.posts, ...action.payload.posts]
        }
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(p => p._id !== action.payload)
            }
        case POST_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}

export default postReducer;