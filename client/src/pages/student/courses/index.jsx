import { Button, } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { filterOptions, sortOptions } from '@/config';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@radix-ui/react-dropdown-menu';
import {  } from '@radix-ui/react-label';
import { ArrowUpDownIcon } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { StudentContext } from '@/context/student-context';
import { checkCoursePurchaseInfoService, fetchStudentViewCourseListService } from '@/services';
import { cardPropDefs } from '@radix-ui/themes/dist/cjs/components/card.props';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Skeleton } from '@radix-ui/themes';
import { AuthContext } from '@/context/auth-context';


function createSearchParamsHelper(filterParams){
    const queryParams = [];


    for (const [key, value] of Object.entries(filterParams)){
        if(Array.isArray(value) && value.length > 0){
            const paramValue = value.join(',');

            queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);

        }
    }
    return queryParams.join('&');

}
const StudentViewCoursesPage = () => {
    const navigate = useNavigate();
    const {auth} = useContext(AuthContext);
    const [sort, setSort] = useState('price-lowtohigh');
    const [filters, setFilters] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        studentViewCoursesList,
        setStudentViewCoursesList,
        loadingState, 
        setLoadingState
    } = useContext(StudentContext);
    
    function handleFilterOnChange(getSectionId, getCurrentOption){
        let cpyFilters = {...filters};
        const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

        console.log(indexOfCurrentSection, getSectionId);
        if(indexOfCurrentSection === -1){
            cpyFilters = {
                ...cpyFilters,
                [getSectionId] : [getCurrentOption.id]
            }

        } else {
            const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
                getCurrentOption.id
            );
            
            if(indexOfCurrentOption === -1) {
                cpyFilters[getSectionId].push(getCurrentOption.id);
                
            } else {
                cpyFilters[getSectionId].splice(getCurrentOption, 1);
            }

        }

        setFilters(cpyFilters);
        sessionStorage.setItem('filters', JSON.stringify(cpyFilters));

        
    }
    async function fetchAllStudentViewCourses(filters, sort){
        const query = new  URLSearchParams({
            ...filters, 
            sortBy: sort,
        })
        const res = await fetchStudentViewCourseListService(query);
        if(res.success){
            setStudentViewCoursesList(res?.data);
            setLoadingState(false);
        }
        
    }

    async function handleCourseNavigate(getCurrentCourseId) {
        const res = await checkCoursePurchaseInfoService(getCurrentCourseId, auth?.user?._id);

        if(res?.success){
            if(res?.data){
                navigate(`/course-progress/${getCurrentCourseId}`);
            } else {
                navigate(`/course/details/${getCurrentCourseId}`);
            }
        }
        console.log(res, 'courseNavigate');
    }

    useEffect(() => {
        const buildQueryStringFilters = createSearchParamsHelper(filters);
        setSearchParams(new URLSearchParams(buildQueryStringFilters));
    }, [filters]);

    useEffect(() => {
        setSort('price-lowtohigh');
        setFilters(JSON.parse(sessionStorage.getItem('filters')) || {})
    }, [])

    useEffect(() => {
        if(filters !== null && sort !== null)
            fetchAllStudentViewCourses(filters, sort);
    }, [filters, sort]);

    console.log(filters);
    
    
  return (
    <div className='conayiner mx-auto p-4'>
        <h1 className="text-3xl font-bold mb-4">All Courses</h1>
        <div className="flex flex-col md:flex-row gap-4">
            <aside className="w-full md:w-64 ">
                <div className="p-4 ">
                    {
                        Object.keys(filterOptions).map((keyItem) => (
                            <div className="p-4 border-b" key={keyItem}>
                                <h3 className='font-bold mb-3'>{keyItem.toUpperCase()}</h3>
                                <div className="grid gap-2 mt-2">
                                    {
                                        filterOptions[keyItem].map(option => (
                                            <Label className='flex font-medium items-center gap-3'>
                                                <Checkbox 
                                                    checked={
                                                        filters && 
                                                        Object.keys(filters).length>0 &&
                                                        filters[keyItem] &&
                                                        filters[keyItem].indexOf(option.id) > -1 
                                                    }
                                                    onCheckedChange={() => handleFilterOnChange(keyItem, option)} 
                                                />
                                                {option.label}
                                            </Label>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </aside>
            <main className="flex-1">
                <div className="flex justify-end items-center mb-4 gap-5">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-3 p-4">
                                <ArrowUpDownIcon className="h-4 w-4" />
                                <span className='text-16px font-medium'>Sort by</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuRadioGroup value={sort} onValueChange={(value) => {setSort(value)}} className='shadow rounded-md'>
                                {
                                    sortOptions.map((sortItem) => (<DropdownMenuRadioItem value={sortItem.id} key={sortItem.id} className='p-1'>
                                        {sortItem.label}
                                    </DropdownMenuRadioItem> 
                                    ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <span className='text-sm text-black font-bold'>{studentViewCoursesList.length} Results</span>
                </div>
                <div className="space-y-4">
                    {
                        loadingState && <Skeleton />
                    }
                    {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                        studentViewCoursesList.map((courseItem) => (
                            <Card key={courseItem?._id} onClick={() => handleCourseNavigate(courseItem?._id)} className="cursor-pointer shadow-md">
                                <CardContent className="flex gap-4 p-4">
                                    <div className="w-48 h-42 flex-shrink-0">
                                        <img
                                            src={courseItem?.image || 'https://via.placeholder.com/150'}
                                            className="w-full h-full object-cover"
                                            alt={courseItem?.title || 'Course Image'}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl mb-2">{courseItem?.title}</h2>
                                        Created By <span className="font-bold">{courseItem?.instructorName}</span>
                                        <p className="text-[15px] text-gray-600 mt-3 mb-2">
                                            {`${courseItem?.curriculum?.length}
                                                ${courseItem?.curriculum?.length <= 1 ? 'Lecture' : 'Lectures'} - ${courseItem?.level.toUpperCase()} Level`
                                            }
                                        </p>
                                        <p className="font-bold text-lg">${courseItem?.pricing}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : loadingState ? (
                        <Skeleton />
                    ) : (
                        <h1 className="text-3xl font-medium text-center">No Courses Found</h1>
                    )}
                </div>

            </main>
        </div>
    </div>
  )
}

export default StudentViewCoursesPage