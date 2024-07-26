const bcrypt = require("bcrypt");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      const user = await User.findOne({ username });
    if (!user) {
     return res.json({ message: "User Does not found" });
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({success: false });
    }
    const jwtToken = jwt.sign(
      { username: user.username, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login Success",
      success: true,
      jwtToken,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    console.log(error, error.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};


module.exports = { login };
