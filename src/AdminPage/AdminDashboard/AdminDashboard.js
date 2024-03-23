import React, { useState, useEffect } from 'react'
import { useAuth } from '../CustomHooks/AuthProvider'
import AdminSummaryHeader from './AdminSummaryHeader'
import AdminSummaryGrap from './AdminSummaryGrap'
import useUsers from '../CustomHooks/useUsers'
import UseReportHistory from '../CustomHooks/UseReportHistory'
import BookingsTable from './BookingsTable'
import usePendingReport from '../CustomHooks/usePendingReport'
import useAdminBookings from '../CustomHooks/useAdminBookings'
import RevenueChart from './RevenueChart'
import AdminAllServiceReviews from './AdminAllServiceReviews'
import useAdminReviews from '../CustomHooks/useAdminReviews'
import http from '../../http'

const AdminDashboard = () => {
  const years = Array.from({length : 2100 - 2020 + 1}, (_, index)=> 2020 + index)
  const [year, setYear] = useState(new Date().getFullYear())
  const [openYearDropdown, setOpenYearDropdown] = useState(false)
  const [services, setServices] = useState([])
  const [users,setUsers] = useState([])
  const [reports,setReports] = useState([])
  const [bookings, setBookings] = useState([])
  const [reviews, setReviews] = useState([])

  // Get Services
  useEffect(()=>{
        const getServices = async () => {
            try {
                const result = await http.get(`AdminDashboard_GetServices/${year}`, {withCredentials : true})
                setServices(result.data)
            } catch (error) {
                console.log(error)
            } 
        }

        getServices()
  },[year])

  // Get Users
  useEffect(()=>{
        const getServices = async () => {
            try {
                const result = await http.get(`AdminDashboard_GetUserLists/${year}`, {withCredentials : true})
                setUsers(result.data)
            } catch (error) {
                console.log(error)
            } 
        }

        getServices()
  },[year])
  
  // Get Users
  useEffect(()=>{
        const getUsers = async () => {
            try {
                const result = await http.get(`AdminDashboard_GetUserLists/${year}`, {withCredentials : true})
                setUsers(result.data)
            } catch (error) {
                console.log(error)
            } 
        }

        getUsers()
  },[year])

  // Get Report Counts
  useEffect(()=>{
        const getReports = async () => {
            try {
                const result = await http.get(`AdminGetAllReportCounts/${year}`, {withCredentials : true})
                setReports(result.data)
            } catch (error) {
                console.log(error)
            } 
        }

        getReports()
  },[year])

  // Get Bookings
  useEffect(()=>{
        const getBookings = async () => {
            try {
                const result = await http.get(`AdminDashboard_GetAllBookings/${year}`, {withCredentials : true})
                setBookings(result.data)
            } catch (error) {
                console.log(error)
            } 
        }

        getBookings()
  },[year])

  // Get Ratings
  useEffect(()=>{
        const getRatings = async () => {
            try {
                const result = await http.get(`AdminDashboard_GetRatings/${year}`, {withCredentials : true})
                setReviews(result.data)
            } catch (error) {
                console.log(error)
            } 
        }

        getRatings()
  },[year])



  return (
    <main className='w-full h-full flex flex-col overflow-auto bg-[#f5f5f5]'>
      <header className='w-full flex items-center justify-between px-5 py-1'>
      <h1 className='text-gray-700 text-lg sm:text-2xl font-semibold relative '>Admin Dashboard</h1>
      <div className='flex items-center relative'>
      <label className='text-sm text-gray-500'>Select Year: </label>
      <button onClick={()=>setOpenYearDropdown(!openYearDropdown)} className='px-1 text-sm font-medium text-gray-600'> {year}</button>
      {/* Year Drowdown */}
      <div className={`absolute shadow-md ${openYearDropdown ? "flex" : "hidden"} flex-col h-[200px] overflow-auto bg-white top-5 z-20`}>
      {
      years.map((year, index) => (
        <button key={index} onClick={()=>{setYear(year);setOpenYearDropdown(false)}} className='text-start pr-10 ps-3 py-1'>{year}</button>
      ))
      }
      </div>
      </div>
      </header>

      {/* Admin Header */}
      <div className='w-full h-[200px] flex flex-col xl:flex-row justify-start items-center gap-3 mt-1 px-1.5 sm:px-5'>
        <AdminSummaryHeader data={{users, services, reports, bookings}} />
        <AdminSummaryGrap data={{users, services}} />
      </div>

      {/* Revenue Chart */}
      <div className='w-full mt-44 sm:mt-[90px] xl:mt-3 flex flex-col px-1.5 sm:px-5 '>
      <RevenueChart bookings={bookings} />
      </div>

      {/* Reports Table Users table total bookings */}
      <div className='w-full min-h-[600px] pb-3 mt-3 px-1.5 sm:px-5 lg:min-h-[300px] flex gap-3 flex-col lg:flex-row justify-evenly  overflow-auto'>

      <div className='w-full overflow-auto h-full max-h-full border rounded-md'>
      <BookingsTable bookings={bookings}/>
      </div>

      <div className='w-full overflow-auto h-full max-h-full border rounded-md'>
      <AdminAllServiceReviews reviews={reviews}/>
      </div>
      </div>
    </main>
  )
}

export default AdminDashboard