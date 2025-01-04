const Course = require("../../models/Course"); 

const addNewCourse = async (requestAnimationFrame, res) => {
    try{

        const courseData = req.body;
        const newlyCreatedCourse = new Course(courseData);
        const saveCourse = newlyCreatedCourse.save(); 

        if (saveCourse) {
            res.status(201).json({
              success: true,
              message: "Course saved successfully",
              data: saveCourse,
            });
          }
    } catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const getAllCourses = async (requestAnimationFrame, res) => {
    try{
        const courseList = await Course.find({});

        res.status(200).json({
            succes: true,
            data: courseList,
        })
    } catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const courseDetails = async (requestAnimationFrame, res) => {
    try{} catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const updateCourseById = async (requestAnimationFrame, res) => {
    try{} catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

module.exports = { addNewCourse, getAllCourses, courseDetails, updateCourseById };