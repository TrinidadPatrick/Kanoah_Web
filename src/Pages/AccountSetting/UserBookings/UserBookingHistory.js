import React from 'react'
import Modal from 'react-modal'
import { useState, useEffect } from 'react';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import SearchIcon from '@mui/icons-material/Search';
import http from '../../../http';
import Rate from './Rate';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

const UserBookingHistory = ({bookingHistory, setBookingHistory}) => {
    const navigate = useNavigate()
    const [modalIsOpen, setIsOpen] = useState(false);
    const [clientInformation, setClientInformation] = useState(null);
    const [openOption, setOpenOption] = useState(false)
    const [dateFilterValue, setDateFilterValue] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [searchOption, setSearchOption] = useState('Store')
    const [rateModalIsOpen, setRateModalIsOpen] = useState(false);
    const [serviceToRate, setServiceToRate] = useState(null)
    const [ratings, setRatings] = useState(null)
    const [ratingInfo, setRatingInfo] = useState(null)
    const [viewRateModalIsOpen, setViewRateModalIsOpen] = useState(false);
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

    const StyledRating = styled(Rating)({
        '& .MuiRating-iconFilled': {
          color: '#ffa534',
          fontSize: "medium"
        },
        '& .MuiRating-iconHover': {
          color: '#ffa534',
          
        },
        '& .MuiRating-iconEmpty': {
          color: '#ffa534',
          fontSize: "large"
          
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity as needed
          },
        

        
    
    });

    useEffect(()=>{
        if(History_Bookings_Orig === null)
        {
            set_History_Bookings_Orig(bookingHistory)
        }     
    },[History_Bookings_Orig])

    const openBookingInfo = (id) => {
        const selected = bookingHistory.find(booking => booking._id === id)
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

    const handleSearch = () => {
        if(dateFilterValue !== '')
        {
            if(searchOption === "Store")
        {
            const result = bookingHistory.filter((history) => (history.shop.basicInformation.ServiceTitle).toLowerCase().includes(searchValue.toLowerCase()))
            setBookingHistory(result)
        }
        else
        {
            const result = bookingHistory.filter((history) => (history.service.selectedService).toLowerCase().includes(searchValue.toLowerCase()))
            setBookingHistory(result)
        }
        }
        else
        {
            if(searchOption === "Store")
        {
            const result = History_Bookings_Orig.filter((history) => (history.shop.basicInformation.ServiceTitle).toLowerCase().includes(searchValue.toLowerCase()))
            setBookingHistory(result)
        }
        else
        {
            const result = History_Bookings_Orig.filter((history) => (history.service.selectedService).toLowerCase().includes(searchValue.toLowerCase()))
            setBookingHistory(result)
        }
        }
        
    }

    
    const handleDateFilter = (date) => {
        console.log(History_Bookings_Orig)
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

        setBookingHistory(filter)
    };

    const rateService = (booking) => {
        setRateModalIsOpen(true)
        setServiceToRate(booking)
    }

    const getUserRatings = async () => {
        try {
            const result = await http.get('getUserRatings', {withCredentials : true})
            setRatings(result.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        getUserRatings()
    },[])

    const viewRating = async (booking_id) => {
        const rating = ratings?.find((rating) => rating.booking === booking_id)
        setRatingInfo(rating)
        setViewRateModalIsOpen(true)
    }


  return (
    <div className='w-full h-full max-h-full flex flex-col gap-4 bg-white py-5'>
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
    {
        bookingHistory?.length === 0 ?
        <div className="flex items-center justify-center h-screen">
        <div className="text-center">
            <h2 className="text-3xl font-semibold mb-4">No Bookings Yet</h2>
            <p className="text-gray-500">Sorry, there are no bookings yet.</p>
        </div>
        </div>
    :
    <div className='w-full h-full max-h-full bg-gray-100 overflow-auto px-3'>
        
        {
        bookingHistory?.map((bookingHistory) => {
            const dateObject = new Date(bookingHistory.schedule.bookingDate)
            const formattedDate = dateObject.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
            return(
                <div key={bookingHistory._id} className="flex gap-3 cursor-pointer flex-col h-fit my-4 bg-white hover:bg-gray-50 rounded-md border shadow-sm p-2">
                {/* Header */}
                <div className='w-full justify-between flex items-center border-b-1 p-2'>
                    <div onClick={()=>navigate(`/explore/viewService/${bookingHistory.shop._id}`)} className='flex items-center cursor-pointer'>
                    <h2 className='font-medium text-base text-gray-700'>{bookingHistory.shop.basicInformation.ServiceTitle}</h2>
                    <ArrowForwardIosIcon fontSize='small' className='p-0.5 text-gray-600' />
                    </div>
                    <span className='text-themeOrange font-medium'>{bookingHistory.status === "CANCELLED" ? "Cancelled" : "Completed"}</span>
                </div>
                {/* Image and personal info container */}
                <div onClick={()=>openBookingInfo(bookingHistory._id)} className='w-full gap-3 h-full relative cursor-pointer flex'>
                    {/* Image Container */}
                    <div className='hidden sm:flex sm:h-[120px] md:h-[130px] lg:h-[170px] aspect-[3/2] '>
                        <img className='w-full rounded-md h-full object-cover' src={bookingHistory.shop.serviceProfileImage} alt="image" />
                    </div>
                    {/* Booking Information */}
                    <div className='flex flex-col w-full px-2 flex-1 justify-between'>
                    <div className='text-lg lg:text-xl font-semibold text-themeOrange '>{bookingHistory.service.selectedService}</div>
                    <div className='w-fit h-full grid grid-cols-2 gap-0 gap-x-5 '>
                        {/* Variant */}
                        <div className={`text-sm lg:text-semiMd text-gray-700 flex items-center font-medium whitespace-nowrap  `}>Variant</div>
                        <div className={`font-normal text-xs lg:text-semiMd flex items-center text-gray-600 `}>{bookingHistory.service.selectedVariant ? bookingHistory.service.selectedVariant?.type : "None"}</div>
                        {/* Amount */}
                        <div className='text-xs lg:text-semiMd text-gray-700 flex items-center font-medium whitespace-nowrap'>Total Amount</div>
                        <div className='font-normal text-xs lg:text-semiMd flex items-center text-gray-600'>₱ {bookingHistory.net_Amount}</div>
                        {/* Schedule */}
                        <div className='text-xs lg:text-semiMd text-gray-700 flex items-center font-medium whitespace-nowrap'>Schedule</div>
                        <div className='font-normal text-xs lg:text-semiMd flex items-center text-gray-600'>{formattedDate}</div>
                        {/* Time */}
                        <div className='text-xs lg:text-semiMd text-gray-700 flex items-center font-medium whitespace-nowrap'>Time</div>
                        <div className='font-normal text-xs lg:text-semiMd flex items-center text-gray-600'>{bookingHistory.schedule.timeSpan[0]} - {bookingHistory.schedule.timeSpan[1]}</div>
                        {/* Time */}
                        <div className='text-xs lg:text-semiMd text-gray-700 flex items-center font-medium whitespace-nowrap'>Service Option</div>
                        <div className='font-normal text-xs lg:text-semiMd flex items-center text-gray-600'>{bookingHistory.schedule.serviceOption}</div>
                    </div>
                    </div>
                    {/* Rate button */}
                    {
                        bookingHistory.status === "COMPLETED" &&
                        <div className=' absolute bottom-3 w-full hidden lg:flex justify-end pr-5 items-end h-full'>
                        {
                            bookingHistory.rated ? 
                            <button onClick={(e)=>{e.stopPropagation();viewRating(bookingHistory._id)}} className='px-3 py-1 bg-themeOrange hover:bg-orange-500 text-white text-sm rounded-sm'>View Rating</button>
                            :
                            <button onClick={(e)=>{e.stopPropagation();rateService(bookingHistory)}} className='px-3 py-1 bg-themeOrange text-white text-sm rounded-sm'>Rate</button>
                        }
                    </div>
                    }
                </div>
                    {/* Rate button */}
                   {
                    bookingHistory.status === "COMPLETED" &&
                    <div className=' w-full flex lg:hidden border-t-1 pt-2 justify-end items-center h-full'>
                    {
                        bookingHistory.rated ?
                        <button onClick={(e)=>{e.stopPropagation();viewRating(bookingHistory._id)}} className=' w-36 py-1 bg-themeOrange text-white text-sm rounded-sm'>View Rating</button>
                        :
                        <button onClick={(e)=>{e.stopPropagation();rateService(bookingHistory)}} className=' w-36 py-1 bg-themeOrange text-white text-sm rounded-sm'>Rate</button>
                    }
                </div>  
                   }
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

                    <div className='text-xs md:text-xs font-semibold whitespace-nowrap'>Book Date</div>
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

    <Modal  isOpen={rateModalIsOpen} style={ModalStyle}>
        <Rate serviceToRate={serviceToRate} />
    </Modal>

    {/* View Rating Modal */}
    <Modal onRequestClose={()=>setViewRateModalIsOpen(false)}  isOpen={viewRateModalIsOpen} style={ModalStyle}>
        <div className='p-5'>
        <span className='text-semiXs block text-gray-500'>Rating ({ratingInfo?.rating}/5)</span>
        <StyledRating readOnly className='relative left-[0.1rem]' defaultValue={ratingInfo?.rating} precision={1} icon={<StarRoundedIcon fontSize='medium' />  } emptyIcon={<StarRoundedIcon fontSize='medium' className='text-gray-300' />} />

        <div className='w-full mt-5'>
            <p className='text-center text-gray-700'>"{ratingInfo?.review}"</p>
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
            <div className={`w-fit h-fit flex flex-col bg-white border absolute top-9 rounded-md overflow-hidden shadow-md`}>
            <button onClick={()=>{setSearchOption('Store');setOpenOption(false)}} className='pr-5 ps-2 py-2 hover:bg-gray-100 text-sm text-start text-gray-700'>Store</button>
            <button onClick={()=>{setSearchOption('Service');setOpenOption(false)}} className='pr-5 ps-2 py-2 hover:bg-gray-100 text-sm text-start text-gray-700'>Service</button>
            </div>
            :
            ""
        }
        </>
    )
}

export default UserBookingHistory