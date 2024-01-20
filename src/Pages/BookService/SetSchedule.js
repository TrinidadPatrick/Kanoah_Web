import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { styled } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import {ThemeProvider} from '@mui/material/styles';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { selectService, selectSchedule, selectContactAndAddress, setService, setSchedule } from '../../ReduxTK/BookingSlice'
import dayjs from 'dayjs';




    const SetSchedule = ({handleStep, bookingSchedule,  serviceInfo}) => {
    const dispatch = useDispatch()
    const scheduleContext = useSelector(selectSchedule)
    const [serviceOptionError, setServiceOptionError] = useState(false)
    const [bookings, setBookings] = useState([])
    const [currentDay, setCurrentDay] = useState('');
    const [timeAvailable, setTimeAvailable] = useState([])
    const date = new Date()
    const dateToday = date.getFullYear() + "-" + date.getMonth()+1 + "-" + date.getDate()
    const [dateSelected, setDateSelected] = useState(dateToday)
    const [timeSelected, setTimeSelected] = useState('12:00 AM')
    const [serviceOption, setServiceOption] = useState('')


    const handleDateChange = (selectedDate) => {
      const dayName = dayjs(selectedDate).format('dddd')
      console.log(dayName)
        // Format the selectedDate using dayjs
        const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
        setTimeSelected(dayjs(selectedDate.$d).format("h:mm A"))
        setDateSelected(formattedDate)
      };

      useEffect(() => {
        // Get the current date
        const currentDate = new Date();
    
        // Array of days of the week
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
        // Get the day of the week (0-indexed)
        const dayIndex = currentDate.getDay();
    
        // Get the day name from the array
        const dayName = daysOfWeek[dayIndex];
    
        // Update state with the current day
        setCurrentDay(dayName);
      }, []);


    useEffect(()=>{
        const time = serviceInfo.serviceHour.find(sched => sched.day === currentDay)
        // setTimeAvailable(serviceInfo.serviveHour)
    },[currentDay])

    const submitSchedule = () => {
        const data = {
            bookingDate : dateSelected,
            bookingTime : timeSelected,
            serviceOption : serviceOption
        }

        if(serviceOption === '')
        {
          setServiceOptionError(true)
          return
        }

        dispatch(setSchedule(data))
        handleStep(3)
    }

    useEffect(()=>{
      const bookings = bookingSchedule.filter((schedule) => schedule.schedule.bookingDate === dateSelected)
      setBookings(bookings)
    },[dateSelected, timeSelected])

    useEffect(()=>{
      if(scheduleContext !== null)
      {
        setServiceOption(scheduleContext.serviceOption)
        setDateSelected(scheduleContext.bookingDate)
        setTimeSelected(scheduleContext.bookingTime)
      }
    },[])

    const disableDate = (date) => {
      const dayName = dayjs(date).format('dddd');
    
      const closedTime = serviceInfo.serviceHour.filter((hour) => hour.isOpen === false);
    
      return closedTime.some((closed) => dayName === closed.day);
    };

    const disableTime = (time) => {
      const dayName = dayjs(time).format('dddd');
      const selectedTime = dayjs(time).format('HH:mm');
    
      const openTime = serviceInfo.serviceHour.find((hour) => {
        return hour.day === dayName && selectedTime >= hour.fromTime && selectedTime <= hour.toTime;
      });
    
      return openTime ? false : true;
    }

    
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* <ThemeProvider theme={newTheme}> */}
    <div className='w-full'>
    <div className='w-full flex items-stretch h-full space-x-3'>
    {/* <StaticDateTimePicker defaultValue={dayjs('2022-04-17T15:30')} /> */}
    <StaticDateTimePicker shouldDisableTime={disableTime} shouldDisableDate={disableDate} ampmInClock value={dayjs(`${dateSelected} ${timeSelected}`)} onChange={(value)=>handleDateChange(value)} className='shadow-md h-[370px] rounded-md'  orientation="landscape" slotProps={{
    actionBar: {
      actions: [],
    },
    toolbar: {
        hidden: true,
      },
    }} />

    <div id='booked' className='w-[200px] h-[372px] bg-white rounded-md shadow-md px-2'>
    <h1 className='text-center text-sm font-medium mt-2 text-gray-800'>Bookings for {dateSelected}</h1>
    {
        bookings.map((booking, index)=>{
            return (
                <p key={index} className='px-2 py-1 rounded-sm bg-gray-300 text-sm my-1'>{booking.schedule.bookingTime}</p>
            )
        })
    }
    </div>
   
    </div>
    {/* Service Options */}
    <div className='w-full shadow-md rounded-md bg-white p-2 mt-3'>
      <h1 className='font-semibold text-gray-800 mb-2 ml-1'>Select option <span className={`text-xs ${serviceOptionError ? "" : "hidden"} font-normal text-red-500`}>*Required</span></h1>
    {
      serviceInfo.advanceInformation.ServiceOptions.map((service, index)=>(
        <button onClick={()=>{setServiceOption(service)}} className={`${serviceOption === service ? "bg-themeBlue text-white" : "bg-gray-200 border border-neutral-500 text-gray-800"} relative px-2 py-1 text-sm  mx-1 rounded-sm`} key={index}>
        <div className={`${serviceOption === service ? "bg-themeBlue" : "hidden"} absolute -top-2 text-themeBlue bg-white rounded-full -right-2`}>
        <CheckCircleOutlineOutlinedIcon fontSize='small' />
        </div>
        
        {service}
        </button>
      ))
    }
    </div>
    
    <div className='w-full flex justify-end space-x-2 mt-3'>
    <button onClick={()=>{handleStep(1)}} className='bg-gray-400 text-white px-2 py-1 rounded-sm text-sm'>Back</button>
    <button onClick={()=>{submitSchedule()}} className='bg-themeBlue text-white px-2 py-1 rounded-sm text-sm'>Next</button>
    </div>
    </div>
    {/* </ThemeProvider> */}
    </LocalizationProvider>
  )
}

export default SetSchedule