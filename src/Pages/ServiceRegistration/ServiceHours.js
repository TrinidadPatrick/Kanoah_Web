import React from 'react'
import { useState, useContext, useEffect } from 'react'
import { pageContext } from './ServiceRegistrationPage'
import holidays from 'date-holidays'

const ServiceHours = () => {
  const hd = new holidays('PH')
  const holiday = hd.getHolidays()
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Holidays'] 
  const [holidayHours, setHolidayHours] = useState({
    day : 'Holidays',
    isOpen: false,
    fromTime: '',
    toTime: '',
  })
  const [step, setStep, serviceInformation, setServiceInformation] = useContext(pageContext)
  const [schedule, setSchedule] = useState(
    days.map((day) => ({
      day,
      isOpen: false,
      fromTime: '06:00',
      toTime: '18:00',
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
    setServiceInformation({...serviceInformation, serviceHour : schedule})
  }

  useEffect(()=>{
    setSchedule(serviceInformation.serviceHour)
  },[step])


 
  return (
    <div className=' h-full w-full flex flex-col'>
    <h1 className='font-semibold text-md text-gray-700'>Set Standard Hours</h1>
    {/* <p className='text-gray-600 text-sm mt-2'>Configure the standard hours of service</p> */}

    {/* Schedule Container */}
    <div className='w-full flex flex-col justify-between space-y-5 md:space-y-0  mt-5 h-full'>
    {schedule.map((entry) => (
        // Rows
        <div key={entry.day} className='flex items-center justify-between'>
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
                className="p-1 text-sm lg:text-[0.9rem] w-[115px] ps-3 border rounded-xl focus:outline-none focus:border-blue-500"
                value={entry.isOpen ? entry.fromTime : ""}
                onChange={(e) => handleTimeChange(entry.day, 'fromTime', e.target.value)}
                disabled={!entry.isOpen}
              />
            </div>
            <span className='text-gray-600 mx-4 text-xs lg:text-[1rem]'>To</span>
            {/* To */}
            <div className="">
              <input
                type="time"
                className="p-1 text-sm lg:text-[0.9rem] w-[115px] ps-3 border rounded-xl focus:outline-none focus:border-blue-50"
                value={entry.isOpen ? entry.toTime : ""}
                onChange={(e) => handleTimeChange(entry.day, 'toTime', e.target.value)}
                disabled={!entry.isOpen}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Holiday Schedule */}

    </div>

    {/* Button */}
    <div className='w-full flex justify-end space-x-2 mt-4'>
            <button onClick={()=>{setStep(3)}} className='px-3 text-[0.75rem] md:text-sm rounded-sm py-1 bg-gray-200 text-gray-500'>Back</button>
            <button onClick={()=>{setStep(5);submitSchedule()}} className='px-3 text-[0.75rem] md:text-sm rounded-sm py-1 bg-themeBlue text-white'>Next</button>
            </div>
    </div>
  )
}

export default ServiceHours