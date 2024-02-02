import React from 'react'
import { useState } from 'react';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import Modal from 'react-modal'
import http from '../../../http';

const CancelledBooking = ({ cancelledBookings, lazyLoad }) => {
    Modal.setAppElement('#root');
    const [modalIsOpen, setIsOpen] = useState(false);
    const [clientInformation, setClientInformation] = useState(null);
    const ModalStyle = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding : "0"
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Change the color and opacity as needed
            zIndex: 998,
          },
    };

    const OpenClientInformation = (id) => {
        setIsOpen(true)
        const booking = cancelledBookings?.find((booking) => booking._id === id)
        const dateObject = new Date(booking.createdAt)
        const formattedDate = dateObject.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        const newData = {...booking, createdAtObject : formattedDate}
        setClientInformation(newData)
    }

    const updateStatus = async (id, status) => {
        try {
            const result = await http.patch(`respondBooking/${id}`, {status})
            lazyLoad()
        } catch (error) {
            console.log(error)
        }
        
    }


  return (
    
    <div className='w-full h-full max-h-full flex flex-col gap-4 py-5 mt-5'>
    {
        cancelledBookings?.map((booking)=>{
            const dateObject = new Date(booking.createdAt)
            const formattedDate = dateObject.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            return (
            <div key={booking._id} className='w-full bg-white border px-2 shadow-sm rounded-md flex justify-evenly h-fit p-1'>
            {/* Left side */}
            <div className=' w-full'>
            <h1 className='text-[1rem] sm:text-[1.2rem] font-semibold text-blue-600'>{booking.service.selectedService}</h1>
            <h2 className='font-medium text-semiSm text-gray-500'>BOOKING ID: <span>{booking.Booking_id}</span></h2>
            <table className='w-[200px] mt-2'>
                <tbody>
                    <tr className={`${booking.service.selectedVariant ? "" : "hidden"}`}>
                        <td className=''><h3 className={`text-sm sm:text-semiMd font-semibold whitespace-nowrap w-[120px]`}>Variant</h3></td>
                        <td className=''><p className='font-normal text-semiMd text-gray-800'>{booking.service.selectedVariant?.type}</p></td>
                    </tr>
                    <tr>
                        <td className=''><h3 className={` text-semiSm sm:text-semiMd font-semibold whitespace-nowrap w-[120px]`}>Amount</h3></td>
                        <td className=' text-ellipsis overflow-hidden max-w-1/2'><p className='font-medium text-semiSm sm:text-semiMd text-gray-600'>₱{booking.service.price}</p></td>
                    </tr>
                    <tr>
                        <td className=''><h3 className={` text-semiSm sm:text-semiMd font-semibold whitespace-nowrap w-[120px]`}>Date</h3></td>
                        <td className=' text-ellipsis overflow-hidden max-w-1/2'><p className='font-medium text-semiSm sm:text-semiMd text-gray-600'>{booking.schedule.bookingDate}</p></td>
                    </tr>
                    <tr>
                        <td className=''><h3 className={` text-semiSm sm:text-semiMd font-semibold whitespace-nowrap w-[120px]`}>Time</h3></td>
                        <td className=' text-ellipsis overflow-hidden max-w-1/2'><p className='font-medium text-semiSm sm:text-semiMd text-gray-600'>{booking.schedule.bookingTime}</p></td>
                    </tr>
                    <tr>
                        <td className=''><h3 className={` text-semiSm sm:text-semiMd font-semibold whitespace-nowrap w-[120px]`}>Service Option</h3></td>
                        <td className=' text-ellipsis overflow-hidden max-w-1/2'><p className='font-medium text-semiSm sm:text-semiMd  whitespace-nowrap text-gray-600'>{booking.schedule.serviceOption}</p></td>
                    </tr>
                    
                </tbody>
            </table>

            {/* Address */}
            <button className='text-[0.55rem] sm:text-semiSm semiMd:hidden mt-2 px-2 py-1 bg-gray-100 shadow-sm border rounded-sm' onClick={()=>{OpenClientInformation(booking._id)}}>Open booking details</button>
            <div className=' hidden semiMd:flex flex-col mt-3'>
                <h1 className='text-[1rem] font-medium'>Address</h1>
                <p className='text-sm'>{booking.contactAndAddress.Address.barangay.name + ", " + booking.contactAndAddress.Address.province.name + ", " + booking.contactAndAddress.Address.region.name}</p>
                <p className='text-sm'>{booking.contactAndAddress.Address.street}</p>
            </div>
            </div>
            {/* Right side */}
            <div className='w-full h-full hidden semiMd:flex flex-col justify-between  pt-12'>
            <table className=' w-[200px]'>
                <tbody>
                    <tr>
                        <td className=''><h3 className={` text-semiMd font-semibold w-full white`}>Client: </h3></td>
                        <td className=' text-ellipsis overflow-hidden max-w-1/2'><p className='font-medium whitespace-nowrap  text-semiMd text-gray-600'>{booking.contactAndAddress.firstname + " " + booking.contactAndAddress.lastname}</p></td>
                    </tr>
                    <tr>
                        <td className=''><h3 className={` text-semiMd font-semibold whitespace-nowrap w-[100px]`}>Contact</h3></td>
                        <td className=' text-ellipsis overflow-hidden max-w-1/2'><p className='font-medium text-semiMd text-gray-600'>+63{booking.contactAndAddress.contact}</p></td>
                    </tr>
                    <tr>
                        <td className=''><h3 className={` text-semiMd font-semibold whitespace-nowrap w-[100px]`}>Email</h3></td>
                        <td className=' text-ellipsis overflow-hidden max-w-1/2'><p className='font-medium text-semiMd underline text-blue-600'>{booking.contactAndAddress.email}</p></td>
                    </tr>
                    <tr>
                        <td className=''><h3 className={` text-semiSm sm:text-semiMd font-semibold whitespace-nowrap w-[100px]`}>Issued on</h3></td>
                        <td className=' whitespace-nowrap text-ellipsis overflow-hidden'><p className='font-medium text-semiSm sm:text-semiMd text-gray-600 max-w-[250px] text-ellipsis overflow-hidden '>{formattedDate}</p></td>
                    </tr>
                </tbody>
            </table>

            </div>

            
            </div>
            )
        })
    }
    
    {/* Modal */}
    <Modal  isOpen={modalIsOpen} style={ModalStyle}>
        <div className='w-[300px] p-2'>
            <div className='flex w-full justify-start space-x-2  items-center mb-2 border-b-1 pb-1'>
            <ArrowBackIosNewOutlinedIcon onClick={()=>setIsOpen(false)} fontSize='small' className=' p-0.5 cursor-pointer' />
            <h1 className='font-semibold text-gray-800 text-lg'>Client Details</h1>
            </div>
            
        <div className='w-full h-full flex flex-col justify-between'>
            <table className=' w-[200px]'>
                <tbody>
                    <tr>
                        <td className=''><h3 className={` text-semiMd font-semibold w-full white py-1`}>Client: </h3></td>
                        <td className=' text-ellipsis overflow-hidden max-w-1/2'><p className='font-medium whitespace-nowrap  text-semiMd text-gray-600'>{clientInformation?.contactAndAddress.firstname + " " + clientInformation?.contactAndAddress.lastname}</p></td>
                    </tr>
                    <tr>
                        <td className=''><h3 className={` text-semiMd font-semibold whitespace-nowrap w-[100px] py-1`}>Contact:</h3></td>
                        <td className=' text-ellipsis overflow-hidden max-w-1/2'><p className='font-medium text-semiMd text-gray-600'>+63{clientInformation?.contactAndAddress.contact}</p></td>
                    </tr>
                    <tr>
                        <td className=''><h3 className={` text-semiMd font-semibold whitespace-nowrap w-[100px] py-1`}>Email:</h3></td>
                        <td className=' text-ellipsis overflow-hidden max-w-1/2'><p className='font-medium text-semiMd text-gray-600'>{clientInformation?.contactAndAddress.email}</p></td>
                    </tr>
                    <tr>
                        <td className=''><h3 className={` text-semiMd font-semibold whitespace-nowrap w-[100px] py-1`}>Issued on:</h3></td>
                        <td className=' text-ellipsis overflow-hidden max-w-1/2'><p className='font-medium text-semiMd text-gray-600'>{clientInformation?.createdAtObject}</p></td>
                    </tr>
                </tbody>
            </table>

            <div className='flex flex-col mt-3'>
                <h1 className='text-[1rem] font-medium'>Address</h1>
                <p className='text-semiSm'>{clientInformation?.contactAndAddress.Address.barangay.name + ", " + clientInformation?.contactAndAddress.Address.province.name + ", " + clientInformation?.contactAndAddress.Address.region.name}</p>
                <p className='text-semiSm'>{clientInformation?.contactAndAddress.Address.street}</p>
            </div>
            
            <div className='relative flex gap-2 mt-3'>
                <button className='text-semiSm  px-2  rounded-sm font-medium py-1 text-green-600' style={{backgroundColor : "rgba(152, 255, 188, 0.38)",}}>Accept booking</button>
                <button className='text-semiSm px-2 rounded-sm font-medium py-1 text-red-600' style={{backgroundColor: "rgba(255, 0, 0, 0.12)"}}>Reject booking</button>
            </div>
            
            </div>
        </div>
    </Modal>
    </div> 
  )
}

export default CancelledBooking