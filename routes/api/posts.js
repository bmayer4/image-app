const express = require('express');
const router = express.Router();  
const passport = require('passport');
const Post = require('../../models/Post');
const keys = require('../../config/keys');
const multer = require('multer');
var cloudinary = require('cloudinary');
  

cloudinary.config({ 
    cloud_name: keys.cloudName, 
    api_key: keys.API_Key, 
    api_secret: keys.API_Secret
});
  
// @route   GET api/posts/?queryParams (optional)
// @desc    Get all posts
// @access  Public
router.get('/', (req, res) => {
    let fetchedPosts;
    let skip = +req.query.skip;
    let limit = +req.query.limit;
    let category = req.query.category; 
    let postQuery = category ? Post.find({ category: category.toLowerCase() }) : Post.find();
    if (skip !== null && limit !== null) {  // 0 limit is equivalent to no limit per mongo docs
        postQuery.skip(skip).limit(limit);
    }
    postQuery.sort({ date: -1 }).populate('user',  ['firstName', 'lastName']).then(posts => {
        fetchedPosts = posts;
        const count = category ? Post.countDocuments({ category: category.toLowerCase() }) : Post.countDocuments()
        return count  //countDocuments returns a promise
        }).then(count => {
            res.json({
                posts: fetchedPosts,
                count
            });
        }).catch(err => res.status(400).json(err));
});

// @route   GET api/posts/:id
// @desc    Get individual post by id
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id).populate('user', ['firstName', 'lastName', 'date']).then(post => {
        if (!post) {
            return res.status(404).json();
        }
        res.json(post);
    })
    .catch(err => res.status(404).json(err));
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
        }).catch(err => res.status(400).json());
});

// @route   POST api/posts/
// @desc    Create posts
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), multer({ dest: 'uploads/' }).single('image'), (req, res) => {
    if (!req.file) { 
        return res.status(400).json({ imageError: 'Image required' }); 
    }

    const { description, category } = req.body;

    cloudinary.v2.uploader.upload(req.file.path,
        {
          height: 800,
          crop: "scale",
          quality: "auto"
        }, function (error, result) {
            if (error) {
                return res.status(400).json(error);
            }
 
        const newPost = new Post({
            description,
            category: category && category.toLowerCase(),
            user: req.user.id,
            imagePath: result.url,
            publicId: result.public_id
        }).save().then(post => res.json(post)).catch(err => res.status(400).json(err));
        }).catch(err => res.status(400).json(err));
});


// @route   DELETE api/posts/:id
// @desc    Delete post by id
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

    Post.findOneAndRemove({ user: req.user.id, _id: req.params.id}).then(post => {
        if (!post) {
            return res.status(404).json();
        }

        cloudinary.v2.uploader.destroy(post.publicId, function(error ,result) {
            if (error) {
                return res.status(400).json(error);
            } 

            return res.json(post);
        });

    }).catch(err => res.status(400).json());
});

// @route   PATCH api/posts/:id
// @desc    Update post by id
// @access  Private
router.patch('/:id', passport.authenticate('jwt', { session: false }), multer({ dest: 'uploads/' }).single('image'), (req, res) => {

    const { description } = req.body;
    const category = req.body.category && req.body.category.toLowerCase();
    let imagePath = req.body.imagePath;
    let publicId;

        Post.findOne({ user: req.user.id, _id: req.params.id}).then(post => {
            if (!post) {
                return res.status(404).json();
            }

            if (req.file) {
            cloudinary.v2.uploader.destroy(post.publicId, function(error ,result) {
                if (error) {
                    return res.status(400).json(error);
                }
            });

            cloudinary.v2.uploader.upload(req.file.path,
                {
                  height: 800,
                  crop: "scale",
                  quality: "auto"
                }, function (error, result) {
                    if (error) {
                        return res.status(400).json(error);
                    }

                    imagePath = result.url;
                    publicId =  result.public_id;

                    post.update({ description, category, imagePath, publicId }, { runValidators: true }).then((post) => {
                        return res.json(post);
                    }).catch(err => res.status(400).json(err));
                });
            } else {
                post.update({ description, category, imagePath }, { runValidators: true }).then((post) => {
                    return res.json(post);
                }).catch(err => res.status(400).json(err));
            }
        }).catch(err => res.status(400).json());
});

// @route   POST api/posts/like/:id
// @desc    Toggle like on post by post id
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

    Post.findById(req.params.id).then(post => {
        if (!post) {
            return res.status(404).json();
        }
            const updatedLikes = post.likes.filter(l => l.user != req.user.id);
            if (updatedLikes.length != post.likes.length) {
                // was liked, so unlike
                post.likes = updatedLikes;
                post.save().then(post => res.json(post))
                .catch(err => res.status(400).json());
            } else {
                // was not liked, so like
                post.likes.unshift({ user: req.user.id });
                post.save().then(post => res.json(post)).catch(err => res.status(400).json());
                return;
            }
               
    }).catch(err => res.status(400).json());
});

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findById(req.params.id).populate('user').then(post => {
        if (!post) {
            return res.status(404).json();
        }

        const newComment = {
            text: req.body.text,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            user: req.user.id
        };

        post.comments.unshift(newComment);
        post.save().then(post => res.json(post)).catch(err => res.status(400).json());
    }).catch(err => res.status(400).json());
});

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment from post
// @access  Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    Post.findById(req.params.id).populate('user').then(post => {
        if (!post) {
            return res.status(404).json();
        }

        let comment = post.comments.filter(c => c.id == req.params.comment_id);

        if (!comment.length) {
            return res.status(404).json();
        }

        if (comment[0].user != req.user.id) {
            return res.status(401).json();
        }
 
        let commentIndex = post.comments.indexOf(comment[0]);
        post.comments.splice(commentIndex, 1);
        post.save().then(post => res.json(post));
        
    }).catch(err => res.status(400).json());
});

module.exports = router;