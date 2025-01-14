import MediaProgressBar from '@/components/media-progress-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import VideoPlayer from '@/components/video-player';
import { courseCurriculumInitialFormData } from '@/config';
import { InstructorContext } from '@/context/instructor-context'
import { mediaBulkUploadService, mediaDeleteService, mediaUploadService } from '@/services';
import { Upload } from 'lucide-react';
import React, { useContext, useRef } from 'react'

const CourseCurriculum = () => {

  const {
    courseCurriculumFormData, 
    setCourseCurriculumFormData,
    mediaUploadProgress, 
    setMediaUploadProgress, 
    mediaUploadProgressPercentage, 
    setMediaUploadProgressPercentage
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);
  
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
    
    setCourseCurriculumFormData(cpyCourseCurriculumFormData)
  }

  function handleFreePreviewChange(currentValue, currentIndex){
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      freePreview: currentValue,
    };
    
    setCourseCurriculumFormData(cpyCourseCurriculumFormData)
    
  }

  async function handleSingleLectureUpload(event, currentIndex){
    console.log(event.target.files[0]);
    const selectedFile = event.target.files[0];

    if(selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);
      
      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(videoFormData, setMediaUploadProgressPercentage);
        if(response.success) {
          let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
          cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(cpyCourseCurriculumFormData);
          setMediaUploadProgress(false);
        }
        
      } catch(err) {
        console.log("kum");
        
      }
    }
  }

  async function handleReplaceVideo(currentIndex){
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoPublicId = cpyCourseCurriculumFormData[currentIndex].public_id;

    const deleteCurrentMediaResponse = await mediaDeleteService(getCurrentVideoPublicId);
    console.log(deleteCurrentMediaResponse);

    if(deleteCurrentMediaResponse?.success){
      cpyCourseCurriculumFormData[currentIndex] = {
        ...cpyCourseCurriculumFormData[currentIndex],
        videoUrl: '',
        public_id: '',
      }
    }
    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    console.log(courseCurriculumFormData);
    
    
  }
  function isCourseCurriculumFormDataValid(){
    return courseCurriculumFormData.every((item) => {
      return (item && 
        typeof item === 'object' && 
        item.title.trim() !== '' &&
        item.videoUrl.trim() !== ''
      );
    });
  }

  function handleOpenBulkUploading(event){
    console.log('kumar', event);
    
    bulkUploadInputRef.current?.click();
  }

  function areAllCourseCurriculumFormDataObjectsEmpty(arr){
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if(typeof value === 'boolean'){
          console.log(98);
          
          return true;
        }
        console.log(value);
        
        return value === ''
      })
    })
  }

  async function handleDeleteLecture(currentIndex){
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentSelectedVideoPublicId = cpyCourseCurriculumFormData[currentIndex]?.public_id;

    const response = await mediaDeleteService(getCurrentSelectedVideoPublicId);
    if(response?.success){
      cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter((_, index) => index !== currentIndex);

      setCourseCurriculumFormData(cpyCourseCurriculumFormData)
    }
  }

  async function handleMediaBulkUpload(event){
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();

    selectedFiles.forEach(fileItem => bulkFormData.append('files', fileItem));
    try{
      setMediaUploadProgress(true);
        const response = await mediaBulkUploadService(bulkFormData, setMediaUploadProgressPercentage);
        console.log('bulk', response);

        if(response?.success){
          console.log(areAllCourseCurriculumFormDataObjectsEmpty(response?.data), 'boring');
          let cpyCourseCurriculumFormData = areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData)
          ? [] : [...courseCurriculumFormData];
          cpyCourseCurriculumFormData = [
            ...cpyCourseCurriculumFormData,
            ...response?.data?.map((item, index) => ({
              videoUrl: item?.url,
              public_id: item?.public_id,
              title: `Lecture${cpyCourseCurriculumFormData.length + index + 1}`,
              freePreview: false
            }))
          ];
          setCourseCurriculumFormData(cpyCourseCurriculumFormData);
          setMediaUploadProgress(false);
          
        }
        
    }catch(e){
      console.log(e);
    }

  console.log(courseCurriculumFormData );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Create Course Curriculum</CardTitle>
        <div>
          <input type="file" 
          ref={bulkUploadInputRef}
          accept="video/*"
          multiple
          className="hidden"
          id="bulk-media-upload"
          onChange={handleMediaBulkUpload} />
          <Button
            as="label"
            htmlFor="bulk-media-upload"
            variant="outline"
            className="cursor-pointer"
            onClick={handleOpenBulkUploading}>
            <Upload className="w-4 h-5 mr-2" /> Bulk Upload
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Button disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress} onClick={handleNewLecture}>Add Lecture</Button>
        {
          mediaUploadProgress ? 
          <MediaProgressBar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage} /> : null
        }
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
                    value={courseCurriculumFormData[index]?.title}
                  />
                  <div className="flex space-x-2">
                    <Switch 
                     onCheckedChange={(value) => handleFreePreviewChange(value, index)}
                     checked={courseCurriculumFormData[index]?.freePreview}
                     id={`freePreview-${index+1}`}
                    />
                    <Label htmlForm={`freePreview-${index+1}`}>Free Preview</Label>
                  </div>
                </div>
                <div className="mt-4">
                  {
                    courseCurriculumFormData[index]?.videoUrl ?
                    <div className="flex gap-3">
                      <VideoPlayer 
                        url={courseCurriculumFormData[index]?.videoUrl}
                        width="450px"
                        height="200px"
                      />
                      <Button onClick={() => handleReplaceVideo(index)}>Replace video</Button>
                      <Button onClick={() => handleDeleteLecture(index)} className="bg-red-900">Delete Lecture</Button>
                    </div> : 
                    <Input 
                    type="file"
                    accept="video/*"
                    className="mb-4"
                    onChange={(event) => handleSingleLectureUpload(event, index)} />
                  }
                </div>
              </div>)
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default CourseCurriculum;