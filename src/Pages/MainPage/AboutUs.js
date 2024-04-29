import React, { useEffect } from 'react'
import wave from './Components/UtilImage/wave_bg_final.png'
import responsive from '../MainPage/Components/UtilImage/AboutUsImage.png'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AboutUs = () => {

    useEffect(()=>{
        AOS.init({
            duration : 250,
            disable : "phone",
            easing : "ease-in-out-cubic"
        })
    },[])
  return (
    <div className='h-fit lg:h-full relative w-full py-5 md:py-0 bg-themeBlue lg:bg-gray-100 flex flex-col lg:flex-row gap-2'>
        <img src={wave} className="absolute hidden drop-shadow-lg lg:block w-full max-w-full object-cover h-full left-0 top-0" />
        {/* Left Section */}
        <div className='h-[80%] w-full  flex flex-col lg:flex-row'>
        <div className='w-full h-full flex flex-col relative z-10 p-10 '>
            <h1 data-aos='fade-right' className='text-3xl text-center lg:text-start md:text-4xl font-bold text-themeOrange'>About Kanoah</h1>
            <p data-aos='fade-right' className='text-white text-center lg:text-start text-sm md:text-base lg:text-lg mt-5 leading-6 md:leading-9 font-light'>Welcome to KANOAH, your go-to service finder! 
            We connect you with a wide range of services, from skilled professionals to local businesses. 
            Our platform simplifies the search for reliable services, making it easy for you to find what you need. 
            Whether you're looking for home services, professional assistance, or local events, 
            KANOAH is your trusted companion in discovering quality solutions. Experience convenience and excellence 
            with KANOAH - where services meet satisfaction.</p>
        </div>
        {/* Right Section */}
        <div className='w-full pb-5 h-full flex flex-col items-center justify-center gap-5 relative '>
        <h1 data-aos='fade-down' className=' text-gray-100 w-full text-center xl:text-start text-3xl font-medium top-0'>Search. Discover. Connect</h1>
        <img data-aos='fade-left' src={responsive} className="w-[250px]  md:w-[300px] lg:w-[400px] " />
        <button onClick={()=>window.location.href = "https://expo.dev/artifacts/eas/nzQJYeMEZDUEf61SWCgD8W.apk"} data-aos='fade-up' className='px-3 py-2  z-30 hover:bg-orange-400 bg-themeOrange text-gray-100 rounded-md flex items-center gap-2 font-medium whitespace-nowrap '><FileDownloadOutlinedIcon /> Download Mobile App</button>
        </div>
        </div>
    </div>
  )
}

export default AboutUs