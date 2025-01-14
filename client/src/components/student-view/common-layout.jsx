import React from 'react'
import StudentViewCommonHeader from './header'
import { Outlet } from 'react-router-dom'

const StudentViewCommonLayout = () => {
  return (
    <div>
        <StudentViewCommonHeader />
        <Outlet/>
    </div>
  )
}

export default StudentViewCommonLayout