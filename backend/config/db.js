const mongoose = require("mongoose");

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Error Connecting to MongoDB", err);
    process.exit(1);
  }
};

module.exports = ConnectDB;
