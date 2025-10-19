// config/db.js

const mongoose = require('mongoose');
require('dotenv').config(); // đọc biến môi trường từ .env

const connectDB = async () => {
  try {
    
      await mongoose.connect(process.env.MONGO_URI, {  
    // await mongoose.connect('mongodb://localhost:27017/clothing-store', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

module.exports = connectDB;
