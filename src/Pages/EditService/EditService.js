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
import Address from './Components/Address'
import ServiceHours from './Components/ServiceHours'
import Tags from './Components/Tags'
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import PageNotFound from '../NotFoundPage/PageNotFound'

const EditService = () => {
const dispatch = useDispatch()
const [windowWidth, setWindowWdith] = useState(null)
const serviceInformation = useSelector(selectServiceData)
const {option} = useParams()
const {setting} = useParams()
const navigate = useNavigate()
const [selectedSettings, setSelectedSettings] = useState(option)
const accessToken = localStorage.getItem('accessToken')

// Handle the selected settings options
const handleSelectSettings = (value) => {
    navigate(`/serviceSettings/${value}`)
    window.location.reload()
}

// Get the service Information
const getServiceInformation = async () => {

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
    <main  className='w-full h-screen  flex justify-evenly'>
    {/* Left Section */}


    {/* Right Section */}
    <section className='h-full flex flex-col w-full  bg-[#fcfcfc] pt-24'>
    {/* Header */}
    <header className='w-full px-5'>
    <h1 className='text-2xl font-semibold text-gray-700'>
        Service Customization
        {/* Sidebar Toggler */}
        {/* <button onClick={()=>{document.getElementById('settingSidebarOpen').className = 'w-[260px] transition duration-500 translate-x-0 exploreSidebarOpen ease-out h-screen mt-20 bg-white z-10 absolute'}} className='absolute  right-2 lg:hidden'><FilterListOutlinedIcon fontSize='large' /></button> */}
    </h1>

    {/* Navigation buttons */}
    <div className={`serviceSettingNavBtn w-screen md:w-full h-fit  overflow-auto flex justify-start space-x-5 mt-5 relative border-b `} >
       
       <Link className={`text-sm lg:text-[1rem] ${option === 'basicInformation' ? 'border-b-4 rounded-sm border-themeOrange text-themeOrange ' : ''} pb-3 whitespace-nowrap`} to={`/myService/editService/basicInformation`}>Basic Information</Link>
       <Link className={`text-sm lg:text-[1rem] ${option === 'advanceInformation' ? 'border-b-4 rounded-sm border-themeOrange text-themeOrange ' : ''} pb-3 whitespace-nowrap`}  to='/myService/editService/advanceInformation' >Advance Information</Link>
       <Link className={`text-sm lg:text-[1rem] ${option === 'address' ? 'border-b-4 rounded-sm border-themeOrange text-themeOrange ' : ''} pb-3 whitespace-nowrap`}  to='/myService/editService/address'>Address</Link>
       <Link className={`text-sm lg:text-[1rem] ${option === 'serviceHours' ? 'border-b-4 rounded-sm border-themeOrange text-themeOrange ' : ''} pb-3 whitespace-nowrap`}  to='/myService/editService/serviceHours'>Service Hours</Link>
       <Link className={`text-sm lg:text-[1rem] ${option === 'tags' ? 'border-b-4 rounded-sm border-themeOrange text-themeOrange ' : ''} pb-3 whitespace-nowrap`}  to='/myService/editService/tags'>Tags</Link>

       {/* <button className='bg-themeOrange px-3 text-white rounded-sm absolute py-1 right-0 -top-1'>Update</button> */}
   </div>
    </header>

    {/* Body */}
    <div className='w-full h-full relative'>
        {
           option == 'basicInformation' ? (<BasicInformation />) : option == 'advanceInformation' ? (<AdvanceInformation />) : option == 'address' ? (<Address />) : option == 'serviceHours' ? (<ServiceHours />) : option == 'tags' ? (<Tags />) : (<PageNotFound />)
        }
    
   
    </div>
    </section>

    {/* Mobile sidebar */}
    {/* <section id='settingSidebarOpen' className={`w-[260px] transition duration-500 -right-14 exploreSidebarOpen ease-out h-full mt-[4.6rem] bg-black z-10 absolute`}>

    </section> */}
    </main>
  )
}

export default EditService