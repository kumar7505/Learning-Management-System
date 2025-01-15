import React from 'react'
import banner from '../../../assets/banner-img.png'
import { courseCategories } from '@/config'
import { Button } from '@/components/ui/button'
const StudentHomePage = () => {
  
  return (
    <div className="min-h-screen bg-white">
      <section className="flex flex-xol lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
        <div className="lg:width-1/2 lg:pr-12">
          <h1 className="text-4xl font-bold mb-4">Learning that get you</h1>
          <p className='text-xl'>Skills for your present and your future. get started with US</p>
        </div>
        <div className="lg:w-full m-8 lg:mb-0">
          <img 
           src={banner} 
           alt="banner"
           width={600}
           height={400}
           className='w-full h-auto rounded-lg shadow-lg' />
        </div>
      </section>
      <section className="py-8 px-4 lg:px-8 bg:gray-100">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
        <div className="grid grid-cols-2 sm:grid-col-3 md:grid-cols-4">
          {
            courseCategories.map(categoryItem => 
              <Button className="justify-start" variant="outline" key={categoryItem.id}>{categoryItem.label}</Button>
            )
          }
        </div>
      </section>
    </div>
)}

export default StudentHomePage