import React from 'react'
import { useEffect } from 'react'
import gear from '../MainPage/Components/UtilImage/CogWheel.png'
import puzzle from '../MainPage/Components/UtilImage/puzzle.png'
import bulb from '../MainPage/Components/UtilImage/bulb.png'
import free from '../MainPage/Components/UtilImage/free.png'
import AOS from 'aos';
import 'aos/dist/aos.css';

const WhyChooseUs = () => {
  useEffect(()=>{
    AOS.init({
        duration : 300,
        disable : "phone",
        easing : "ease-in-out-cubic"
    })
},[])

  return (
    <main className='w-full flex flex-col h-full justify-start space-y-5 '>
      <div className='bg-themeBlue py-16'>
        <h1 className='text-4xl  border-themeBlue font-bold text-white text-center'>Why Choose <span className='text-3xl font-bold text-themeOrange border-b-4 border-themeOrange text-center'>Us?</span></h1>
        <p className='text-center text-white mt-5'>Choose us because we make finding services easy and enjoyable. 
        <br></br>We're here to provide top-notch, reliable service that goes above and beyond to meet your needs.</p>
      </div>

        {/* Cards */}
          <div  className="w-[60%] sm:w-[80%] md:w-[75%] lg:w-[50%] -translate-y-16 grid grid-cols-1  sm:grid-cols-2 gap-3 p-3 h-full mx-auto ">
            <div data-aos='fade-right' className=' shadow-sm rounded-md bg-white flex flex-col justify-center py-5 px-3'>
              <div className='w-12 lg:w-16 mx-auto p-1 rounded-full bg-sky-300 aspect-square mb-3'>
              <img src={puzzle} />
              </div>
              <h2 className='text-xl text-themeOrange text-center font-medium'>Extensive Service Choices</h2>
              <p className='text-gray-700 text-semiSm mt-3 leading-5 text-center'>We take great pride in providing an extensive selection of services that are customized 
              to meet your individual needs. With a variety of options to choose from, you can count on us to help you find the best fit for your needs.</p>
            </div>

            <div data-aos='fade-right' className=' shadow-sm rounded-md bg-white flex flex-col justify-center py-5 px-3'>
              <div className='w-12 lg:w-16 mx-auto p-1 rounded-full bg-sky-300 aspect-square mb-3'>
              <img src={gear} />
              </div>
              <h2 className='text-xl text-themeOrange text-center font-medium'>User-Friendly Platform</h2>
              <p className='text-gray-700 text-semiSm mt-3 leading-5 text-center'>Discover how effortless it is to use our intuitive platform. 
              Our website is thoughtfully designed to make your experience smooth and stress free as you browse and choose the perfect services for your needs.</p>
            </div>

            <div data-aos='fade-left' className=' shadow-sm rounded-md bg-white flex flex-col justify-center py-5 px-3'>
              <div className='w-12 lg:w-16 mx-auto p-1 rounded-full bg-sky-300 aspect-square mb-3'>
              <img src={bulb} />
              </div>
              <h2 className='text-xl text-themeOrange text-center font-medium'>We're here to support</h2>
              <p className='text-gray-700 text-semiSm mt-3 leading-5 text-center'>We are specialized in satisfying customers. We are dedicated in ensuring that our customer 
              can contact us in the best way for them to get hold of us by email, contact and utilizing the report button.</p>
            </div>

            <div data-aos='fade-left' className=' shadow-sm rounded-md bg-white flex flex-col justify-center py-5 px-3'>
              <div className='w-12 lg:w-16 mx-auto p-1 rounded-full bg-sky-300 aspect-square mb-3'>
              <img src={free} />
              </div>
              <h2 className='text-xl text-themeOrange text-center font-medium'>Free to Use</h2>
              <p className='text-gray-700 text-semiSm mt-3 leading-5 text-center'>Discover the advantages of our system, with its free features and no hidden fees or subscriptions. Access a transparent and budget-friendly 
              solution tailored to your needed services.</p>
            </div>

        </div>
    </main>
  )
}

export default WhyChooseUs

// Extensive Service Choices: We take great pride in providing an extensive selection of services that are customized 
// to meet your individual needs. With a variety of options to choose from, you can count on us to help you find the best fit for your needs.


// User-Friendly Platform: Discover how effortless it is to use our intuitive platform. 
// Our website is thoughtfully designed to make your experience smooth and stress free as you browse and choose the perfect services for your needs.
