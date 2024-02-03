import React from 'react'
import { Link } from 'react-router-dom'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BookOnlineOutlinedIcon from '@mui/icons-material/BookOnlineOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';

const MobileServiceSettingSidebar = ({openMobileSidebar, setSelectedSettings, selectedSettings, setOpenMobileSidebar}) => {
  return (
    <div className={`flex flex-col ${openMobileSidebar ? "translate-x-[0%]" : "-translate-x-[100%]"} ease-in-out duration-300 md:hidden h-full w-[200px] bg-themeBlue z-50 absolute`}>
        <div className='border-l-4 ps-2 ml-5 border-l-themeBlue mt-5'>
    <h1 className='text-lg font-bold text-gray-50 '>Account Setting</h1>
    <p className='text-[0.59rem] text-gray-50'>Manage or edit your account here</p>
    </div>

    {/* Options */}
    <div className='flex flex-col items-start mt-10 space-y-6 p-3'>
    <Link to="/myAccount/Profile" onClick={()=>{setSelectedSettings('Profile');setOpenMobileSidebar(false)}} className={`${selectedSettings == "Profile" ? " bg-blue-500 font-semibold" : ""} flex items-center space-x-2 rounded-md w-full py-4 px-5 cursor-pointer`}>
        <PersonOutlinedIcon className='text-gray-50' fontSize='small' />
        <div className={`${selectedSettings == "Profile" ? "text-gray-50" : "text-gray-50"} text-semiSm`}>Profile</div>
    </Link>

    <Link to="/myAccount/Bookings" onClick={()=>{setSelectedSettings('Bookings');setOpenMobileSidebar(false)}} className={`${selectedSettings == "Bookings" ? " bg-blue-500 font-semibold" : ""} flex items-center space-x-2 rounded-md w-full py-4 px-5 cursor-pointer`}>
        <BookOnlineOutlinedIcon className='text-gray-50' fontSize='small' />
        <div className={`${selectedSettings == "Bookings" ? "text-gray-50" : "text-gray-50"} text-semiSm`}>Bookings</div>
    </Link>


    <Link to="/myAccount/BlockedServices" onClick={()=>{setSelectedSettings('BlockedServices');setOpenMobileSidebar(false)}} className={`${selectedSettings == "BlockedServices" ? "bg-blue-500  font-semibold" : ""} rounded-md flex items-center space-x-2  w-full py-4 px-5 cursor-pointer`}>
        <BlockOutlinedIcon className='text-gray-50' fontSize='small' />
        <div className={`${selectedSettings == "BlockedServices" ? "text-gray-50" : "text-gray-50"} text-semiSm`}>Blocked Services</div>
    </Link>

    <Link to="/myAccount/Favorites" onClick={()=>{setSelectedSettings('Favorites');setOpenMobileSidebar(false)}} className={`${selectedSettings == "Favorites" ? " bg-blue-500 font-semibold" : ""} flex items-center space-x-2 rounded-md w-full py-4 px-5 cursor-pointer`}>
        <FavoriteOutlinedIcon className='text-gray-50' fontSize='small' />
        <div className={`${selectedSettings == "Favorites" ? "text-gray-50" : "text-gray-50"} text-semiSm`}>Favorite</div>
    </Link>
    
    </div>
    </div>
  )
}

export default MobileServiceSettingSidebar