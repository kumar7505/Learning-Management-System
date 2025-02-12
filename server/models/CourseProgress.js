const mongoose = require('mongoose');

const LectureProgressSchema = new mongoose.Schema({
    lectureId: String,
    viewed: Boolean,
    dateViwed: Date,
});

const CourseProgressSchema = new mongoose.Schema({
    userId: String, 
    courseId: String,
    completed: Boolean,
    completionDate: Date,
    lecturesProgress: [LectureProgressSchema],
});

module.exports = mongoose.model('Progress', CourseProgressSchema);