import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import http from '../../http'
import { selectServiceData, setServiceData } from '../../ReduxTK/serviceSlice'
import { Link } from 'react-router-dom'
import BasicInformation from './Components/BasicInformation'
import AdvanceInformation from './Components/AdvanceInformation'
import './style.css'
import Address from './Components/Address'
import ServiceHours from './Components/ServiceHours'
import Tags from './Components/Tags'
import useService from '../../ClientCustomHook/ServiceProvider'
import PageNotFound from '../NotFoundPage/PageNotFound'
import BookingInformation from './Components/BookingInformation'

const EditService = () => {
const dispatch = useDispatch()
const [windowWidth, setWindowWdith] = useState(null)
const {serviceInformation, authenticated} = useService()
const {option} = useParams()
const {setting} = useParams()
const navigate = useNavigate()
const [selectedSettings, setSelectedSettings] = useState(option)

// Function to handle window resize
const handleResize = () => {
const windowWidth = window.innerWidth;
                  
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
    if(authenticated)
    {
        setSelectedSettings(option)
    }
    else if(authenticated === false){
        navigate("/")
    }
    
},[authenticated])

    
  return (
    <main  className='w-full h-screen relative  flex'>


    {/* Right Section */}
    <section className='h-full flex flex-col w-full  bg-[#fcfcfc] pt-3'>
    {/* Header */}
    <header className='w-full px-5'>
    <h1 className='text-2xl font-semibold text-gray-700'>
        Service Customization
        {/* Sidebar Toggler */}
        {/* <button onClick={()=>{document.getElementById('settingSidebarOpen').className = 'w-[260px] transition duration-500 translate-x-0 exploreSidebarOpen ease-out h-screen mt-20 bg-white z-10 absolute'}} className='absolute  right-2 lg:hidden'><FilterListOutlinedIcon fontSize='large' /></button> */}
    </h1>

    {/* Navigation buttons */}
    <div className={`serviceSettingNavBtn w-full md:w-full h-fit  overflow-auto flex justify-start space-x-5 mt-5 relative border-b `} >
       
       <Link className={`text-sm lg:text-[1rem] ${option === 'basicInformation' ? 'border-b-4 rounded-sm border-themeOrange text-themeOrange ' : ''} pb-3 whitespace-nowrap`} to={`/myService/editService/basicInformation`}>Basic Information</Link>
       <Link className={`text-sm lg:text-[1rem] ${option === 'advanceInformation' ? 'border-b-4 rounded-sm border-themeOrange text-themeOrange ' : ''} pb-3 whitespace-nowrap`}  to='/myService/editService/advanceInformation' >Advance Information</Link>
       <Link className={`text-sm lg:text-[1rem] ${option === 'address' ? 'border-b-4 rounded-sm border-themeOrange text-themeOrange ' : ''} pb-3 whitespace-nowrap`}  to='/myService/editService/address'>Address</Link>
       <Link className={`text-sm lg:text-[1rem] ${option === 'serviceHours' ? 'border-b-4 rounded-sm border-themeOrange text-themeOrange ' : ''} pb-3 whitespace-nowrap`}  to='/myService/editService/serviceHours'>Service Hours</Link>
       <Link className={`text-sm lg:text-[1rem] ${option === 'tags' ? 'border-b-4 rounded-sm border-themeOrange text-themeOrange ' : ''} pb-3 whitespace-nowrap`}  to='/myService/editService/tags'>Tags</Link>
       <Link className={`text-sm lg:text-[1rem] ${option === 'Booking' ? 'border-b-4 rounded-sm border-themeOrange text-themeOrange ' : ''} pb-3 whitespace-nowrap`}  to='/myService/editService/Booking'>Booking</Link>

       {/* <button className='bg-themeOrange px-3 text-white rounded-sm absolute py-1 right-0 -top-1'>Update</button> */}
   </div>
    </header>

    {/* Body */}
    <div className='w-full h-full relative flex items-center justify-center bg-[#f9f9f9]'>
        {
           option == 'basicInformation' ? (<BasicInformation serviceInformation={serviceInformation} />) : option == 'advanceInformation' ? (<AdvanceInformation serviceInformation={serviceInformation} />) : option == 'address' ? (<Address serviceInformation={serviceInformation} />) : option == 'serviceHours' ? (<ServiceHours serviceInformation={serviceInformation} />) : option == 'tags' ? (<Tags serviceInformation={serviceInformation} />) : option == 'Booking' ? (<BookingInformation serviceInformation={serviceInformation} />) : (<PageNotFound />)
        }
    
   
    </div>
    </section>

    {/* Mobile sidebar */}
    {/* <section className='w-[200px] bg-black h-full absolute z-30'>

    </section> */}
    </main>
  )
}

export default EditService