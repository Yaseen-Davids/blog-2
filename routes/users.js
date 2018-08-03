var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');


// Bring in User Model
let User = require('../models/user');


/* GET register page */
router.get('/register', function(req, res, next){

  let errors = req.validationErrors();

  res.render('register', {
    title: "",
    subtitle: "Please Login",
    errors: errors
  })
});


// Register Process
router.post('/register', function(req, res, next){

  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password2);


  let errors = req.validationErrors();

  if (errors){
    console.log(errors);
    res.render('register', {
      errors: errors
    })
  }

  else {
    let newUser = new User({
      name: name,
      username: username,
      email: email,
      password: password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if (err){
          console.log(err);
          return;
        }
        newUser.password = hash;

        newUser.save(function(err){
          if (err){
            console.log(err);
            return;
          }
          else{
            req.flash('success', 'You are now registered and can log in');
            res.redirect('/users/login');
          }
        });
      });
    })
  }
});


/* GET login page */
router.get('/login', function(req, res, next){

  let errors = req.validationErrors();

  res.render('login', {
    title: "",
    subtitle: "Please Login",
    errors: errors
  })
});


// Login Process
router.post('/login', function(req, res, next){

  passport.authenticate('local', {
    successRedirect: '/', 
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
})


// Logout Proccess
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
})

module.exports = router;