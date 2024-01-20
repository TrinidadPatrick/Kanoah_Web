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

const ServiceSettings = () => {
  const {userInformation, authenticated} = UseInfo()
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
    if(option != "myService" && option != "Bookings" && option != "BookingHistory")
    {
      setNotFound(true)
    }
  },[])

  return (

        <div className='w-full h-screen flex flex-col '>
      {

        notFound ? (<PageNotFound />)
        :
        (
          // Main Container
    <div className='flex w-full h-full'>
    {/* Left section */}
    <section className='w-[370px] h-full bg-white hidden md:flex flex-col'>
    <div className='border-l-4 ps-2 ml-5 border-l-themeBlue mt-5'>
    <h1 className='text-xl lg:text-3xl font-bold text-themeBlue '>Service Setting</h1>
    <p className='text-[0.79rem]'>Manage or edit your service here</p>
    </div>

    <div className='flex flex-col items-start mt-10 space-y-6'>
    <div  onClick={()=>{handleSelectSettings("myService")}}  className={`${option == "myService" ? "text-blue-800 bg-blue-100 border-r-4 border-r-blue-800 font-semibold" : ""} flex items-center space-x-2 hover:bg-blue-300 w-full py-4 px-5 cursor-pointer`}><PersonOutlinedIcon fontSize='small' className='text-gray-600' /><Link to="" className={`${option == "myService" ? "text-blue-800" : "text-gray-700"} font-medium`}>My Service</Link></div>
    <div  onClick={()=>{handleSelectSettings("Bookings")}}  className={`${option == "Bookings" ? "text-blue-800 bg-blue-100 border-r-4 border-r-blue-800 font-semibold" : ""} flex items-center space-x-2 hover:bg-blue-300 w-full py-4 px-5 cursor-pointer`}><BookOnlineOutlinedIcon fontSize='small' className='text-gray-600' /><Link to="" className={`${option == "Bookings" ? "text-blue-800" : "text-gray-700"} font-medium`}>Bookings</Link></div>
    <div  onClick={()=>{handleSelectSettings("Reviews")}}  className={`${option == "Reviews" ? "text-blue-800 bg-blue-100 border-r-4 border-r-blue-800 font-semibold" : ""} flex items-center space-x-2 hover:bg-blue-300 w-full py-4 px-5 cursor-pointer`}><GradeOutlinedIcon fontSize='small' className='text-gray-600' /><Link to="" className={`${option == "Reviews" ? "text-blue-800" : "text-gray-700"} font-medium`}>Reviews</Link></div>
    
    </div>

    </section>


    {/* Right section */}
    <section className='w-full h-full flex pt-5'>
    {option == "Bookings" ? <Bookings /> : option == "myService" ? <MyService /> : option == "myService" ?  <EditService /> : "" }
    </section>
    </div>
        )
      }
    
    </div>

  )
}

export default ServiceSettings