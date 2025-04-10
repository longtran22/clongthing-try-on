// config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // await mongoose.connect('mongodb+srv://tranledung:1234@cluster0.j8r21fd.mongodb.net/myapp?retryWrites=true&w=majority', {
      await mongoose.connect('mongodb://localhost:27017/clothing-store', {
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
