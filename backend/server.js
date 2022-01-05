const express = require("express");
const { chats } = require("./data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = express();
const colors = require("colors");
const userRoutes = require("./Routes/userRoutes");

dotenv.config();
connectDB();

app.get("/", (req, res) => {
  res.send("api is run");
});

app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(5000, () => {
  console.log(`Server Started Port ${PORT}`.america);
});
