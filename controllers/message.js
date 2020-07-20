const Message = require("../models/message");
const User = require("../models/user");

// /api/users/:id/messages
const createMessage = async (req, res, next) => {
  console.log(req.body);
  try {
    let message = await Message.create({
      text: req.body.text,
      user: req.params.id,
    });
    let foundUser = await User.findById(message.user);
    foundUser.messages.push(message._id);
    await foundUser.save();

    console.log(foundUser);

    let foundMessage = await Message.findById(message._id).populate("user", {
      username: 1,
    });
    res.json(foundMessage);
  } catch (err) {
    console.log(err);
    next({ status: 400, message: err.message });
  }
};

// /api/users/:id/messages/:message_id
const getMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(
      req.params.message_id
    ).populate("user", { username: true, profileImageUrl: true, email: true });
    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    next({ status: 400, msg: "Get message Failed" });
  }
};

// /api/users/:id/messages/:message_id
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.message_id);

    await message.remove();
    console.log("Delete Success");
    res.status(200).json({ msg: "Delete Success" });
  } catch (err) {
    next({ status: 400, msg: "Delete Failed" });
  }
};
module.exports = {
  createMessage,
  getMessage,
  deleteMessage,
};
