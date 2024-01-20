import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import http from '../../http'
import DoneIcon from '@mui/icons-material/Done';
import './style.css'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { selectService, selectSchedule, selectPayment, setService } from '../../ReduxTK/BookingSlice'
import ServiceSelect from './ServiceSelect'
import SetSchedule from './SetSchedule'
import ContactAndAddress from './ContactAndAddress';
import UseInfo from '../../ClientCustomHook/UseInfo';
import Confirmation from './Confirmation';
import useBookings from '../../ClientCustomHook/BookingsProvider';
import Success from './Success';

const BookService = ({handleCloseModal, serviceId}) => {
    const userContext = UseInfo()
    const [step, setStep] = useState(1)
    const [serviceInfo, setServiceInfo] = useState(null)
    const [bookingSchedule, setBookingSchedule] = useState([])
    const {bookings} = useBookings()

    const handleStep = (value) => {
        setStep(value)
    }

    useEffect(()=>{
        http.get(`getServiceInfo/${serviceId}`).then((res)=>{
            setServiceInfo(res.data.service)
          }).catch((err)=>{
            console.log(err)
        })
    },[])

    useEffect(()=>{
        if(serviceInfo !== null)
        {
          const getBookingSchedule = async () => {
            try {
              const result = await http.get(`getBookingSchedules/${serviceInfo._id}`)
              if(result)
              {
                setBookingSchedule(result.data)
              }
            } catch (error) {
              console.log(error)
            }
          }
          getBookingSchedule()
        }
    }, [serviceInfo])
    

  return (
    <main className='w-fit h-full max-h-full overflow-auto bg-[#f9f9f9] flex flex-col justify-center items-start px-5 pb-2'>
         <div className={`${step === 4 || step === "success" ? "hidden" : ""} py-2 flex justify-between w-full items-center`}>
            <div>
            <h1 className='text-2xl font-bold text-gray-800'>Book Service</h1>
            <h3 className='text-semiXs font-medium text-gray-500'>R & Next Carwash</h3>
            </div>  
            <CloseOutlinedIcon onClick={()=>handleCloseModal()} className='cursor-pointer' />
        </div> 
        {/*Stepper */}
        <div className={`${step === 4 || step === "success" ? "hidden" : ""} flex items-center w-full bg-white mb-2 rounded-md shadow-sm px-2 py-2  mx-auto font-[sans-serif]`}>
        <div className=' w-full flex'>
      <div className="flex items-center w-full">
        <div className={`w-7 h-7 shrink-0 mx-[-1px] bg-blue-500 p-1.5 flex items-center justify-center rounded-full`}>
        <span className={`text-base ${step !== 1 ? "hidden" : ""} ${step === 1 ? 'text-gray-200' : 'text-gray-400'} font-bold`}>1</span>
        <div className={`${step !== 1 ? "" : "hidden"}`}>
        <DoneIcon className='text-white mb-0.5' fontSize='small' />
        </div>
        </div>
        <h6 className={`text-base ml-4  text-blue-500 whitespace-nowrap max-lg:hidden`}>Service</h6>
        <div className={`w-full h-0.5 rounded-xl mx-4 ${step === 2 || step === 3 ? "bg-blue-500" : "bg-gray-300"}`}></div>
      </div>
      
      <div className="flex items-center w-full">
        <div className={`w-7 h-7 shrink-0 mx-[-1px] ${step === 2 || step === 3 ? "bg-blue-500" : "border-2"} p-1.5 flex items-center justify-center rounded-full`}>  
        <div className={`${step === 3 ? "" : "hidden"}`}>
        <DoneIcon className='text-white mb-0.5' fontSize='small' />
        </div>
          <span className={`text-base  ${step === 2 ? "text-gray-200" : step === 3 ? "hidden" : "text-gray-400"} font-bold`}>2</span>
        </div>
        <h6 className={`text-base ml-4 ${step === 2 || step === 3 ? "text-blue-500" : "text-gray-400"} whitespace-nowrap max-lg:hidden`}>Schedule</h6>
        <div className={`w-full ${step === 3 ? "bg-blue-500" : "bg-gray-300"} h-0.5 rounded-xl mx-4 `}></div>
      </div>

      <div className="flex items-center w-max">
        <div className={`w-7 h-7 shrink-0 mx-[-1px] ${step === 3 ? "bg-blue-500" : "border-2"} p-1.5 flex items-center justify-center rounded-full`}>
        <span className={`text-base  ${step === 3 ? "text-gray-200" : "text-gray-400"} font-bold`}>3</span>
        </div>
        <h6 className={`text-base ml-4 ${step === 3 ? "text-blue-500" : "text-gray-400"}  whitespace-nowrap max-lg:hidden`}>Contact & Address</h6>
      </div>
      </div>
    </div>
        {/* Step 1 */}
        {
            step === 1 &&<ServiceSelect handleStep={handleStep} serviceInfo={serviceInfo} />
        }
        {
            step === 2 &&<SetSchedule handleStep={handleStep} bookingSchedule={bookingSchedule} serviceInfo={serviceInfo} />
        }
        {
            step === 3 &&<ContactAndAddress handleStep={handleStep} userContext={userContext.userInformation} serviceInfo={serviceInfo} />
        }
        {
            step === 4 &&<Confirmation handleStep={handleStep} userContext={userContext.userInformation} serviceInfo={serviceInfo} />
        }
        {
            step === "success" &&<Success handleCloseModal={handleCloseModal} />
        }
        

    </main>
  )
}

export default BookService