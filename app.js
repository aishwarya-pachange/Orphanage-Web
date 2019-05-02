var express=require('express'),bodyParser=require('body-parser'),
    path = require('path'),urlencodedParser=bodyParser.urlencoded({extended:false}),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth20/lib').Strategy;
var cheerio = require('cheerio');
var request1 = require('request');
var app=express();
var urlencodedParser=bodyParser.urlencoded({extended:false});
app.set('view engine','ejs');

var GOOGLE_CLIENT_ID      = ""
    , GOOGLE_CLIENT_SECRET  = "";
passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        console.log('passport callback function fired:');
        console.log(profile);
        console.log(accessToken);
    })
);


app.use(passport.initialize());
app.use(passport.session());
// app.use('/assets',express.static('assets'));
// app.use('/assets', express.static('assets'));
app.use('/js', express.static('js'));
app.use(express.static(path.join(__dirname, 'assets')));

//database connection
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// Change the below URL as per your database end point. In this case, it is mongo db deployed on AWS EC2 instance.
mongoose.connect('mongodb://ec2-user@18.217.247.105:27017/ConnectingHands');
//mongoose.connect('mongodb://ec2-user@3.87.173.234:27017/students');
//const connection = mongoose.connection;

//mongoose.connect('mongodb://localhost/ConnectingHands',{ useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
   console.log("We are connected!");
});

var donations_db = require('./models/orphanageDB.js');

//for realtime data
// var fs      = require('fs');
// var request = require('request');
// var cheerio = require('cheerio');
// var app     = express();
// let gm = require('googlemaps');
// var util = require('util');


app.get("/auth/google/redirect",
    passport.authenticate("google", { failureRedirect: "/" }),
    function(req, res) {
        res.redirect('/');

});

app.get('/',function(request,response)
{
      response.render('home');
});


app.get('/about',function(request,response)
{
      response.render('about',{lat:53,longi:45});
});


app.get('/children',async function(request,response)
{
      const children = await donations_db.getAllChildren();
      // console.log(children);
      response.render('children',{profiles:children});
});


app.get('/events',async function(request,response)
{
        response.render('events');
});
app.get('/donate',async function(request,response)
{

    const orgs = await donations_db.getAllOrgs();
    // console.log(orgs);
    response.render('donate',{orgs:orgs});
});

app.get('/contact',function(request,response)
{
    response.render('contact');
});


app.get('/maps',function(request,response)
{

      response.render('maps');
});

app.get('/mentor',function(request,response)
{
    response.render('mentor');
});

app.get('/mentor_msg',function(request,response)
{
    response.render('mentor-msg');
});

app.get('/sponsorform',function(request,response)
{
    response.render('sponsorform');
});

app.get('/mentorform',function(request,response)
{
    response.render('mentorform');
});

app.get('/custom_mform',function(request,response)
{
    var name = request.query.ch;
    var imgp = request.query.img;
    response.render('custom_mform',{child:name,img:imgp});
});

app.get('/custom_sform',function(request,response)
{
    var name = request.query.ch;
    var imgp = request.query.img;
    response.render('custom_sform',{child:name,img:imgp});
});



app.get('/login', passport.authenticate('google', {
        scope: ['profile']
    })
);

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
/*app.get('/auth', passport.authenticate('google'), (req, res) => {

    console.log('enetered in login suceessss');
    response.render('home');
});*/



app.listen('3000');
/*
var port=process.env.PORT || 8081;
app.listen(port,()=>console.log('listening'));
*/
