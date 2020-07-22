const jwt = require("jsonwebtoken");
const User = require("../models/user");
const path = require("path");

const signup = async (req, res, next) => {
  if (req.file) {
    req.body.profileImageUrl = req.file.buffer;
  }
  try {
    let user = await User.create(req.body);
    console.log(user);
    const { _id, email, username, profileImageUrl } = user;
    debugger;
    const token = jwt.sign({ _id, email, username }, process.env.JWT_SECRET);
    res.status(200).json({
      _id,
      token,
      email,
      username,
      profileImageUrl,
    });
  } catch (err) {
    if (err.code === 11000) {
      return next({
        status: 400,
        message: "Sorry, this email is already taken",
      });
    }
    next({
      status: 400,
      message: err.message,
    });
  }
};

const signin = async (req, res, next) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next({ status: 400, message: "Invalid email/password." });
    }

    const { _id, email, username, profileImageUrl } = user;

    const isMatch = await user.matchPassword(req.body.password);

    console.log(isMatch, "why");
    if (!isMatch) {
      return next({ status: 400, message: "Invalid email/password." });
    }

    const token = jwt.sign(
      {
        _id,
        email,
        username,
      },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      _id,
      email,
      username,
      token,
      profileImageUrl,
    });
  } catch (err) {
    next({ status: 400, message: "Invalid email/password." });
  }
};
module.exports = {
  signup,
  signin,
};
