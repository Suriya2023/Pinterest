const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");


const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: { type: String },
  email: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post'
  }],
  profileimage: String,
  about: String,
  website: String
});

userSchema.plugin(plm);

const User = mongoose.model('user', userSchema);

// Export both the model and the router
module.exports = {
  router,
  User
};
