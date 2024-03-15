import React, { useEffect, useState } from 'react'
import Dashboard from "./Utilities/SVG_Icons/Dashboard.svg"
import Management from "./Utilities/SVG_Icons/Management.svg"
import Reports from "./Utilities/SVG_Icons/Reports.svg"
import Services from "./Utilities/SVG_Icons/Services.svg"
import Users from "./Utilities/SVG_Icons/Users.svg"
import Admins from "./Utilities/SVG_Icons/Admins.svg"
import Logout from "./Utilities/SVG_Icons/Logout.svg"
import { Link, useParams, useNavigate, useResolvedPath, useMatch } from 'react-router-dom'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useAuth } from './CustomHooks/AuthProvider'
import useAdminInfo from './CustomHooks/useAdminInfo';
import http from '../http'

const SideBar = () => {
    const profile = useAdminInfo()
    const {logout} = useAuth()


    const handleLogout = async () => {
        logout()
    }

  return (
    <div className='min-w-[250px] bg-themeBlue xl:w-[300px] hidden md:flex flex-col space-y-10 h-full absolute md:relative p-7'>
        <div className={`${profile?.loading ? 'hidden' : 'block'}`}>
        <h1 className='text-base lg:text-lg font-semibold text-white px-2'>{profile.adminInformation?.firstname + " " + profile.adminInformation?.lastname}</h1>
        <h1 className='text-xs lg:text-sm font-semibold text-white px-2'>{profile.adminInformation?.Role}</h1>
        </div>
        
        {/* Container */}
        <div className=' w-full flex flex-col space-y-5 justify-between h-full py-2'>
            <div className='flex flex-col space-y-5'>
            {/* DashBoard */}
            <CustomSidebar to="admin/Dashboard" imageValue={Dashboard}>Dashboard</CustomSidebar>
            {/* Users */}
            <CustomSidebar to="admin/Users" imageValue={Users}>Users</CustomSidebar>
            {/* Posts */}
            <CustomSidebar to="admin/Services" imageValue={Services}>Services</CustomSidebar>
            {/* Reports */}
            <CustomSidebar to="admin/Reports" imageValue={Reports}>Reports</CustomSidebar>
            {/* Management */}
            <CustomSidebar to="admin/Management" imageValue={Management}>Management</CustomSidebar>
           
            {/* Admins */}
            <CustomSidebar to="admin/Admins" imageValue={Admins}>Admins</CustomSidebar>
            </div>

            <div onClick={()=>{handleLogout()}}  className={`flex  justify-start cursor-pointer items-center  pt-3  px-2 space-x-1 text-white`}>
            {/* <img className='w-6 ' src={Logout} alt='Logout' /> */}
            <LogoutOutlinedIcon className='text-red-500' />
                <h2 className='text-red-500'>Logout</h2>
            </div>
        </div>
    </div>
  )
}

const CustomSidebar = ({ to, children, imageValue }) => {
    const selectedOption = useResolvedPath(to)
    const isActive = useMatch({path : selectedOption.pathname, end : true})
    return (
        <Link to={to} className={`flex ${isActive ? "bg-[#F8F8F726]" : ""} justify-start items-center  py-2 rounded-md px-2 space-x-3 opacity-70 text-white`}>
            <img className='w-6 ' src={imageValue} alt='Admins' />
                <h2>{children}</h2>
        </Link>
    )
}

export default SideBar