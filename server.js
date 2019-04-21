const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const keys = require('./config/keys');
const passport = require('passport');
const bodyParser = require('body-parser');
const path = require('path');
var cloudinary = require('cloudinary');

const users = require('./routes/api/users');
const posts = require('./routes/api/posts');

//Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Passport middleware/config
app.use(passport.initialize());
require('./config/passport')(passport);

//Connect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useNewUrlParser: true }).then(() => {
    console.log('Connected to MongoDB!')
}).catch(err => console.log(err));

cloudinary.config({ 
    cloud_name: keys.cloudName, 
    api_key: keys.API_Key, 
    api_secret: keys.API_Secret
});

//use routes
app.use('/api/users', users);
app.use('/api/posts', posts);

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static('client/build'));

    app.get('*' , (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}


app.listen(port, () => {
    console.log(`Server running on port ${port}!`);
});