import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import QRCode from "react-qr-code";
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import {io} from 'socket.io-client'
import { selectService, selectSchedule, selectContactAndAddress, setService, setSchedule, setContactAndAddress } from '../../ReduxTK/BookingSlice'
import http from '../../http';
import axios from 'axios';
import Xendit from 'xendit-node'

const Confirmation = ({handleStep, serviceInfo, userContext}) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [bookingInformation, setBookingInformation] = useState({})
    const [invoiceId, setInvoiceId] = useState('')
    const contactAndAddress = useSelector(selectContactAndAddress)
    const schedule = useSelector(selectSchedule)
    const service = useSelector(selectService)
    const [socket, setSocket] = useState(null)

    useEffect(()=>{
        setSocket(io("https://kanoah.onrender.com"))
        // setSocket(io("http://localhost:5000"))
    
      },[])

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

    const generateExternalId = () => {
        const variables = '1234567890'
        let id = ''
        for(let i = 0; i <= 10;i++)
        {
            const randomIndex = Math.floor(Math.random() * variables.length)
            id += variables.charAt(randomIndex)

        }

        return id;
    }

    const computeDistance = () => {
        const providerPlace = {longitude : serviceInfo.address.longitude, latitude : serviceInfo.address.latitude}
        const clientPlace = {longitude : contactAndAddress.Address.longitude, latitude : contactAndAddress.Address.latitude}

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const earthRadius = 6371;
        const toRadians = degrees => degrees * (Math.PI / 180);

        // Convert latitude and longitude from degrees to radians
        const radLat1 = toRadians(lat1);
        const radLon1 = toRadians(lon1);
        const radLat2 = toRadians(lat2);
        const radLon2 = toRadians(lon2);

        // Calculate differences in coordinates
        const deltaLat = radLat2 - radLat1;
        const deltaLon = radLon2 - radLon1;

        // Haversine formula
        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                  Math.cos(radLat1) * Math.cos(radLat2) *
                  Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // Distance in kilometers
        const distance = earthRadius * c;

        return distance;
    }


    
         // Calculate distance between providerPlace and clientPlace
    const distance = Number(calculateDistance(providerPlace.latitude, providerPlace.longitude, clientPlace.latitude, clientPlace.longitude).toFixed(0))

    const basePrice = 49

    
    return basePrice + (distance * 5)
    }


    useEffect(()=>{
        const booking_fee = service.price <= 200 ? 15 : service.price <= 500 ? 25 : service.price <= 1000 ? 35 : 45
        const service_fee = schedule?.serviceOption === "Home Service" ? computeDistance() : 0
        const data = {
            shop : serviceInfo._id,
            service : service,
            schedule : schedule,
            contactAndAddress : contactAndAddress,
            createdAt : new Date(),
            booking_id : generateBookingId(),
            client : userContext._id,
            service_fee : service_fee,
            booking_fee,
            net_Amount : Number(service.price) + Number(service_fee) + Number(booking_fee)
          }

          setBookingInformation(data)
    },[])

    useEffect(()=>{

        const intervalId = setInterval(() => invoiceId !== '' && checkPayment(), 5000); // Check every 5 seconds

        return () => clearInterval(intervalId);
    },[invoiceId])

    const checkPayment = async () => {
        const YOUR_SECRET_KEY = 'xnd_development_POyuz5jRjC6pmt45msNOB126rIexa4MjXNSAFO2kz2t0FKOyiw9zDXBhDHbrgS';

        const xendit = new Xendit({ secretKey: YOUR_SECRET_KEY });

        const { Invoice } = xendit



        const response= await Invoice.getInvoiceById({
        invoiceId: invoiceId
        })
        if(response.status === "PAID") {
            submitBooking()
        }
    }

    const pay = async () => {
        setLoading(true)
        const YOUR_SECRET_KEY = 'xnd_development_POyuz5jRjC6pmt45msNOB126rIexa4MjXNSAFO2kz2t0FKOyiw9zDXBhDHbrgS';

        const xendit = new Xendit({ secretKey: YOUR_SECRET_KEY });
        const { Invoice } = xendit

        const data = {
            "amount" : bookingInformation.net_Amount,
            "invoiceDuration" : 1800,
            "externalId" : generateExternalId(),
            "description" : `Payment of ${bookingInformation.net_Amount} for ${bookingInformation.service.selectedService}`,
            "currency" : "PHP",
            "reminderTime" : 1
          }
        
          try {
            const response= await Invoice.createInvoice({
              data
          })
          setLoading(false)
          setInvoiceId(response.id)
          window.open( response.invoiceUrl, '_blank');
          } catch (error) {
            console.log(error)
          }

    }

    const notifyUser = async (booking_id, receiver) => {
        try {
            const notify = await http.post('addNotification', {
                notification_type : "New_Booking", 
                createdAt : new Date(),
                content : "You have a new Booking!", 
                client : userContext._id,
                notif_to : receiver,
                reference_id : booking_id
            })
        } catch (error) {
            console.error(error)
        }
    }

    const submitBooking = async () => {
        const htmlContent = `
        <div class='w-full bg-[#f9f9f9] flex overflow-auto flex-col h-fit py-3 relative space-y-2 rounded-md '>
        <h1 class='text-center font-semibold text-lg md:text-lg text-gray-800'>Booking Confirmation</h1>
        <button class='absolute top-1'>
            <ArrowBackIosOutlinedIcon class=' hover:text-gray-400' fontSize='small left-0' />
        </button>

        <div class='flex gap-3 w-full bg-white border shadow-sm p-2'>
            <div class='w-[120px] min-w-[120px] flex items-center rounded-sm overflow-hidden aspect-video '>
                <img src=${serviceInfo.serviceProfileImage} alt="service image" />
            </div>
            <div class='w-full'>
                <h1 class='font-medium text-sm md:text-base'>${serviceInfo.basicInformation?.ServiceTitle}</h1>
                <h2 class='font-normal text-xs md:text-sm'>Service: ${bookingInformation.service?.selectedService}</h2>
                <h2 class='font-normal text-xs md:text-sm'>Variant: ${bookingInformation.service?.selectedVariant.type}</h2>
                <h2 class='font-normal text-xs md:text-sm'>Service Option: ${bookingInformation.schedule?.serviceOption}</h2>
            </div>
            <div class='relative justify-self-end w-fit font-semibold'>
                ₱${bookingInformation.service?.price}
            </div>
        </div>

        <div class='w-full bg-white border rounded-sm shadow-sm'>
            <h2 class='font-semibold'>Booking ID: <span class='font-normal underline text-blue-500'>${bookingInformation.booking_id}</span></h2>
        </div>


        <div class='bg-white w-full rounded-sm shadow-sm'>
           
            <div class='flex h-fit items-stretch justify-between gap-2 flex-col md:flex-row-reverse'>

            <ul class='w-full max-w-full text-ellipsis overflow-hidden'>
                <h1 class='font-semibold text-xs'>Client Details</h1>
                <li class='text-xs md:text-sm text-gray-700'>${bookingInformation.contactAndAddress?.firstname + " " + bookingInformation.contactAndAddress?.lastname}</li>
                <li class='text-xs md:text-sm text-gray-700'>${bookingInformation.contactAndAddress?.email}</li>
                <li class='text-xs md:text-sm text-gray-700'>+63${bookingInformation.contactAndAddress?.contact}</li>
            </ul>

            <ul class='w-full '>
            <h1 class='font-semibold'>Schedule</h1>
                <li class='text-xs md:text-sm text-gray-700'>${new Date(bookingInformation.schedule?.bookingDate).toLocaleDateString('EN-US', {
                    month : 'long',
                    day : '2-digit',
                    year : 'numeric'
                })}</li >
                <li class='text-xs md:text-sm text-gray-700'>${bookingInformation.schedule?.timeSpan[0]} - ${bookingInformation.schedule?.timeSpan[1]}</li >
            </ul>
            </div>

            <div class='mt-2'>
            <h2 class='font-semibold'>Address</h2>
            <ul class='flex items-start '>
                <li class='text-xs md:text-sm font-medium mx-0.5 text-gray-700'>${bookingInformation.contactAndAddress?.Address.barangay.name}, 
                ${bookingInformation.contactAndAddress?.Address.municipality.name}, ${bookingInformation.contactAndAddress?.Address.province.name}, ${bookingInformation.contactAndAddress?.Address.region.name}</li>
            </ul>
            <span class='text-xs md:text-sm text-gray-700'>${bookingInformation.contactAndAddress?.Address.street}</span>
            </div>
        </div>
        <div class='p-3 bg-white w-full border rounded-sm shadow-sm'>
        <ul class='grid grid-cols-2 gap-0 gap-x-5'>
                <div class={'font-medium text-xs md:text-sm text-gray-600 '}>Total Service Amount:</div>
                <div class={'font-normal pl-2 text-xs md:text-sm text-gray-600 '}>₱${bookingInformation.service?.price}</div>
                <div class={'font-medium text-xs md:text-sm text-gray-600 '}>Service Fee:</div>
                <div class={'font-normal pl-2 text-xs md:text-sm text-gray-600 '}>₱${bookingInformation.service_fee}</div>
                <div class={'font-medium text-xs md:text-sm text-gray-600 '}>Booking Fee:</div>
                <div class={'font-normal pl-2 text-xs md:text-sm text-gray-600 '}>₱${bookingInformation.booking_fee}</div>
                <div class={'font-medium text-xs md:text-sm text-gray-600 '}>Total amount to pay:</div>
                <div class={'font-normal pl-2 text-xs md:text-sm text-red-500 border-t-1 border-gray-700 '}>₱${bookingInformation.net_Amount}</div>
        </ul>
        </div>
    </div>
                            `
        const receiver = serviceInfo.owner._id
        if(bookingInformation !== null)
        {   
            try {
                const result = await http.post('addBooking', bookingInformation)
                if(result.status === 200)
                {
                    const result = await http.post('sendBookingReceipt', {email : userContext.email, html : htmlContent})
                    dispatch(setService(null))
                    dispatch(setSchedule(null))
                    dispatch(setContactAndAddress(null))
                    handleStep("success")
                    notifyUser(result.data._id, receiver) //insert notification in the database
                    socket.emit('New_Notification', {notification : 'New_Booking', receiver : receiver}); //notify user theres a new booking
                    axios.post(`https://app.nativenotify.com/api/indie/notification`, {
                    subID: receiver,
                    appId: 19825,
                    appToken: 'bY9Ipmkm8sFKbmXf7T0zNN',
                    title: `New Booking`,
                    message: `You have a new booking`
                    });
                }
            } catch (error) {
                alert(error)
            } finally {
                setLoading(false)
            }
           

        }
    }


  return (
    <div className='w-full md:w-[600px] bg-[#f9f9f9] flex overflow-auto flex-col h-fit py-3 relative space-y-2 rounded-md '>
        <h1 className='text-center font-semibold text-lg md:text-lg text-gray-800'>Booking Confirmation</h1>
        <button onClick={()=>{handleStep(3)}} className='absolute top-1'>
            <ArrowBackIosOutlinedIcon className=' hover:text-gray-400' fontSize='small left-0' />
        </button>
        {/* Reminder */}
        <div className=' w-full p-1 bg-white border shadow-sm'>
            <p className='text-center text-sm'>Cancelation policy</p>
            <p className='text-[0.67rem] text-center text-gray-700'>{serviceInfo?.cancelationPolicy?.cancelPolicy}</p>
            <p className='text-[0.67rem] text-center text-gray-700'>This policy is provided by the service provider.</p>
        </div>
        {/* Top Part */}
        <div className={`flex gap-3 w-full bg-white border shadow-sm p-2`}>
            {/* Image container */}
            <div className='w-[120px] min-w-[120px] flex items-center rounded-sm overflow-hidden aspect-video '>
                <img src={serviceInfo.serviceProfileImage} alt="service image" />
            </div>
            <div className='w-full'>
                <h1 className='font-medium text-sm md:text-base'>{serviceInfo.basicInformation?.ServiceTitle}</h1>
                <h2 className='font-normal text-xs md:text-sm'>Service: {bookingInformation.service?.selectedService}</h2>
                <h2 className='font-normal text-xs md:text-sm'>Variant: {bookingInformation.service?.selectedVariant.type}</h2>
                <h2 className='font-normal text-xs md:text-sm'>Service Option: {bookingInformation.schedule?.serviceOption}</h2>
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
           
            <div className='flex h-fit items-stretch justify-between gap-2 flex-col md:flex-row-reverse'>
            {/* Schedule */}
            <ul className=' w-full max-w-full text-ellipsis overflow-hidden'>
                <h1 className='font-semibold'>Client Details</h1>
                <li className='text-xs md:text-sm text-gray-700'>{bookingInformation.contactAndAddress?.firstname + " " + bookingInformation.contactAndAddress?.lastname}</li>
                <li className='text-xs md:text-sm text-gray-700'>{bookingInformation.contactAndAddress?.email}</li>
                <li className='text-xs md:text-sm text-gray-700'>+63{bookingInformation.contactAndAddress?.contact}</li>
            </ul>
            {/* CLient */}
            <ul className='w-full '>
            <h1 className='font-semibold'>Schedule</h1>
                <li className='text-xs md:text-sm text-gray-700'>{new Date(bookingInformation.schedule?.bookingDate).toLocaleDateString('EN-US', {
                    month : 'long',
                    day : '2-digit',
                    year : 'numeric'
                })}</li >
                <li className='text-xs md:text-sm text-gray-700'>{bookingInformation.schedule?.timeSpan[0]} - {bookingInformation.schedule?.timeSpan[1]}</li >
            </ul>
            </div>
            {/* Address */}
            <div className='mt-2'>
            <h2 className='font-semibold'>Address</h2>
            <ul className='flex items-start '>
                <li className='text-xs md:text-sm font-medium mx-0.5 text-gray-700'>{bookingInformation.contactAndAddress?.Address.barangay.name}, 
                {bookingInformation.contactAndAddress?.Address.municipality.name}, {bookingInformation.contactAndAddress?.Address.province.name}, {bookingInformation.contactAndAddress?.Address.region.name}</li>
            </ul>
            <span className='text-xs md:text-sm text-gray-700'>{bookingInformation.contactAndAddress?.Address.street}</span>
            </div>
        </div>
        <div className='p-3 bg-white w-full border rounded-sm shadow-sm'>
        <ul className=' grid grid-cols-2 gap-0 gap-x-5'>
            <div className={`font-medium text-xs md:text-sm text-gray-600 `}>Total Service Amount:</div>
            <div className={`font-normal pl-2 text-xs md:text-sm text-gray-600 `}>₱{bookingInformation.service?.price}</div>
            <div className={`font-medium text-xs md:text-sm text-gray-600 `}>Service Fee:</div>
            <div className={`font-normal pl-2 text-xs md:text-sm text-gray-600 `}>₱{bookingInformation.service_fee}</div>
            <div className={`font-medium text-xs md:text-sm text-gray-600 `}>Booking Fee:</div>
            <div className={`font-normal pl-2 text-xs md:text-sm text-gray-600 `}>₱{bookingInformation.booking_fee}</div>
            <div className={`font-medium text-xs md:text-sm text-gray-600 `}>Total amount to pay:</div>
            <div className={`font-normal pl-2 text-xs md:text-sm text-red-500 border-t-1 border-gray-700 `}>₱{bookingInformation.net_Amount}</div>
        </ul>
        </div>
        <button onClick={()=>{pay()}} className={`text-white ${loading ? "bg-slate-500" : "bg-themeBlue"} hover:bg-slate-500 px-2 py-2 text-xs md:text-sm rounded-sm `}>
        Submit
        </button>
    </div>
  )
}

export default Confirmation