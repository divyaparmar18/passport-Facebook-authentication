const express = require('express')
const passport = require('passport')
const Strategy = require('passport-facebook').Strategy;

const port = process.env.PORT || 3000;

passport.use(new Strategy({
    clientID :  "280209986484648",
    clientSecret : "a187c5f4a95bdf5259073f909812053a",
    callbackURL : "http://loacalhost:3000/login/facebook/return"
},
    function (accessToken, refreshToken , profile , cb){
        return cb(null,profile)
    }
  )
);

passport.serializeUser((user,cb)=>{
    cb(null,user)
})

passport.deserializeUser((obj,cb)=>{
    cb(null,obj)
})

// create express app

const app = express();

//set view dir

app.set('views' , __dirname + '/views');
app.set('view engine','ejs');

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({extended:true}));
app.use(require('express-session')({secret : 'my app', resave : true, saveUninitialized: true}));

//@route   -  GET  /home
//@desc    -  a route to home page
//Access   -  PUBLIC
app.get('/',(req,res)=>{
    res.render('home',{user:req.user});
})

//@route   -  GET  /login
//@desc    -  a route to login page
//Access   -  PUBLIC
app.get('/login',(req,res)=>{
    res.render('login')
})

//@route   -  GET  /login/facebook/
//@desc    -  a route to facebook auth
//Access   -  PUBLIC
app.get('login/facebook',
passport.authenticate('facebook'));

//@route   -  GET  /login/facebook/callback
//@desc    -  a route to facebook auth
//Access   -  PUBLIC
app.get('login/facebook/callback',
passport.authenticate('facebook',{failureRedirect : '/login'}),
    (req,res)=>{
        // successfull authentication
        res.redirect('/')
})

//@route   -  GET  /profile
//@desc    -  a route to profile of the user
//Access   -  PRIVATE

app.get('/profile',require('connect-ensure-login').ensureLoggedIn(),(req,res)=>{
    res.render('profile',{user:req.user})
})

app.listen(port,()=>{
    console.log('your server is running');
    
})

