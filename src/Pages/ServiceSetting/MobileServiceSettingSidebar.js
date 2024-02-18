import React from 'react'
import { Link } from 'react-router-dom'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BookOnlineOutlinedIcon from '@mui/icons-material/BookOnlineOutlined';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import { useParams } from 'react-router-dom';

const MobileServiceSettingSidebar = ({openMobileSidebar, setOpenMobileSidebar}) => {
    const {option} = useParams()

  return (
    <div className={`flex flex-col ${openMobileSidebar ? "translate-x-[0%]" : "-translate-x-[100%]"} ease-in-out duration-300 md:hidden h-full w-[200px] bg-themeBlue z-20 absolute`}>
        <div className='border-l-4 ps-2 ml-5 border-l-themeBlue mt-5'>
    <h1 className='text-lg font-bold text-gray-50 '>Service Setting</h1>
    <p className='text-[0.59rem] text-gray-50'>Manage or edit your service here</p>
    </div>

    {/* Options */}
    <div className='flex flex-col items-start mt-10 space-y-6 p-3'>
    <Link to="/serviceSettings/Dashboard" onClick={()=>{setOpenMobileSidebar(false)}} className={`${option == "Dashboard" ? " bg-blue-500 font-semibold" : ""} flex items-center space-x-2 rounded-md w-full py-4 px-5 cursor-pointer`}>
    <span className="icon-[material-symbols--dashboard-outline-rounded] text-gray-50 text-xl"></span>
        <div className={`${option == "Dashboard" ? "text-gray-50" : "text-gray-50"} text-semiSm`}>Dashboard</div>
    </Link>
    <Link to="/serviceSettings/myService" onClick={()=>{setOpenMobileSidebar(false)}} className={`${option == "myService" ? " bg-blue-500 font-semibold" : ""} flex items-center space-x-2 rounded-md w-full py-4 px-5 cursor-pointer`}>
        <PersonOutlinedIcon className='text-gray-50' fontSize='small' />
        <div className={`${option == "myService" ? "text-gray-50" : "text-gray-50"} text-semiSm`}>My Service</div>
    </Link>

    <Link to="/serviceSettings/Bookings" onClick={()=>{setOpenMobileSidebar(false)}} className={`${option == "Bookings" ? " bg-blue-500 font-semibold" : ""} flex items-center space-x-2 rounded-md w-full py-4 px-5 cursor-pointer`}>
        <BookOnlineOutlinedIcon className='text-gray-50' fontSize='small' />
        <div className={`${option == "Bookings" ? "text-gray-50" : "text-gray-50"} text-semiSm`}>Bookings</div>
    </Link>


    <Link to="/serviceSettings/Reviews" onClick={()=>{setOpenMobileSidebar(false)}} className={`${option == "Reviews" ? "bg-blue-500  font-semibold" : ""} rounded-md flex items-center space-x-2  w-full py-4 px-5 cursor-pointer`}>
        <GradeOutlinedIcon fontSize='small' className='text-gray-50' />
        <div className={`${option == "Reviews" ? "text-gray-50" : "text-gray-50"} text-semiSm`}>Reviews</div>
    </Link>

    
    </div>
    </div>
  )
}

export default MobileServiceSettingSidebar