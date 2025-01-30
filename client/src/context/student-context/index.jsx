import React, { createContext, useState } from 'react';

export const StudentContext = createContext(null);

export default function StudentProvider({children}){
  const [loadingState, setLoadingState] = useState(true);
     const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);
    return (
        <StudentContext.Provider
          value={{ 
            studentViewCoursesList,
            setStudentViewCoursesList,
            loadingState,
            setLoadingState,
          }}>{children}</StudentContext.Provider>
    )
}

