const express = require("express");
const {
  register,
  login,
  logout,
  me,
  passwordChange,
  updatePassword,
} = require("../controllers/authController");
const isAuthenticated = require("../middlewares/auth");
authRouter = express.Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/forgotPassword", passwordChange);
authRouter.post("/updatePassword", updatePassword);
authRouter.get("/me", isAuthenticated, me);

module.exports = authRouter;
