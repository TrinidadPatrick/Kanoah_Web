import React, { useEffect } from 'react'
import { selectServiceData, setServiceData } from '../../../ReduxTK/serviceSlice'
import { selectUserId } from '../../../ReduxTK/userSlice'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import http from '../.././../http'

const BasicInformation = () => {
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const serviceData = useSelector(selectServiceData)
    const userId = useSelector(selectUserId)
    const [basicInformation, setBasicInformation] = useState({ ServiceTitle : "", OwnerContact : "", OwnerEmail : "" , Description : ""})
    const accessToken = localStorage.getItem('accessToken')

    useEffect(()=>{
        if(serviceData.basicInformation !== undefined)
        {
            setBasicInformation(serviceData.basicInformation)
        }
    }, [serviceData])

    const handleUpdate = async () => {
      setUpdating(true)
      try {
        const result = await http.patch(`updateService/${userId}`, {basicInformation : basicInformation},  {
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



  return (
    <main className='w-full flex flex-col space-y-4 h-full sm:h-full p-5'>
        
        {/* Service Title */}
        <div className='w-full flex flex-col justify-start'>
        <label htmlFor='title' className='font-medium text-sm xl:text-[0.9rem] text-gray-700'>Service Title</label>
        <input value={basicInformation.ServiceTitle} onChange={(e)=>{setBasicInformation({...basicInformation, ServiceTitle : e.target.value})}} id='title' className='text-sm xl:text-[1rem] border p-2 outline-none rounded-md' type='text' />
        </div>

        {/* Email and Contact */}
        <div className='w-full flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-3'>
        <div className='flex flex-col w-full'>
        <label htmlFor='email' className='font-medium text-sm xl:text-[0.9rem] text-gray-700'>Owner Email</label>
        <input value={basicInformation.OwnerEmail} onChange={(e)=>{setBasicInformation({...basicInformation, OwnerEmail : e.target.value})}} id='email' className='text-sm xl:text-[1rem] border p-2 outline-none rounded-md' type='text' />
        </div>
        <div className='flex flex-col w-full relative'>   
        <label htmlFor='contact' className='font-medium text-sm xl:text-[0.9rem] text-gray-700'>Owner Contact</label>
        <span className='absolute top-[50%] text-sm xl:text-[1rem] lg:top-[50%] left-2 text-gray-600'>+63</span>
        <input value={basicInformation.OwnerContact} onChange={(e)=>{setBasicInformation({...basicInformation, OwnerContact : e.target.value})}} id='contact' className='text-sm xl:text-[1rem] border p-2 ps-8 lg:ps-9 outline-none rounded-md' type='text' />
        </div>
        </div>

         {/* Service Description */}
         <div className='w-full h-full flex flex-col'>
         <label htmlFor='description' className='font-medium text-sm xl:text-[0.9rem] text-gray-700'>Service Description</label>
        <div className='w-full flex flex-col justify-start h-full border p-2'>   
        <textarea value={basicInformation.Description} onChange={(e)=>{setBasicInformation({...basicInformation, Description : e.target.value})}} id='description' className='text-sm xl:text-[0.9rem] p-2 outline-none rounded-md h-full resize-none'  />
        </div>
        </div>

        <button onClick={()=>{handleUpdate()}} className={`${updating ? "bg-orange-400" : "bg-themeOrange"} px-3 py-1 w-fit text-gray-100 font-medium shadow-md rounded-sm `}>Update</button>
        
    </main>
  )
}

export default BasicInformation