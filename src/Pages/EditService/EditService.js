import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import http from '../../http'
import { selectServiceData, setServiceData } from '../../ReduxTK/serviceSlice'
import { Link } from 'react-router-dom'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BookOnlineOutlinedIcon from '@mui/icons-material/BookOnlineOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import BasicInformation from './Components/BasicInformation'
import AdvanceInformation from './Components/AdvanceInformation'
import './style.css'

const EditService = () => {
const dispatch = useDispatch()
const [windowWidth, setWindowWdith] = useState(null)
const serviceInformation = useSelector(selectServiceData)
const {option} = useParams()
const navigate = useNavigate()
const [selectedSettings, setSelectedSettings] = useState(option)

// Handle the selected settings options
const handleSelectSettings = (value) => {
    navigate(`/serviceSettings/${value}`)
    window.location.reload()
}

// Get the service Information
const getServiceInformation = async () => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        const result = await http.get(`getServiceProfile`, {
            headers : {Authorization: `Bearer ${accessToken}`},
          })
        dispatch(setServiceData(result.data))
    } catch (error) {
        navigate('/')
        console.error('Erro fetching data: ' + error)
    }
}

// Function to handle window resize
const handleResize = () => {
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
                  
// Update your code or perform actions based on the new size
setWindowWdith(windowWidth)
}
                  
// Attach the event listener to the window resize event
window.addEventListener('resize', handleResize);
                  
// Call the function once to get the initial size
useEffect(()=>{
handleResize();
},[])

useEffect(()=>{
    setSelectedSettings(option)
    getServiceInformation()
},[])


  return (
    <main className='w-full h-screen flex'>
    {/* Left Section */}
    <section className='w-[370px] lg:w-[450px] h-screen bg-white hidden md:flex flex-col'>
    <div className='border-l-4 ps-2 ml-5 border-l-themeBlue mt-24'>
    <h1 className='text-xl lg:text-3xl font-bold text-themeBlue '>Service Setting</h1>
    <p className='text-semiXs lg:text-[0.79rem]'>Manage or edit your service here</p>
    </div>

    {/* Options */}
    <div className='flex flex-col items-start mt-10 space-y-6'>
    <div  onClick={()=>{handleSelectSettings("myService")}}  className={`${selectedSettings == "myService" ? "text-blue-800 bg-blue-100 border-r-4 border-r-blue-800 font-semibold" : ""}  flex items-center space-x-2 hover:bg-blue-300 w-full py-4 px-5 cursor-pointer`}><PersonOutlinedIcon /><Link to="" className={`${selectedSettings == "myService" ? "text-blue-800" : "text-gray-800"}`}>My Service</Link></div>
    <div  onClick={()=>{handleSelectSettings("Bookings")}}  className={`${selectedSettings == "Bookings" ? "text-blue-800 bg-blue-100 border-r-4 border-r-blue-800 font-semibold" : ""} flex items-center space-x-2 hover:bg-blue-300 w-full py-4 px-5 cursor-pointer`}><BookOnlineOutlinedIcon /><Link to="" className={`${selectedSettings == "Bookings" ? "text-blue-800" : "text-gray-800"}`}>Bookings</Link></div>
    <div  onClick={()=>{handleSelectSettings("BookingHistory")}}  className={`${selectedSettings == "BookingHistory" ? "text-blue-800 bg-blue-100 border-r-4 border-r-blue-800 font-semibold" : ""} flex items-center space-x-2 hover:bg-blue-300 w-full py-4 px-5 cursor-pointer`}><UpdateOutlinedIcon /><Link to="" className={`${selectedSettings == "BookingHistory" ? "text-blue-800" : "text-gray-800"}`}>Booking History</Link></div>
    
    </div>

    </section>

    {/* Right Section */}
    <section className='h-screen flex flex-col w-full max-w-full bg-white pt-24'>
    {/* Header */}
    <header className='w-full px-5'>
    <h1 className='text-2xl font-semibold text-gray-700'>
        Service Customization
    </h1>

    {/* Navigation buttons */}
    <div className={`serviceSettingNavBtn w-screen md:w-full overflow-auto flex justify-start space-x-5 mt-10 relative  border-b`}>
        <Link className={`text-sm lg:text-[1rem] ${option === 'basicInformation' ? 'border-b-4 rounded-sm border-themeOrange text-themeOrange ' : ''} pb-3 whitespace-nowrap`} to={`/myService/editService/basicInformation`}>Basic Information</Link>
        <Link className={`text-sm lg:text-[1rem] ${option === 'advanceInformation' ? 'border-b-4 rounded-sm border-themeOrange text-themeOrange ' : ''} pb-3 whitespace-nowrap`}  to='/myService/editService/advanceInformation' >Advance Information</Link>
        <Link className={`text-sm lg:text-[1rem] ${option === 'address' ? 'border-b-4 rounded-sm border-themeOrange text-themeOrange ' : ''} pb-3 whitespace-nowrap`}  to='/myService/editService/address'>Address</Link>
        <Link className={`text-sm lg:text-[1rem] ${option === 'serviceHours' ? 'border-b-4 rounded-sm border-themeOrange text-themeOrange ' : ''} pb-3 whitespace-nowrap`}  to='/myService/editService/serviceHours'>Service Hours</Link>
        <Link className={`text-sm lg:text-[1rem] ${option === 'ratings' ? 'border-b-4 rounded-sm border-themeOrange text-themeOrange ' : ''} pb-3 whitespace-nowrap`}  to='/myService/editService/tags'>Tags</Link>

        {/* <button className='bg-themeOrange px-3 text-white rounded-sm absolute py-1 right-0 -top-1'>Update</button> */}
    </div>
    </header>

    {/* Body */}
    <div className='w-full h-full p-3'>
        {
           option == 'basicInformation' ? (<BasicInformation />) : option == 'advanceInformation' ? (<AdvanceInformation />) : ""
        }
    </div>
    </section>
    </main>
  )
}

export default EditService