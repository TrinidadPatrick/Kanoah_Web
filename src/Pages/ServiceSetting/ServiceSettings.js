import React from 'react'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BookOnlineOutlinedIcon from '@mui/icons-material/BookOnlineOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import http from '../../http';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import MyService from './MyService';
import PageNotFound from '../NotFoundPage/PageNotFound';
import EditService from '../EditService/EditService';
import Bookings from './BookingManager/Bookings';
import UseInfo from '../../ClientCustomHook/UseInfo';
import MobileServiceSettingSidebar from './MobileServiceSettingSidebar';
import RatingsAndReviews from './RatingsAndReviews/RatingsAndReviews';
import ServiceDashboard from './ServiceDashboard/ServiceDashboard';

const ServiceSettings = () => {
  const {userInformation, authenticated} = UseInfo()
  const [openMobileSidebar, setOpenMobileSidebar] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const {option} = useParams()
  const navigate = useNavigate()

    // Handle the selected settings options
  const handleSelectSettings = (value) => {
        navigate(`/serviceSettings/${value}`)
        // window.location.reload()
  }

  useEffect(()=>{
    if(authenticated === false)
    {
      navigate("/")
    }

  },[authenticated])

  //Check if the url is valid
  useEffect(()=>{
    if(option != "myService" && option != "Bookings" && option != "Reviews" && option != "Dashboard")
    {
      setNotFound(true)
    }
  },[])

  return (

    <div className='w-full h-full flex flex-col relative '>
      {

        notFound ? (<PageNotFound />)
        :
        (
          // Main Container
    <div className='flex w-full h-full'>
    {/* Left section */}
    <section className='w-[310px] lg:w-[320px] h-full bg-white hidden md:flex flex-col'>
    <div className='border-l-4 ps-2 ml-5 border-l-themeBlue mt-5'>
    <h1 className='text-lg lg:text-xl font-bold text-themeBlue '>Service Setting</h1>
    <p className='text-xs lg:text-[0.69rem]'>Manage or edit your service here</p>
    </div>

    <div className='flex flex-col items-start mt-10 space-y-6'>
    <div onClick={()=>{handleSelectSettings("Dashboard")}}  className={`${option == "Dashboard" ? "text-blue-800 bg-blue-100 border-r-4 border-r-blue-800 font-semibold" : ""} flex items-center space-x-2 hover:bg-blue-300 w-full py-4 px-5 cursor-pointer`}><span className="icon-[material-symbols--dashboard-outline-rounded] text-gray-700 text-xl"></span><div className={`${option == "Dashboard" ? "text-blue-800" : "text-gray-700"} text-sm font-medium`}>Dashboard</div></div>
    <div onClick={()=>{handleSelectSettings("myService")}}  className={`${option == "myService" ? "text-blue-800 bg-blue-100 border-r-4 border-r-blue-800 font-semibold" : ""} flex items-center space-x-2 hover:bg-blue-300 w-full py-4 px-5 cursor-pointer`}><span className="icon-[material-symbols--business-center-outline] text-gray-600 text-xl"></span><div className={`${option == "myService" ? "text-blue-800" : "text-gray-700"} text-sm font-medium`}>My Service</div></div>
    <div onClick={()=>{handleSelectSettings("Bookings")}}  className={`${option == "Bookings" ? "text-blue-800 bg-blue-100 border-r-4 border-r-blue-800 font-semibold" : ""} flex items-center space-x-2 hover:bg-blue-300 w-full py-4 px-5 cursor-pointer`}><BookOnlineOutlinedIcon fontSize='small' className='text-gray-600' /><div className={`${option == "Bookings" ? "text-blue-800" : "text-gray-700"} font-medium text-sm`}>Bookings</div></div>
    <div onClick={()=>{handleSelectSettings("Reviews")}}  className={`${option == "Reviews" ? "text-blue-800 bg-blue-100 border-r-4 border-r-blue-800 font-semibold" : ""} flex items-center space-x-2 hover:bg-blue-300 w-full py-4 px-5 cursor-pointer`}><GradeOutlinedIcon fontSize='small' className='text-gray-600' /><div className={`${option == "Reviews" ? "text-blue-800" : "text-gray-700"} font-medium text-sm`}>Reviews</div></div>
    </div>

    </section>


    {/* Right section */}
    <section className='w-full h-full flex flex-col relative overflow-auto '>
    
      <button onClick={()=>setOpenMobileSidebar(true)} className="absolute md:hidden top-4 bg-white shadow-md border rounded-md w-8 h-8 flex items-center justify-center left-2">
      <span className="icon-[icon-park-outline--hamburger-button] bg-black  text-2xl"></span>
      </button>
      {option == "Bookings" ? <Bookings /> : option == "myService" ? <MyService /> : option == "Reviews" ?  <RatingsAndReviews /> : option == "Dashboard" ?  <ServiceDashboard /> : <PageNotFound /> }
      <div onClick={()=>setOpenMobileSidebar(false)} className={`${openMobileSidebar ? "" : "hidden"} w-full h-full bg-[#00000080] absolute`}></div>
    </section>

    {/* mobile Sidebar */}
    <MobileServiceSettingSidebar openMobileSidebar={openMobileSidebar} setOpenMobileSidebar={setOpenMobileSidebar} />
    </div>
        )
      }
    
    </div>

  )
}

export default ServiceSettings