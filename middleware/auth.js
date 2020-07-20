const jwt = require("jsonwebtoken");

//Login in First
const loginRequired = (req, res, next) => {
  try {
    const decode = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET
    );
    console.log(decode);
    if (decode) {
      req.user = decode;
      next();
    } else {
      next({ status: 400, message: "Please Login first " });
    }
  } catch (err) {
    console.log(err);
    next({ status: 400, message: "Please login first" });
  }
};

//ensure correct user
const ensureCorrectUser = (req, res, next) => {
  console.log(req.params.id, req.user._id);
  if (req.params.id !== req.user._id) {
    next({ status: 401, message: "Unauthorized" });
  } else {
    next();
  }
};

module.exports = {
  loginRequired,
  ensureCorrectUser,
};
