const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
require("dotenv").config()

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!(name && email && password)) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!isEmail(email)) {
      return res.status(400).json({ error: "The email you entered is invalid" });
    }
    if (!isPasswordFormat(password)) {
      return res.status(400).json({
        error:
          "Wrong password format. Your password must be 8 characters long, contain at least 1 uppercase, 1 lowercase, 1 number and a special character",
      });
    }
    const user = await User.findOne({ where: { email } })
    if (user) {
      return res.status(401).json({ error: "Email is already registered" })
    }
    const hashedPwd = await bcrypt.hash(password, 10)
    const newUser = await User.create({ name, email, password: hashedPwd })
    return res.status(201).json({ "User created": { newUser } })
  } catch (error) {
    console.log(error)
    return res.status(500).json("An unknown error has occurred", error)
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!(email && password)) {
      return res.status(400).json({ email: "Email and password are required!" })
    }
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(400).json({ error: "The user with the email doesn't exist" })
    }
    const comparePwd = await bcrypt.compare(password, user.password)
    if (!comparePwd) {
      return res.status(400).json({ error: "You entered a wrong password" })
    }
    const token = jwt.sign({
      user: {
        id: user.id,
        email: user.email
      }
    }, process.env.JWT_SECRET, { expiresIn: "31d" })
    return res.status(200).json({ "Add the token to the bearer to log in": { token } })
  } catch (error) {
    console.log(error)
    return res.status(500).json("An unknown error has occurred", error)
  }

}

const isEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

const isPasswordFormat = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(password);
};

module.exports = {registerUser, loginUser}