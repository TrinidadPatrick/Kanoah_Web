import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import CoverPhoto2 from '../MainPage/Components/UtilImage/business2.jpg'
import { categories } from './Components/Categories'
import Tag from '../MainPage/Components/CategoryImage/Tag.png'
import TopRatedServices from './TopRatedServices'
import RecentServices from './RecentServices'
import HowItWorks from './HowItWorks'
import Footer from './Footer'
import UserAllServices from '../../ClientCustomHook/AllServiceProvider';
import { useActionData, useNavigate } from 'react-router-dom'
import LocationSearch from './Components/LocationSearch'
import AOS from 'aos';
import 'aos/dist/aos.css';
import AboutUs from './AboutUs';
import WhyChooseUs from './WhyChooseUs'


const MainPage = ({ scrollToAboutUs, setScrollToAboutUs }) => {
  const aboutUsSectionRef = useRef(null);
  const {services} = UserAllServices()
  const navigate = useNavigate()

  useEffect(() => {
    if(scrollToAboutUs)
    {
      aboutUsSectionRef.current.scrollIntoView({ behavior: 'smooth', block : "center" });
      setScrollToAboutUs(false);
    }
      
  }, [scrollToAboutUs, setScrollToAboutUs]);

  useEffect(()=>{
    AOS.init({
        duration : 700,
        easing : "ease-in-out-cubic"
    })
},[])

  return (
    <div className='h-full w-full relative'>
      {/* Main Page Top Part */}
      <section className='w-full  h-screen  grid place-items-center bg-cover bg-center ' style={{backgroundImage : `url(${CoverPhoto2})`}}>
        
      
      <div className='w-4/5 md:w-[65%]'>
      <h1 className='font-medium mb-4 text-3xl md:text-5xl text-center' style={{color: "#FFFFFF", textShadow: "1px 1px 5px black"}}>Search smarter find faster</h1>
      {/* Search field and search button */}
      <LocationSearch />
      </div>
      
      </section>
      
{/* ************************************************************************************************ */}
      {/* FEATURED CATEGORIES */}
      <section className='w-full h-fit bg-[#f8f8f8] py-16 px-5 md:px-20 lg:px-16 xl:px-32'>
      {/* Main Container */}
  <div className='w-full '>
      {/* Header Container */}
      <div className='border-l-4 border-x-themeGray pl-3'>
      <h1 className='text-3xl md:text-4xl text-themeGray font-bold'>Featured Categories</h1>
      <p className='text-gray-500 font-medium'>Pick from our categories</p>
      </div>
      {/* Category Cards Container */}
      <div className='w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-10  h-fit  px-1 py-5 mt-5'>
      {
        categories.filter(category => category.featured == true).map((category, index)=>{
          return (
          <div onClick={()=>{navigate(`explore?${"category="+category.category_name}&page=1`)}} key={index} className="categoryContainerBox cursor-pointer origin-center w-full xl:w-full hover:shadow-2xl relative rounded-lg  border-2 border-white h-80 sm:h-44 md:h-56 xl:h-64 " style={{backgroundImage : `url(${category.category_image})`,backgroundSize: "cover",boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px"}}>
          <div className='tag bg-themeOrange absolute right-0 top-5 flex  items-center'>
          <div className='font-medium  text-white'>{category.category_name}</div>
          </div>
          {/* <div className='absolute brightness-90 top-3 w-31 py-0 h-9 -right-[1px] pl-6 pr-4 flex items-center ' style={{backgroundImage : `url(${Tag})`,backgroundSize: "100% 35.9px",backgroundRepeat : "no-repeat"}}> */}
          {/* <img className='w-full h-full brightness-75' src={Tag} alt="tag" /> */}
          {/* <div className='font-medium relative -top-[0.4px] bg-white text-gray-500'>{category.category_name}</div> */}
          {/* </div>  */}
          <div className='absolute flex items-center w-full h-full rounded-md  hover:translate-y-0 bg-black opacity-0 hover:opacity-40 hover:rounded-md ease-in duration-200'></div>
          
          </div> 
          )})}   
  </div>
  </div>
  </section>
    
    {/* TOP RATED SERVICES */}
    <section className='top_rated_service w-full h-screen bg-[#f8f8f8] py-[1rem] sm:px-0 md:px-16 lg:px-16'>
    <TopRatedServices services={services} />
    </section>

    {/* RECENT SERVICES */}
    <section className='top_rated_service w-full h-screen bg-[#f8f8f8] py-[1rem] sm:px-0 md:px-16 lg:px-16'>
    <RecentServices services={services} />
    </section>

     {/* How it works */}
    <section ref={aboutUsSectionRef} id='AboutUs' className='about_us w-full h-full xl:h-[85vh] bg-[#f5f5f5] '>
    <AboutUs />
    </section>

    {/* How it works */}
    <section className='top_rated_service w-full h-fit lg:h-fit pb-20 bg-gray-100 py-[1rem] sm:px-10 md:px-16 lg:px-36' >
    <HowItWorks />
    </section>

    {/* Why choose us */}
    <section className='top_rated_service w-full h-fit lg:h-fit pb-20 bg-gray-100 py-[1rem] sm:px-10 md:px-16 lg:px-36' >
    <WhyChooseUs />
    </section>

    {/* Footer */}
    <section className='top_rated_service w-full pb-10 bg-themeBlue py-[1rem] sm:px-10 md:px-16 lg:px-36' >
    <Footer />
    </section>

    
    
    </div>
  )
}

export default MainPage