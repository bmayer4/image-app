import { ADD_POST, POST_LOADING, GET_POSTS, GET_POST, DELETE_POST, GET_USER_POSTS, RESET_POSTS, GET_MORE_POSTS, GET_MORE_USER_POSTS, ADD_LIKE_TO_POST } from '../actions/types';

const initialState = {
    posts: [],
    post:  {},
    count: null,
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
        case ADD_LIKE_TO_POST:
            let post = state.posts.find(p => p._id === action.payload.postId);
            const updatedLikes = post.likes.filter(l => l.user !== action.payload.userId);
            if (post.likes.length !== updatedLikes.length) {    //was liked, so unlike
                post.likes = updatedLikes;
            } else {
                post.likes.push({ _id: 1, user: action.payload.userId});
            }
        return {
            ...state,
            posts: [...state.posts, ...post]
        }
        case RESET_POSTS:
        return {
            ...state,
            posts: [],
            count: null
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
            count: action.payload.count,
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