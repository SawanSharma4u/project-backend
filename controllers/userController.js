"use strict";

const { errorMessage, successMessage } = require("../utils/responseUtils");
const { query } = require("../db");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const getUsers = async (req, res) => {
  try {
    const getUsersQuery = `
        SELECT * FROM users;
        `;
    const result = await query(getUsersQuery);
    return res.json(successMessage(result));
  } catch (error) {
    return res.status(400).json(errorMessage(error.message));
  }
};

const getUser = async (req, res) => {
    try {
      const getUserQuery = `
          SELECT * FROM users where userId="${req.params.userId}";
          `;
      const result = await query(getUserQuery);
      return res.json(successMessage(result));
    } catch (error) {
      return res.status(400).json(errorMessage(error.message));
    }
  };

const addUser = async (req, res) => {
  try {
    const { fullName, email, password, mobile } = req.body;
    const hashedPassword = await bcrypt.hash(password, 13);
    // console.log({ ...req.body });
    const user = new User(fullName, email, hashedPassword, hashedPassword, mobile);

    // const createQuery = `CREATE TABLE IF NOT EXISTS 
    //         users (userId int(11) PRIMARY KEY AUTO_INCREMENT,
    //             fullName varchar(30) NOT NULL,
    //             email varchar(20),
    //             password varchar(255),
    //             mobile varchar(15)
    //             );`;
    const insertQuery = `INSERT INTO users VALUES (NULL, ${user.toString()});`;
    const checkEmailQuery = `SELECT email FROM users WHERE email = "${email}"`;
    // await query(createQuery);
    const result = await query(checkEmailQuery);
    if (result.length > 0)
      return res.status(422).json({ message: "Email already exists!!" });
    else {
      await query(insertQuery);
      return res.json(successMessage("User Added"));
    }
  } catch (error) {
    return res.status(400).json(errorMessage(error.message));
  }
};

const editUser = async(req, res) => {
    try {
        const { fullName, email, mobile, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 13);
        const updateUserQuery = `
        UPDATE users SET fullname="${fullName}", email="${email}", mobile="${mobile}", password="${hashedPassword}" where userId="${req.params.userId}";
        `
        const result = await query(updateUserQuery);
        return res.json(successMessage(result));
    } catch (error) {
        return res.status(400).json(errorMessage(error.message));
    }
}

const deleteUser = async(req, res) => {
    try {
        const deleteUserQuery = `
        DELETE from users where userId="${req.params.userId}";
        `
        const result = await query(deleteUserQuery)
        return res.json(successMessage(result));
    } catch (error) {
        return res.status(400).json(errorMessage(error.message));
    }
}

const resetPassword = async(req, res) => {
    try {
        const {defaultPassword} = req.body;
        const updatePasswordQuery = `
        UPDATE users SET password="${defaultPassword}" where userId="${req.params.userId}"
        `
        const result = await query(updatePasswordQuery);
        return res.json(successMessage(result));
    } catch (error) {
        return res.status(400).json(errorMessage(error.message));
    }
}

module.exports = {
  getUsers,
  getUser,
  addUser,
  editUser,
  deleteUser,
  resetPassword
};
