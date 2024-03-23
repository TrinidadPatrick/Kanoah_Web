import React from 'react'
import { useAuth } from '../CustomHooks/AuthProvider'
import AdminSummaryHeader from './AdminSummaryHeader'
import AdminSummaryGrap from './AdminSummaryGrap'
import useUsers from '../CustomHooks/useUsers'
import useAdminServices from '../CustomHooks/useAdminServices'
import UseReportHistory from '../CustomHooks/UseReportHistory'
import BookingsTable from './BookingsTable'
import usePendingReport from '../CustomHooks/usePendingReport'
import useAdminBookings from '../CustomHooks/useAdminBookings'
import RevenueChart from './RevenueChart'
import AdminAllServiceReviews from './AdminAllServiceReviews'
import useAdminReviews from '../CustomHooks/useAdminReviews'

const AdminDashboard = () => {
  const {users} = useUsers()
  const {services} = useAdminServices()
  const {reportsHistory} = UseReportHistory()
  const {pendingReports} = usePendingReport()
  const {bookings} = useAdminBookings()
  const {reviews} = useAdminReviews()

  return (
    <main className='w-full h-full flex flex-col overflow-hidden bg-[#f5f5f5]'>
      <header className='w-full  px-5 py-1'>
      <h1 className='text-2xl font-medium text-gray-600'>Admin Dashboard</h1>
      </header>

      {/* Admin Header */}
      <div className='w-full h-[200px] flex justify-start items-center gap-3 mt-1 px-5'>
        <AdminSummaryHeader data={{users, services, reportsHistory, bookings}} />
        <AdminSummaryGrap data={{users, services, reportsHistory}} />
      </div>

      {/* Revenue Chart */}
      <div className='w-full flex flex-col px-5  mt-3'>
      <RevenueChart bookings={bookings} />
      </div>

      {/* Reports Table Users table total bookings */}
      <div className='w-full h-full justify-evenly flex gap-3 px-5 pb-2 overflow-hidden mt-3 '>
      {/* Bookings and Users */}
      <div className='w-[50%] bg-white overflow-auto h-full flex flex-col '>
      <BookingsTable bookings={bookings}/>
      </div>
      {/* Revenue Chart */}
      <div className='w-[50%] bg-white flex-1 h-full overflow-auto flex flex-col '>
      <AdminAllServiceReviews reviews={reviews}/>
      </div>
      </div>
    </main>
  )
}

export default AdminDashboard