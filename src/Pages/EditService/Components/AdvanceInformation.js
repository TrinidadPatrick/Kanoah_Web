import React, { useEffect } from 'react'
import { categories } from '../../MainPage/Components/Categories'
import { selectServiceData, setServiceData } from '../../../ReduxTK/serviceSlice'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const AdvanceInformation = () => {
    const serviceData = useSelector(selectServiceData)
    
    const [advanceInformation, setAdvanceInformation] = useState({ ServiceContact : "",
    ServiceFax : "",
    ServiceEmail : "",
    ServiceCategory : "",
    ServiceOptions : [],
    AcceptBooking : false,
    SocialLink : [{media : "Youtube",link : ""}, {media : "Facebook",link : ""}, {media : "Instagram",link : ""}],
    PaymentMethod : [{method : "Gcash", enabled: false, gcashInfo : {}}, {method : "Cash", enabled : false}],})


    useEffect(()=>{
        if(serviceData.advanceInformation !== undefined)
        {
            setAdvanceInformation(serviceData.advanceInformation)
        }
    },[serviceData])



  return (
    <main className='w-full flex flex-col space-y-4 h-full overflow-auto p-5'>
    
    {/* fax and Contact */}
    <div className='w-full grid grid-cols-2 lg:grid-cols-4 gap-3'>
        <div className='flex flex-col '>
        {/* Contact */}
        <label htmlFor='contact' className='font-medium'>Service Contact</label>
        <input onChange={(e)=>{setAdvanceInformation({...advanceInformation, ServiceContact : e.target.value})}} value={advanceInformation.ServiceContact} id='contact' className='border p-2 outline-none rounded-md' type='text' />
        </div>
        {/* Fax */}
        <div className='flex flex-col '>   
        <label htmlFor='fax' className='font-medium'>Service Fax Number</label>
        <input  onChange={(e)=>{setAdvanceInformation({...advanceInformation, ServiceFax : e.target.value})}} value={advanceInformation.ServiceFax} id='fax' className='border p-2 outline-none rounded-md' type='text' />
        </div>
        {/* Email */}
        <div className='flex flex-col '>
        <label htmlFor='email' className='font-medium'>Service Email</label>
        <input  onChange={(e)=>{setAdvanceInformation({...advanceInformation, ServiceEmail : e.target.value})}} value={advanceInformation.ServiceEmail} id='email' className='border p-2 outline-none rounded-md' type='text' />
        </div>
        {/* Category */}
        <div className='flex flex-col '>   
        <label htmlFor='category' className='font-medium'>Category</label>
        <select className='border p-2 rounded-md'  onChange={(e)=>{setAdvanceInformation({...advanceInformation, ServiceCategory : e.target.value})}} defaultValue={advanceInformation.ServiceCategory}>
        {
        categories.map((category, index)=>(<option key={index} className='py-2'>{category.category_name}</option>))
        }
        </select>
        </div>
    </div>

    {/* Email and Category */}
    <div className='w-full flex space-x-3'>
       
    </div>

    </main>
  )
}

export default AdvanceInformation