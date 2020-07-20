const express = require("express");
const router = express.Router();
const { getUsers, getMe } = require("../controllers/user");
router.route("/").get(getUsers);
router.get("/:id", getMe);

module.exports = router;
