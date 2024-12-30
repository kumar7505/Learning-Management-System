import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InstructorContext } from '@/context/instructor-context'
import React, { useContext } from 'react'

const CourseCurriculum = () => {

  const {courseCurriculumFormData, setCourseCurriculumFormData} = useContext(InstructorContext);
  console.log(courseCurriculumFormData);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Course Curriculum</CardTitle>
      </CardHeader>

      <CardContent>
        <Button>Add Lecture</Button>
        <div className="mt-4 space-y-4">
          {courseCurriculumFormData.map((curriculumItem, index) => {
            <div className="border p-5 rounded-md">
              <div className="flex gap-5">
                <div className="font-semibold">Lecture {index + 1}</div>
              </div>
            </div>
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default CourseCurriculum