var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const plm = require("passport-local-mongoose");
const posts = require('./posts');
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
    require: true,
  },
  fullname: {
    type: String,
    require: true,
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post'
  }]

})
userName.plugin(plm);

module.exports = mongoose.model('user', userName);

