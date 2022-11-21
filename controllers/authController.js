"use strict"

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {query} = require('../db');
const {
    JWT_SECRET,
} = require("../config/key");
const { errorMessage, successMessage } = require("../utils/responseUtils");
const User = require("../model/User");


const signUp = async (req, res) => {
    try {
        const { fullName, email, password, mobile } = req.body;
        const hashedPassword = await bcrypt.hash(password, 13);
        // console.log({ ...req.body });
        const user = new User(fullName, email, hashedPassword, hashedPassword, mobile);

        const createQuery = `CREATE TABLE IF NOT EXISTS 
        users (userId int(11) PRIMARY KEY AUTO_INCREMENT,
        fullName varchar(30) NOT NULL,
        email varchar(100),
        password varchar(255),
        defaultpassword varchar(255),
        mobile varchar(15)
        );`
        const insertQuery = `INSERT INTO users VALUES (NULL, ${user.toString()});`
        const checkEmailQuery = `SELECT email FROM users WHERE email = "${email}"`;
        await query(createQuery);
        const result = await query(checkEmailQuery);
        if (result.length > 0)
            return res.status(422).json({ message: "Email already exists!!" });
        else {
            await query(insertQuery)
            return res.json(
                successMessage("User Created")
            );
    }
        
    } catch (error) {
        return res.status(400).json(
            errorMessage(error.message)
        );
    }
}

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        //find if email is present
        const checkEmailQuery = `SELECT * FROM users WHERE email = "${email}"`;
        const result = await query(checkEmailQuery)
        if (result.length > 0) {
            //console.log(result)
            const doMatch = await bcrypt.compare(password, result[0].password);
            if (doMatch) {
                const token = jwt.sign({ _id: result[0].userId }, JWT_SECRET, { expiresIn: "7d" });
                return res.json(
                    successMessage(token)
                );
            } else return res.status(422).json({ error: "Invalid Email or Password!" });
        }
        else
            res.status(422).send("email not found!!!");
    } catch (error) {
        return res.status(400).json(
            errorMessage(error.message)
        );
    }
}

module.exports = {
    signUp,
    signIn
}