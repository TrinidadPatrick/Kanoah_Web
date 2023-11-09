import React from 'react'
import BusinessInformation from './BusinessInformation'
import ContactAndPayment from './ContactAndPayment'
import background1 from './Utils/images/background5.svg'

const ServiceRegistrationPage = () => {
    const page = 2
  return (
    // Main Container
    <div className='w-full h-fit md:h-screen  bg-[#f9f9f9] flex items-center justify-center'>
    
    {/* Main Card */}
    <section className='w-full bg-white h-full md:w-[90%] lg:w-[850px] xl:w-[60%] md:h-[80%] mt-20 md:mt-16 relative shadow-md md:rounded-md flex flex-col md:flex-row p-1'>
    {/* Left Side */}
    <div className='h-fit md:h-full  md:w-[400px] p-3'>

    {/* left Blue Card */}
    <div className='w-full h-[100px] md:h-full py-10 border rounded-md md:space-y-8 flex items-center justify-center customBG relative md:ps-5 md:pt-5  md:flex-col  md:justify-start'>
    {/* Step 1 */}
    <div className='flex h-12 px-2 md:px-0 md:w-full justify-center md:justify-start'>
    {/* For circle */}
    <div className='w-12 p-1.5 h-full '>
    <div style={{backgroundColor: page == 1 ? "hsl(229, 24%, 87%)" : "", color: page == 1 ? "hsl(213, 96%, 18%)" : "hsl(229, 24%, 87%)"}} className='border-2 w-full h-full rounded-full grid place-items-center'>1</div>
    </div>
    {/* For Words */}
    <div className='hidden md:flex pt-1 flex-col text-left ps-1'>
    <h2 className='text-sm text-gray-200 font-medium'>STEP 1</h2>
    <p className='text-sm text-gray-100 font-bold'>Basic Information</p>
    </div>
    </div>
    {/* Step 2 */}
    <div className='flex h-12 px-2 md:px-0 md:w-full justify-center md:justify-start'>
        {/* For circle */}
        <div className='w-12 p-1.5 h-full '>
            <div style={{backgroundColor: page == 2 ? "hsl(229, 24%, 87%)" : "", color: page == 2 ? "hsl(213, 96%, 18%)" : "hsl(229, 24%, 87%)"}} className=' w-full h-full rounded-full border-2  text-Lightgray grid place-items-center'>2</div>
        </div>
        {/* For Words */}
        <div className='hidden md:flex pt-1 flex-col text-left ps-1'>
            <h2 className='text-sm text-gray-200 font-medium'>STEP 2</h2>
            <p className='text-sm text-gray-100 font-bold'>Contact and Payment</p>
        </div>
    </div>

    {/* Step 3 */}
    <div className='flex h-12 px-2 md:px-0 md:w-full justify-center md:justify-start'>
    {/* For circle */}
    <div className='w-12 p-1.5 h-full '>
    <div style={{backgroundColor: page == 3 ? "hsl(229, 24%, 87%)" : "", color: page == 3 ? "hsl(213, 96%, 18%)" : "hsl(229, 24%, 87%)"}} className=' w-full h-full rounded-full border-2  text-Lightgray grid place-items-center'>2</div>
    </div>
    {/* For Words */}
    <div className='hidden md:flex pt-1 flex-col text-left ps-1'>
    <h2 className='text-sm text-gray-200 font-medium'>STEP 3</h2>
    <p className='text-sm text-gray-100 font-bold'>Address</p>
    </div>
    </div>

    </div>
    </div>

    {/* Right Side */}
    {/* Container */}
    <div className='w-full h-fit md:h-full flex flex-col justify-stretch bg-white p-4 '>
    {/* Card */}

    <h1 className='text-xl font-semibold block md:hidden'>Service Information</h1>
    {page == 1 ? (<BusinessInformation />) : page == 2 ? (<ContactAndPayment />) : ""}
    
    </div>
    </section>



    

    </div>
  )
}

export default ServiceRegistrationPage