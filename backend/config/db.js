const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.rainbow.bold);
  } catch (error) {
    console.log(`Error: ${error.message}`.bgRed.white);
    process.exit();
  }
};

module.exports = connectDB;
