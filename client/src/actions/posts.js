import axios from 'axios';
import { ADD_POST, GET_ERRORS, CLEAR_ERRORS, GET_POSTS, GET_POST, DELETE_POST, POST_LOADING, GET_USER_POSTS, RESET_POSTS, GET_MORE_POSTS, GET_MORE_USER_POSTS, ADD_LIKE_TO_POST } from './types';
import alertify from 'alertifyjs';

/* thunks */
export const startAddPost = (postData, history) => dispatch => {
    dispatch(clearErrors());
    dispatch(setPostLoading());
    axios.post('/api/posts', postData).then(res => { 
        history.push('/explore');
    }).catch(err => {
        dispatch(getErrors({ addPostError: 'Server error' })); 
    });
}

export const startGetPosts = (category = '', skip = 0, limit = 3, loadMore = false) => dispatch => {
    if (skip === 0) { dispatch(setPostLoading()); }  //only load spinner on initial fetch
    axios.get(`/api/posts?category=${category}&skip=${skip}&limit=${limit}`).then(res => {
        if (loadMore) {
         dispatch(getMorePosts(res.data)); 
        } else {
         dispatch(getPosts(res.data));
        }
    }).catch(err => {
        dispatch(getErrors({ getPostsError: 'Server error' }));   
    });
}

export const startGetPost = (id) => dispatch => {
    dispatch(setPostLoading());
    axios.get(`/api/posts/${id}`).then(res => {
        dispatch(getPost(res.data));
    }).catch(err => {
        dispatch(getErrors({ getPostError: 'Server error' }));    
    });
}

export const startGetUserPosts = (userId, skip = 0, limit = 3, loadMore = false) => dispatch => {
    if (skip === 0) { dispatch(setPostLoading()); }
    axios.get(`/api/posts/user/${userId}?skip=${skip}&limit=${limit}`).then(res => {
        if (loadMore) {
            dispatch(getMoreUserPosts(res.data));  
        } else {
            dispatch(getUserPosts(res.data));  
        }
    }).catch(err => {
        dispatch(getErrors({ getUserPostsError: 'Server error' }));
    });
}

export const startDeletePost = (id, history) => dispatch => {
    dispatch(clearErrors());
    axios.delete(`/api/posts/${id}`).then(res => {
        dispatch(deletePost(id));
        history.push('/explore');
    }).catch(err => {
        dispatch(getErrors({ deleteError: 'Server error' }));  
    });   
}

export const startUpdatePost = (id, postData, history) => dispatch => {
    dispatch(setPostLoading());
    axios.patch(`/api/posts/${id}`, postData).then(res => {
        history.push(`/posts/${id}`);    
    }).catch(err => {
        dispatch(getErrors({ editPostError: 'Server error' }));
    });   
}

export const startToggleLikePost = (id, userId) => dispatch => {
    axios.post(`/api/posts/like/${id}`).then(res => {
        dispatch(addLikeToPost({ postId: id, userId: userId }));  
    }).catch(err => {
        alertify.error('Server error');
    });
}

export const startAddComment = (postId, commentData) => dispatch => {
    dispatch(clearErrors());
    axios.post(`/api/posts/comment/${postId}`, commentData).then(res => {
        dispatch(getPost(res.data)); 
    }).catch(err => {
        dispatch(getErrors({ addCommentError: 'Server error' })); 
    });
}

export const startDeleteComment = (postId, commentId) => dispatch => {
    axios.delete(`/api/posts/comment/${postId}/${commentId}`).then(res => {
        dispatch(getPost(res.data)); 
    }).catch(err => {
        dispatch(getErrors({ deleteCommentError: 'Server error' }));
    });
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

export const getUserPosts = (posts) => ({
    type: GET_USER_POSTS,
    payload: posts
})

export const getMoreUserPosts = (posts) => ({
    type: GET_MORE_USER_POSTS,
    payload: posts
})

export const addLikeToPost = (likeData) => ({
    type: ADD_LIKE_TO_POST,
    payload: likeData
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