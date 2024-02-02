import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Modal from 'react-modal'
import OwnerBookingHistory from './OwnerHistory'
import http from '../../../http'
import useService from '../../../ClientCustomHook/ServiceProvider'
import PageNotFound from '../../NotFoundPage/PageNotFound'
import InProgressBooking from './InProgressBooking'
import CompletedBooking from './CompletedBooking'
import CancelledBooking from './CancelledBooking'

const Bookings = () => {
    const {serviceInformation} = useService()
    const [selectedTab, setSelectedTab] = useState("InProgress")
    const [inProgressBookings, setInProgressBookings] = useState([])
    const [cancelledBookings, setCancelledBookings] = useState([])
    const [completedBookings, setCompletedBookings] = useState([])
    const [history, setHistory] = useState([])

    const lazyLoad = async () => {
        const inProgress = await http.get(`getInProgressBooking/${serviceInformation._id}`)
        setInProgressBookings(inProgress.data)
        const cancelled = await http.get(`getCancelledBooking/${serviceInformation._id}`)
        setCancelledBookings(cancelled.data)
        const completed = await http.get(`getCompletedBooking/${serviceInformation._id}`)
        setCompletedBookings(completed.data)
        const history = await http.get(`getBookingHistory/${serviceInformation._id}`)
        setHistory(history.data)
    }

    useEffect(()=>{
        const getInProgressBookings = async () => {
                const inprogress =  await http.get(`getInProgressBooking/${serviceInformation._id}`)
                setInProgressBookings(inprogress.data)
                lazyLoad()
        }
           
        serviceInformation !== null && getInProgressBookings()
        
        
    },[serviceInformation])
    
    console.log(history)

  return (
    
    <div className='w-full h-full flex bg-white flex-col px-2'>
    
    {/* Navigation */}
    <nav className=' fixed top-[4.5rem] w-full bg-white pt-3'>
    <h1 className='text-xl font-semibold text-gray-800'>My service bookings</h1>
        <ul className='flex space-x-3 border-b-1 border-gray-700'>
           
            <li className=''>
                <button onClick={()=>setSelectedTab("InProgress")} className={`pb-2 text-semiSm sm:text-sm ${selectedTab === "InProgress" ? "border-b-[3px] text-themeOrange border-themeOrange" : "text-gray-600"}`}>In Progress</button>
            </li>
            <li>
                <button onClick={()=>setSelectedTab("Completed")} className={`pb-2 text-semiSm sm:text-sm ${selectedTab === "Completed" ? "border-b-[3px] text-themeOrange border-themeOrange" : "text-gray-600"}`}>Completed</button>
            </li>
            <li>
                <button onClick={()=>setSelectedTab("Cancelled")} className={`pb-2 text-semiSm sm:text-sm ${selectedTab === "Cancelled" ? "border-b-[3px] text-themeOrange border-themeOrange" : "text-gray-600"}`}>Cancelled</button>
            </li>
            <li>
                <button onClick={()=>setSelectedTab("History")} className={`pb-2 text-semiSm sm:text-sm ${selectedTab === "History" ? "border-b-[3px] text-themeOrange border-themeOrange" : "text-gray-600"}`}>All Bookings</button>
            </li>
            
        </ul>
    </nav>
    {
    inProgressBookings === null ? 
    (
        <div className='w-full h-screen grid place-items-center'>
            <div className="spinner"></div>
        </div>
    ) :
    (
       
    <div className='w-full h-full flex flex-col pb-2 mt-11'>
    {
        selectedTab === "InProgress" ? <InProgressBooking lazyLoad={lazyLoad} inProgressBookings={inProgressBookings} /> : selectedTab === "Completed" ? <CompletedBooking lazyLoad={lazyLoad} completedBookings={completedBookings} /> : selectedTab === "Cancelled" ? <CancelledBooking lazyLoad={lazyLoad} cancelledBookings={cancelledBookings} /> : selectedTab === "History" ? <OwnerBookingHistory lazyLoad={lazyLoad} history={history} /> : <PageNotFound />
    }
    </div>
       
   
        
    )

        }
    </div>
  )
}

export default Bookings