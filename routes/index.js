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
// create a route for registerUs and Loginus
router.get("/FinalPage", isLoggedIn, function (req, res) {
  res.render('FinalPage')
})

router.get("/loginus", function (req, res) {
  res.render("login")
})
router.get('/account',function(req,res){
  res.render('account')
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
      res.redirect('/FinalPage')
    })
  })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: "/FinalPage",
  failureRedirect: "/"
}), function (req, res) { })

// router.get('/profile', isLoggedIn, function (req, res) {
//   res.render('FinalPage')

// })


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()

  } res.redirect('/')

}
module.exports = router;
