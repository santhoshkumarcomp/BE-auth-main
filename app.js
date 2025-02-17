const express = require("express");
const app = express();
const authRouter = require("./routes/authRoute");
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173", // or '*' to allow any origin (not recommended for production)
  })
);
app.use(express.json());
app.use("/auth", authRouter);
module.exports = app;
