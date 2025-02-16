import React from 'react'
import StudentViewCommonHeader from './header'
import { Outlet, useLoaction } from 'react-router-dom'

const StudentViewCommonLayout = () => {
  const location = useLoaction()
  return (
    <div>
      {
        !location.pathname.includes("course-progress") ? (
          
        <StudentViewCommonHeader />) : null
      }
        <Outlet/>
    </div>
  )
}

export default StudentViewCommonLayout