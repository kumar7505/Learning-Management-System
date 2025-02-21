import React from 'react'
import StudentViewCommonHeader from './header'
import { Outlet, useLocation } from 'react-router-dom'

const StudentViewCommonLayout = () => {
  const location = useLocation()
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