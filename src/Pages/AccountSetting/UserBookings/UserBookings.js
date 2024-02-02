import React, { useEffect } from 'react'
import { useState } from 'react'
import UseInfo from '../../../ClientCustomHook/UseInfo'
import http from '../../../http'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import UserInProgressBooking from './UserInProgressBookings'

const UserBookings = () => {
const navigate = useNavigate()
const {authenticated, userInformation} = UseInfo()
const [selectedTab, setSelectedTab] = useState("Pending")
const [inProgressBookings, setInProgressBookings] = useState(null)
const [completedBookings, setCompletedBookings] = useState(null)
const [cancelledBookings, setCancelledBookings] = useState(null)
const [bookingHistory, setBookingHistory] = useState(null)

  const lazyLoad = async () => {
    try {
        const Req_InProgress = await http.get(`CLIENT_getInProgressBooking`, {withCredentials : true})
        setInProgressBookings(Req_InProgress.data)
        const Req_Completed = await http.get(`CLIENT_getCompletedBooking`, {withCredentials : true})
        setCompletedBookings(Req_Completed.data)
        const Req_Cancelled = await http.get(`CLIENT_getCancelledBooking`, {withCredentials : true})
        setCancelledBookings(Req_Cancelled.data)
        const Req_History = await http.get(`CLIENT_getHistoryBooking`, {withCredentials : true})
        setBookingHistory(Req_History.data)
    } catch (error) {
        console.error(error)
    }
  }

  useEffect(()=>{
    const getBookings = async () => {
        try {
            const result = await http.get(`CLIENT_getInProgressBooking`, {withCredentials : true})
            if(result)
            {
                setInProgressBookings(result.data)
                lazyLoad()
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
    <main className='w-full h-full flex flex-col  '>
    <nav className=' w-full  h-fit pt-3'>
    <h1 className='text-xl font-semibold text-gray-800'>My bookings</h1>
        <ul className='flex space-x-3 border-b-1 border-gray-700 mt-3'>
            <li className=''>
                <button onClick={()=>setSelectedTab("All Bookings")} className={`pb-2 text-semiSm sm:text-sm ${selectedTab === "All Bookings" ? "border-b-[3px] text-themeOrange border-themeOrange" : "text-gray-600"}`}>All Bookings</button>
            </li>
            <li className=''>
                <button onClick={()=>setSelectedTab("InProgress")} className={`pb-2 text-semiSm sm:text-sm ${selectedTab === "InProgress" ? "border-b-[3px] text-themeOrange border-themeOrange" : "text-gray-600"}`}>In Progress</button>
            </li>
            <li className=''>
                <button onClick={()=>setSelectedTab("Completed")} className={`pb-2 text-semiSm sm:text-sm ${selectedTab === "Completed" ? "border-b-[3px] text-themeOrange border-themeOrange" : "text-gray-600"}`}>Completed</button>
            </li>
            <li>
                <button onClick={()=>setSelectedTab("Cancelled")} className={`pb-2 text-semiSm sm:text-sm ${selectedTab === "Cancelled" ? "border-b-[3px] text-themeOrange border-themeOrange" : "text-gray-600"}`}>Cancelled</button>
            </li>
        </ul>
    </nav>

    <section className='w-full h-full bg-gray-50 flex flex-col max-h-full overflow-auto p-3'>
    {
        selectedTab === "InProgress" ? (<UserInProgressBooking inProgressBookings={inProgressBookings} />) : ""
    }
    </section>
    </main>
  )
}

export default UserBookings