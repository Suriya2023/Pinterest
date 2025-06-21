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
const MongoStore = require('connect-mongo');

// Load .env variables
dotenv.config();

// Routes and User Schema
const indexRouter = require('./routes/index');
const { router: usersRouter, User } = require('./routes/users'); // ✅ Route + model

// Init App
const app = express();


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // ssl: true, // optional if using +srv URI
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));



// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ✅ Static Folder for Post Images
app.use('/images/uploads', express.static(path.join(__dirname, 'public/images/uploads')));

// Optional: Serve CSS/JS/Assets from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Sessions + Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Flash Messages + User for Views
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user; // For navbar/user info
  next();
});

// Passport Config
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 404 Page
app.use((req, res, next) => {
  res.status(404).render('404', { title: '404 Not Found' });
});

// Export app (used in bin/www)
module.exports = app;
