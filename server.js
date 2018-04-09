const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/blackhole');
let db = mongoose.connection;

// Check Connection
db.once('open', function() {
    console.log('Connected to Mongodb');
})

//Check for db errors
db.on('error', function(err) {
    console.log(err);
});

// Init the app
const app = express();

// Bring in Models
let Post = require('./models/post')

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Home Route
app.get('/', function(req, res) {
    Post.find({}, function(err, posts) {
        if(err){
            console.log(err);
        } else {
            res.render('home', {
                posts: posts
            });
        }
    });
});

// Add Post Route
app.get('/posts/add', function(req, res) {
    res.render('add_post');
});

// Add POST route for posts
app.post('/posts/add', function(req, res) {
    let post = new Post();
    post.title = req.body.title;
    post.author = req.body.author;
    post.body = req.body.body;

    post.save(function(err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

// Add POST route for commments
app.post('/posts/comment/:id', function(req, res) {
    console.log('Comment test');
    // post.body = req.body.body;

    // post.save(function(err) {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     } else {
    //         res.redirect('/');
    //     }
    // });
});

// Get Single Post
app.get('/posts/:id', function(req, res) {
    Post.findById(req.params.id, function (err, post) {
        res.render('post', {
            post: post
        });
    });
});

app.set('port', (process.env.PORT || 8000));

app.listen(app.get('port'), function () {
    console.log('Server started');
});