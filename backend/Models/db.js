const mongoose = require('mongoose');

const URI_MONGODB = process.env.MongoDB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(URI_MONGODB);
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;