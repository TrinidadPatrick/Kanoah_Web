import React from 'react'
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import http from '../../../http';
import { selectServiceData } from '../../../ReduxTK/serviceSlice';
import { selectUserId } from '../../../ReduxTK/userSlice';

const ServiceHours = () => {
  const serviceData = useSelector(selectServiceData)
  const userId = useSelector(selectUserId)
  const accessToken = localStorage.getItem('accessToken')
  const [updating, setUpdating] = useState(false)
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Holidays'] 
  const [schedule, setSchedule] = useState(
    days.map((day) => ({
      day,
      isOpen: false,
      fromTime: '',
      toTime: '',
    }))
  );

  const handleToggle = (day) => {
    setSchedule((prevSchedule) => {
      const newSchedule = prevSchedule.map((entry) =>
        entry.day === day ? { ...entry, isOpen: !entry.isOpen } : entry
      );
      return newSchedule;
    });
  };

  const handleTimeChange = (day, field, value) => {
    setSchedule((prevSchedule) => {
      const newSchedule = prevSchedule.map((entry) =>
        entry.day === day ? { ...entry, [field]: value } : entry
      );
      return newSchedule;
    });
  };

  const submitSchedule = async () => {
    const serviceHour = schedule
    setUpdating(true)
      try {
        const result = await http.patch(`updateService/${userId}`, {serviceHour : serviceHour},  {
          headers : {Authorization: `Bearer ${accessToken}`},
        })
        if(result.data.status == "Success")
        {
          window.location.reload()
          return ;
        }
        else{setUpdating(false)}
      } catch (error) {
        console.error(error)
        setUpdating(false)
      }
  }

  useEffect(()=>{
    if(serviceData.serviceHour !== undefined)
    {
        setSchedule(serviceData.serviceHour)
    }
  },[serviceData])


  return (
    <div className='w-full h-full flex flex-col p-2 '>
    <h1 className='font-semibold text-md text-gray-700'>Set Standard Hours</h1>

    {/* Schedule Container */}
    <div className='w-full flex flex-col relative justify-evenly space-y-5 md:space-y-0  h-full'>
    {schedule.map((entry) => (
        // Rows
        <div key={entry.day} className='flex items-center justify-between md:justify-evenly'>
          <p className={`${entry.day === "Holidays" ? "text-green-500" : ""} font-semibold w-[70px] lg:w-[100px] text-xs lg:text-[1rem]`}>{entry.day}</p>

          {/* Toggle Button */}
         <div className='flex items-center'>
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer outline-none"
      checked={entry.isOpen}
      onChange={() => handleToggle(entry.day)}
    />
    <div className={`w-[1.1rem] h-[0.6rem] lg:w-[1.82rem] lg:h-4 ${entry.isOpen ? 'bg-blue-600' : 'bg-gray-300'} peer-focus:outline-none outline-none flex items-center rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:lg:left-[2px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:lg:h-[0.8rem] after:h-[0.5rem] after:lg:w-[0.8rem] after:w-[0.5rem] after:transition-all dark:border-gray-600`}></div>
    <span className='hidden semiXs:block ml-2 text-xs lg:text-[1rem]'>{entry.isOpen ? 'Open' : 'Closed'}</span>
  </label>
</div>


          {/* Input time */}
          {/* From */}
          <div className={`flex items-center `}>
            <div className="">
              <input
                type="time"
                className="p-1 text-xs xl:text-[1rem] w-[90px] sm:w-[100px] md:w-[115px] sm:ps-3 border rounded-xl focus:outline-none focus:border-blue-50"
                value={entry.isOpen ? entry.fromTime == "" ? "06:00" : entry.toTime : ""}
                onChange={(e) => handleTimeChange(entry.day, 'fromTime', e.target.value)}
                disabled={!entry.isOpen}
              />
            </div>
            <span className='text-gray-600 mx-4 text-xs lg:text-[1rem]'>To</span>
            {/* To */}
            <div className="">
              <input
                type="time"
                
                className="p-1 text-xs xl:text-[1rem] w-[90px] sm:w-[100px] md:w-[115px] sm:ps-3 border rounded-xl focus:outline-none focus:border-blue-50"
                value={entry.isOpen ? entry.toTime == "" ? "06:00" : entry.toTime : ""}
                onChange={(e) => handleTimeChange(entry.day, 'toTime', e.target.value)}
                disabled={!entry.isOpen}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
    <button onClick={()=>{submitSchedule()}} className={`${updating ? "bg-orange-400" : "bg-themeOrange"} px-3 text-sm py-1 absolute sm:relative -bottom-7 sm:bottom-0 w-fit text-gray-100 font-medium shadow-md rounded-sm `}>Update</button>

    </div>
  )
}

export default ServiceHours