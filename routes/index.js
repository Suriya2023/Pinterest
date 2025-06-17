const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const upload = require('./multer');
const postModel = require('./posts');
const userModel = require('./users');

// Passport strategy setup
passport.use(new LocalStrategy(userModel.authenticate()));

/* Home page */
router.get('/', (req, res) => {
  res.render('index');
});

/* Register a user */
router.post("/register", async (req, res) => {
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
    posts: [],
  });

  userModel.register(userData, req.body.password).then((registeredUser) => {
    passport.authenticate('local')(req, res, () => {
      res.redirect('/FinalPage');
    });
  });
});

/* Login */
router.post('/login', passport.authenticate('local', {
  successRedirect: "/FinalPage",
  failureRedirect: "/loginus",
  failureFlash: true,
}));

/* FinalPage - all posts */
router.get("/FinalPage", isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const posts = await postModel.find().populate('user');
  res.render('FinalPage', { user, posts });
});

/* Account - show user's posts */
router.get('/account', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user }).populate('posts');
  res.render('account', { user });
});

/* Edit profile page */
router.get('/edditPf', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render('edditPf', { user });
});

/* Profile image upload */
router.post('/profileimage', isLoggedIn, upload.single('dp'), async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  user.profileimage = req.file.filename;
  await user.save();
  res.redirect('/account');
});

/* Upload post page */
router.get('/uploadpost', isLoggedIn, (req, res) => {
  res.render('upload');
});

/* Add new post */
router.post('/addpost', isLoggedIn, upload.single('post'), async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });

  const newPost = await postModel.create({
    images: req.file.filename,
    posttext: req.body.posttext,
    title: req.body.title,
    user: user._id
  });

  user.posts.push(newPost._id);
  await user.save();
  res.redirect('/account');
});

/* All user's posts */
router.get('/allpost', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user }).populate('posts');
  res.render('allpost', { user });
});

/* Dashboard */
router.get('/Dashboard', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render('Dashboard', { user });
});

/* Login and Register pages */
router.get("/loginus", (req, res) => {
  res.render("login", { error: req.flash('error') });
});

router.get("/RegisterUs", (req, res) => {
  res.render("Register");
});
router.post('/updateprofile', isLoggedIn, upload.single('dp'), async (req, res, next) => {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });

    user.fullname = req.body.fullname;
    user.username = req.body.username;
    user.about = req.body.about;
    user.website = req.body.website;

    if (req.file) {
      user.profileimage = req.file.filename;
    }

    await user.save();

    req.login(user, function (err) {
      if (err) return next(err);
      res.redirect('/FinalPage');
    });
  } catch (err) {
    console.error("Update failed:", err);
    res.redirect('/edditPf');
  }
});


/* Logout */
router.get('/logout', (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
    res.redirect('/loginus');
  });
});

/* Middleware - check login */
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/loginus');
}

module.exports = router;
