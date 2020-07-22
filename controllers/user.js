const User = require("../models/user");

const getUsers = async (req, res) => {
  const users = await User.find().populate("messages", { text: true });

  res.status(200).json({ users });
};

const getMe = async (req, res) => {
  const user = await User.findById(req.params.id);

  console.log(user);

  res.status(200).json({ user });
};
module.exports = {
  getUsers,
  getMe,
};


