const CourseProgress = require('../../models/CourseProgress');
const Course= require('../../models/Course');
const StudentCourses = require('../../models/StudentCourses');


const markCurrentLectureAsViewed = async(req, res) => {
    try{
        const {userId, courseId, lectureId} = req.body;

        let progress = await CourseProgress.findOne({userId, courseId});

        if(!progress){
            progress = new CourseProgress({
                userId,
                courseId,
                lecturesProgress: [
                    {
                        lectureId, viewed: true, dataViewed: new Date(),
                    }
                ]
            })
            await progress.save()
        } else {
            const lectureProgress = progress.lecturesProgress.find(item => item.lectureId === lectureId);
            if(lectureProgress){
                lectureProgress.viewed = true;
                lectureProgress.dateViewed = new Date();
            } else {
                progress.lecturesProgress.push({
                    lectureId,
                    viewed: true, 
                    dataViewed: new Date()
                })
            }
            await progress.save()

        }

        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            })
        }

        const allLecturesViewed = progress.lecturesProgress.length === 
         course.curriculum.length && progress.lecturesProgress.every(item => item.viewed)
        
         if(allLecturesViewed){
            progress.completed = true;
            progress.completionDate = new Date();

            await progress.save();
        }

        res.status(200).json({
            success: true,
            message: "Lecture marked as viewed",
            data: progress,
        });
    } catch(e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error Occured"
        });
    }
}

const getCurrentCourseProgress = async(req, res) => {
    try{
        const {userId, courseId} = req.params;

        const studentPurchasedCourses = await StudentCourses.findOne({ userId });
        const isCurrentCoursePurchasedByCurrentUserOrNot =
          studentPurchasedCourses?.courses.some(item => item.courseId.toString() === courseId.toString());
        
        console.log("Checking purchase status:", isCurrentCoursePurchasedByCurrentUserOrNot, studentPurchasedCourses);
        
       
        
        if(!isCurrentCoursePurchasedByCurrentUserOrNot){
            
            return res.status(200).json({
                success: true,
                data: {
                    isPurchased: false,
                },
                message: 'You need to purchase this course to access it'
            })
        }

        const currentUserCourseProgress = await CourseProgress.findOne({userId, courseId});
        
        if(!currentUserCourseProgress || currentUserCourseProgress?.lecturesProgress?.length === 0){
            const course = await Course.findById(courseId);
            if(!course){
                return res.status(404).json({
                    success: false,
                    message: 'Course not Foound'
                })
            }
            return res.status(200).json({
                
                success: true,
                message: 'No progrees Found, you can start watching the course',
                data: {
                    courseDetails: course,
                    progress: [],
                    isPurchased: true,
                }
            })
        }

        const courseDetails = await Course.findById(courseId);
        
        res.status(200).json({
            success: true,
            data: {
                courseDetails,
                progress: currentUserCourseProgress.lecturesProgress,
                completed: currentUserCourseProgress.completed,
                completionDate: currentUserCourseProgress.completionDate,
                isPurchased: true
            }
        })
    } catch(e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error Occured"
        });
    }
}

const resetCurrentCourseProgress = async(req, res) => {
    try{
        const {userId, courseId} = req.body;
        
        const progress = await CourseProgress.findOne({userId, courseId})
        
        if(!progress){
            return res.status(404).json({ 
                success: false,
                message: 'Progress not Found!'
            })
        }

        progress.lecturesProgress = [];
        progress.completed = false;
        progress.completionDate = null;
        
        await progress.save();

        res.status(200).json({
            success: true,
            message: 'Course progress has been reset',
            data: progress
        })
    } catch(e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error Occured"
        });
    }
}

module.exports = {
    markCurrentLectureAsViewed,
    getCurrentCourseProgress,
    resetCurrentCourseProgress,
}