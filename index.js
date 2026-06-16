const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");


dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);


const PORT = process.env.PORT || 5000;


const startServer = async () => {
  await connectDB();

  // routes
  app.get("/", (req, res) => {
    res.status(200).json({ message: "API is running", status: "connected" });
  });

  app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
  });
};

startServer();
