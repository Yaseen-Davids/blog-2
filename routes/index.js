var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var flash = require('connect-flash');
var session = require('express-session');
var expressValidator = require('express-validator');
var request = require('request');
var passport = require('passport');
var back = require('express-back');


// Months variable for date
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var the_date = new Date();

// Posts model
var Posts = require('../models/posts');

// User model
var User = require('../models/user');

// Express session Middleware
router.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));


// Express Messages Middleware
router.use(require('connect-flash')());
router.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// Express Validator Middleware
router.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }

    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

router.use(back());


// Passport Config
require('../config/passport')(passport);
// Passport Middleware
router.use(passport.initialize());
router.use(passport.session());


// Set global variable for all pages
router.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});


/* GET home page. */
router.get('/', function(req, res, next) {
  Posts.find({}, function(err, posts){
    if (err) {
      console.log(err);
    }
    else {
      res.render('index', {
        title: "TechTalk - Blog",
        posts: posts
      })
    }
  }).sort(
    { "_id":-1 }
  )
});


/* GET single blog post page */
router.get('/blog/:id', function(req, res, next){
  Posts.findById(req.params.id, function(err, posts){
    User.findById(posts.author, function(err, user){
      if (err) {
        console.log(err);
      }
      else{
        res.render('blog', {
          title: "TechTalk - Blog",
          posts: posts,
          author: user.name
        })
      }
    })
  })
});

/* GET Tech Posts Page */
router.get('/category/tech', function(req, res, next){
  Posts.find({}, function(err, posts){
    res.render('category', {
      category: "Tech",
      posts: posts,
      title: "TechTalk - Tech",
      categoryHeading: "Tech Articles"
    })
  })
});


/* GET Gaming Posts Page */
router.get('/category/gaming', function(req, res, next){
  Posts.find({}, function(err, posts){
    res.render('category', {
      category: "Gaming",
      posts: posts,
      title: "TechTalk - Gaming",
      categoryHeading: "Gaming Articles"
    })
  })
});


/* GET Gadgets Posts Page */
router.get('/category/gadgets', function(req, res, next){
  Posts.find({}, function(err, posts){
    res.render('category', {
      category: "Gadgets",
      posts: posts,
      title: "TechTalk - Gadgets",
      categoryHeading: "Gadget Articles"
    })
  })
});


/* GET New Post Page */
router.get('/new-post',ensureAuthenticated , function(req, res, next){
  res.render('new_post', {
    title: "TechTalk - New Blog",
  });
});


/* POST new blog post */
router.post('/new-post', function(req, res, next){
  var post = new Posts();
  post.title = req.body.title;
  post.image = req.body.image;
  post.author = req.user._id;
  post.category = req.body.select;
  post.content = req.body.content;
  post.date = months[the_date.getMonth()] + " " + the_date.getDate() + " " + the_date.getFullYear();

  post.save(function(err){
    if (err){
      console.log(err);
    }
    else{
      req.flash('success', 'New Blog Post Added');
      res.redirect('/');
    }
  })

});


/* GET edit single post page */
router.get('/edit/:id', ensureAuthenticated, function(req, res, next){
  Posts.findById(req.params.id , function(err, posts){
    if (err) {
      console.log(err);
    }
    else{
      res.render('edit', {
        title: "TechTalk - Edit Blog",
        posts: posts
      })
    }
  })
});


/* UPDATE edited post */
router.post('/edit/:id', function(req, res, next){
  var post = {};
  post.title = req.body.title;
  post.image = req.body.image;
  post.category = req.body.select;
  post.content = req.body.content;

  let query = {_id:req.params.id};

  Posts.update(query, post , function(err){
    if (err) {
      console.log(err)
    }
    else{
      req.flash('success', 'Blog Post Updated');
      return res.back();
    }
  })
});


/* Delete post */
router.delete('/delete/:id', function(req, res, next){

  let query = {_id:req.params.id};

  Posts.findById(req.params.id, function(err, posts){
    if (err) {
      console.log(err);
      return;
    }
    else{
      Posts.remove(query, function(err){
        if (err){
          console.log(err);
          return;
        }
        req.flash('success', "Post Deleted");
        res.send("Successfully Deleted");
      })
    }
  });
});

// Access control
function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  else{
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;

