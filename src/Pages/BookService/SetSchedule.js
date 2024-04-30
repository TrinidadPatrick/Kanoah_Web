import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { styled } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import {ThemeProvider} from '@mui/material/styles';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { selectService, selectSchedule, selectContactAndAddress, setService, setSchedule } from '../../ReduxTK/BookingSlice'
import dayjs from 'dayjs';





    const SetSchedule = ({handleStep, bookingSchedule,  serviceInfo}) => {
    const dispatch = useDispatch()
    const scheduleContext = useSelector(selectSchedule)
    const serviceContext = useSelector(selectService)
    const [error, setError] = useState({
      dateSelected : false,
      timeSelected : false,
      serviceOption : false,
    })
    const [serviceOptionError, setServiceOptionError] = useState(false)
    const [serviceDateError, setServiceDateError] = useState(false)
    const [bookings, setBookings] = useState([])
    const [currentDay, setCurrentDay] = useState('');
    const [bookingScheds, setBookingScheds] = useState([])
    const date = new Date()
    const dateToday = date.getFullYear() + "-" +(date.getMonth() + 1) + "-" + date.getDate()
    const [dateSelected, setDateSelected] = useState('')
    const [timeSelected, setTimeSelected] = useState('')
    const [timeSpan, setTimeSpan] = useState([])
    const [serviceOption, setServiceOption] = useState('')
    const [bookingTimeSlot, setBookingTimeSlot] = useState([])
    const [unavailableTimes, setUnavailableTimes] = useState([])


    const handleDateChange = (selectedDate) => {
        const dayName = dayjs(selectedDate).format('dddd')
        setCurrentDay(dayName)
        // Format the selectedDate using dayjs
        const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
        // setTimeSelected(dayjs(selectedDate.$d).format("h:mm A"))
        setDateSelected(formattedDate)
      };

      // Gets the current day name today
      // useEffect(() => {
      //   // Get the current date
      //   const currentDate = new Date();
    
      //   // Array of days of the week
      //   const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
      //   // Get the day of the week (0-indexed)
      //   const dayIndex = currentDate.getDay();
    
      //   // Get the day name from the array
      //   const dayName = daysOfWeek[dayIndex];
    
      //   // Update state with the current day
      //   setCurrentDay(dayName);
      // }, []);


    const submitSchedule = () => {
        const data = {
            bookingDate : dateSelected,
            bookingTime : timeSelected,
            timeSpan,
            serviceOption : serviceOption
        }
        const keys = {
          dateSelected,
          timeSelected,
          serviceOption
        }
        let hasError = false
        
        Object.entries(keys).forEach(([key, value])=>{
         if(value === '')
         {
          setError((prevError) => ({...prevError, [key] : true}))
          hasError = true
         }
         else
         {
          setError((prevError) => ({...prevError, [key] : false}))
         }
        })

        if(!hasError)
        {
          dispatch(setSchedule(data))
          handleStep(3)
        }
    }


    useEffect(()=>{
      if(dateSelected !== '')
      {
        const bookings = bookingSchedule.filter((schedule) => schedule.schedule.bookingDate === dateSelected)
        setBookings(bookings)
  
        const dateTimeString = dateSelected + " " + timeSelected;
        const dateTime = new Date(dateTimeString + " UTC");
        dateTime.setMinutes(dateTime.getMinutes() + serviceContext.duration);
        const newDateTimeString = dateTime.toISOString().slice(0, 19).replace("T", " ");
  
        const time24Hour = newDateTimeString.split(" ").slice(1).toString()
  
        // Convert to 12-hour format
        const [hours, minutes] = time24Hour.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
  
        const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const time12Hour = `${hours12}:${paddedMinutes} ${period}`;
        setTimeSpan([timeSelected, time12Hour])
      }
    },[dateSelected, timeSelected])


    useEffect(()=>{
      if(scheduleContext !== null)
      {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDateSelected = new Date(scheduleContext.bookingDate);
        const dayIndex = currentDateSelected.getDay();
        const dayName = daysOfWeek[dayIndex]
        setCurrentDay(dayName)
        setServiceOption(scheduleContext.serviceOption)
        setDateSelected(scheduleContext.bookingDate)
        setTimeSelected(scheduleContext.bookingTime)
      }
    },[])

    const disableDate = (date) => {
      const dayName = dayjs(date).format('dddd');
    
      const closedTime = serviceInfo.serviceHour.filter((hour) => hour.isOpen === false);
      return (new Date(date) < new Date() || closedTime.some((closed) => dayName === closed.day));
    };

    useEffect(()=>{
      const getSchedules = (bookings) => {
        return bookings.map((booking) => {
          return booking.schedule.timeSpan;
        });
      }

      setBookingScheds(getSchedules(bookings))

    },[bookings])

    // set the times to match the schedule of the day of the service
    useEffect(()=>{
      const schedule = serviceInfo?.serviceHour.find((serviceHour) => serviceHour.day === currentDay)
      
      const fromDate = new Date(`2000-01-01T${schedule?.fromTime}:00`);
      const toDate = new Date(`2000-01-01T${schedule?.toTime}:00`);

      const timeArray = [];

      let currentTime = fromDate;
      while (currentTime <= toDate) {
        const endTime = new Date(currentTime);
        endTime.setMinutes(endTime.getMinutes() + serviceContext.duration);
    
        // Check if the end time is within the service hours
        if (endTime <= toDate) {
          const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          timeArray.push(formattedTime);
        }
    
        // Increment the current time by the interval in minutes
        currentTime.setMinutes(currentTime.getMinutes() + 30);
      }
    
      setBookingTimeSlot(timeArray);


    },[currentDay, dateSelected])

    // check and disables the time when necessary
    useEffect(()=>{
      if(bookingTimeSlot.length !== 0 && bookingScheds.length !== 0)
      {
        const unavailableTimes = []
        const check = (time) => {
          let count = 0;
          
        for (const timeSpan of bookingScheds) {
          const startTime = new Date(`2000-01-01 ${timeSpan[0]}`);
          const endTime = new Date(`2000-01-01 ${timeSpan[1]}`);
          const targetTimeDate = new Date(`2000-01-01 ${time}`);
  
          if (targetTimeDate >= startTime && targetTimeDate <= endTime) {
            count++;
          }
        }
      
        return count
        }
  
        bookingTimeSlot.map((slot) => {
          const slotNumber = check(slot)
          if(slotNumber == serviceInfo.booking_limit)
          {
            unavailableTimes.push(slot)
          }
        });

        setUnavailableTimes(unavailableTimes)
      }
     

    },[bookingTimeSlot, bookingScheds])


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* <ThemeProvider theme={newTheme}> */}
    <div className='w-full overflow-auto h-[400px] lg:h-[470px] flex flex-col'>
    <div className='w-full pb-1 flex flex-col min-h-[630px] md:min-h-[330px]  md:flex-row gap-2 items-stretch h-[320px]'>
    <div className='relative'>
    <span className={`${error.dateSelected ? "" : "hidden"} absolute top-1 left-1 text-xs text-red-500`}>*Please select a date below</span>
    <StaticDatePicker 
    value={dateSelected !== '' ? dayjs(`${dateSelected}`) : ''}
    shouldDisableDate={disableDate}  onChange={(value)=>handleDateChange(value)} className=' h-[320px] min-h-[330px] rounded-md border'  orientation="landscape" slotProps={{
    actionBar: {
      actions: [],
    },
    toolbar: {
        hidden: true,
      },
    }} />
    </div>

    <div id='booked' className={`w-[280px] h-[330px] bg-white flex flex-col justify-start pb-3 rounded-md relative border px-2`}>
      <span className={`${error.timeSelected ? "" : "hidden"} text-xs text-red-500`}>*Please select a time below</span>
    {
      bookingTimeSlot.length !== 0
      ?
      <div className='grid grid-cols-3 gap-2 mt-3'>
    {
      bookingTimeSlot.map((time) =>{
        return (
          <button key={time}
          disabled={unavailableTimes.includes(time)} onClick={()=>setTimeSelected(time)} className={`px-3 py-1 ${time === timeSelected ? 'bg-blue-500 text-gray-50' : 'bg-gray-100 border text-gray-700'} disabled:bg-blue-300  text-semiSm rounded-sm `}>{time}</button>
        )
      })
    }
    </div>
    :
    <div className='flex-1 flex justify-center items-center '>
      <p className='text-gray-600'>No date selected</p>
    </div>
    }
    </div>
   
    </div>

    <div className='w-full border  rounded-md bg-white p-2 mt-2'>
      <h1 className='font-semibold text-gray-800 mb-2 ml-1'>Select option <span className={`text-xs ${error.serviceOption ? "" : "hidden"} font-normal text-red-500`}>*Required</span></h1>
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
    
    <div className='w-full flex justify-end  space-x-2 mt-3'>
    <button onClick={()=>{handleStep(1)}} className='bg-gray-400 text-white px-2 py-1 rounded-sm text-sm'>Back</button>
    <button onClick={()=>{submitSchedule()}} className='bg-themeBlue text-white px-2 py-1 rounded-sm text-sm'>Next</button>
    </div>
    </div>
    {/* </ThemeProvider> */}
    </LocalizationProvider>
  )
}

export default SetSchedule