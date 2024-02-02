import React, { useEffect } from 'react'
import wave from './Components/UtilImage/wave_bg_final.png'
import responsive from '../MainPage/Components/UtilImage/AboutUsImage.png'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AboutUs = () => {

    useEffect(()=>{
        AOS.init({
            duration : 300,
            disable : "phone",
            easing : "ease-in-out-cubic"
        })
    },[])
  return (
    <div className='h-full relative w-full bg-themeBlue semiMd:bg-gray-100 flex flex-col lg:flex-row gap-2'>
        <img src={wave} className="absolute hidden semiMd:block w-full max-w-full object-cover h-full left-0 top-0" />
        {/* Left Section */}
        <div className='h-[80%] w-full  flex flex-col lg:flex-row'>
        <div className='w-full h-full flex flex-col relative z-10 p-10 lg:p-20'>
            <h1 data-aos='fade-right' className='text-4xl font-bold text-gray-100'>About Kanoah</h1>

            <p data-aos='fade-right' className='text-white text-sm md:text-lg lg:text-lg mt-10 leading-9 font-light'>Welcome to KANOAH, your go-to service finder! 
            We connect you with a wide range of services, from skilled professionals to local businesses. 
            Our platform simplifies the search for reliable services, making it easy for you to find what you need. 
            Whether you're looking for home services, professional assistance, or local events, 
            KANOAH is your trusted companion in discovering quality solutions. Experience convenience and excellence 
            with KANOAH - where services meet satisfaction.</p>
        </div>
        {/* Right Section */}
        <div className='w-full h-full flex flex-col items-center justify-center gap-5 relative z-50 '>
        <h1 data-aos='fade-down' className=' text-gray-100 w-full text-center xl:text-start text-3xl font-medium top-0'>Search. Discover. Connect</h1>
        <img data-aos='fade-left' src={responsive} className="w-[300px]  md:w-[300px]   z-10 lg:w-[400px] " />
        <button data-aos='fade-up' className='px-3 py-2  z-30 hover:bg-orange-400 bg-themeOrange text-gray-100 rounded-md flex items-center gap-2 font-medium whitespace-nowrap '><FileDownloadOutlinedIcon /> Download Mobile App</button>
            {/* <h1 data-aos='fade-down-left' className='absolute text-gray-100 text-3xl font-medium top-0 semiMd:top-14 semiMd:left-5'>Search. Discover. Connect</h1>
            <img data-aos='fade-right' src={responsive} className="w-[500px]  md:w-[650px] mt-20 semiMd:mt-0 absolute z-10 lg:w-[900px] lg:mt-8 " />
            <button data-aos='fade-up-left' className='px-3 py-2 lg:bottom-24 left-[20%] md:-bottom-24 semiMd:bottom-10 xl:bottom-3 md:left-[56%] lg:left-[28%] xl:left-[32%] z-30 hover:bg-orange-400 bg-themeOrange text-gray-100 rounded-md flex items-center gap-2 font-medium whitespace-nowrap absolute'><FileDownloadOutlinedIcon /> Download Mobile App</button> */}
        </div>
        </div>
    </div>
  )
}

export default AboutUs