import React from 'react'
import explore from './Components/howitworks/Explore.png'
import connect from './Components/howitworks/connect.png'
import rate from './Components/howitworks/Rate.png'
import view from './Components/howitworks/view.png'

const HowItWorks = () => {
  return (
    <div className='w-full p-1 mt-10`'>
    <div className='border-l-4 mx-7 border-x-themeGray pl-3 mt-10'>
      <h1 className='text-sm md:text-sm text-gray-400 font-bold'>How it Works</h1>
      <p className='text-gray-700 text-3xl md:text-4xl font-medium'>Get Started with 4 Easy Steps</p>
      </div>
        {/* Card Containers */}
        <div className='grid gap-y-7 md:grid-cols-2 md:gap-8 lg:grid-cols-4 place-items-center mt-[6rem]'>
            {/* Card1 */}
            <div className='w-[215px] h-[290px] HIW_box p-2 bg-white rounded-lg relative flex flex-col items-center'>
                {/* Circle Container */}
                <div className='w-fit p-1 rounded-full   border-2 bg-white border-blue-400 flex justify-center  mt-1'>
                <div className='w-[30px] h-[30px] rounded-full bg-white z-20 flex items-center justify-center'>
                <p className='text-themeBlue font-medium text-2xl'>1</p>
                </div>
                </div>
                <img className='w-[90%] h-[100px]' src={explore} />
                <h2 className='text-sm font-medium mt-2'>Explore Services</h2>
                <p className='text-semiXs text-center mt-2'>Navigate to the website and browse through the various service categories available.
                Click on a category to view the services offered within that category.
                </p>
                
            </div>
            {/* Card2 */}
            <div className='w-[215px] h-[290px] HIW_box p-2 bg-white rounded-lg relative flex flex-col items-center'>
                {/* Circle Container */}
                <div className='w-fit p-1 rounded-full   border-2 bg-white border-blue-400 flex justify-center  mt-1'>
                <div className='w-[30px] h-[30px] rounded-full bg-white z-20 flex items-center justify-center'>
                <p className='text-themeBlue font-medium text-2xl'>2</p>
                </div>
                </div>
                <img className='w-[90%] h-[100px]' src={view} />
                <h2 className='text-sm font-medium mt-2'>View Services</h2>
                <p className='text-semiXs text-center mt-2'>Navigate to the website and browse through the various service categories available.
                Click on a category to view the services offered within that category.
                </p>
                
            </div>
            
            {/* Card 3 */}
            <div className='w-[215px] h-[290px] HIW_box p-2 bg-white rounded-lg relative flex flex-col items-center'>
                {/* Circle Container */}
                <div className='w-fit p-1 rounded-full   border-2 bg-white border-blue-400 flex justify-center  mt-1'>
                <div className='w-[30px] h-[30px] rounded-full bg-white z-20 flex items-center justify-center'>
                <p className='text-themeBlue font-medium text-2xl'>3</p>
                </div>
                </div>
                <img className='w-[90%] h-[100px]' src={connect} />
                <h2 className='text-sm font-medium mt-2'>Connect with service owner</h2>
                <p className='text-semiXs text-center mt-2'>Browse through the list of service providers offering the service you are interested in.
                Click on a provider's profile to view details such as ratings, reviews, service offerings, and contact information.
                </p>
                
            </div>
                {/* Card4 */}
                <div className='w-[215px] h-[290px] HIW_box p-2 bg-white rounded-lg relative flex flex-col items-center'>
                {/* Circle Container */}
                <div className='w-fit p-1 rounded-full   border-2 bg-white border-blue-400 flex justify-center  mt-1'>
                <div className='w-[30px] h-[30px] rounded-full bg-white z-20 flex items-center justify-center'>
                <p className='text-themeBlue font-medium text-2xl'>4</p>
                </div>
                </div>
                <img className='w-[90%] h-[100px]' src={rate} />
                <h2 className='text-sm font-medium mt-2'>Rate and Feedback</h2>
                <p className='text-semiXs text-center mt-2'>Provide feedback on the service you received, helping us maintain a high standard of quality.
                Rate the service and share your experience, enabling other users to make informed decisions.
                </p>
                
            </div>
            
        </div>
    </div>
  )
}

export default HowItWorks