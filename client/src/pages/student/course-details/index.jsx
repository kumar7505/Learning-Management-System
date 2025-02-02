import StudentProvider, { StudentContext } from '@/context/student-context'
import { fetchStudentViewCourseDetailsService } from '@/services';
import { Skeleton } from '../../../components/ui/skeleton';
import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { CheckCircle, Globe, Lock, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { courseCurriculumInitialFormData } from '@/config';
import VideoPlayer from '@/components/video-player';


const StudentViewCourseDetailsPage = () => {
  const params = useParams();
  const {
    currentCourseDetailsId, 
    setCurrentCourseDetailsId,
    studentViewCourseDetails, 
    setStudentViewCourseDetails,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  async function fetchStudentViewCourseDetails(){
    const res = await fetchStudentViewCourseDetailsService(currentCourseDetailsId);
    console.log(res);

    if(res?.success){
      setStudentViewCourseDetails(res?.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }

    if(loadingState) return <Skeleton />
    console.log('kumar',studentViewCourseDetails?.objectives);
    
    
  }
  useEffect(() => {
    if(currentCourseDetailsId !== null)
      fetchStudentViewCourseDetails()
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if(params?.id) setCurrentCourseDetailsId(params?.id)
  }, [params?.id]);
  
  if(loadingState) return <Skeleton />

  const getIndexOfFreePreviewUrl = studentViewCourseDetails !== null ? 
  studentViewCourseDetails?.curriculum?.findIndex(item => item.freePreview) 
  : -1
  return (
    <div className=' mx-auto p-4'>
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className='text-3xl font-bold mb-4'>
          {studentViewCourseDetails?.title}
        </h1>
         <p className="text-xl mb-4">
          {studentViewCourseDetails?.subtitle}
        </p>
        <div className="text-xs flex items-center space-x-4 mt-2 text-sm">
          <span>Created By {studentViewCourseDetails?.instructorName}</span>
          <span>Created On {studentViewCourseDetails?.date?.split("T")[0]}</span>
          <span className='flex items-center'>
            <Globe className='mr-1 h-4 w-4'/>
            {studentViewCourseDetails?.primaryLanguage}
          </span>
          <span>{
            studentViewCourseDetails?.students.length} 
            {studentViewCourseDetails?.students.length <= 1 ? ' Student' : ' Students'}
          </span>
        </div>      
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <main className="flex-grow">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>
                  What you'll learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                  {
                    studentViewCourseDetails?.objectives.split(',').map((objective, index) => (
                      <li key={index} className='flex items-start'>
                        <CheckCircle className='mr-2 h-5 w-5 text-green-500 flex-shrink-0' />
                        <span>{objective}</span>
                      </li>
                    ))
                  }
                </ul>
              </CardContent>
            </Card>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>
                  Course Curriculum
                </CardTitle>
              </CardHeader>
              <CardContent>
                {
                  studentViewCourseDetails?.curriculum?.map((curriculum, index) => (
                    <li className={`${curriculum?.freePreview ? 'cursor-pointer' : 'cursor-not-allowed'} flex items-center mb-4`}>
                      {
                        curriculum?.freePreview ?
                        <PlayCircle className='mr-2 h-4 w-4' /> : <Lock className='mr-2 h-4 w-4' />
                      }
                      <span>{curriculum?.title}</span>
                    </li>
                  ))
                }
              </CardContent>
            </Card>
        </main>
        <aside className='w-full md:w-[500px]'>
          <Card className="sticky top-4">
            <CardContent className="p-4">
              <div className="aspect-video md-4 rounded-lg flex items-center justify-center">
                {/* <VideoPlayer 
                  url={
                    studentViewCourseDetails?.curriculum.
                  } /> */}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

    </div>
  )
}

export default StudentViewCourseDetailsPage