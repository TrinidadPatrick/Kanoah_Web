import React, { useEffect, useState } from 'react'
import usersIcon from './Images/Users.png'
import serviceIcon from './Images/Services.webp'
import reportIcon from './Images/Report.png'
import salesIcon from './Images/Sales.webp'
import http from '../../http'

const AdminSummaryHeader = ({data}) => {
    const {users, services, reports, bookings} = data
    const [totalRevenue, setotalRevenue] = useState(0)

    useEffect(()=>{
        const net = bookings.reduce((accumulator, currentValue) => accumulator + currentValue.booking_fee, 0)
        setotalRevenue(net)
    },[bookings])

  return (
    <div className='w-full xl:w-fit flex-none grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-3 xl:h-full'>
        {/* Total Users */}
        <div className='flex border h-full w-full sm:w-[130px] md:w-[150px] lg:w-[200px] py-3 px-3 rounded-md shadow-sm bg-white'>
        {/* Icon container */}
        <div className='w-14 h-full hidden lg:flex aspect-square items-center justify-center flex-none'>
            <img className='w-10 h-10' src={usersIcon} />
        </div>
        {/* Information */}
        <div className='flex flex-col w-full'>
            <div className=' w-full'>
            <p className='text-[0.9rem] semiMd:text-sm font-medium text-gray-800'>Total Users</p>
            </div>
            <div className=''>
            <p className='text-2xl text-start  font-medium text-gray-800'>{users?.length}</p>
            </div>
        </div>
        </div>

        {/* Total Services */}
        <div className='flex border w-full sm:w-[130px] md:w-[150px] lg:w-[200px] py-3 px-3 rounded-md shadow-sm bg-white'>
        {/* Icon container */}
        <div className='w-14 h-full  aspect-square hidden lg:flex items-center justify-center flex-none'>
            <img className='w-10 h-10' src={serviceIcon} />
        </div>
        {/* Information */}
        <div className='flex flex-col w-full'>
            <div className='px-2 w-full'>
            <p className='text-[0.9rem] whitespace-nowrap semiMd:text-sm font-medium text-gray-800'>Total Services</p>
            </div>
            <div className='px-2'>
            <p className='text-xl lg:text-2xl font-semibold text-gray-700'>{services.length}</p>
            </div>
        </div>
        </div>

        {/* Total Reports */}
        <div className='flex border w-full sm:w-[130px] md:w-[150px] lg:w-[200px] py-3 px-3 rounded-md shadow-sm bg-white'>
        {/* Icon container */}
        <div className='w-14 h-full  aspect-square hidden lg:flex items-center justify-center flex-none'>
            <img className='w-8 h-8' src={reportIcon} />
        </div>
        {/* Information */}
        <div className='flex flex-col w-full'>
            <div className='px-2 w-full'>
            <p className='text-[0.9rem] semiMd:text-sm font-medium text-gray-800'>Total Reports</p>
            </div>
            <div className='px-2'>
            <p className='text-xl lg:text-2xl font-semibold text-gray-700'>{reports?.length}</p>
            </div>
        </div>
        </div>

        {/* Total Revenue */}
        <div className='flex border w-full sm:w-[130px] md:w-[150px] lg:w-[200px] py-3 px-3 rounded-md shadow-sm bg-white'>
        {/* Icon container */}
        <div className='w-14 h-full  aspect-square hidden lg:flex items-center justify-center flex-none'>
            <img className='w-8 h-8' src={salesIcon} />
        </div>
        {/* Information */}
        <div className='flex flex-col w-full'>
            <div className='px-2 w-full'>
            <p className='text-[0.9rem] whitespace-nowrap semiMd:text-sm font-medium text-gray-800'>Total Revenue</p>
            </div>
            <div className='px-2'>
            <p className='text-xl lg:text-2xl font-semibold text-gray-700'>{totalRevenue}</p>
            </div>
        </div>
        </div>
    </div>
  )
}

export default AdminSummaryHeader