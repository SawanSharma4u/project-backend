const { Router } = require("express");
const express = require("express");
const route = express.Router();
const userController = require("../controllers/userController");

route.get('/getusers', userController.getUsers);

route.get('/getuser/:userId', userController.getUser);

route.post('/adduser', userController.addUser);

route.put('/edituser/:userId', userController.editUser);

route.delete('/deleteuser/:userId', userController.deleteUser)

route.put('/resetpassword/:userId', userController.resetPassword)

module.exports = route;