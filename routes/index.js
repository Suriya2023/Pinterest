var express = require('express');
var router = express.Router();
let lacalStrategy = require('passport-local')
let passport = require('passport')
let upload = require('./multer')
let postModl = require('./posts')
let userModel = require('./users')
passport.use(new lacalStrategy(userModel.authenticate()))

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index');
});
// create a route for registerUs and Loginus
router.get("/FinalPage", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user,
  })
  console.log("user", user);
  res.render('FinalPage', { username: user.username, fullname: user.fullname, email: user.email })
})



router.post("/register", function (req, res) {
  let userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
  })
  userModel.register(userData, req.body.password).then(function (registeruser) {
    passport.authenticate('local')(req, res, function () {
      res.redirect('/FinalPage')
    })
  })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: "/FinalPage",
  failureRedirect: "/loginus",
  failureFlash: true,

}), function (req, res) { })

// router.get('/profile', isLoggedIn, function (req, res) {
//   res.render('FinalPage')

// })

router.get('/account', async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user, //save username background 
  })
  res.render('account', { username: user.username, fullname: user.fullname })
})



router.get('/edditPf', async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  res.render('edditPf', { username: user.username, fullname: user.fullname })
})

router.get('/post', function (req, res) {
  res.render('post')
})

router.get('/Dashboard', isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  res.render('Dashboard', { username: user.username, fullname: user.fullname })
})

router.get("/loginus", function (req, res) {
  res.render("login", { error: req.flash('error') });
  console.log(req.flash('error'));
})


router.get("/RegisterUs", function (req, res) {
  res.render("Register")
})




function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()

  } res.redirect('/')


}
//logout section
router.get('/logout', function (req, res) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/loginus')
  })
})




router.post('/upload', upload.single('file'), function (req, res) {
  if (!req.file) {
    return res.status(400).send("No files were uploaded");
  }
  res.send("File uploaded successfully");
});
module.exports = router;
