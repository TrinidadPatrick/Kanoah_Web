import React, { useEffect, useState } from 'react'
import './AdminDashboard.css'

const BookingsTable = ({bookings}) => {
    const [allBookings, setAllBookings] = useState([])

    useEffect(()=>{
        if(bookings.length !== 0)
        {
            setAllBookings(bookings.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)))
        }
       
    },[bookings])

    // console.log(allBookings)

    const DataBody = () => {
        return (
            allBookings?.map((booking) => {
                const dateCreated = booking.createdAt
                const createdAt = new Date(dateCreated).toLocaleDateString('EN-US', {
                    month : 'short',
                    day : '2-digit',
                    year : 'numeric'
                })
                const timeCreated = new Date(dateCreated).toLocaleTimeString('EN-US', {
                   hour12 : true
                })
                const timeArray = timeCreated.split(/:| /)
                timeArray.splice(2, 1)
                const createdAtTime = timeArray.join().replace(",", ":")
                return (
                    <tr key={booking._id}>
                        <td>
                            <p className={`font-medium ${booking.status === "COMPLETED" ? "text-green-500" : booking.status === "CANCELLED" ? "text-red-500" : "text-blue-500"} text-xs text-start py-2 px-5`}>{booking.status.charAt(0) + booking.status.toLowerCase().slice(1)}</p>
                        </td>
                        <td>
                            <p className={`font-medium text-gray-600 text-xs text-start py-2 px-5 whitespace-nowrap`}>{booking.client.firstname + " " + booking.client.lastname}</p>
                        </td>
                        <td>
                            <p className={`font-medium text-gray-600 text-xs text-start py-2 px-5 whitespace-nowrap`}>{booking.shop.basicInformation.ServiceTitle}</p>
                        </td>
                        <td>
                            <p className={`font-medium text-gray-600 text-xs text-start py-2 px-5 whitespace-nowrap`}>{createdAt}</p>
                        </td>
                        <td>
                            <p className={`font-medium text-gray-600 text-xs text-start py-2 px-5 whitespace-nowrap`}>{createdAtTime.replace(",", " ")}</p>
                        </td>
                        <td>
                            <p className={`font-medium text-gray-600 text-xs text-center py-2 px-5 whitespace-nowrap`}>₱{booking.booking_fee.toLocaleString('en-US')}.00</p>
                        </td>
                        <td>
                            <p className={`font-medium text-gray-600 text-xs text-center py-2 px-5 whitespace-nowrap`}>₱{booking.net_Amount.toLocaleString('en-US')}.00</p>
                        </td>
                    </tr>
                )
            })
        )
       
    }


  return (
    <div className='w-full h-full overflow-auto flex flex-col bg-white shadow-sm border rounded-md '>
        <div className='w-full py-2'>
        <h1 className='text-gray-700 font-medium text-lg px-5'>Latest Bookings</h1>
        </div>
        <div className='AdminBookingTable w-full h-full overflow-auto '>
        <table className='w-full '>
            
            <thead className='border-b-1 sticky top-0 bg-gray-100 shadow-sm'>
                <tr>
                    <th>
                        <p className='font-normal text-gray-500 text-sm text-start py-2 px-5'>Status</p>
                    </th>
                    <th>
                        <p className='font-normal text-gray-500 text-sm text-start py-2 px-5'>Client</p>
                    </th>
                    <th>
                        <p className='font-normal text-gray-500 text-sm text-start py-2 px-5'>Service</p>
                    </th>
                    <th>
                        <p className='font-normal text-gray-500 text-sm text-start py-2 px-5'>Date</p>
                    </th>
                    <th>
                        <p className='font-normal text-gray-500 text-sm text-start py-2 px-5'>Time</p>
                    </th>
                    <th>
                        <p className='font-normal text-gray-500 text-sm text-start py-2 px-5 whitespace-nowrap'>Booking Fee</p>
                    </th>
                    <th>
                        <p className='font-normal text-gray-500 text-sm text-start py-2 px-5 whitespace-nowrap'>Total Amount</p>
                    </th>
                </tr>
            </thead>
            <tbody>
                <DataBody />
            </tbody>
        </table>
        </div>
    </div>
  )
}

export default BookingsTable