// Core Modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const dotenv = require('dotenv');

// Load env
dotenv.config();

// Routes and User Schema
const indexRouter = require('./routes/index');
const { router: usersRouter, User } = require('./routes/users'); // ✅ Destructure both route and schema

// Init App
const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'your-mongo-uri')
  .then(() => {
    console.log('✅ MongoDB Connected');
  })
  .catch((err) => {
    console.error('❌ MongoDB Error:', err);
  });


// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // for multer uploads

// Session & Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'PinterestSecretKey',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Flash Messages Middleware
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});

// Passport Config using User model
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 404 Error Handler
app.use((req, res, next) => {
  res.status(404).render('404', { title: '404 Not Found' });
});

// ❌ IMPORTANT: Do NOT use app.listen() here — it's handled in ./bin/www

module.exports = app;
