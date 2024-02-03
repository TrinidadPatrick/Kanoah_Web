import React from 'react'
import { useState, useEffect } from 'react';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import Modal from 'react-modal'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import http from '../../../http';

const InProgressBooking = ({inProgressBookings, lazyLoad}) => {
    Modal.setAppElement('#root');
    const [modalIsOpen, setIsOpen] = useState(false);
    const [clientInformation, setClientInformation] = useState(null);
    const [InProgress_Bookings_Orig, set_InProgress_Bookings_Orig] = useState(null);
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

    useEffect(()=>{
        set_InProgress_Bookings_Orig(inProgressBookings)
    },[inProgressBookings])


    const OpenClientInformation = (id) => {
        const selected = inProgressBookings.find(booking => booking._id === id)
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

    const updateStatus = async (id, status) => {
        const index = InProgress_Bookings_Orig.findIndex(booking => booking._id === id)
        if(index !== -1)
        {
            const newBooking = [...InProgress_Bookings_Orig]
            newBooking[index] = {...newBooking[index], ["status"] : status}
            const filtered = newBooking.filter((booking) => booking.status === "INPROGRESS")
            set_InProgress_Bookings_Orig(filtered)
            try {
                const result = await http.patch(`respondBooking/${id}`, {status})
                lazyLoad()
            } catch (error) {
                console.log(error)
            }
        }

        return ;
       
        
    }


  return (
    <div className='w-full h-full  max-h-full mt-5 overflow-auto flex flex-col gap-4 py-5'>
    {
        InProgress_Bookings_Orig?.map((booking)=>{
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
            <button className='text-[0.55rem] sm:text-semiSm semiMd:hidden mt-2 px-2 py-1 bg-gray-100 shadow-sm border rounded-sm' onClick={()=>{OpenClientInformation(booking.booking_id)}}>Open booking details</button>
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
            
            <div className='relative flex gap-2 mb-3'>
                <button onClick={()=>OpenClientInformation(booking._id)} className='text-semiSm  px-2 bg-gray-100 border hover:bg-gray-200 relative z-20 rounded-sm font-medium py-1 text-gray-500'><OpenInNewOutlinedIcon /></button>
                <button onClick={()=>updateStatus(booking._id, "COMPLETED")} className='text-semiSm  px-2 hover:bg-black relative z-20 rounded-sm font-medium py-1 text-green-600' style={{backgroundColor : "rgba(152, 255, 188, 0.38)",}}>Mark as Complete</button>
                <button onClick={()=>updateStatus(booking._id, "CANCELLED")} className='text-semiSm px-2 rounded-sm font-medium py-1 text-red-600' style={{backgroundColor: "rgba(255, 0, 0, 0.12)"}}>Cancel booking</button>
            </div>
            
            </div>

            
            </div>
            )
        })
    }
    
    {/* Modal */}
    <Modal  isOpen={modalIsOpen} style={ModalStyle}>
        <div className='w-fit h-fit flex flex-col bg-[#f9f9f9] border p-2'>
            <div className='flex items-center space-x-1'>
            <ArrowBackIosNewOutlinedIcon onClick={()=>setIsOpen(false)} fontSize='small' className='text-gray-500 cursor-pointer' />
            <h1 className='text-xl text-gray-800 font-medium'>Booking Details</h1>
            </div>
            
            <div  className="flex flex-col h-fit my-2  p-2">
                {/* Image and personal info container */}
                <div className='w-full flex bg-white rounded-md border shadow-sm p-2'>
                    {/* Booking Information */}
                    <div className='flex flex-col space-y-2 px-2'>
                    <div className='text-xl font-semibold text-blue-500 '>{clientInformation?.service?.selectedService}</div>
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

                    <div className='text-semiMd font-semibold whitespace-nowrap'>Book Schedule</div>
                    <div className='font-medium text-right text-semiMd text-gray-600'>{clientInformation?.schedule.timeSpan}</div>
                    
                </div>
                <div className='w-full mt-4 grid grid-cols-2 gap-0 gap-x-5 bg-white rounded-md border shadow-sm p-2'>
                    <div className='text-semiMd font-semibold whitespace-nowrap'>Service Amount</div>
                    <div className='font-medium text-right text-semiMd text-gray-600'>₱{clientInformation?.service.price}</div>

                    <div className='text-semiMd font-semibold whitespace-nowrap'>Booking Fee</div>
                    <div className='font-medium text-right text-semiMd text-gray-600'>₱{clientInformation?.booking_fee}</div>

                    <div className='text-semiMd font-semibold whitespace-nowrap'>Service Fee</div>
                    <div className='font-medium text-right text-semiMd text-gray-600'>₱{clientInformation?.service_fee}</div>

                    <div className='text-semiMd font-semibold whitespace-nowrap'>Total Amount</div>
                    <div className='font-medium text-right text-semiMd text-red-500'>₱{clientInformation?.net_Amount}</div>

                    </div>
                </div>
        </div>
    </Modal>
    </div> 
  )
}

export default InProgressBooking