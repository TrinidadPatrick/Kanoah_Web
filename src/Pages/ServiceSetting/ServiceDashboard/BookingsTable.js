import React, { useState, useEffect } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import http from '../../../http'

const BookingsTable = ({serviceInformation}) => {
    const [selectedFilter, setSelectedFilter] = useState('Completed')
    const [bookings, setBookings] = useState(null)
    useEffect(() => {
        const getDBBookings = async () => {
            try {
                const result = await http.get(`getDBBookings?service=${serviceInformation._id}&filter=${selectedFilter}`, {withCredentials : true})
                setBookings(result.data)
            } catch (error) {
                console.error(error)
            }
        }

        serviceInformation !== null && getDBBookings()
    },[serviceInformation, selectedFilter])

  return (
    <div  className='flex flex-col w-full h-full max-h-full'>
        {/* Nav */}
        <nav className='w-full flex items-center px-3 py-3 justify-between border-b-1'>
            <h1 className='text-lg  text-gray-700 font-semibold'>Recent Bookings</h1>
            <Dropdown selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
        </nav>

        {/* Table */}
        <div className='w-full max-w-full h-full max-h-full overflow-auto overflow-x-scroll'>
            <table className='w-full '>
                <thead className='font-normal text-center text-sm text-gray-500'>
                    <tr className='sticky top-0'>
                    <td className=''>
                        <div className='border-b-1 py-2 bg-gray-50 w-[120px] whitespace-nowrap'>Booking ID</div>
                    </td>
                    <td className=''>
                        <div className='border-b-1 py-2 bg-gray-50 w-[120px] whitespace-nowrap'>Client</div>
                    </td>
                    <td className=''>
                        <div className='border-b-1 py-2 bg-gray-50 w-[120px] whitespace-nowrap'>Service</div>
                    </td>
                    <td className=''>
                        <div className='border-b-1 py-2 bg-gray-50 w-[120px] whitespace-nowrap'>Date</div>
                    </td>
                    <td className=''>
                        <div className='border-b-1 py-2 bg-gray-50 w-[120px] whitespace-nowrap'>Amount</div>
                    </td>
                    </tr>
                </thead>
                <tbody className=' h-full'>
                    {
                        bookings?.map((booking)=>{
                            const objDate = new Date(booking.createdAt)
                            const date = objDate.toLocaleDateString()
                            return (
                                <tr key={booking._id} className={`text-semiSm text-center ${booking.status === "COMPLETED" ? "text-gray-600" : "text-red-500"} font-medium`}>
                                    <td>
                                        <div className='py-2'>#{booking.booking_id}</div>
                                    </td>
                                    <td>
                                        <div className='py-2 whitespace-nowrap '>{booking.client.firstname}</div>
                                    </td>
                                    <td>
                                        <div className='py-2'>{booking.service.selectedService}</div>
                                    </td>
                                    <td>
                                        <div className='py-2'>{date}</div>
                                    </td>
                                    <td>
                                        <div className='py-2 text-green-500'>{booking.service.price}</div>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    </div>
  )
}

const Dropdown = ({selectedFilter, setSelectedFilter}) => {
    const [openFilter, setOpenFilter] = useState(false)
    return(
        <OutsideClickHandler onOutsideClick={()=>setOpenFilter(false)}>
        <div className='w-[110px] h-[30px] bg-gray-100 rounded-md relative z-10'>
            
            <button onClick={()=>setOpenFilter(!openFilter)} className='w-full h-full flex justify-center items-center text-gray-600 font-medium text-sm'>
                {selectedFilter}
                <span className="icon-[iconamoon--arrow-down-2] text-lg text-gray-600"></span>
            </button>
            <div className={`w-fit h-fit ${openFilter ? "" : "hidden"} bg-white shadow-md rounded-md relative top-1 overflow-hidden`}>
                <button onClick={()=>{setSelectedFilter('Completed');setOpenFilter(false)}} className='px-2 py-1 text-center w-full text-sm text-gray-700 hover:bg-gray-100'>Completed</button>
                <button onClick={()=>{setSelectedFilter('Cancelled');setOpenFilter(false)}} className='px-2 py-1 text-center w-full text-sm text-gray-700 hover:bg-gray-100'>Cancelled</button>
                <button onClick={()=>{setSelectedFilter('All Bookings');setOpenFilter(false)}} className='px-2 py-1 text-center w-full text-sm text-gray-700 hover:bg-gray-100'>All Bookings</button>
            </div>
            
        </div>
        </OutsideClickHandler>
    )
}

export default BookingsTable