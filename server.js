const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const keys = require('./config/keys');
const passport = require('passport');
const bodyParser = require('body-parser');
const path = require('path');

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

app.get('/', (req, res) => {
    res.send('hello!!');
});

//use routes
app.use('/api/users', users);
app.use('/api/posts', posts);

app.use('/images', express.static(path.join(__dirname, 'images')));  //any req targeting /images will be forwarded to backend/images and allowed to continue


app.listen(port, () => {
    console.log(`Server running on port ${port}!`);
});