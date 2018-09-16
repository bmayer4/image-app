const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users'); //prevents errors with mongoose 
const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secret;

module.exports = (passport) => {
    passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
        console.log('jwtPayload', jwtPayload); 
        User.findById(jwtPayload.id).then(user => {
            if (user) {
                return done(null, user);  
            }
            done(null, false);
        }).catch(err => console.log(err));
    }));
}