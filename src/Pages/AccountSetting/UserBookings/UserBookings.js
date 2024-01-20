import React, { useEffect } from 'react'
import { useState } from 'react'
import UseInfo from '../../../ClientCustomHook/UseInfo'
import http from '../../../http'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserBookings = () => {
const navigate = useNavigate()
const {authenticated, userInformation} = UseInfo()
  const [selectedTab, setSelectedTab] = useState("Pending")

  

  useEffect(()=>{
    const getBookings = async () => {
        try {
            const result = await http.get(`getBooking`, {withCredentials : true})
            if(result)
            {
                // console.log(result.data)
                return
            }
        } catch (error) {
            console.error(error)
            navigate("/")
        }
    }
    if(authenticated)
    {
        getBookings()
    }
  },[authenticated])


  return (
    <main className='w-full h-full bg-black'>
    <nav className=' w-full bg-white pt-3'>
    <h1 className='text-xl font-semibold text-gray-800'>My bookings</h1>
        <ul className='flex space-x-3 border-b-1 border-gray-700'>
            <li className=''>
                <button onClick={()=>setSelectedTab("Pending")} className={`pb-2 text-semiSm sm:text-sm ${selectedTab === "Pending" ? "border-b-[3px] text-themeOrange border-themeOrange" : "text-gray-600"}`}>Pending</button>
            </li>
            <li>
                <button onClick={()=>setSelectedTab("Accepted")} className={`pb-2 text-semiSm sm:text-sm ${selectedTab === "Accepted" ? "border-b-[3px] text-themeOrange border-themeOrange" : "text-gray-600"}`}>Accepted</button>
            </li>
            <li>
                <button onClick={()=>setSelectedTab("Rejected")} className={`pb-2 text-semiSm sm:text-sm ${selectedTab === "Rejected" ? "border-b-[3px] text-themeOrange border-themeOrange" : "text-gray-600"}`}>Rejected</button>
            </li>
            <li>
                <button onClick={()=>setSelectedTab("History")} className={`pb-2 text-semiSm sm:text-sm ${selectedTab === "History" ? "border-b-[3px] text-themeOrange border-themeOrange" : "text-gray-600"}`}>History</button>
            </li>
        </ul>
    </nav>
    </main>
  )
}

export default UserBookings