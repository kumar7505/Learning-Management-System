import React, { createContext, useState } from 'react';

export const StudentContext = createContext(null);

export default function StudentProvider({children}){
  const [loadingState, setLoadingState] = useState(true);
  const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);
  const [studentViewCourseDetails, setStudentViewCourseDetails] = useState(null);
  const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState();
  const [studentBoughtCoursesList, setStudentBoughtCoursesList] = useState([]);
  return (
    <StudentContext.Provider
      value={{ 
        studentViewCoursesList,
        setStudentViewCoursesList,
        loadingState,
        setLoadingState,
        currentCourseDetailsId, 
        setCurrentCourseDetailsId,
        studentViewCourseDetails, 
        setStudentViewCourseDetails,
        studentBoughtCoursesList, 
        setStudentBoughtCoursesList,
      }}>{children}</StudentContext.Provider>
  )
}

