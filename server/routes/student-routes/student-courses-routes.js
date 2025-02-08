const express = require('express');

// const {createOrder, capturePaymentAndFinalizeOrder} = require('../../controllers/student-controller/order-controller')
const {getCourseByStudentId} = require("../../controllers/student-controller/student-courses-conroller");

const router = express.Router();

// router.get("/get/:studentId", getCourseByStudentId);
console.log("Student Courses Route Loaded"); // Add this log

router.get("/get/:studentId", (req, res, next) => {
    console.log(`Incoming request to: /get/${req.params.studentId}`); // Log the request
    next();
}, getCourseByStudentId);

module.exports = router;