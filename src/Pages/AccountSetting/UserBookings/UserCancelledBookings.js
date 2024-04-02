import React from 'react'
import Modal from 'react-modal'
import { useState } from 'react';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const UserCancelledBookings = ({cancelledBookings}) => {
    const navigate = useNavigate()
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

    const openBookingInfo = (id) => {
        const selected = cancelledBookings.find(booking => booking._id === id)
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
        const newData = {...selected, bookSchedule : bookSchedule, issuedDate : issuedDate, bookTime : bookTime, owner : selected.shop.owner}
        setClientInformation(newData)
        setIsOpen(true)
    }

  return (
    <>
    {
    cancelledBookings?.length === 0 ?
    <div className="flex items-center justify-center h-screen">
        <div className="text-center">
            <h2 className="text-3xl font-semibold mb-4">No Bookings Yet</h2>
            <p className="text-gray-500">Sorry, there are no bookings yet.</p>
        </div>
    </div>
    :
    cancelledBookings === null
    ?
    <div className='w-full mt-5 flex flex-col'>
        <div className="flex flex-col  w-full  h-64 animate-pulse rounded-xl p-4 gap-4"  >
        <div className="bg-neutral-400/50 w-56 h-32 animate-pulse rounded-md"></div>
        <div className="flex flex-col gap-2">
        <div className="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
        <div className="bg-neutral-400/50 w-4/5 h-4 animate-pulse rounded-md"></div>
        <div className="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
        <div className="bg-neutral-400/50 w-2/4 h-4 animate-pulse rounded-md"></div>
        </div>
        </div>
        <div className="flex flex-col  w-full  h-64 animate-pulse rounded-xl p-4 gap-4"  >
        <div className="bg-neutral-400/50 w-56 h-32 animate-pulse rounded-md"></div>
        <div className="flex flex-col gap-2">
        <div className="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
        <div className="bg-neutral-400/50 w-4/5 h-4 animate-pulse rounded-md"></div>
        <div className="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
        <div className="bg-neutral-400/50 w-2/4 h-4 animate-pulse rounded-md"></div>
        </div>
        </div>
        </div>
    :
    <div className='w-full h-full max-h-full overflow-auto'>
        {
        cancelledBookings?.map((cancelledBookings) => {
            const dateObject = new Date(cancelledBookings.schedule.bookingDate)
            const formattedDate = dateObject.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
            return(
                <div key={cancelledBookings._id} className="flex gap-3 cursor-pointer flex-col h-fit my-4 bg-white hover:bg-gray-50 rounded-md border shadow-sm p-2">
                {/* Header */}
                <div className='w-full justify-between flex items-center border-b-1 p-2'>
                    <div onClick={()=>navigate(`/explore/viewService/${cancelledBookings.shop._id}`)} className='flex items-center cursor-pointer'>
                    <h2 className='font-medium text-base text-gray-700'>{cancelledBookings.shop.basicInformation.ServiceTitle}</h2>
                    <ArrowForwardIosIcon fontSize='small' className='p-0.5 text-gray-600' />
                    </div>
                    <span className='text-red-500 font-medium'>Cancelled</span>
                </div>
                {/* Image and personal info container */}
                <div onClick={()=>openBookingInfo(cancelledBookings._id)} className='w-full gap-3 h-full relative cursor-pointer flex'>
                    {/* Image Container */}
                    <div className='hidden sm:flex sm:h-[120px] lg:h-[200px] aspect-[3/2] '>
                        <img className='w-full rounded-md h-full object-cover' src={cancelledBookings.shop.serviceProfileImage} alt="image" />
                    </div>
                    {/* Booking Information */}
                    <div className='flex flex-col w-full px-2 flex-1 justify-between'>
                    <div className='text-lg lg:text-xl font-semibold text-themeOrange '>{cancelledBookings.service.selectedService}</div>
                    <div className='w-fit h-full grid grid-cols-2 gap-0 gap-x-5 '>
                        {/* Variant */}
                        <div className={`text-sm lg:text-semiMd text-gray-700 flex items-center font-medium whitespace-nowrap  `}>Variant</div>
                        <div className={`font-normal text-xs lg:text-semiMd flex items-center text-gray-600 `}>{cancelledBookings.service.selectedVariant ? cancelledBookings.service.selectedVariant?.type : "None"}</div>
                        {/* Amount */}
                        <div className='text-xs lg:text-semiMd text-gray-700 flex items-center font-medium whitespace-nowrap'>Total Amount</div>
                        <div className='font-normal text-xs lg:text-semiMd flex items-center text-gray-600'>₱ {cancelledBookings.net_Amount}</div>
                        {/* Schedule */}
                        <div className='text-xs lg:text-semiMd text-gray-700 flex items-center font-medium whitespace-nowrap'>Schedule</div>
                        <div className='font-normal text-xs lg:text-semiMd flex items-center text-gray-600'>{formattedDate}</div>
                        {/* Time */}
                        <div className='text-xs lg:text-semiMd text-gray-700 flex items-center font-medium whitespace-nowrap'>Time</div>
                        <div className='font-normal text-xs lg:text-semiMd flex items-center text-gray-600'>{cancelledBookings.schedule.timeSpan[0]} - {cancelledBookings.schedule.timeSpan[1]}</div>
                        {/* Time */}
                        <div className='text-xs lg:text-semiMd text-gray-700 flex items-center font-medium whitespace-nowrap'>Service Option</div>
                        <div className='font-normal text-xs lg:text-semiMd flex items-center text-gray-600'>{cancelledBookings.schedule.serviceOption}</div>
                    </div>
                    </div>
                </div>

                </div>
            )
        })
    }
    </div>
    }

<Modal  isOpen={modalIsOpen} style={ModalStyle}>
        <div className='w-full sm:w-fit h-fit max-h-[90dvh] sm:h-full flex flex-col bg-[#f9f9f9] p-2'>
            <div className='flex items-center space-x-1'>
            <ArrowBackIosNewOutlinedIcon onClick={()=>setIsOpen(false)} fontSize='small' className='text-gray-500 p-0.5 cursor-pointer' />
            <h1 className='text-lg text-gray-700 font-medium'>Booking Details</h1>
            </div>
            
            <div  className="flex flex-col h-fit my-0 sm:my-4  p-2">
                {/* Image and personal info container */}
                <div className='w-full flex flex-col sm:flex-row bg-white rounded-md border shadow-sm p-2'>
                    {/* Image Container */}
                    <div className='h-[120px] md:h-[140px] aspect-square flex '>
                        <img className='w-full rounded-md h-full object-cover' src={clientInformation?.shop.serviceProfileImage} alt="image" />
                    </div>
                    {/* Booking Information */}
                    <div className='flex flex-col space-y-0 sm:space-y-2 px-2'>
                    <div className='text-base md:text-lg font-semibold text-themeOrange '>{clientInformation?.service?.selectedService}</div>
                    <div className='w-fit h-full grid grid-cols-2 gap-0 gap-x-5 '>
                        {/* Variant */}
                        <div className={`text-[0.72rem] md:text-sm font-medium text-gray-800 whitespace-nowrap  `}>Variant</div>
                        <div className={`font-normal text-semiMd text-gray-600 `}>{clientInformation?.service.selectedVariant ? clientInformation?.service.selectedVariant?.type : "None"}</div>
                        {/* Amount */}
                        <div className='text-xs md:text-[0.8rem] font-medium text-gray-800 whitespace-nowrap'>Amount</div>
                        <div className='font-normal text-xs md:text-[0.8rem] text-gray-600'>₱ {clientInformation?.service.price}</div>
                        {/* Schedule */}
                        <div className='text-xs md:text-[0.8rem] font-medium text-gray-800 whitespace-nowrap'>Schedule</div>
                        <div className='font-normal text-xs md:text-[0.8rem] text-gray-600'>{clientInformation?.bookSchedule}</div>
                        {/* Time */}
                        <div className='text-xs md:text-[0.8rem] font-medium text-gray-800 whitespace-nowrap'>Time</div>
                        <div className='font-normal text-xs md:text-[0.8rem] text-gray-600'>{clientInformation?.schedule.bookingTime}</div>
                        {/* Time */}
                        <div className='text-xs md:text-[0.8rem] font-medium text-gray-800 whitespace-nowrap'>Service Option</div>
                        <div className='font-normal text-xs md:text-[0.8rem] text-gray-600'>{clientInformation?.schedule.serviceOption}</div>
                    </div>
                    </div>
                    
                </div>
                <div className='w-full mt-4 flex flex-col bg-white rounded-md border shadow-sm p-2'>
                    <h2 className='text-gray-800 text-sm font-medium'>Client Details</h2>
                    <span className='text-gray-600 font-normal text-[0.7rem]'>{clientInformation?.contactAndAddress.firstname + " " + clientInformation?.contactAndAddress.lastname}</span>
                    <span className='text-gray-600 font-normal text-[0.7rem]'>{clientInformation?.contactAndAddress.email}</span>
                    <span className='text-gray-600 font-normal text-[0.7rem]'>+63{clientInformation?.contactAndAddress.contact}</span>
                    <span className='text-gray-600 font-normal text-[0.7rem]'>{clientInformation?.contactAndAddress.Address.barangay.name + ", " + clientInformation?.contactAndAddress.Address.province.name + ", " + clientInformation?.contactAndAddress.Address.region.name}</span>
                    <span className='text-gray-600 font-normal text-[0.7rem]'>{clientInformation?.contactAndAddress.Address.street}</span>
                </div>
                <div className='w-full mt-4 grid grid-cols-2 gap-0 gap-x-5 bg-white rounded-md border shadow-sm p-2'>
                    <div className='text-xs md:text-xs font-semibold whitespace-nowrap'>BOOKING ID</div>
                    <div className='font-medium text-right text-xs md:text-xs text-gray-600'>{clientInformation?.booking_id}</div>

                    <div className='text-xs md:text-xs font-semibold whitespace-nowrap'>Date Issued</div>
                    <div className='font-medium text-right text-xs md:text-xs text-gray-600'>{clientInformation?.issuedDate}</div>

                    <div className='text-xs md:text-xs font-semibold whitespace-nowrap'>Book Schedule</div>
                    <div className='font-medium text-right text-xs md:text-xs text-gray-600'>{clientInformation?.schedule.timeSpan[0]} - {clientInformation?.schedule.timeSpan[1]}</div>
                    
                </div>
                <div className='w-full mt-4 grid grid-cols-2 gap-0 gap-x-5 bg-white rounded-md border shadow-sm p-2'>
                    <div className='text-xs md:text-xs font-semibold whitespace-nowrap'>Service Amount</div>
                    <div className='font-medium text-right text-xs md:text-xs text-gray-600'>₱{clientInformation?.service.price}</div>

                    <div className='text-xs md:text-xs font-semibold whitespace-nowrap'>Booking Fee</div>
                    <div className='font-medium text-right text-xs md:text-xs text-gray-600'>₱{clientInformation?.booking_fee}</div>

                    <div className='text-xs md:text-xs font-semibold whitespace-nowrap'>Service Fee</div>
                    <div className='font-medium text-right text-xs md:text-xs text-gray-600'>₱{clientInformation?.service_fee}</div>

                    <div className='text-xs md:text-xs font-semibold whitespace-nowrap'>Total Amount</div>
                    <div className='font-medium text-right text-xs md:text-xs text-red-500'>₱{clientInformation?.net_Amount}</div>

                    <button onClick={() => { window.open(`/explore/viewService/${clientInformation.shop._id}`, '_blank') }} className='bg-gray-100 border rounded-sm text-xs text-gray-800 py-1 mt-2'>View Service</button>
                    <button onClick={() => { window.open(`/chat?service=${clientInformation.owner}`, '_blank') }} className='bg-green-400 border rounded-sm text-xs text-gray-100 py-1 mt-2'>Contact Service</button>
                    </div>
                </div>
        </div>
    </Modal>
    </>
  )
}

export default UserCancelledBookings