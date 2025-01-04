import MediaProgressBar from '@/components/media-progress-bar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InstructorContext } from '@/context/instructor-context';
import { mediaUploadService } from '@/services';
import { Label } from '@radix-ui/react-dropdown-menu';
import React, { useContext } from 'react';

const CourseSettings = () => {
  const {courseLandingFormData, 
    setCourseLandingFormData,    
    mediaUploadProgress, 
    setMediaUploadProgress, 
    mediaUploadProgressPercentage, 
    setMediaUploadProgressPercentage
  } = useContext(InstructorContext);

  async function handleImageUploadChange(event){
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(imageFormData, setMediaUploadProgressPercentage);
        
        if(response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          })
        }
        
      } catch(e) {
        console.log(e);
        
      }
      setMediaUploadProgress(false);
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <div className="p-4">
        {
          mediaUploadProgress ? 
          <MediaProgressBar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage} /> : null
        }
      </div>
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