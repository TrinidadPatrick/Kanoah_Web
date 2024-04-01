import React, { useEffect } from 'react'
import { useState } from 'react';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import Modal from 'react-modal'
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import http from '../../../http';

const OwnerBookingHistory = ({ history, lazyLoad, setHistory }) => {
    Modal.setAppElement('#root');
    const [modalIsOpen, setIsOpen] = useState(false);
    const [clientInformation, setClientInformation] = useState(null);
    const [openOption, setOpenOption] = useState(false)
    const [dateFilterValue, setDateFilterValue] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [searchOption, setSearchOption] = useState('Client')
    const [History_Bookings_Orig, set_History_Bookings_Orig] = useState(null);
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
        if(History_Bookings_Orig === null)
        {
            set_History_Bookings_Orig(history)
        }     
    },[History_Bookings_Orig])

    const OpenClientInformation = (id) => {
        const selected = history.find(booking => booking._id === id)
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

    const handleSearch = () => {
        if(dateFilterValue !== '')
        {
            if(searchOption === "Client")
        {
            const result = history.filter((history) => (history.contactAndAddress.firstname+history.contactAndAddress.lastname).toLowerCase().includes(searchValue.toLowerCase()))
            setHistory(result)
        }
        else
        {
            const result = history.filter((history) => (history.service.selectedService).toLowerCase().includes(searchValue.toLowerCase()))
            setHistory(result)
        }
        }
        else
        {
            if(searchOption === "Client")
        {
            const result = History_Bookings_Orig.filter((history) => (history.contactAndAddress.firstname+history.contactAndAddress.lastname).toLowerCase().includes(searchValue.toLowerCase()))
            setHistory(result)
        }
        else
        {
            const result = History_Bookings_Orig.filter((history) => (history.service.selectedService).toLowerCase().includes(searchValue.toLowerCase()))
            setHistory(result)
        }
        }
        
    }

    
    const handleDateFilter = (date) => {
            setDateFilterValue(date)
            const filter =  History_Bookings_Orig?.filter((history) => {
            const historyDate = history.createdAt;
            
            // Extract year, month, and day components
            const isoDate = new Date(historyDate);
            const isoYear = isoDate.getFullYear();
            const isoMonth = isoDate.getMonth() + 1;
            const isoDay = isoDate.getDate();
    
            const commonDateParts = date.split('-');
            const commonYear = parseInt(commonDateParts[0], 10);
            const commonMonth = parseInt(commonDateParts[1], 10);
            const commonDay = parseInt(commonDateParts[2], 10);
    
            return isoYear === commonYear && isoMonth === commonMonth && isoDay === commonDay;
        });

        setHistory(filter)
    };


  return (
    
    <div className='w-full h-full max-h-full flex flex-col gap-4 py-5  px-3 '>
    {/* Search Input and filter */}
    <div className=' flex items-stretch gap-2 pb-3 border-t-1 pt-3 border-b-1 w-full rounded-md'>
    <div className=' flex items-stretch justify-between gap-2 pb-3 border-t-1 pt-3 border-b-1 w-full rounded-md'>
        {/* Search */}
        <div className='w-fit flex items-stretch relative h-full'>
        <Dropdown openOption={openOption} setOpenOption={setOpenOption} setSearchOption={setSearchOption} />
        <button onClick={()=>setOpenOption(!openOption)} className='bg-gray-100 focus:bg-gray-200 border border-e-0 rounded-s-md flex items-center h-full text-xs px-2 text-gray-700'>
        {searchOption}
        <ArrowDropDownOutlinedIcon fontSize='small' />
        </button>
        <input value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} className='h-full w-32 semiSm:w-56 py-2 px-2 pr-6 semiSm:pr-16 text-ellipsis text-gray-700 border rounded-e-md outline-none text-xs sm:text-sm' type='text' placeholder='Search booking' />
        <div className='absolute top-[3px] right-1'>
            <button onClick={()=>handleSearch()} className='text-semiXs hidden semiSm:block sm:text-xs px-2 py-1 bg-blue-500 rounded-sm hover:bg-blue-400 text-white'>Search</button>
            <button className='block semiSm:hidden'>
                <SearchIcon  fontSize='small' className='text-gray-500' />
            </button>
        </div>
        </div>
        <button className='flex items-center bg-gray-100 w-28 sm:w-36 border border-[#949494] rounded-md px-0'>
        <input onChange={(e)=>{handleDateFilter(e.target.value)}} className='rounded-md text-xs text-gray-500 h-full px-2 w-full bg-gray-200 border-0'  type='date' />
        </button>
        </div>
    </div>
    {   
    history?.length === 0 ?
    <div className="flex items-center justify-center h-screen">
    <div className="text-center">
        <h2 className="text-3xl font-semibold mb-4">No Bookings Yet</h2>
        <p className="text-gray-500">Sorry, there are no bookings yet.</p>
    </div>
    </div>
    :   
    <div className='bg-gray-100 rounded-md p-2 flex flex-col gap-3 overflow-auto'> 
        {
        history?.map((booking)=>{
            const dateObject = new Date(booking.createdAt)
            const formattedDate = dateObject.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
            return (
            <div key={booking._id} className={`w-full bg-white border px-2 shadow-sm rounded-md flex justify-evenly h-fit p-1`}>
            {/* Left side */}
            <div className=' w-full'>
            <h1 className='text-[1rem] sm:text-[1.2rem] font-semibold text-themeOrange'>{booking.service.selectedService}</h1>
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
            <button onClick={()=>{{window.open(`https://www.google.com/maps/dir/?api=1&destination=${booking.contactAndAddress.Address.latitude},${booking.contactAndAddress.Address.longitude}`, '_black')}}} className='hidden semiMd:flex flex-col mt-3'>
                <h1 className='text-[1rem] font-medium'>Address</h1>
                <div className='hover:text-gray-400 flex flex-col items-start'>
                <p className='text-sm '>{booking.contactAndAddress.Address.barangay.name + ", " + booking.contactAndAddress.Address.province.name + ", " + booking.contactAndAddress.Address.region.name}</p>
                <p className='text-sm '>{booking.contactAndAddress.Address.street}</p>
                </div>
            </button>
            </div>
            {/* Right side */}
            <div className='w-full h-full hidden semiMd:flex flex-col justify-between relative  pt-12'>
                <div className={`absolute right-2 top-2 ${booking.status === "COMPLETED" ? "text-green-500" : "text-red-500"}`}>
                    <span>{booking.status}</span>
                </div>
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
                <button onClick={()=>OpenClientInformation(booking._id)} className='text-semiSm  px-2  rounded-sm font-medium py-1 bg-gray-100 border text-gray-700' >View Details</button>
            </div>
            </div>

            
            </div>
            )
        })
        }
        </div>
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
                    <div className='font-medium text-right text-semiMd text-gray-600'>{clientInformation?.booking_id}</div>

                    <div className='text-semiMd font-semibold whitespace-nowrap'>Date Issued</div>
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

const Dropdown = ({openOption, setOpenOption, setSearchOption}) => {
    return (
        <>
        {
            openOption ?
            <div className={`w-fit flex flex-col bg-white border absolute top-9 rounded-md overflow-hidden shadow-md`}>
            <button onClick={()=>{setSearchOption('Client');setOpenOption(false)}} className='px-5 py-2 hover:bg-gray-100 text-sm text-gray-700'>Client</button>
            <button onClick={()=>{setSearchOption('Service');setOpenOption(false)}} className='px-5 py-2 hover:bg-gray-100 text-sm text-gray-700'>Service</button>
            </div>
            :
            ""
        }
        </>
    )
}

export default OwnerBookingHistory