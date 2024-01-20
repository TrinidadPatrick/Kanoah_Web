import React from 'react'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BookOnlineOutlinedIcon from '@mui/icons-material/BookOnlineOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import http from '../../http';
import UserInformation from './UserInformation/UserInformation';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import UserBookings from './UserBookings/UserBookings';

const CustomerAccount = () => {
    const {optn} = useParams()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [selectedSettings, setSelectedSettings] = useState(optn)

    // Get the selected settings from localstorage
    useEffect(() => {
      setSelectedSettings(optn)
    }, [])


    

  return (

    <div className='w-full h-screen'>
      {
        loading ? ("") :
        (
          // Main Container
    <div className='flex w-full'>
    {/* Left section */}
    <section className='w-[370px] h-full bg-white hidden md:flex flex-col'>
    <div className='border-l-4 ps-2 ml-5 border-l-themeBlue mt-5'>
    <h1 className='text-3xl font-bold text-themeBlue '>Account Setting</h1>
    <p className='text-[0.79rem]'>Manage or edit your account here</p>
    </div>

    {/* Options */}
    <div className='flex flex-col items-start mt-10 space-y-6'>
    <Link to="/myAccount/Profile" onClick={()=>{setSelectedSettings('Profile')}} className={`${selectedSettings == "Profile" ? "text-blue-800 bg-blue-100 border-r-4 border-r-blue-800 font-semibold" : ""} flex items-center space-x-2 hover:bg-blue-300 w-full py-4 px-5 cursor-pointer`}><PersonOutlinedIcon /><div to="" className={`${selectedSettings == "Profile" ? "text-blue-800" : "text-gray-800"}`}>Profile</div></Link>
    <Link to="/myAccount/Bookings" onClick={()=>{setSelectedSettings('Bookings')}} className={`${selectedSettings == "Bookings" ? "text-blue-800 bg-blue-100 border-r-4 border-r-blue-800 font-semibold" : ""} flex items-center space-x-2 hover:bg-blue-300 w-full py-4 px-5 cursor-pointer`}><BookOnlineOutlinedIcon /><div to="" className={`${selectedSettings == "Bookings" ? "text-blue-800" : "text-gray-800"}`}>Bookings</div></Link>
    <Link to="/myAccount/BookingHistory" onClick={()=>{setSelectedSettings('BookingHistory')}} className={`${selectedSettings == "Booking History" ? "text-blue-800 bg-blue-100 border-r-4 border-r-blue-800 font-semibold" : ""} flex items-center space-x-2 hover:bg-blue-300 w-full py-4 px-5 cursor-pointer`}><UpdateOutlinedIcon /><div to="" className={`${selectedSettings == "Booking History" ? "text-blue-800" : "text-gray-800"}`}>Booking History</div></Link>
    <Link to="/myAccount/Favorites" onClick={()=>{setSelectedSettings('Favorites')}} className={`${selectedSettings == "Favorites" ? "text-blue-800 bg-blue-100 border-r-4 border-r-blue-800 font-semibold" : ""} flex items-center space-x-2 hover:bg-blue-300 w-full py-4 px-5 cursor-pointer`}><FavoriteOutlinedIcon /><div to="" className={`${selectedSettings == "Favorites" ? "text-blue-800" : "text-gray-800"}`}>Favorite</div></Link>
    
    </div>
   
    </section>


    {/* Right section */}
    <section className='w-full h-full '>
    {selectedSettings == "Profile" ? <UserInformation /> : <UserBookings />}
    </section>
    </div>
        )
      }
    
    </div>
  )
}

export default CustomerAccount