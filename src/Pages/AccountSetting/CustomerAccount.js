import React from 'react'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BookOnlineOutlinedIcon from '@mui/icons-material/BookOnlineOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import UseInfo from '../../ClientCustomHook/UseInfo';
import UserInformation from './UserInformation/UserInformation';
import { useNavigate } from 'react-router-dom';
import UserBookings from './UserBookings/UserBookings';
import UserFavorites from './Favorites/UserFavorites';
import BlockedServices from './BlockedServices/BlockedServices';
import MobileServiceSettingSidebar from '../ServiceSetting/MobileServiceSettingSidebar';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

const CustomerAccount = () => {
    const {authenticated} = UseInfo()
    const {optn} = useParams()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [selectedSettings, setSelectedSettings] = useState(optn)
    const [openMobileSidebar, setOpenMobileSidebar] = useState(false)

    // Get the selected settings from localstorage
    useEffect(() => {
      setSelectedSettings(optn)
    }, [])

    useEffect(()=>{
      if(authenticated === false)
      {
        navigate("/")
      }
    },[authenticated])
  return (

    <div className='w-full h-full '>
      {
        loading ? ("") :
        (
          // Main Container
    <div className='flex w-full h-full'>
    {/* Left section */}
    <section className='w-[370px] h-full bg-white hidden md:flex flex-col'>
    <div className='border-l-4 ps-2 ml-5 border-l-themeBlue mt-5'>
    <h1 className='text-3xl font-bold text-themeBlue '>Account Setting</h1>
    <p className='text-[0.79rem]'>Manage or edit your account here</p>
    </div>

    {/* Options */}
    <div className='flex flex-col items-start mt-10 space-y-6'>
    <Link to="/myAccount/Profile" onClick={()=>{setSelectedSettings('Profile')}} className={`${selectedSettings == "Profile" ? "text-blue-800 bg-blue-100 border-r-4 border-r-blue-800 font-semibold" : ""} flex items-center space-x-2 hover:bg-blue-300 w-full py-4 px-5 cursor-pointer`}><PersonOutlinedIcon fontSize='small' /><div className={`${selectedSettings == "Profile" ? "text-blue-800" : "text-gray-800"}`}>Profile</div></Link>
    <Link to="/myAccount/Bookings" onClick={()=>{setSelectedSettings('Bookings')}} className={`${selectedSettings == "Bookings" ? "text-blue-800 bg-blue-100 border-r-4 border-r-blue-800 font-semibold" : ""} flex items-center space-x-2 hover:bg-blue-300 w-full py-4 px-5 cursor-pointer`}><BookOnlineOutlinedIcon fontSize='small' /><div className={`${selectedSettings == "Bookings" ? "text-blue-800" : "text-gray-800"}`}>Bookings</div></Link>
    <Link to="/myAccount/BlockedServices" onClick={()=>{setSelectedSettings('BlockedServices')}} className={`${selectedSettings == "BlockedServices" ? "text-blue-800 bg-blue-100 border-r-4 border-r-blue-800 font-semibold" : ""} flex items-center space-x-2 hover:bg-blue-300 w-full py-4 px-5 cursor-pointer`}><UpdateOutlinedIcon fontSize='small' /><div className={`${selectedSettings == "BlockedServices" ? "text-blue-800" : "text-gray-800"}`}>Blocked Services</div></Link>
    <Link to="/myAccount/Favorites" onClick={()=>{setSelectedSettings('Favorites')}} className={`${selectedSettings == "Favorites" ? "text-blue-800 bg-blue-100 border-r-4 border-r-blue-800 font-semibold" : ""} flex items-center space-x-2 hover:bg-blue-300 w-full py-4 px-5 cursor-pointer`}><FavoriteOutlinedIcon fontSize='small' /><div className={`${selectedSettings == "Favorites" ? "text-blue-800" : "text-gray-800"}`}>Favorite</div></Link>
    
    </div>
   
    </section>


    {/* Right section */}
    <section className='w-full relative h-full max-h-full overflow-auto  flex flex-col'>
    
    <div className='h-full flex md:hidden absolute z-30'>
    <div className={`absolute ${openMobileSidebar ? "hidden" : ""}  ease-in-out duration-300 h-[30px] flex items-center justify-center top-3 left-1  text-black `}>
      <button className='flex items-center ' onClick={()=>setOpenMobileSidebar(!openMobileSidebar)}><MenuOpenIcon  /></button>
    </div>
    <MobileServiceSettingSidebar setSelectedSettings={setSelectedSettings} selectedSettings={selectedSettings} openMobileSidebar={openMobileSidebar} setOpenMobileSidebar={setOpenMobileSidebar} />
    </div>
    <div onClick={()=>setOpenMobileSidebar(false)} className={`w-full cursor-pointer ${openMobileSidebar ? "" : "hidden"} h-full absolute bg-[#00000080] z-10`}></div>
    {selectedSettings == "Profile" ? <UserInformation /> : selectedSettings == "Bookings" ? <UserBookings /> : selectedSettings == "Favorites" ? <UserFavorites authenticated={authenticated} /> : <BlockedServices authenticated={authenticated} />}
    </section>
    </div>
        )
      }
    
    </div>
  )
}

export default CustomerAccount