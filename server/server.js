require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require('./routes/auth-routes/index');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URI;

cors({origin: process.env.CLIENT_URL,
    method: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization']
});

app.use(express.json())

mongoose.connect(MONGO_URL)
  .then(()=>console.log('mongodb is connected'))
  .catch((e)=>console.error(e));

app.use('/auth', authRoutes);

app.use((err, req, res, next) => {
    console.log(err.stack); // Logs the error stack trace for debugging purposes
    res.status(500).json({
        success: false,
        message: "Something went wrong", // Sends a generic error message to the client
    });
});
  
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});