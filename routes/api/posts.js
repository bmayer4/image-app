const express = require('express');
const router = express.Router();  
const passport = require('passport');
const Post = require('../../models/Post');
const validatePostInput = require('../../validation/post');
const validateCommentInput = require('../../validation/comment');
const multer = require('multer');
const storage = require('../../middleware/multer-middleware');


// @route   GET api/posts/?queryParams (optional)
// @desc    Get all posts
// @access  Public
router.get('/', (req, res) => {
    let fetchedPosts;
    let skip = +req.query.skip;
    let limit = +req.query.limit;
    let category = req.query.category;  //TODO, find count by categiry if category
    let postQuery = category ? Post.find({ category: category.toLowerCase() }) : Post.find();
    if (skip !== null && limit !== null) {  //0 limit is equivalent to no limit per mongo docs
        postQuery.skip(skip).limit(limit);
    }
    postQuery.sort({ date: -1 }).populate('user',  ['firstName', 'lastName']).then(posts => {
        fetchedPosts = posts;
        return Post.countDocuments();  //countDocuments returns a promise
        }).then(count => {
            res.json({
                posts: fetchedPosts,
                count
            })
        }).catch(err => res.status(404).json({ postserror: 'Unable to retrieve posts' }));
});

// @route   GET api/posts/:id
// @desc    Get individual post by id
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id).populate('user', ['firstName', 'lastName', 'date']).then(post => {
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
    let fetchedPosts;
    let skip = +req.query.skip;
    let limit = +req.query.limit;
    let postQuery = Post.find({ user: req.params.userId });
    if (skip !== null && limit !== null) {  //0 limit is equivalent to no limit per mongo docs
        postQuery.skip(skip).limit(limit);
    }
    postQuery.populate('user', ['firstName', 'lastName', 'date']).then((posts) => {
        fetchedPosts = posts;
        return Post.countDocuments({ user: req.params.userId }) 
        }).then(count => {
            res.json({
                posts: fetchedPosts,
                count
            })
        }).catch(err => res.status(404).json());
});

// @route   POST api/posts/
// @desc    Create posts
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), multer({storage: storage}).single('image'), (req, res) => {
    const { errors, isValid} = validatePostInput(req.body);
    console.log(req.file.filename);
    if (!isValid) { 
        if (!req.file) { 
            errors.image = 'Image required';
            return res.status(400).json(errors); 
        }
        return res.status(400).json(errors) 
    }

    if (!req.file) { 
        errors.image = 'Image required';
        return res.status(400).json(errors); 
    }

    const { description, category } = req.body;
    //console.log('rq is', req.protocol);  //http
    const url = req.protocol + 's' + '://' + req.get('host');

    const newPost = new Post({
        description,
        category: category.toLowerCase(),
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

    //Not using the image validation on client because you can't submit button without image
    // if (!req.body.imagePath  || !req.file) {
    //     errors.image = 'Image required'; 
    //     return res.status(400).json(errors);
    // }

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
        console.log(post);
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
                .catch(err => res.status(400).json({ unlikeerror: 'Unable to unlike post' }));
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
    const { errors, isValid} = validateCommentInput(req.body);

    if (!isValid) { 
        return res.status(400).json(errors) 
    }

    Post.findById(req.params.id).populate('user').then(post => {
        if (!post) {
            return res.status(404).json({ postnotfound: 'No post found' });
        }

        const newComment = {
            text: req.body.text,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
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

    Post.findById(req.params.id).populate('user').then(post => {
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