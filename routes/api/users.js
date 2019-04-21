const express = require('express');
const router = express.Router();  
const User = require('../../models/User');
const passport = require('passport');


// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {  
        
        if (user) { 
            return res.status(400).json({ emailExists: 'Email already exists' }); 
        } 

        const { firstName, lastName, email, password } = req.body;
        const newUser = new User({ firstName, lastName, email, password });

        newUser.save().then((user) => {
            res.json(user);
        }).catch(err => res.status(400).json(err));
    }).catch(err => res.status(400).json(err));
});

// @route   POST api/users/login
// @desc    Login user / Returning JWT token
// @access  Public
router.post('/login', (req, res) => {

    const { email, password } = req.body;

    User.findOne({email}).then((user) => {
        if (!user) { 
            return res.status(422).json({ loginError: 'Invalid email or password' });
        }

        user.comparePassword(password).then((user) => {
            user.generateToken().then((token) => {
                if (token) {
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                    });
                }
            }).catch(err => { res.status(422).json(err) });
        }).catch(err => res.status(422).json({ loginError: 'Invalid email or password' }));
    }).catch(err => res.status(422).json({ loginError: 'Invalid email or password' }));
});

// @route   GET api/users/current
// @desc    Return the current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false}), (req, res) => {

    const { id, firstName, lastName, email } = req.user;

    res.json({ id, firstName, lastName, email });
})

// @route   GET api/users/:userid
// @desc    Get user by user id
// @access  Public
router.get('/:userId', (req, res) => {
    User.findById(req.params.userId, ['firstName', 'lastName', 'date']).then((user) => {
        if (!user) {
            return res.status(404).json()
        }
        res.json(user);
    }).catch(err => res.status(400).json());
});


module.exports = router; 