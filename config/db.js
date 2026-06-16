const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUrl = process.env.mongo_url || process.env.MONGO_URL;

  if (!mongoUrl) {
    throw new Error("mongo_url is missing from .env");
  }

  try {
    const conn = await mongoose.connect(mongoUrl);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
