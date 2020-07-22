const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect(process.env.MONGO_URI || process.env.MONGO_DEV, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => console.log("DB Connected"))
    .catch((err) => {
      console.log("Cannot connect to DB ", err);
      process.exit(1);
    });
};

module.exports = connect;
