import axios from 'axios';
import { ADD_POST, GET_ERRORS, CLEAR_ERRORS, GET_POSTS, GET_POST, DELETE_POST, POST_LOADING, GET_USER_POSTS, RESET_POSTS, GET_MORE_POSTS } from './types';

/* thunks */
export const startAddPost = (postData, history) => dispatch => {
    dispatch(clearErrors());
    axios.post('/api/posts', postData).then(res => {
        //dispatch(addPost(res.data));  //post we add from create isn't populating user info
        history.push('/explore');
    }).catch(err => {
        dispatch(getErrors(err.response.data)); 
    })
}

export const startGetPosts = (category = '', skip = 0, limit = 3) => dispatch => {
    if (skip === 0) { dispatch(setPostLoading()); }  //so we only load spinner on initial fetch
    axios.get(`/api/posts?category=${category}&skip=${skip}&limit=${limit}`).then(res => {
        dispatch(getPosts(res.data));
    }).catch(err => {
        dispatch(getPosts(null));   //no error if no posts
    })
}

export const startGetMorePosts = (category = '', skip = 0, limit = 3) => dispatch => {
    if (skip === 0) { dispatch(setPostLoading()); }  //so we only load spinner on initial fetch
    axios.get(`/api/posts?category=${category}&skip=${skip}&limit=${limit}`).then(res => {
        dispatch(getMorePosts(res.data));
    }).catch(err => {
        dispatch(getMorePosts(null));  
    })
}

export const startGetPost = (id) => dispatch => {
    dispatch(setPostLoading());
    axios.get(`/api/posts/${id}`).then(res => {
        dispatch(getPost(res.data));
    }).catch(err => {
        dispatch(getPost(null)); 
    })
}

export const startGetUserPosts = (userId) => dispatch => {
    dispatch(setPostLoading());
    axios.get(`/api/posts/user/${userId}`).then(res => {
        dispatch(getUserPosts(res.data));  //no posts from api wouldn't return error
    }).catch(err => {
        dispatch(getUserPosts(null));
    })
}

export const startDeletePost = (id) => dispatch => {
    dispatch(clearErrors());
    axios.delete(`/api/posts/${id}`).then(res => {
        dispatch(deletePost(id));
    }).catch(err => {
        dispatch(getErrors(err.response.data)); 
    })   
}

export const startUpdatePost = (id, history) => dispatch => {
    dispatch(clearErrors());
    axios.patch(`/api/posts/${id}`).then(res => {
        history.goBack();    //may want to go back to profile
    }).catch(err => {
        dispatch(getErrors(err.response.data)); 
    })   
}

export const startToggleLikePost = (id) => dispatch => {
    axios.post(`/api/posts/like/${id}`).then(res => {
        dispatch(startGetPosts());  //may want reducer for this
        console.log('liked');
    }).catch(err => {
       dispatch(getErrors(err.response.data)); 
    })
}

export const startAddComment = (postId, commentData) => dispatch => {
    dispatch(clearErrors());
    axios.post(`/api/posts/comment/${postId}`, commentData).then(res => {
        dispatch(getPost(res.data));   //? 
    }).catch(err => {
        dispatch(getErrors(err.response.data)); 
    })
}

export const startDeleteComment = (postId, commentId) => dispatch => {
    axios.delete(`/api/posts/comment/${postId}/${commentId}`).then(res => {
        dispatch(getPost(res.data));   //?
    }).catch(err => {
        dispatch(getErrors(err.response.data)); 
    })
}


/* action creators */
export const addPost = (post) => ({
    type: ADD_POST,
    payload: post
});

export const getPosts = (posts) => ({
    type: GET_POSTS,
    payload: posts
});

export const getMorePosts = (posts) => ({
    type: GET_MORE_POSTS,
    payload: posts
});

export const getPost = (post) => ({
    type: GET_POST,
    payload: post
});

export const resetPosts = () => ({
    type: RESET_POSTS
});

export const deletePost = (id) => ({
    type: DELETE_POST,
    payload: id
});

export const getUserPosts = (posts) =>({
    type: GET_USER_POSTS,
    payload: posts
})

export const setPostLoading = () => ({
    type: POST_LOADING
})

export const getErrors = (errors) => ({
    type: GET_ERRORS,
    payload: errors
});

export const clearErrors = (errors) => ({
    type: CLEAR_ERRORS
});