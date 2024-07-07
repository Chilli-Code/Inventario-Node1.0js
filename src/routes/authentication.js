const express = require('express');
const router = express.Router();
const passport = require('passport');


const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();



passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // Aquí puedes realizar acciones específicas una vez que el usuario se autentique correctamente
    done(null, profile);
  }));
  
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  

// console.log(process.env.GOOGLE_CLIENT_ID);
// console.log(process.env.GOOGLE_CLIENT_SECRET);
// console.log(process.env.GOOGLE_REDIRECT_URL);


router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) { 
    const usuario = req.user.displayName;

    // Add the  to the response locals
    res.locals.usuario = usuario;
    // Successful authentication, redirect home.
 
    res.redirect('/Home');
  });





router.get('/signin',isNotLoggedIn, (req, res) =>{
  const message = req.flash("message");
    res.render('../auth/signin',{
        message: message.length ? message[0] : null,

    });
});


router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/Home',
        failureRedirect: '/signin',
        failureFlash: true
    }) (req, res, next);
});

//Iniciar Session
router.get('/Signup', isNotLoggedIn, (req, res) => {
  const message = req.flash("message");
  res.render('../auth/signup',{
    message: message.length ? message[0] : null,

});
});
//Iniciar Session
router.post('/Signup',  passport.authenticate('local.signup', {
    successRedirect: '/Home',
    failureRedirect: '/Signup',
    failureFlash: true
}));
//Cerrar Session
router.get("/logout", (req, res, next) => {
    req.logOut(req.user, err => {
        if(err) return next(err);
        res.redirect("/signin");  
    });
});



  router.get('/Home', isLoggedIn, (req, res) => {
    res.send('profile');
});





module.exports = router;