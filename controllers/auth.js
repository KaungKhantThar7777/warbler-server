const jwt = require("jsonwebtoken");
const User = require("../models/user");
const path = require("path");

const signup = async (req, res, next) => {
  console.log(req.body, req.files);
  try {
    let user = await User.create({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
    });
    const { _id, email, username } = user;
    if (req.files !== null) {
      const { file } = req.files;
      if (!file.mimetype.startsWith("image")) {
        return next({ status: 400, message: "Please upload an image" });
      }

      file.name = `photo_${_id}${path.parse(file.name).ext}`;

      file.mv(`public/uploads/${file.name}`, async (err) => {
        if (err) {
          return next({ status: 400, message: "Uploading photo failed" });
        }

        try {
          user = await User.findByIdAndUpdate(
            _id,
            {
              profileImageUrl: file.name,
            },
            {
              runValidators: true,
              new: true,
            }
          );
          const token = jwt.sign(
            { _id, email, username, profileImageUrl: user.profileImageUrl },
            process.env.JWT_SECRET
          );
          res.status(200).json({
            _id,
            token,
            email,
            username,
            profileImageUrl: user.profileImageUrl,
          });
        } catch (err) {
          if (err.code === 11000) {
            return next({
              status: 400,
              message: "Sorry, that email is already taken",
            });
          }

          console.log(err.message, err);
          next({
            status: 400,
            message: err.message,
          });
        }
      });
    } else {
      const token = jwt.sign({ _id, email, username }, process.env.JWT_SECRET);
      res.status(200).json({
        _id,
        token,
        email,
        username,
      });
    }
  } catch (err) {
    console.log(err);
    next({
      status: 400,
      message: err.message,
    });
  }
};

const signin = async (req, res, next) => {
  console.log(req.body, req.files);
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
        profileImageUrl,
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
    console.log(err);
    next({ status: 400, message: "Invalid email/password." });
  }
};
module.exports = {
  signup,
  signin,
};
