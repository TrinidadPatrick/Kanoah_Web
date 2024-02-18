import React from 'react'
import SummaryDetails from './SummaryDetails'
import useService from '../../../ClientCustomHook/ServiceProvider'
import { useState } from 'react'
import BookingAndSalesChart from './BookingAndSalesChart'
import BookingsTable from './BookingsTable'
import RatingTable from './RatingTable'

const ServiceDashboard = () => {
    const {serviceInformation} = useService()
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed
    const dateNow = `${year}-${month}`;
    const [dateSelected, setDateSelected] = useState(dateNow)

  return (
    <main className='w-full flex flex-col gap-3 h-full bg-white overflow-auto px-3 md:px-5 lg:px-10 py-3'>
        <div className='flex items-center justify-between mt-1.5'>
        <h1 className='text-gray-700 text-lg sm:text-2xl font-semibold relative left-10 md:left-0'>Dashboard</h1>
        <input className='border rounded-sm px-1 py-1 border-gray text-gray-500 text-xs sm:text-sm' type='month' onChange={(e)=>{setDateSelected(e.target.value)}} value={dateSelected} />
        </div>

        <section className='w-full gap-3 lg:gap-0 flex flex-col lg:flex-row  h-fit  '>
            <div className='w-full lg:w-[40%] h-full  grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2'>
            <SummaryDetails dateSelected={dateSelected} serviceInformation={serviceInformation} />
            </div>
            <div className='w-full lg:w-[60%] h-full '>
            <BookingAndSalesChart dateSelected={dateSelected} serviceInformation={serviceInformation} />
            </div>
        </section>

        <section className='w-full min-h-[600px] lg:min-h-fit lg:h-full flex gap-3 flex-col lg:flex-row justify-evenly  overflow-auto'>
            <div className='w-full overflow-auto h-full max-h-full border rounded-md'>
                <BookingsTable dateSelected={dateSelected} serviceInformation={serviceInformation} />
            </div>
            <div className='w-full h-full col-span-5 overflow-auto max-h-full border rounded-md'>
                <RatingTable dateSelected={dateSelected} serviceInformation={serviceInformation} />
            </div>
        </section>
    </main>
  )
}

export default ServiceDashboard