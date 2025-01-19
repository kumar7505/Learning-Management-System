const getAllStudentViewCourses = async(req, res) => {
    try {
        const coursesList = await course.find({})

        if(coursesList.length === 0){
            return res.status(404).json({
                success : false,
                message : 'No course details found',
                data : [],
            })
        }

        res.status(200).json({
            success : true,
            data : coursesList
        })
    } catch(e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error Occurred',
        })
    } 
};

const getStudentViewCourseDetails = async(req, res) => {
    try {
        const {id} = req.params;
        const courseDetails = await Course.findById(id);

        if(!courseDetails){
            return res.status(404).json({
                success : false,
                message : 'No course details found',
                data : [],
            })
        }

        res.status(200).json({
            success : true,
            data : courseDetails
        })


    } catch(e)
      {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error Occurred',
        })
    }
};

module.exports = {getAllStudentViewCourses, getStudentViewCourseDetails};