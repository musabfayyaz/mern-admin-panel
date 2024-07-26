const express = require("express");
const connectDB = require("./Models/db");
const authRouter = require('./Routes/authRouter');
const userRouter = require('./Routes/userRouter')
const cors = require('cors');
require('dotenv').config()
app = express()
connectDB();

app.use(cors())
app.use(express.json())
app.use('/auth', authRouter)
app.use('/user' , userRouter )
PORT = process.env.PORT || 3002
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`))
