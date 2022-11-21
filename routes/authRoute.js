const express = require("express");
const route = express.Router();
const authController = require("../controllers/authController");

route.post('/signup', authController.signUp);

route.post('/signin', authController.signIn);

module.exports = route;