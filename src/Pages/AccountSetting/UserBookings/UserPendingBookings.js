import React from 'react'
import Modal from 'react-modal'
import { useState } from 'react';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

const UserPendingBookings = ({ pendingBookings }) => {
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

    const openBookingInfo = (booking_id) => {
        const selected = pendingBookings.find(booking => booking.Booking_id === booking_id)
        const scheduleObject = new Date(selected.schedule.bookingDate)
        const issuedDateObject = new Date(selected.createdAt)
        const bookTimeObject = new Date(selected.createdAt);
        const bookSchedule = scheduleObject.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        const issuedDate = issuedDateObject.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        const bookTime = bookTimeObject.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          });
        const newData = {...selected, bookSchedule : bookSchedule, issuedDate : issuedDate, bookTime : bookTime}
        setClientInformation(newData)
        setIsOpen(true)
    }

    console.log(clientInformation)
  return (
    <>
    <div className='w-full h-full max-h-full overflow-auto'>
        {
        pendingBookings?.map((pendingBooking) => {
            const dateObject = new Date(pendingBooking.schedule.bookingDate)
            const formattedDate = dateObject.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
            return(
                <div key={pendingBooking._id} className="flex flex-col h-fit my-4 bg-white rounded-md border shadow-sm p-2">
                {/* Image and personal info container */}
                <div className='w-full flex'>
                    {/* Image Container */}
                    <div className='h-[180px] aspect-square flex '>
                        <img className='w-full rounded-md h-full object-cover' src={pendingBooking.shop.serviceProfileImage} alt="image" />
                    </div>
                    {/* Booking Information */}
                    <div className='flex flex-col space-y-2 px-2'>
                    <div className='text-xl font-semibold text-gray-900 '>{pendingBooking.service.selectedService}</div>
                    <div className='w-fit h-full grid grid-cols-2 gap-0 gap-x-5 '>
                        {/* Variant */}
                        <div className={`text-semiMd font-semibold whitespace-nowrap  `}>Variant</div>
                        <div className={`font-medium text-semiMd text-gray-600 `}>{pendingBooking.service.selectedVariant ? pendingBooking.service.selectedVariant?.type : "None"}</div>
                        {/* Amount */}
                        <div className='text-semiMd font-semibold whitespace-nowrap'>Total Amount</div>
                        <div className='font-medium text-semiMd text-gray-600'>₱ {pendingBooking.service.price}</div>
                        {/* Amount */}
                        <div className='text-semiMd font-semibold whitespace-nowrap'>Booking fee</div>
                        <div className='font-medium text-semiMd text-gray-600'>₱ {pendingBooking.service.price}</div>
                        {/* Schedule */}
                        <div className='text-semiMd font-semibold whitespace-nowrap'>Schedule</div>
                        <div className='font-medium text-semiMd text-gray-600'>{formattedDate}</div>
                        {/* Time */}
                        <div className='text-semiMd font-semibold whitespace-nowrap'>Time</div>
                        <div className='font-medium text-semiMd text-gray-600'>{pendingBooking.schedule.bookingTime}</div>
                        {/* Time */}
                        <div className='text-semiMd font-semibold whitespace-nowrap'>Service Option</div>
                        <div className='font-medium text-semiMd text-gray-600'>{pendingBooking.schedule.serviceOption}</div>
                    </div>
                    </div>
                    {/* Buttons */}
                    
                </div>
                <div className='mt-2 relative w-full  h-full flex gap-2'>
                    <button onClick={()=>openBookingInfo(pendingBooking.Booking_id)} className=' border rounded-sm px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 shadow-sm text-semiSm'>View Booking</button>
                    <button className=' border rounded-sm px-2 py-1 bg-red-100 hover:bg-red-200 text-red-500 font-medium shadow-sm text-semiSm'>Cancel Booking</button>
                </div>
                </div>
            )
        })
    }
    </div>


    <Modal  isOpen={modalIsOpen} style={ModalStyle}>
        <div className='w-fit h-fit flex flex-col bg-[#f9f9f9] border p-2'>
            <div className='flex items-center space-x-1'>
            <ArrowBackIosNewOutlinedIcon onClick={()=>setIsOpen(false)} fontSize='small' className='text-gray-500 cursor-pointer' />
            <h1 className='text-xl text-gray-800 font-medium'>Booking Details</h1>
            </div>
            
            <div  className="flex flex-col h-fit my-4  p-2">
                {/* Image and personal info container */}
                <div className='w-full flex bg-white rounded-md border shadow-sm p-2'>
                    {/* Image Container */}
                    <div className='h-[180px] aspect-square flex '>
                        <img className='w-full rounded-md h-full object-cover' src={clientInformation?.shop.serviceProfileImage} alt="image" />
                    </div>
                    {/* Booking Information */}
                    <div className='flex flex-col space-y-2 px-2'>
                    <div className='text-xl font-semibold text-gray-900 '>{clientInformation?.service?.selectedService}</div>
                    <div className='w-fit h-full grid grid-cols-2 gap-0 gap-x-5 '>
                        {/* Variant */}
                        <div className={`text-semiMd font-semibold whitespace-nowrap  `}>Variant</div>
                        <div className={`font-medium text-semiMd text-gray-600 `}>{clientInformation?.service.selectedVariant ? clientInformation?.service.selectedVariant?.type : "None"}</div>
                        {/* Amount */}
                        <div className='text-semiMd font-semibold whitespace-nowrap'>Amount</div>
                        <div className='font-medium text-semiMd text-gray-600'>₱ {clientInformation?.service.price}</div>
                        {/* Schedule */}
                        <div className='text-semiMd font-semibold whitespace-nowrap'>Schedule</div>
                        <div className='font-medium text-semiMd text-gray-600'>{clientInformation?.bookSchedule}</div>
                        {/* Time */}
                        <div className='text-semiMd font-semibold whitespace-nowrap'>Time</div>
                        <div className='font-medium text-semiMd text-gray-600'>{clientInformation?.schedule.bookingTime}</div>
                        {/* Time */}
                        <div className='text-semiMd font-semibold whitespace-nowrap'>Service Option</div>
                        <div className='font-medium text-semiMd text-gray-600'>{clientInformation?.schedule.serviceOption}</div>
                    </div>
                    </div>
                    
                </div>
                <div className='w-full mt-4 flex flex-col bg-white rounded-md border shadow-sm p-2'>
                    <h2 className='text-gray-800 font-medium'>Client Details</h2>
                    <span className='text-gray-600 font-normal text-sm'>{clientInformation?.contactAndAddress.firstname + " " + clientInformation?.contactAndAddress.lastname}</span>
                    <span className='text-gray-600 font-normal text-sm'>{clientInformation?.contactAndAddress.email}</span>
                    <span className='text-gray-600 font-normal text-sm'>+63{clientInformation?.contactAndAddress.contact}</span>
                    <span className='text-gray-600 font-normal text-sm'>{clientInformation?.contactAndAddress.Address.barangay.name + ", " + clientInformation?.contactAndAddress.Address.province.name + ", " + clientInformation?.contactAndAddress.Address.region.name}</span>
                    <span className='text-gray-600 font-normal text-sm'>{clientInformation?.contactAndAddress.Address.street}</span>
                </div>
                <div className='w-full mt-4 grid grid-cols-2 gap-0 gap-x-5 bg-white rounded-md border shadow-sm p-2'>
                    <div className='text-semiMd font-semibold whitespace-nowrap'>BOOKING ID</div>
                    <div className='font-medium text-right text-semiMd text-gray-600'>{clientInformation?.Booking_id}</div>

                    <div className='text-semiMd font-semibold whitespace-nowrap'>Book Date</div>
                    <div className='font-medium text-right text-semiMd text-gray-600'>{clientInformation?.issuedDate}</div>

                    <div className='text-semiMd font-semibold whitespace-nowrap'>Book Time</div>
                    <div className='font-medium text-right text-semiMd text-gray-600'>{clientInformation?.bookTime}</div>

                    <button className='bg-gray-100 border rounded-sm text-sm text-gray-800 py-1 mt-2'>View Service</button>
                    <button className='bg-green-400 border rounded-sm text-sm text-gray-100 py-1 mt-2'>Contact Service</button>
                </div>
                </div>
        </div>
    </Modal>
    </>
  )
}

export default UserPendingBookings