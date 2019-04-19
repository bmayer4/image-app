const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 80
    },
    category: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    publicId: {
        type: String
    },
    likes: [
      {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
      }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            text: {
                type: String,
                required: true,
                maxlength: 300
            },
            firstName: {
                type: String,
                required: true
            },
            lastName: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model('posts', PostSchema);
module.exports = Post;