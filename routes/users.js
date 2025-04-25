var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const plm = require("passport-local-mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/pinterest")

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
let userName = mongoose.Schema({
  username: {
    type: String, required: true, unique: true
  },
  password: { type: String },

  email: {
    type: String,
  }

})
userName.plugin(plm);

module.exports = mongoose.model('user', userName);

