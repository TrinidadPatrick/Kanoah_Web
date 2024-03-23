import React, { useEffect, useState } from 'react'
import Dashboard from "./Utilities/SVG_Icons/Dashboard.svg"
import Management from "./Utilities/SVG_Icons/Management.svg"
import Reports from "./Utilities/SVG_Icons/Reports.svg"
import Services from "./Utilities/SVG_Icons/Services.svg"
import Users from "./Utilities/SVG_Icons/Users.svg"
import Admins from "./Utilities/SVG_Icons/Admins.svg"
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { Link, useLocation, useNavigate, useResolvedPath, useMatch } from 'react-router-dom'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import OutsideClickHandler from 'react-outside-click-handler'
import { useAuth } from './CustomHooks/AuthProvider'
import useAdminInfo from './CustomHooks/useAdminInfo';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import http from '../http'

const SideBar = () => {
    const profile = useAdminInfo()
    const {logout} = useAuth()
    const [isOpenSidebar, setIsOpenSidebar] = useState(false)
    const [showSuperAdminModal, setShowSuperAdminModal] = useState(false)
    const [SAinput, setSAInput] = useState({
        firstname : '',
        lastname : '',
        password : '',
        SAPassword : ''
    })
    const [errorInput, setErrorInput] = useState({
        firstname : false,
        lastname : false,
        password : false,
        SAPassword : false
    })
    const [invalidSAPassword, setInvalidSAPassword] = useState(false)

    const handleLogout = async () => {
        logout()
    }

    const handleAccountSettings = () => {
        setShowSuperAdminModal(true)

        setSAInput({
            firstname : profile.adminInformation.firstname,
            lastname : profile.adminInformation.lastname,
            password : '',
            SAPassword : ''
        })
    }

    const updateSuperAdmin = async () => {
        let hasError = false
        Object.entries(SAinput).map(([key, value]) => {

            if(value === "" && key !== "password")
            {
                setErrorInput((prevErrorInput) => ({...prevErrorInput, [key] : true}))
                hasError = true
            }
            else if(value.length <= 8 && value.length >= 1 && key === "password")
            {
                setErrorInput((prevErrorInput) => ({...prevErrorInput, [key] : true}))
                hasError = true
            }
            else
            {
                setErrorInput((prevErrorInput) => ({...prevErrorInput, [key] : false}))
            }
        })

        if(!hasError)
        {
            try {
                const result = await http.patch('UpdateSuperAdmin', SAinput, {withCredentials : true})
                console.log(result.data)
            } catch (error) {
                console.log(error)
                if(error.response.data.error === "Password incorrect")
                {
                    setInvalidSAPassword(true)
                }
            }
        }
    }


  return (
    <OutsideClickHandler onOutsideClick={()=>setIsOpenSidebar(false)}>
    {/* Overlay */}
    <div style={{backgroundColor : 'rgba(0,0,0,0.6)'}} className={`w-full h-full ${showSuperAdminModal ? "" : "hidden"} flex justify-center items-center absolute z-20`}>
    {/* Modal */}
        <div className='w-[300px] ml-[50px] md:ml-[300px]  h-fit flex flex-col bg-white shadow-md rounded-md'>
        <header className='flex items-center gap-2 border-b-1 px-2 py-2 justify-start mt-1'>
            <button onClick={()=>setShowSuperAdminModal(false)} className=' w-fit p-0 flex justify-start'><ArrowBackIosNewOutlinedIcon fontSize='small' className='' /></button>
            <h1 className='font-medium text-gray-600'>Edit Account</h1>
        </header>
        {/* Information */}
        <div className='flex flex-col p-2 gap-3'>
        <div className='flex flex-col'>
        <label className='text-xs text-gray-500'>Firstname</label>
        <input className='border rounded-md px-2 py-1' type='text' value={SAinput.firstname} onChange={(e)=>{setSAInput({...SAinput, firstname : e.target.value})}} />
        <span className={`text-xs ${errorInput.firstname ? '' : 'hidden'} text-red-500`}>Firstname must not be empty.</span>
        </div>
        <div className='flex flex-col'>
        <label className='text-xs text-gray-500'>Lastname</label>
        <input className='border rounded-md px-2 py-1' type='text' value={SAinput.lastname} onChange={(e)=>{setSAInput({...SAinput, lastname : e.target.value})}} />
        <span className={`text-xs ${errorInput.lastname ? '' : 'hidden'} text-red-500`}>Lastname must not be empty.</span>
        </div>
        <div className='flex flex-col'>
        <label className='text-xs text-gray-500'>New Password (Leave blank if not changing)</label>
        <input className='border rounded-md px-2 py-1' type='text' value={SAinput.password} onChange={(e)=>{setSAInput({...SAinput, password : e.target.value})}} />
        <span className={`text-xs ${errorInput.password ? '' : 'hidden'} text-red-500`}>Password must contain more than 8 characters.</span>
        </div>
        <div className='flex flex-col'>
        <label className='text-xs text-gray-500'>Your Current Password (For validation)</label>
        <input className='border rounded-md px-2 py-1' type='text' value={SAinput.SAPassword} onChange={(e)=>{setSAInput({...SAinput, SAPassword : e.target.value})}} />
        <span className={`text-xs ${errorInput.SAPassword ? '' : 'hidden'} text-red-500`}>This field must not be empty.</span>
        <span className={`text-xs ${invalidSAPassword ? '' : 'hidden'} text-red-500`}>Password incorrect.</span>
        </div>
        <button onClick={()=>updateSuperAdmin()} className='w-full py-1 bg-themeOrange text-white rounded-sm'>Submit</button>
        </div>
        </div>
    </div>
    <div className={`flex-none bg-themeBlue ${isOpenSidebar ? "w-[250px] absolute" : "w-[60px] relative"} z-30 transition-all overflow-visible md:w-[250px] xl:w-[300px] flex flex-col space-y-1 h-full md:relative p-3 md:p-7`}>
        {/* Open Close Button */}
        <button onClick={()=>{setIsOpenSidebar(!isOpenSidebar)}} className='w-5 h-5 md:hidden rounded-full flex items-center justify-start pl-1 bg-themeBlue absolute -right-2.5'>
        <KeyboardArrowRightOutlinedIcon fontSize='small' className='text-white' />
        </button>
        <div onClick={()=>{if(profile?.adminInformation?.Role === "SuperAdmin" ){handleAccountSettings()}}} className={`${profile?.loading ? 'hidden' : 'flex'} ${profile?.adminInformation?.Role === "SuperAdmin" && "cursor-pointer"} items-center pt-3 `}>
        <div className='w-9 h-9 md:hidden flex flex-none items-center justify-center aspect-square bg-[#f9f9f9] rounded-full'>
        <h1 className='text-gray-600'>{profile.adminInformation?.firstname.slice(0,1)}{profile.adminInformation?.lastname.slice(0,1)}</h1>
        </div>
        <div className='flex flex-col ml-2 overflow-hidden'>
        <h1 className='text-base whitespace-nowrap lg:text-lg font-semibold text-white px-2'>{profile.adminInformation?.firstname + " " + profile.adminInformation?.lastname}</h1>
        <h1 className='text-xs whitespace-nowrap lg:text-sm font-semibold text-white px-2'>{profile.adminInformation?.Role}</h1>
        </div>
        </div>
        
        {/* Container */}
        <div className=' w-full flex flex-col space-y-5 justify-between h-full py-2'>
            <div className='flex flex-col space-y-5 mt-5'>
            {/* DashBoard */}
            <CustomSidebar to="/admin/Dashboard" imageValue={Dashboard}>Dashboard</CustomSidebar>
            {/* Users */}
            <CustomSidebar to="/admin/Users" imageValue={Users}>Users</CustomSidebar>
            {/* Posts */}
            <CustomSidebar to="/admin/Services" imageValue={Services}>Services</CustomSidebar>
            {/* Reports */}
            <CustomSidebar to="/admin/Reports" imageValue={Reports}>Reports</CustomSidebar>
            {/* Management */}
            <CustomSidebar to="/admin/Management" imageValue={Management}>Management</CustomSidebar>
           
            {/* Admins */}
            {
                profile?.adminInformation?.Role === "SuperAdmin" &&
                <CustomSidebar to="/admin/Admins" imageValue={Admins}>Admins</CustomSidebar>
            }
            </div>

            <div onClick={()=>{handleLogout()}}  className={`flex  justify-start cursor-pointer items-center  pt-3  px-2 space-x-1 text-white`}>
            {/* <img className='w-6 ' src={Logout} alt='Logout' /> */}
            <LogoutOutlinedIcon className='text-red-500' />
                <h2 className='text-red-500 pl-3 md:pl-1 overflow-hidden'>Logout</h2>
            </div>
        </div>
    </div>
    </OutsideClickHandler>
  )
}

