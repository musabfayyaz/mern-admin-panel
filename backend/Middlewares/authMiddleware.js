const jwt = require('jsonwebtoken');
const User = require('../Models/User');
require('dotenv').config()
const authMiddleware = async (req, res, next) => {
  try {
    console.log('Received headers:', req.headers);
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log('Extracted token:', token);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // Change this line
    const user = await User.findOne({ _id: decoded._id });
    console.log('Found user:', user ? user._id : 'No user found');

    if (!user) {
      throw new Error('User not found');
    }

    if (user.role !== 'vendor') {
      throw new Error('User is not a vendor');
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = authMiddleware;