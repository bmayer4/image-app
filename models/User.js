const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 30,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

UserSchema.methods.comparePassword = function(password) {
    let user = this;
 
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) { return reject(); }
            isMatch ? resolve(user) : reject();
        });
    });
}

UserSchema.methods.generateToken = function() {
    let user = this;
    const payload = { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, date: user.date };
    let token = jwt.sign(payload, keys.secret, { expiresIn: "4h"  });

    return Promise.resolve(token);
}

UserSchema.pre('save', function(next) {
    var user = this;
    if (user.isModified('password')) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) { throw err };
          user.password = hash;
          next();
        })
      });
    } else {
      next();
    }
  });


const User = mongoose.model('users', UserSchema);

module.exports = User;