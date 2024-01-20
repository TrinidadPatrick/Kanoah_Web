import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import { selectService, selectSchedule, selectContactAndAddress, setService, setSchedule, setContactAndAddress } from '../../ReduxTK/BookingSlice'
import http from '../../http';

const Confirmation = ({handleStep, serviceInfo, userContext}) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [bookingInformation, setBookingInformation] = useState({})
    const contactAndAddress = useSelector(selectContactAndAddress)
    const schedule = useSelector(selectSchedule)
    const service = useSelector(selectService)

    const generateBookingId = () => {
        const variables = '1234567890'
        let id = ''
        for(let i = 0; i <= 10;i++)
        {
            const randomIndex = Math.floor(Math.random() * variables.length)
            id += variables.charAt(randomIndex)

        }

        return id;
    }


    useEffect(()=>{
        const data = {
            shop : serviceInfo._id,
            service : service,
            schedule : schedule,
            contactAndAddress : contactAndAddress,
            createdAt : Date(),
            booking_id : generateBookingId(),
            client : userContext._id
          }

          setBookingInformation(data)
    },[])

    const submitBooking = async () => {
        if(bookingInformation !== null)
        {
            setLoading(true)
        }
        try {
            const result = await http.post('addBooking', bookingInformation)
            if(result.status === 200)
            {
                dispatch(setService(null))
                dispatch(setSchedule(null))
                dispatch(setContactAndAddress(null))
                handleStep("success")
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    }


  return (
    <div className='w-[600px] bg-[#f9f9f9] flex flex-col h-fit py-3 relative space-y-3 rounded-md '>
        <h1 className='text-center font-semibold text-2xl text-gray-800'>Booking Confirmation</h1>
        <button onClick={()=>{handleStep(3)}} className='absolute top-1'>
            <ArrowBackIosOutlinedIcon className=' hover:text-gray-400' fontSize='small left-0' />
        </button>
        {/* Top Part */}
        <div className={`flex gap-3 w-full bg-white border shadow-sm p-2`}>
            {/* Image container */}
            <div className='w-[120px] min-w-[120px] flex items-center rounded-sm overflow-hidden aspect-video '>
                <img src={serviceInfo.serviceProfileImage} alt="service image" />
            </div>
            <div className='w-full'>
                <h1 className='font-medium text-[1rem]'>{serviceInfo.basicInformation?.ServiceTitle}</h1>
                <h2 className='font-normal text-sm'>Service: {bookingInformation.service?.selectedService}</h2>
                <h2 className='font-normal text-sm'>Variant: {bookingInformation.service?.selectedVariant.type}</h2>
                <h2 className='font-normal text-sm'>Service Delivery: {bookingInformation.schedule?.serviceOption}</h2>
            </div>
            <div className='relative justify-self-end w-fit font-semibold'>
                ₱{bookingInformation.service?.price}
            </div>
        </div>
        {/* Booking ID container */}
        <div className='p-3 w-full bg-white border rounded-sm shadow-sm'>
            <h2 className='font-semibold'>Booking ID: <span className='font-normal underline text-blue-500'>{bookingInformation.booking_id}</span></h2>
        </div>

        {/* Customer Information */}
        <div className='p-3 bg-white w-full border rounded-sm shadow-sm'>
           
            <div className='flex h-fit items-stretch justify-between flex-row-reverse'>
            {/* Schedule */}
            <ul className=' w-full max-w-full text-ellipsis overflow-hidden'>
                <h1 className='font-semibold'>Client Details</h1>
                <li className='text-sm text-gray-700'>{bookingInformation.contactAndAddress?.firstname + " " + bookingInformation.contactAndAddress?.lastname}</li>
                <li className='text-sm text-gray-700'>{bookingInformation.contactAndAddress?.email}</li>
                <li className='text-sm text-gray-700'>+63{bookingInformation.contactAndAddress?.contact}</li>
            </ul>
            {/* CLient */}
            <ul className='w-full '>
            <h1 className='font-semibold'>Schedule</h1>
                <li className='text-semiSm text-gray-700'>{bookingInformation.schedule?.bookingDate}</li >
                <li className='text-semiSm text-gray-700'>{bookingInformation.schedule?.bookingTime}</li >
            </ul>
            </div>
            {/* Address */}
            <div className='mt-2'>
            <h2 className='font-semibold'>Address</h2>
            <ul className='flex flex-col items-start '>
                <li className='text-sm font-medium text-gray-700'>{bookingInformation.contactAndAddress?.Address.barangay.name},</li>
                <li className='text-sm font-medium text-gray-700'>{bookingInformation.contactAndAddress?.Address.province.name},</li>
                <li className='text-sm font-medium text-gray-700'>{bookingInformation.contactAndAddress?.Address.region.name}</li>
            </ul>
            <span className='text-sm text-gray-700'>{bookingInformation.contactAndAddress?.Address.street}</span>
            </div>
        </div>
        <button onClick={()=>{submitBooking()}} className={`text-white ${loading ? "bg-slate-500" : "bg-themeBlue"} px-2 py-2 text-sm rounded-sm `}>
        Submit
        </button>
    </div>
  )
}

export default Confirmation