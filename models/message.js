const express = require("express");
const mongoose = require("mongoose");
const User = require("./user");
const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      maxlength: 160,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.pre("remove", async function (next) {
  try {
    const user = await User.findById(this.user);

    user.messages.remove(this._id);

    await user.save();
  } catch (err) {
    next(err);
  }
});
module.exports = mongoose.model("Message", messageSchema);
