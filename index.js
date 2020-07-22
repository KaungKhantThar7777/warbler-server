const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
dotenv.config();

//DB connect
const connect = require("./dbConnect");
connect();

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");
const userRoutes = require("./routes/user");
const path = require("path");
const { loginRequired, ensureCorrectUser } = require("./middleware/auth");

const app = express();
const errorHandler = require("./error");

const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
//Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use(
  "/api/users/:id/messages",
  loginRequired,
  ensureCorrectUser,
  messageRoutes
);

const Message = require("./models/message");

app.get("/api/messages", loginRequired, async (req, res, next) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: "asc" })
      .populate("user", {
        username: 1,
        profileImageUrl: 1,
      });

    res.status(200).json(messages);
  } catch (err) {
    next({ status: 500, message: "Server error" });
  }
});

//Error Handling
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is starting on port ${PORT}`);
});
