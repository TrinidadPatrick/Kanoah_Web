import React from 'react'
import { useState } from 'react';

const BusinessInformation = () => {
    const [description, setDescription] = useState(''); // State to track textarea content
    const handleChange = (e) => {
        setDescription(e.target.value); // Update the description state as the user types
      };

  return (
    <div className='flex flex-col w-full bg-white h-full md:h-full  relative p-1'>
    {/* Business Information */}
    <div className="mb-5">
        <label className="block text-sm text-gray-500 font-semibold mb-2" htmlFor="businessTitle">Service Title</label>
        <input type="text" id="businessTitle" className="w-full p-2 border rounded outline-none shadow-sm" placeholder="Enter business title"/>
    </div>

    {/* Business email and contact */}
    <div className="flex w-full space-x-3  ">
        <div className='w-1/2'> 
            <label className="emailLabel block text-sm text-gray-500 font-semibold mb-2" htmlFor="email">Owner's Email</label>
            <input type="email" id="email" className="w-full p-2 border rounded outline-none shadow-sm" placeholder="example@email.com" />
        </div>
        <div className='w-1/2 relative'> 
            <label className="block text-sm text-gray-500 font-semibold mb-2" htmlFor="contact">Owner's Contact</label>
            <span className='absolute top-[2.303rem] text-gray-400 left-2'>+63</span>
            <input type="tel" id="contact" className="w-full ps-9 p-2 border rounded outline-none shadow-sm" placeholder="1234567890" />
        </div>
    </div>

    {/* Description */}
    <div className="h-full mt-5  flex flex-col"> 
        <label className="block text-sm text-gray-500 font-semibold mb-2" htmlFor="description">Service Description</label>
        <div className='border h-[200px]  md:h-[90%]'>
        <textarea
        id="description"
        value={description}
        onChange={handleChange}
        className="w-full p-2  resize-none outline-none min-h-[20px] max-h-[190px] "
        rows={description.split('\n').length + 1} 
        placeholder="Enter business description..."
      ></textarea>
      </div>
    </div>

    {/* Next button */}
    <div className='text-end mt-3'>
    <button className='px-3 rounded-sm py-1 bg-themeBlue text-white'>Next</button>
    </div>
    </div>
  )
}

export default BusinessInformation