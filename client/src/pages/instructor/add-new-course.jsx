import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import React, { useRef, useState } from 'react'

const AddNewCoursePage = () => {

    const [focusedTab, setFocusedTab] = useState("curriculum");

    // Handle tab click to maintain focus
    const handleTabClick = (value) => {
        setFocusedTab(value);
    };

    return (
    <div className="container mx-auto p-4">
        <div className="flex justify-between">
            <h1 className="text-3xl font-extrabold mb-5">Create a New Course</h1>
            <Button className="text-sm tracking-wider font-bold px-8">
                SUBMIT
            </Button>
        </div>
        <Card>
            <CardContent>
                <div className="container mx-auto p-4">
                    <Tabs defaultValue="curriculum" className='space-y-4'>
                        <TabsList className="inline-flex p-1 space-x-[2px] border rounded-lg shadow-md bg-gray-100">
                            <TabsTrigger
                                value="curriculum"
                                autoFocus
                                onClick={() => handleTabClick("curriculum")}
                                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                                  focusedTab === "curriculum" ? "bg-black text-white" : "bg-gray-200 text-gray-700"
                                } hover:bg-gray-300 border-none outline-none`}
                                > Curriculum </TabsTrigger>
                            <TabsTrigger
                                value="course-landing-page"
                                onClick={() => handleTabClick("course-landing-page")}
                                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                                focusedTab === "course-landing-page" ? "bg-black text-white" : "bg-gray-200 text-gray-700"
                                } hover:bg-gray-300 border-none outline-none`}
                                > Course Landing Page </TabsTrigger>
                            <TabsTrigger
                                value="settings"
                                onClick={() => handleTabClick("settings")}
                                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                                focusedTab === "settings" ? "bg-black text-white" : "bg-gray-200 text-gray-700"
                                } hover:bg-gray-300 border-none outline-none`}
                                > Settings </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}

export default AddNewCoursePage