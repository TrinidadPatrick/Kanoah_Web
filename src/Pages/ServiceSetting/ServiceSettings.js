import React from 'react'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BookOnlineOutlinedIcon from '@mui/icons-material/BookOnlineOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import http from '../../http';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { setUserId, selectUserId } from '../../ReduxTK/userSlice';
import { useParams } from 'react-router-dom';
import Gallery from './Gallery';
import MyService from './MyService';
import PageNotFound from '../NotFoundPage/PageNotFound';
import EditService from '../EditService/EditService';

const ServiceSettings = () => {
  const [isEditService, setIsEditService] = useState(false)
  const [notFound, setNotFound] = useState(false)
    const {option} = useParams()
    const dispatch = useDispatch();
    const userId = useSelector(selectUserId); 
    const [access, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const [selectedSettings, setSelectedSettings] = useState(option)

    // Handle the selected settings options
    const handleSelectSettings = (value) => {
        navigate(`/serviceSettings/${value}`)
        window.location.reload()
    }


      // Get userInformation
      const getUser = async () => {
        await http.get(`getUser/${userId}`).then((res)=>{
        }).catch((err)=>{
          console.log(err)
        })
  }

  //Get Tokens from Local Storage
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setAccessToken(accessToken);
      setLoading(false)
    }else{
      // setIsLoggedIn(false)
      navigate("/")
    }
  }, [userId])

  //Check if the url is valid
  useEffect(()=>{
    if(option != "myService" && option != "Bookings" && option != "BookingHistory")
    {
      setNotFound(true)
    }
  },[])

// console.log(option)
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
    <div  onClick={()=>{handleSelectSettings("myService")}}  className={`${selectedSettings == "myService" ? "text-blue-800 bg-blue-100 border-r-4 border-r-blue-800 font-semibold" : ""} flex items-center space-x-2 hover:bg-blue-300 w-full py-4 px-5 cursor-pointer`}><PersonOutlinedIcon /><Link to="" className={`${selectedSettings == "myService" ? "text-blue-800" : "text-gray-800"}`}>My Service</Link></div>
    <div  onClick={()=>{handleSelectSettings("Bookings")}}  className={`${selectedSettings == "Bookings" ? "text-blue-800 bg-blue-100 border-r-4 border-r-blue-800 font-semibold" : ""} flex items-center space-x-2 hover:bg-blue-300 w-full py-4 px-5 cursor-pointer`}><BookOnlineOutlinedIcon /><Link to="" className={`${selectedSettings == "Bookings" ? "text-blue-800" : "text-gray-800"}`}>Bookings</Link></div>
    <div  onClick={()=>{handleSelectSettings("BookingHistory")}}  className={`${selectedSettings == "BookingHistory" ? "text-blue-800 bg-blue-100 border-r-4 border-r-blue-800 font-semibold" : ""} flex items-center space-x-2 hover:bg-blue-300 w-full py-4 px-5 cursor-pointer`}><UpdateOutlinedIcon /><Link to="" className={`${selectedSettings == "BookingHistory" ? "text-blue-800" : "text-gray-800"}`}>Booking History</Link></div>
    
    </div>

    </section>


    {/* Right section */}
    <section className='w-full h-full pt-5'>
    {selectedSettings == "Gallery" ? <Gallery /> : selectedSettings == "myService" ? <MyService /> : selectedSettings == "myService" ?  <EditService /> : "" }
    </section>
    </div>
        )
      }
    
    </div>

  )
}

export default ServiceSettings