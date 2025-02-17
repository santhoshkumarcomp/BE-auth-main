const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
require("dotenv").config();

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        throw new Error("Email already exists");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      sendMail(
        email,
        "Welcome to Socify!!",
        "Welcome to Socify!! We are glad to have you on board."
      );
      res.send("User registered");
    } catch (error) {
      res.send(error.message);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
      const isCorrectPassword = await bcrypt.compare(password, user.password);
      if (!isCorrectPassword) {
        throw new Error("Password is incorrect");
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.json({ token: token });
    } catch (error) {
      res.send(error.message);
    }
  },
  logout: async (req, res) => {
    try {
      const { userId } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      // set the token to an empty string
      const token = "";

      res.json({ message: "User logged out", token: token });
    } catch (error) {
      res.send(error.message);
    }
  },
  me: async (req, res) => {
    try {
      const { userId } = req;
      const user = await User.findById(userId).select("-password -__v");
      if (!user) {
        throw new Error("User not found");
      }
      res.json(user);
    } catch (error) {
      res.send(error.message);
    }
  },
  passwordChange: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
      stringLength = 10;
      const characters = "abcdefghijklmnopqrstuvwxyz";
      let result = "";
      const charactersLength = characters.length;
      for (let i = 0; i < stringLength; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      console.log(user);

      await User.findByIdAndUpdate(user._id, { reset: result });
      sendMail(email, "Password string to be included", result);

      res.send("string sent to mail");
    } catch (error) {
      res.send(error.message);
    }
  },
  updatePassword: async (req, res) => {
    try {
      const { email, reset, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
      if (user.reset == reset) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });
        let result = "";
        await User.findByIdAndUpdate(user._id, { reset: result });
        res.send("User password changed");
      }
      if (user.reset.length > 0) {
        res.send("enter the correct string which is sent to your email id");
      } else {
        res.send("come through forgotPassword link");
      }
    } catch (error) {
      res.send(error.message);
    }
  },
};

module.exports = authController;
