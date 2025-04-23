var express = require('express');
var router = express.Router();
let lacalStrategy = require('passport-local')
let passport = require('passport')
let userModel = require('./users')
passport.use(new lacalStrategy(userModel.authenticate()))

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index');
});
router.get("/loginus", function (req, res) {
  res.render("login")
})
router.get("/RegisterUs", function (req, res) {
  res.render("Register")
})

router.post("/register", function (req, res) {
  let userData = new userModel({
    username: req.body.username,
    email: req.body.email
  })
  userModel.register(userData, req.body.password).then(function (registeruser) {
    passport.authenticate('local')(req, res, function () {
      res.redirect('/profile')
    })
  })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: "profile",
  failureRedirect: "/"
}), function (req, res) { })

router.get('/profile', isLoggedIn, function (req, res) {
  res.send("Congratulation your are loggedIn")

})


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()

  } res.redirect('/')

}
module.exports = router;
