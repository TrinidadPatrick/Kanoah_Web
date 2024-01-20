import React, { useEffect, useState } from 'react'
import useBookings from '../../../ClientCustomHook/BookingsProvider'
import { useParams } from 'react-router-dom'
import Modal from 'react-modal'
import PendingBookings from './PendingBookings'
import AcceptedBookings from './AcceptedBookings'
import RejectedBooking from './RejectedBooking'
import OwnerBookingHistory from './OwnerHistory'
import http from '../../../http'
import useService from '../../../ClientCustomHook/ServiceProvider'

const Bookings = () => {
    const {serviceInformation} = useService()
    const [selectedTab, setSelectedTab] = useState("Pending")
    const [pendingBookings, setPendingBookings] = useState([])
    const [acceptedBookings, setAcceptedBookings] = useState([])
    const [rejectedBookings, setRejectedBookings] = useState([])
    const [history, setHistory] = useState([])
    const {bookings} = useBookings()

    const lazyLoad = async () => {
        const accepted = await http.get(`getAcceptedBooking/${serviceInformation._id}`)
        setAcceptedBookings(accepted.data)
        const rejected = await http.get(`getRejectedBooking/${serviceInformation._id}`)
        setRejectedBookings(rejected.data)
        const history = await http.get(`getBookingHistory/${serviceInformation._id}`)
        setHistory(history.data)
    }

    useEffect(()=>{
        const getPendingBookings = async () => {
                const pending =  await http.get(`getPendingBooking/${serviceInformation._id}`)
                setPendingBookings(pending.data)
                lazyLoad()
        }
           
        serviceInformation !== null && getPendingBookings()
        
        
    },[serviceInformation])



  return (
    
    <div className='w-full h-full flex bg-white flex-col px-2'>
    
    {/* Navigation */}
    <nav className=' fixed top-[4.5rem] w-full bg-white pt-3'>
    <h1 className='text-xl font-semibold text-gray-800'>My service bookings</h1>
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
    {
    bookings === null ? 
    (
        <div className='w-full h-screen grid place-items-center'>
            <div className="spinner"></div>
        </div>
    ) :
    (
       
    <div className='w-full h-full flex flex-col pb-2 mt-11'>
    {
        selectedTab === "Pending" ? <PendingBookings lazyLoad={lazyLoad} pendingBookings={pendingBookings} /> : selectedTab === "Accepted" ? <AcceptedBookings lazyLoad={lazyLoad} acceptedBookings={acceptedBookings} /> : selectedTab === "Rejected" ? <RejectedBooking lazyLoad={lazyLoad} rejectedBookings={rejectedBookings} /> : <OwnerBookingHistory lazyLoad={lazyLoad} history={history} />
    }
    </div>
       
   
        
    )

        }
    </div>
  )
}

export default Bookings