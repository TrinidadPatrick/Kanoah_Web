import React, { useEffect } from 'react'
import { selectServiceData, setServiceData } from '../../../ReduxTK/serviceSlice'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const BasicInformation = () => {
    const [loading, setLoading] = useState(true)
    const serviceData = useSelector(selectServiceData)
    const [basicInformation, setBasicInformation] = useState({ ServiceTitle : "", OwnerContact : "", OwnerEmail : "" , Description : ""})

    useEffect(()=>{
        if(serviceData.basicInformation !== undefined)
        {
            setBasicInformation(serviceData.basicInformation)
        }
    }, [serviceData])

    console.log(basicInformation)

  return (
    <main className='w-full flex flex-col space-y-4 h-full  p-5'>
        
        {/* Service Title */}
        <div className='w-full flex flex-col justify-start'>
        <label htmlFor='title' className='font-medium'>Service Title</label>
        <input value={basicInformation.ServiceTitle} onChange={(e)=>{setBasicInformation({...basicInformation, ServiceTitle : e.target.value})}} id='title' className='border p-2 outline-none rounded-md' type='text' />
        </div>

        {/* Email and Contact */}
        <div className='w-full flex space-x-3'>
        <div className='flex flex-col w-full'>
        <label htmlFor='email' className='font-medium'>Owner Email</label>
        <input value={basicInformation.OwnerEmail} onChange={(e)=>{setBasicInformation({...basicInformation, OwnerEmail : e.target.value})}} id='email' className='border p-2 outline-none rounded-md' type='text' />
        </div>
        <div className='flex flex-col w-full'>   
        <label htmlFor='contact' className='font-medium'>Owner Contact</label>
        <input value={basicInformation.OwnerContact} onChange={(e)=>{setBasicInformation({...basicInformation, OwnerContact : e.target.value})}} id='contact' className='border p-2 outline-none rounded-md' type='text' />
        </div>
        </div>

         {/* Service Description */}
         <div className='w-full flex flex-col justify-start h-full'>
        <label htmlFor='description' className='font-medium'>Service Description</label>
        <textarea value={basicInformation.Description} onChange={(e)=>{setBasicInformation({...basicInformation, Description : e.target.value})}} id='description' className='border p-2 outline-none rounded-md h-full resize-none'  />
        </div>
        
    </main>
  )
}

export default BasicInformation