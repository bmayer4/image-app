const express = require('express');
const router = express.Router();  
const passport = require('passport');
const Post = require('../../models/Post');
const validatePostInput = require('../../validation/post');
const multer = require('multer');
const storage = require('../../middleware/multer-middleware');


// @route   GET api/posts/
// @desc    Get all posts
// @access  Public
router.get('/', (req, res) => {
    Post.find().sort({  date: -1 }).then(posts => res.json(posts))
    .catch(err => res.status(404).json());
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id).then(post => {
        if (!post) {
            return res.status(404).json({ postnotfound: 'No post found' });
        }
        res.json(post);
    })
    .catch(err => res.status(404).json({ posterror: 'Unable to retrieve post' }));
});

// @route   GET api/posts/user/:userid
// @desc    Get posts by user id
// @access  Public
router.get('/user/:userId', (req, res) => {
    Post.find({ user: req.params.userId }).populate('user').then((posts) => {
        if (!posts) {
            return res.status(404).json({ postsnotfound: 'No posts found' });
        }
        res.json(posts);
    })
    .catch(err => res.status(404).json({ postserror: 'Unable to retrieve posts' }));;
});


// @route   POST api/posts/
// @desc    Create posts
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), multer({storage: storage}).single('image'), (req, res) => {
    const { errors, isValid} = validatePostInput(req.body, req.file);

    if (!isValid) { 
        return res.status(400).json(errors) 
    }

    const { description, category } = req.body;
    const url = req.protocol + '://' + req.get('host');

    const newPost = new Post({
        description,
        category,
        user: req.user.id,
        imagePath: url + '/images/' + req.file.filename
    });

    newPost.save().then(post => res.json(post)).catch(e => res.json(e));
});


// @route   DELETE api/posts/:id
// @desc    Delete post by id
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findOneAndRemove({ user: req.user.id, _id: req.params.id}).then(post => {
        if (!post) {
            return res.status(404).json({ postnotfound: 'No post found' });
        }
        res.json(post);
    }).catch(err => res.status(404).json({ deletepost: 'Unable to delete post' }));
});

// @route   PATCH api/posts/:id
// @desc    Update post by id
// @access  Private
router.patch('/:id', passport.authenticate('jwt', { session: false }), multer({storage: storage}).single('image'), (req, res) => {
    const { errors, isValid} = validatePostInput(req.body, req.file);

    if (!isValid) { 
        return res.status(400).json(errors);
    }

    const { description, category } = req.body;
    let imagePath = req.body.imagePath;  
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    }
    Post.findOneAndUpdate({ user: req.user.id, _id: req.params.id}, { $set: { description, category, imagePath }}, { new: true }).then((post) => { 
        if (!post) {
            return res.status(404).json({ postnotfound: 'No post found' });
        }
        res.json(post) 
    }).catch(err => res.status(404).json({ updatepost: 'Unable to update post' }));
});

// @route   POST api/posts/like/:id
// @desc    Like post by post id
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

    Post.findById(req.params.id).then(post => {
        if (!post) {
            return res.status(404).json({ postnotfound: 'No post found' });
        }
            const updatedLikes = post.likes.filter(l => l.user != req.user.id);
            if (updatedLikes.length != post.likes.length) {
                //was liked, so unlike
                post.likes = updatedLikes;
                post.save().then(post => res.json(post))
                .catch(err => res.status(400).json({ likeerror: 'Unable to unlike post' }));
            } else {
                   //was never liked, so like
                   post.likes.unshift({ user: req.user.id });
                   post.save().then(post => res.json(post))
                   .catch(err => res.status(400).json({ likeerror: 'Unable to like post' }));
                   return;
            }
               
    }).catch(err => res.status(404).json({ postnotfound: 'Unable to retrieve post' }));
});

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid} = validatePostInput(req.body);

    if (!isValid) { 
        return res.status(400).json(errors) 
    }

    Post.findById(req.params.id).then(post => {
        if (!post) {
            return res.status(404).json({ postnotfound: 'No post found' });
        }

        const newComment = {
            text: req.body.text,
            user: req.user.id
        };

        post.comments.unshift(newComment);
        post.save().then(post => res.json(post));
    }).catch(err => res.status(404).json({ postnotfound: 'Error retreiving post' }));
});

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment from post
// @access  Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {

    Post.findById(req.params.id).then(post => {
        if (!post) {
            return res.status(404).json({ postnotfound: 'No post found' });
        }

        let comment = post.comments.filter(c => c.id == req.params.comment_id);

        if (comment.length < 1 ) {
            return res.status(400).json({ commentnotfound: 'Comment not found'});
        }

        if (comment[0].user != req.user.id) {
            return res.status(400).json();
        }
 
        let commentIndex = post.comments.indexOf(comment[0]);
        post.comments.splice(commentIndex, 1);
        post.save().then(post => res.json(post));
        
    }).catch(err => res.status(404).json({ postnotfound: 'Error retreiving post' }));
});

module.exports = router;