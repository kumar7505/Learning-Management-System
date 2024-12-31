import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { courseCurriculumInitialFormData } from '@/config';
import { InstructorContext } from '@/context/instructor-context'
import React, { useContext } from 'react'

const CourseCurriculum = () => {

  const {courseCurriculumFormData, setCourseCurriculumFormData} = useContext(InstructorContext);
  
  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0]
      },
    ])
  }

  function handleCourseTitleChange(event, currentIndex){
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      title: event.target.value,
    };
    console.log(cpyCourseCurriculumFormData);
    
    setCourseCurriculumFormData(cpyCourseCurriculumFormData)
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Course Curriculum</CardTitle>
      </CardHeader>

      <CardContent>
        <Button onClick={handleNewLecture}>Add Lecture</Button>
        <div className="mt-4 space-y-4">
          {courseCurriculumFormData.map((curriculumItem, index) => {
            return (
              <div className="border p-5 rounded-md" key={index}>
                <div className="flex gap-5 items-center">
                  <h3 className="font-semibold">Lecture {index + 1}</h3>
                  <Input 
                    name={`title-${index+1}`}
                    placeholder="Enter Lecture Title"
                    className="max-w-96 items-center"
                    onChange={(event) => handleCourseTitleChange(event, index)}
                  />
                  <div className="flex space-x-2">
                    <Switch 
                    checked={false}
                    id={`freePreview-${index+1}`}
                    />
                    <Label htmlForm={`freePreview-${index+1}`}>Free Preview</Label>
                  </div>
                </div>
                <div className="mt-4">
                  <Input 
                  type="file"
                  accept="video/*"
                  className="mb-4" />
                </div>
              </div>)
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default CourseCurriculum