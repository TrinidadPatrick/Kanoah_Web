import React from 'react'
import { useState, useContext } from 'react'
import { pageContext } from './ServiceRegistrationPage'

const ServiceHours = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] 
  const [step, setStep] = useContext(pageContext)
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

  const submitSchedule = () => {
    console.log(schedule)
  }
 
  return (
    <div className=' h-full w-full flex flex-col'>
    <h1 className='font-semibold text-md text-gray-700'>Set Standard Hours</h1>
    {/* <p className='text-gray-600 text-sm mt-2'>Configure the standard hours of service</p> */}

    {/* Schedule Container */}
    <div className='w-full flex flex-col justify-evenly space-y-5 md:space-y-0  mt-5 h-full'>
    {schedule.map((entry) => (
        // Rows
        <div key={entry.day} className='flex items-center justify-evenly'>
          <p className='font-semibold w-[70px] lg:w-[100px] text-xs lg:text-[1rem]'>{entry.day}</p>

          {/* Toggle Button */}
          <div className='flex items-center'>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer outline-none"
                checked={entry.isOpen}
                onChange={() => handleToggle(entry.day)}
              />
              <div className={`w-7 h-4 lg:w-11 lg:h-6 ${entry.isOpen ? 'bg-blue-600' : 'bg-gray-300'} peer-focus:outline-none outline-none flex items-center rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:lg:left-[3px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:lg:h-[1.2rem] after:h-[0.8rem] after:lg:w-[1.2rem] after:w-[0.8rem] after:transition-all dark:border-gray-600`}></div>
              <span className='ml-2 hidden sm:block text-xs lg:text-[1rem]'>{entry.isOpen ? 'Open' : 'Closed'}</span>
            </label>
          </div>

          {/* Input time */}
          {/* From */}
          <div className={`flex items-center `}>
            <div className="">
              <input
                type="time"
                className="p-0 text-sm lg:text-[1rem] block w-full border rounded-sm focus:outline-none focus:border-blue-500"
                value={entry.fromTime}
                onChange={(e) => handleTimeChange(entry.day, 'fromTime', e.target.value)}
                disabled={!entry.isOpen}
              />
            </div>
            <span className='text-gray-600 mx-4 text-xs lg:text-[1rem]'>TO</span>
            {/* To */}
            <div className="">
              <input
                type="time"
                className="p-0 text-sm lg:text-[1rem] block w-full border rounded-sm focus:outline-none focus:border-blue-500"
                value={entry.toTime}
                onChange={(e) => handleTimeChange(entry.day, 'toTime', e.target.value)}
                disabled={!entry.isOpen}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className='w-full flex justify-end space-x-2 mt-4'>
            <button onClick={()=>{setStep(3)}} className='px-3 text-[0.75rem] md:text-sm rounded-sm py-1 bg-gray-200 text-gray-500'>Back</button>
            <button onClick={()=>{setStep(5);submitSchedule()}} className='px-3 text-[0.75rem] md:text-sm rounded-sm py-1 bg-themeBlue text-white'>Next</button>
            </div>
    </div>
  )
}

export default ServiceHours