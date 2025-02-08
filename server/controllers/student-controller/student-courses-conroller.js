const StudentCourses = require('../../models/StudentCourses');

const getCourseByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const studentBoughtCourses = await StudentCourses.findOne({ userId: studentId });
        console.log(studentBoughtCourses);
        
        
        if (!studentBoughtCourses) {
            return res.status(404).json({
                success: false,
                message: 'No courses found for this student!',
            });
        }

        return res.status(200).json({
            success: true,
            data: studentBoughtCourses ? studentBoughtCourses.courses : [], // Ensuring courses is always an array
        });
    } catch (e) {
        console.error('Error fetching student courses:', e);
        res.status(500).json({
            success: false,
            message: 'Some error occurred!',
            error: e.message,
        });
    }
};

module.exports = { getCourseByStudentId };
