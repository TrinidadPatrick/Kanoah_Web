import React, { useEffect } from 'react'
import { useState } from 'react'
import UseInfo from '../../../ClientCustomHook/UseInfo'
import http from '../../../http'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import UserPendingBookings from './UserPendingBookings'

const UserBookings = () => {
const navigate = useNavigate()
const {authenticated, userInformation} = UseInfo()
const [selectedTab, setSelectedTab] = useState("Pending")
const [pendingBookings, setPendingBookings] = useState(null)
const [toPay, setToPay] = useState(null)
const [acceptedBookings, setAcceptedBookings] = useState(null)
const [rejectedBookings, setRejectedBookings] = useState(null)
const [getBookingHistory, setBookingHistory] = useState(null)

  const lazyLoad = async () => {
    try {
        const Req_ToPay = await http.get(`CLIENT_getToPayBooking`, {withCredentials : true})
        setToPay(Req_ToPay.data)
        const Req_Accepted = await http.get(`CLIENT_getAcceptedBooking`, {withCredentials : true})
        setAcceptedBookings(Req_Accepted.data)
        const Req_Rejected = await http.get(`CLIENT_getRejectedBooking`, {withCredentials : true})
        setRejectedBookings(Req_Rejected.data)
        const Req_History = await http.get(`CLIENT_getHistoryBooking`, {withCredentials : true})
        setBookingHistory(Req_History.data)
    } catch (error) {
        console.error(error)
    }
  }

  useEffect(()=>{
    const getBookings = async () => {
        try {
            const result = await http.get(`CLIENT_getPendingBooking`, {withCredentials : true})
            if(result)
            {
                setPendingBookings(result.data)
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
                <button onClick={()=>setSelectedTab("Pending")} className={`pb-2 text-semiSm sm:text-sm ${selectedTab === "Pending" ? "border-b-[3px] text-themeOrange border-themeOrange" : "text-gray-600"}`}>Pending</button>
            </li>
            <li className=''>
                <button onClick={()=>setSelectedTab("ToPay")} className={`pb-2 text-semiSm sm:text-sm ${selectedTab === "ToPay" ? "border-b-[3px] text-themeOrange border-themeOrange" : "text-gray-600"}`}>To Pay</button>
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

    <section className='w-full h-full bg-gray-50 flex flex-col max-h-full overflow-auto p-3'>
    {
        selectedTab === "Pending" ? (<UserPendingBookings pendingBookings={pendingBookings} />) : ""
    }
    </section>
    </main>
  )
}

export default UserBookings