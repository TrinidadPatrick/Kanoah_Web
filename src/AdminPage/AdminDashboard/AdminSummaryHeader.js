import React, { useEffect, useState } from 'react'
import usersIcon from './Images/Users.png'
import serviceIcon from './Images/Services.webp'
import reportIcon from './Images/Report.png'
import salesIcon from './Images/Sales.webp'
import useUsers from '../CustomHooks/useUsers'
import useAdminServices from '../CustomHooks/useAdminServices'
import UseReportHistory from '../CustomHooks/UseReportHistory'

const AdminSummaryHeader = ({data}) => {
    const {users, services, reportsHistory, bookings} = data
    const [totalRevenue, setotalRevenue] = useState(0)

    useEffect(()=>{
        const net = bookings.reduce((accumulator, currentValue) => accumulator + currentValue.booking_fee, 0)
        setotalRevenue(net)
    },[bookings])

  return (
    <div className='w-fit flex-none grid grid-cols-2 gap-3  h-full'>
        {/* Total Users */}
        <div className='flex border h-full w-[200px] py-3 px-3 rounded-md shadow-sm bg-white'>
        {/* Icon container */}
        <div className='w-14 h-full  aspect-square flex items-center justify-center flex-none'>
            <img className='w-10 h-10' src={usersIcon} />
        </div>
        {/* Information */}
        <div className='flex flex-col w-full'>
            <div className='px-2 w-full'>
            <p className='font-medium text-center w-full text-gray-600 '>Total Users</p>
            </div>
            <div className='px-2'>
            <p className='text-2xl text-start ps-2 font-medium text-gray-800'>{users?.length}</p>
            </div>
        </div>
        </div>

        {/* Total Services */}
        <div className='flex border w-[200px] py-3 px-3 rounded-md shadow-sm bg-white'>
        {/* Icon container */}
        <div className='w-14 h-full  aspect-square flex items-center justify-center flex-none'>
            <img className='w-10 h-10' src={serviceIcon} />
        </div>
        {/* Information */}
        <div className='flex flex-col w-full'>
            <div className='px-2 w-full'>
            <p className='font-medium text-center w-full text-gray-600 '>Total Services</p>
            </div>
            <div className='px-2'>
            <p className='text-2xl text-start ps-0.5 w-full font-medium text-gray-800'>{services.length}</p>
            </div>
        </div>
        </div>

        {/* Total Reports */}
        <div className='flex border w-[200px] py-3 px-3 rounded-md shadow-sm bg-white'>
        {/* Icon container */}
        <div className='w-14 h-full  aspect-square flex items-center justify-center flex-none'>
            <img className='w-8 h-8' src={reportIcon} />
        </div>
        {/* Information */}
        <div className='flex flex-col w-full'>
            <div className='px-2 w-full'>
            <p className='font-medium text-center w-full text-gray-600 '>Total Reports</p>
            </div>
            <div className='px-2'>
            <p className='text-2xl text-start ps-1 w-full font-medium text-gray-800'>{reportsHistory?.length}</p>
            </div>
        </div>
        </div>

        {/* Total Revenue */}
        <div className='flex border w-[200px] py-3 px-3 rounded-md shadow-sm bg-white'>
        {/* Icon container */}
        <div className='w-14 h-full  aspect-square flex items-center justify-center flex-none'>
            <img className='w-8 h-8' src={salesIcon} />
        </div>
        {/* Information */}
        <div className='flex flex-col w-full'>
            <div className='px-2 w-full'>
            <p className='font-medium text-center w-full text-gray-600 '>Total Revenue</p>
            </div>
            <div className='px-2'>
            <p className='text-2xl text-start w-full font-medium text-gray-800'>{totalRevenue}</p>
            </div>
        </div>
        </div>
    </div>
  )
}

export default AdminSummaryHeader