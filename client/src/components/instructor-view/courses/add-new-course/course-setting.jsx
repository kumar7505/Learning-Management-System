import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InstructorContext } from '@/context/instructor-context';
import { mediaUploadService } from '@/services';
import { Label } from '@radix-ui/react-dropdown-menu';
import React, { useContext } from 'react';

const CourseSettings = () => {
  const {courseLandingFormData, setCourseLandingFormData} = useContext(InstructorContext);

  async function handleImageUploadChange(event){
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        const response = await mediaUploadService(imageFormData);
        
        if(response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          })
        }
        
      } catch(e) {
        console.log(e);
        
      }
    }

  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <CardContent>
        {courseLandingFormData?.image ? (
          <img src={courseLandingFormData.image} />
        ) : ( <div className="flex flex-col gap-3">
          <Label>Upload Course Image</Label>
          <Input 
           onChange={(event) => {handleImageUploadChange(event)}}
           type="file"
           accept="image/*"
           className="mb-4"
          />
        </div>
        )
      }
      </CardContent>
    </Card>
  )
};

export default CourseSettings;