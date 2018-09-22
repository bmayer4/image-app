const express = require('express');
const router = express.Router();  
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {

    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    
    User.findOne({ email: req.body.email }).then(user => {  
        
        if (user) {   
            errors.email = 'Email already exists'
            return res.status(400).json(errors); 
        } 

            const newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password
            });

            newUser.save().then((user) => {
                res.json(user);
            }).catch(err => res.status(400).json(err));  //mongoose validation
    });
});

// @route   POST api/users/login
// @desc    Login user / Returning JWT token
// @access  Public
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);  
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email}).then((user) => {
        if (!user) { 
            errors.email = 'Email not found';
           return res.status(404).json(errors);
         }

        user.comparePassword(password).then((user) => {
            user.generateToken().then((token) => {
                if (token) {
                res.json({
                    success: true,
                    token: 'Bearer ' + token
                });
                }
            }).catch(err => { res.status(401).json(err) });
            }).catch((e) => {
                errors.password = 'Password incorrect';
                res.status(401).json(errors); 
             });
    }).catch(err => res.json(err));
});

// @route   GET api/users/current
// @desc    Return the current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email
    });
})

// @route   GET api/users/:userid
// @desc    Get user by user id
// @access  Public
router.get('/:userId', (req, res) => {
    User.findById(req.params.userId, ['firstName', 'lastName', 'date']).then((user) => {
        if (!user) {
            return res.status(400).json({ usererror: 'Unable to retrieve user' })
        }
        res.json(user);
    })
    .catch(err => res.status(404).json({ usererror: 'Unable to retrieve user' }));;
});


module.exports = router; 