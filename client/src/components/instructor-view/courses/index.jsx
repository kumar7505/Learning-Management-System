import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Delete, Edit } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const InstructorCourses = ({ listOfCourses }) => {
    const navigate = useNavigate();
  return (
    <Card>
        <CardHeader className="flex justify-between flex-row items-center">
            <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
            <Button onClick={() => {navigate("/instructor/create-new-course")}} className="p-6">Create New Courses</Button>
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="">Course</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            listOfCourses && listOfCourses > 0 ? 
                            listOfCourses.map(course=>
                                <TableRow>
                                <TableCell className="font-medium">
                                    {course?.title}
                                </TableCell>
                                <TableCell>{course?.students?.length}</TableCell>
                                <TableCell>${course.pricing}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="">
                                        <Edit className="h-6 w-6" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="">
                                        <Delete className="h-6 w-6" />
                                    </Button>
                                </TableCell>
                                </TableRow>
                            ) : null
                        }

                    </TableBody>
                </Table>  

            </div>
        </CardContent>
    </Card>
  )
}

export default InstructorCourses