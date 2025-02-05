import StudentProvider, { StudentContext } from '@/context/student-context'
import { createPaymentService, fetchStudentViewCourseDetailsService } from '@/services';
import { Skeleton } from '../../../components/ui/skeleton';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { CheckCircle, Copy, Globe, Lock, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { courseCurriculumInitialFormData } from '@/config';
import VideoPlayer from '@/components/video-player';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AuthContext } from '@/context/auth-context';


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

  const {auth} = useContext(AuthContext);
  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState(null)
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false)
  const [approvalUrl, setApprovalUrl] = useState('');
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

  if(approvalUrl !== ''){
    console.log(approvalUrl);
    window.location.href = approvalUrl;
  }
  console.log(studentViewCourseDetails);

  async function handleCreatePayment() {
    
    const paymentPayload = {
      userId: auth?.user?._id,
      userName: auth?.user?.userName,
      userEmail: auth?.user?.userEmail,
      orderStatus: 'pending',
      paymentMethod: 'paypal',
      paymentStatus: 'indicated' ,
      orderDate: new Date() ,
      paymentId: '' ,
      payerId: '' ,
      instructorId: studentViewCourseDetails?.instructorId ,
      instructorName: studentViewCourseDetails?.instructorName ,
      courseImage: studentViewCourseDetails?.image ,
      courseTitle: studentViewCourseDetails?.title ,
      courseId: studentViewCourseDetails?._id ,
      coursePricing: studentViewCourseDetails?.pricing ,
    }

    console.log(paymentPayload);
    const res = await createPaymentService(paymentPayload)
    
    if(res.success){
      sessionStorage.setItem('currentOrderId', JSON.stringify?.data?.orderId);
      console.log(res?.data?.approveUrl);
      
      setApprovalUrl(res?.data?.approveUrl);
    }
  }

  function handleSetFreePreview(getCurrentVideoInfo){
    console.log(getCurrentVideoInfo);
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl)
  }

  useEffect(() => {
    if(displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true)
  }, [displayCurrentVideoFreePreview])
  useEffect(() => {
    if(currentCourseDetailsId !== null)
      fetchStudentViewCourseDetails()
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if(params?.id) setCurrentCourseDetailsId(params?.id)
  }, [params?.id]);
  
  useEffect(() => {
    if(!location.pathname.includes("course/details")){
      setStudentViewCourseDetails(null)
      setCurrentCourseDetailsId(null)
    }
  })
  if(loadingState) return <Skeleton />

  const getIndexOfFreePreviewUrl = studentViewCourseDetails !== null ? 
  studentViewCourseDetails?.curriculum?.findIndex((item) => item.freePreview) : -1; 
  // console.log('');
  
  console.log(getIndexOfFreePreviewUrl, 
    // getIndexOfFreePreviewUrl !== -1 ? 
    studentViewCourseDetails?.curriculum[getIndexOfFreePreviewUrl]
    //  : null, 
  );

  return (
    <div className=' mx-auto p-4'>
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className='text-3xl font-bold mb-4'>
          {studentViewCourseDetails?.title}
        </h1>
        <p className="text-xl mb-4">
          {studentViewCourseDetails?.subtitle}
  0     </p>
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
                  Course Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                {
                  studentViewCourseDetails?.description
                }
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
                    <li className={`${curriculum?.freePreview ? 'cursor-pointer' : 'cursor-not-allowed'} flex items-center mb-4`}
                      onClick={
                        curriculum?.freePreview 
                        ? () => handleSetFreePreview(curriculum) 
                        : null}>
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
                <VideoPlayer 
                  url={
                    getIndexOfFreePreviewUrl !== -1 ? 
                    studentViewCourseDetails?.curriculum[getIndexOfFreePreviewUrl].videoUrl
                    : ''
                  }
                  width="450px"
                  height="350px" />
              </div>
              <div className="m-4"><span className='text-3xl font-bold'>${studentViewCourseDetails?.pricing}</span></div>
              <Button onClick={handleCreatePayment} className='w-full'>Buy Now</Button>
            </CardContent>
          </Card>
        </aside>
      </div>
      <Dialog open={showFreePreviewDialog} onOpenChange={() => {
        setShowFreePreviewDialog(false)
        setDisplayCurrentVideoFreePreview(null)

      }}>
 
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Course Preview</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="aspect-video mb-2 rounded-lg flex items-center justify-center">
                <VideoPlayer 
                  url={
                    displayCurrentVideoFreePreview
                  }
                  width="450px"
                  height="350px" />
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          {
            studentViewCourseDetails?.curriculum?.filter(item => item.freePreview).map(filteredItem => 
              <p onClick={() => handleSetFreePreview(filteredItem)} className='cursor-pointer text-[16px] font-medium'>
                {filteredItem?.title}
              </p>)
          }
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  )
}

export default StudentViewCourseDetailsPage