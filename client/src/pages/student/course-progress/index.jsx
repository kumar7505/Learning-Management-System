import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoPlayer from '@/components/video-player';
import { AuthContext } from '@/context/auth-context';
import { StudentContext } from '@/context/student-context';
import { getCurrentCourseProgressService, markLectureAsViewedService, resetCourseProgressService } from '@/services';
import { Check, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import Confetti from 'react-confetti';
import { useNavigate, useParams } from 'react-router-dom';

const StudentViewCourseProgressPage = () => {
  
  const navigate = useNavigate();
  const {auth} = useContext(AuthContext);
  const {studentCurrentCourseProgress, setStudentCurrentCourseProgress} = useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true); 
  const {id} = useParams();
  console.log(studentCurrentCourseProgress?.courseDetails?.curriculum);


  async function fetchCurrentCourseProgress(){
    const res = await getCurrentCourseProgressService(auth?.user?._id, id);
    console.log("Course progress response:", res);

    if(res?.success){
      if(!res?.data?.isPurchased){
        console.log("Locking course because isPurchased is false!");
        setLockCourse(true);
        console.log(res);
      } else {
        setLockCourse(false); 
        setStudentCurrentCourseProgress({
          courseDetails: res?.data?.courseDetails,
          progress: res?.data?.progress,
        });

        if(res?.data?.completed){
          setCurrentLecture(res?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);

          return;
        }
        console.log(res?.data?.progress.length);


        if(res?.data?.progress.length === 0){
          console.log(res?.data?.courseDetails?.curriculum[0], 'currentLecture');
           
          setCurrentLecture(res?.data?.courseDetails?.curriculum[0])
        } else {
          console.log('kumar89');
          
          const lastIndexOfViewedAsTrue = res?.data?.progress.reduceRight(
            (acc, obj, index) => (              
              acc === -1 && obj.viewed ? index : acc
            ), -1
          );
          
          setCurrentLecture(res?.data?.courseDetails?.curriculum[lastIndexOfViewedAsTrue + 1]);
        }
      }
    }
  }

  async function updateCourseProgress() {
    if(currentLecture){
      const res = await markLectureAsViewedService(auth?.user?._id, studentCurrentCourseProgress?.courseDetails?._id, currentLecture?._id)
    
      if(res?.success){
        fetchCurrentCourseProgress()
      }
    }
  }

  async function handleRewatchCourse(){
    console.log('kumar1');
    const res = await resetCourseProgressService(auth?.user?._id, studentCurrentCourseProgress?.courseDetails?._id);
    console.log('kumar1');
    if(res?.success){
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      await fetchCurrentCourseProgress();
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if(currentLecture?.progressValue === 1)
      updateCourseProgress()
  }, [currentLecture])
  
  useEffect(() => {
    if(showConfetti)
      setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);

  // console.log(currentLecture, 'currentLecture');
  
  return (
    <div className='flex flex-col h-screen bg-[#1c1d1f] text-white'>
      {
        showConfetti && <Confetti />
      }
      <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <Button onClick={() => navigate('/student-courses')} className="bg-white text-black" variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2"/>
            Back to My Courses Page
          </Button>
          <h1 className="text-lg font-bold hidden md:block"> 
            {
              studentCurrentCourseProgress?.courseDetails?.title
            }
          </h1>
        </div>
        <Button onClick={() => setIsSideBarOpen(prev => !prev)}>
          {
            isSideBarOpen ? 
            <ChevronRight className='h-5 w-5'/> : <ChevronLeft className='h-5 w-5'/>
          }
        </Button>
        
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className={`transition-all duration-300 ${isSideBarOpen ? 'w-[calc(100%-400px)]' : 'w-full'}`}>
          <VideoPlayer 
            width="100%"
            height="500px"
            url={currentLecture?.videoUrl} 
            onProgressUpdate={setCurrentLecture}
            progressData={currentLecture}
          />
          <div className="p-6 bg-[#1c1d1f]">
            <h2 className='text-2xl font-bold mb-2'>
              {currentLecture?.title}
            </h2>
          </div>
        </div>
        
        <div className={`w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 ${isSideBarOpen ? 'translate-x-0 block' : 'translate-x-full hidden'}`}>
          <Tabs defaultValue='content' className='h-full flex flex-col'>
            <TabsList className="grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-14">
              <TabsTrigger value="content" className="data-[state=active] bg-white text-black rounded-none h-full">Course Content</TabsTrigger>
              <TabsTrigger value="overview" className="data-[state=active] bg-white text-black rounded-none h-full">OverView</TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-4">
                  {
                    studentCurrentCourseProgress?.courseDetails?.curriculum.map((item) => (
                      <div key={item?._id} className="flex items-center space-x-2 text-sm text-white font-bold cursor-pointer ">
                        {
                          studentCurrentCourseProgress?.progress?.find(progressItem => progressItem.lectureId === item?._id)?.viewed ? (
                          <Check className='h-4 w-4 text-green-500' /> ) : (
                          <Play className="h-4 w-4" /> )
                        }
                        <span className='text-white'>{item?.title}</span>
                      </div>
                    ))
                  }
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent  value="overview" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <h2 className='text-xl font-bold mb-4'>About this Course</h2>
                  <p className='text-gray-400'>{studentCurrentCourseProgress?.courseDetails?.description}</p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Dialog open={lockCourse}>
        <DialogContent showOverlay={false} className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>You can't view this page</DialogTitle>
              <DialogDescription>
                Please purchase this course to get access
              </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showCourseCompleteDialog}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Congradulation!
            </DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              <Label>You have completed thos course</Label>
              <div className="flex flex-row col-3 gap-3">
                <Button onClick={() => navigate('/student-courses')}>My Courses Page</Button>
                <Button onClick={handleRewatchCourse}>Rewatch Course</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default StudentViewCourseProgressPage;