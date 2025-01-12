import CourseCurriculum from '@/components/instructor-view/courses/add-new-course/course-curriculum'
import CourseLanding from '@/components/instructor-view/courses/add-new-course/course-landing'
import CourseSettings from '@/components/instructor-view/courses/add-new-course/course-setting'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from '@/config'
import { AuthContext } from '@/context/auth-context'
import { InstructorContext } from '@/context/instructor-context'
import { addNewCourseService, fetchInstructorCourseDetailservice, updateCourseByIdService } from '@/services'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const AddNewCoursePage = () => {

    const [focusedTab, setFocusedTab] = useState("curriculum");

    const {
        courseCurriculumFormData, 
        courseLandingFormData, 
        setCourseLandingFormData, 
        setCourseCurriculumFormData,    
        currentEditedCourseId, 
        setCurrentEditedCourseId
    } = useContext(InstructorContext);
    
    // Handle tab click to maintain focus
    const {auth} = useContext(AuthContext);
    const handleTabClick = (value) => {
        setFocusedTab(value);
    };
    const navigate = useNavigate();
    const params = useParams();
    
    async function fetchCurrentCourseDetials(){
        const response = await fetchInstructorCourseDetailservice(currentEditedCourseId);
        
        if(response?.success){
            const setCourseFormData = Object.keys(courseLandingInitialFormData).reduce((acc, key) => {
                acc[key] = response?.data[key] || courseLandingInitialFormData[key];

                return acc;
            }, {});
            console.log("PRAS", response?.data,  setCourseFormData );
            setCourseLandingFormData(setCourseFormData);
            setCourseCurriculumFormData(response?.data?.curriculum || [])
                         
        }
    }

    
    useEffect(() =>{
        if(currentEditedCourseId !== null) 
            fetchCurrentCourseDetials();
        
    }, [currentEditedCourseId])

    useEffect(() => {
        
        if(params?.courseId) setCurrentEditedCourseId(params.courseId);
        console.log(currentEditedCourseId);
        
    }, [params?.courseId]);
    
    function isEmpty(value){
        if(Array.isArray(value)){
            return value.length === 0;
        }

        return value === "" || value === null || value === undefined; 
    }
    function validateFormData() {
        for(const key in courseLandingFormData){
            if(isEmpty(courseLandingFormData[key]))
                return false;
        }

        let hasFreePreview = false;

        for(const item of courseCurriculumFormData){

            if(isEmpty(item.title) || isEmpty(item.videoUrl) || isEmpty(item.public_id)){
                return false
            }

            if (item.freePreview) {
                hasFreePreview = true; //found at least one free preview
            }
        }
        return hasFreePreview;
    }

    async function handleCreateCourse(){
        const courseFinalFormData = {
            instructorId: auth?.user?._id,
            instructorName: auth?.user?.userName,
            date: new Date(),
            ...courseLandingFormData, 
            students: [
            ],
            curriculum: courseCurriculumFormData,
            isPublished: true,
        };

        const response = currentEditedCourseId !== null ? 
        await updateCourseByIdService(currentEditedCourseId, courseFinalFormData) : 
        await addNewCourseService(courseFinalFormData);

        if(response?.success){
            setCourseLandingFormData(courseLandingFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate(-1);
        }
        console.log( "Course Final Formm Data", courseFinalFormData);
        
    }
    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between">
                <h1 className="text-3xl font-extrabold mb-5">Create a New Course</h1>
                <Button 
                  disabled={!validateFormData()} 
                  className="text-sm tracking-wider font-bold px-8"
                  onClick={handleCreateCourse}>
                    SUBMIT
                </Button>
            </div>
            <Card>
                <CardContent>
                    <div className="container mx-auto p-4">
                        <Tabs defaultValue="curriculum" className='space-y-4'>
                            <TabsList className="inline-flex p-1 space-x-[2px] border rounded-lg shadow-md bg-gray-100">
                                <TabsTrigger
                                    value="curriculum"
                                    autoFocus
                                    onClick={() => handleTabClick("curriculum")}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                                    focusedTab === "curriculum" ? "bg-black text-white" : "bg-gray-100 text-gray-700"
                                    } hover:bg-gray-300 border-none outline-none`}
                                    > Curriculum </TabsTrigger>
                                <TabsTrigger
                                    value="course-landing-page"
                                    onClick={() => handleTabClick("course-landing-page")}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                                    focusedTab === "course-landing-page" ? "bg-black text-white" : "bg-gray-100 text-gray-700"
                                    } hover:bg-gray-300 border-none outline-none`}
                                    > Course Landing Page </TabsTrigger>
                                <TabsTrigger
                                    value="settings"
                                    onClick={() => handleTabClick("settings")}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                                    focusedTab === "settings" ? "bg-black text-white" : "bg-gray-100 text-gray-700"
                                    } hover:bg-gray-300 border-none outline-none`}
                                    > Settings </TabsTrigger>
                            </TabsList>
                            <TabsContent value="curriculum">
                                <CourseCurriculum />
                            </TabsContent>
                            <TabsContent value="course-landing-page">
                                <CourseLanding />
                            </TabsContent>
                            <TabsContent value="settings">
                                <CourseSettings />
                            </TabsContent>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>
        </div>
  )
}

export default AddNewCoursePage