const CustomSidebar = ({ to, children, imageValue }) => {
    const [showReportDropdown, setShowReportDropdown] = useState(false)
    const location = useLocation();
    const navigate = useNavigate()
    const currentUrl = location.pathname
    return (
        <div className='flex flex-col'>
        <Link onClick={()=>{to === "/admin/Reports" && setShowReportDropdown(!showReportDropdown)}} to={to !== "/admin/Reports" && to} className={`flex ${to === currentUrl && "bg-[#F8F8F726]"} ${currentUrl == "/admin/Reports/Pending" && to === "/admin/Reports" && "bg-[#F8F8F726]"} ${currentUrl == "/admin/Reports/History" && to === "/admin/Reports" && "bg-[#F8F8F726]"} relative justify-start items-center whitespace-nowrap py-2 rounded-md px-2 space-x-3 `}>
                
                <img className='min-w-6 w-6 aspect-square flex-none ' src={imageValue} alt='Admins' />
                <h2 className='text-white justify-between  w-full flex items-center pl-3 md:pl-1 overflow-hidden'>{children} 
                {/* Report Dropdown button */}
                <button onClick={()=>setShowReportDropdown(!showReportDropdown)} className={`${to === '/admin/Reports' ? "" : "hidden"} relative`}>
                <ArrowDropDownOutlinedIcon />
                </button>
                </h2>
        </Link>
        {/* Report Dropdown */}
        <div className={` ${showReportDropdown && to === "/admin/Reports" ? "h-[60px]" : "h-0"} overflow-hidden origin-top transition-all flex flex-col items-start w-full ps-12`}>
            <button onClick={()=>{navigate('admin/Reports/Pending')}} className={`py-1 ${currentUrl === "/admin/Reports/Pending" ? "text-orange-400 underline" : 'text-white'}  `}>Pending Reports</button>
            <button onClick={()=>{navigate('admin/Reports/History')}} className={`py-1 ${currentUrl === "/admin/Reports/History" ? "text-orange-400 underline" : 'text-white'}  `}>Report History</button>
        </div>
        </div>
    )
}

export default SideBar