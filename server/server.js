require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require('./routes/auth-routes/index');
const mediaRoutes = require('./routes/instructor-routes/media-routes');
const instructorCourseRoutes = require('./routes/instructor-routes/course-routes');
const studentViewCourseRoutes = require('./routes/student-routes/course-routes');
const studentViewOrderRoutes = require('./routes/student-routes/order-routes');
const studentCoursesRoutes = require('./routes/student-routes/student-courses-routes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URI;

app.use(cors({origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
    console.log('Origin:', req.headers.origin);
    next();
});


app.use(express.json())

mongoose.connect(
    MONGO_URL)
  .then(()=>console.log('mongodb is connected'))
  .catch((e)=>console.error(e));

app.use('/auth', authRoutes);
app.use('/media', mediaRoutes);
app.use('/instructor/course', instructorCourseRoutes );
app.use('/student/course', studentViewCourseRoutes );
app.use('/student/order', studentViewOrderRoutes );
app.use('/student/courses-bought', studentCoursesRoutes);

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