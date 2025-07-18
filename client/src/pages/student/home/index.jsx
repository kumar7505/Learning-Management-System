import React, { useContext, useEffect } from 'react';
import banner from '../../../assets/banner-img.png';
import { courseCategories } from '@/config';
import { Button } from '@/components/ui/button';
import { StudentContext } from '@/context/student-context';
import { checkCoursePurchaseInfoService, fetchStudentViewCourseListService } from '@/services';
import { AuthContext } from '@/context/auth-context';
import { useNavigate } from 'react-router-dom';
const StudentHomePage = () => {
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState, 
    setLoadingState
  } = useContext(StudentContext);
  const {auth} = useContext(AuthContext);
  const navigate = useNavigate();

  async function fetchAllStudentViewCourses(){
    const res = await fetchStudentViewCourseListService();
    if(res?.success){
      setStudentViewCoursesList(res?.data);
    }
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const res = await checkCoursePurchaseInfoService(getCurrentCourseId, auth?.user?._id);

    if(res?.success){
        if(res?.data){
            navigate(`/course-progress/${getCurrentCourseId}`);
        } else {
            navigate(`/course/details/${getCurrentCourseId}`);
        }
    }
    console.log(res, 'courseNavigate');
  }

  function handleNavigateToCoursesPage(getCurrentId){
    console.log(getCurrentId);
    sessionStorage.removeItem('filters');
    const currentFilter = {
      category: [getCurrentId]
    }
    console.log(currentFilter);
    
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate(`/courses?category=${getCurrentId}`)
  }


  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);
  return (
    <div className="min-h-screen bg-white">
      <section className="flex flex-xol lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
        <div className="lg:width-1/2 lg:pr-12">
          <h1 className="text-4xl font-bold mb-4">Learning that get you</h1>
          <p className='text-xl'>Skills for your present and your future. get started with US</p>
        </div>
        <div className="lg:w-full m-8 lg:mb-0">
          <img 
           src={banner} 
           alt="banner"
           width={600}
           height={400}
           className='w-full h-auto rounded-lg shadow-lg' />
        </div>
      </section>
      <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
        <div className="grid grid-cols-2 sm:grid-col-3 md:grid-cols-4 gap-3">
          {
            courseCategories.map(categoryItem => 
              <Button 
               className="justify-start" 
               variant="outline" 
               key={categoryItem.id}
               onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
               >{categoryItem.label}</Button>
            )
          }
        </div>
      </section>

      <section className="py-12 px-4 lg:px-8">
      <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {
            studentViewCoursesList && studentViewCoursesList.length > 0 ?
            studentViewCoursesList.map(courseItem => 
              <div onClick={() => handleCourseNavigate(courseItem?._id)} className="border rounded-lg overflow-hidden shadow cursor-pointer">
                <img src={courseItem?.image} 
                alt="image"
                width={300}
                height={150}
                className='w-full h-40 object-cover' />
                <div className="p-4">
                  <h3 className='font-bold mb-2'>{courseItem?.title}</h3>
                  <p className="text-sm text-gray-700 mb-2">{courseItem?.instructorName}</p>
                  <p className="font-bold text-{16px}">${courseItem?.pricing}</p>
                </div>
              </div>
            ) 
            :
            ( <h1 className='font-bold text-5xl'>No Courses Found</h1> )
          }
        </div>
      </section>
    </div>
)}

export default StudentHomePage