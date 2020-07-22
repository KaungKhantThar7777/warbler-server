const express = require("express");
const router = express.Router();
const { signup, signin } = require("../controllers/auth");

const multer = require("multer");

const upload = multer({
  limits: {
    fileSize: 2000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  },
});
router.post("/signup", upload.single("file"), signup);
router.post("/signin", signin);

module.exports = router;
