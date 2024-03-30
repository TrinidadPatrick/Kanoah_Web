import React, { useEffect } from 'react'
import { selectServiceData, setServiceData } from '../../../ReduxTK/serviceSlice'
import { selectUserId } from '../../../ReduxTK/userSlice'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import useService from '../../../ClientCustomHook/ServiceProvider'
import http from '../.././../http'

const BasicInformation = ({serviceInformation}) => {
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const userId = useSelector(selectUserId)
    const [basicInformation, setBasicInformation] = useState({ ServiceTitle : "", OwnerContact : "", OwnerEmail : "" , Description : ""})

    useEffect(()=>{
        if(serviceInformation?.basicInformation !== undefined)
        {
            setBasicInformation(serviceInformation?.basicInformation)
        }
    }, [serviceInformation])

    const handleUpdate = async () => {
      setUpdating(true)
      try {
        const result = await http.patch(`updateService/${serviceInformation.userId}`, {basicInformation : basicInformation},  {
          withCredentials : true
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
    <main className='w-full sm:w-[90%] md:w-[80%] xl:w-1/2 bg-white shadow-md rounded-md flex flex-col space-y-4 h-full sm:h-[95%] p-5'>
        
        {/* Service Title */}
        <div className='w-full flex flex-col justify-start'>
        <h1 className='text-lg md:text-xl font-medium text-gray-700 mb-0'>Basic Information</h1>
        <label htmlFor='title' className='font-medium text-semiSm xl:text-[0.9rem] text-gray-700'>Service Title</label>
        <input maxLength={200} value={basicInformation.ServiceTitle} onChange={(e)=>{setBasicInformation({...basicInformation, ServiceTitle : e.target.value})}} id='title' className='text-sm xl:text-[1rem] border p-2 outline-none rounded-md' type='text' />
        </div>

        {/* Email and Contact */}
        <div className='w-full flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-3'>
        <div className='flex flex-col w-full'>
        <label htmlFor='email' className='font-medium text-semiSm xl:text-[0.9rem] text-gray-700'>Owner Email</label>
        <input maxLength={300} value={basicInformation.OwnerEmail} onChange={(e)=>{setBasicInformation({...basicInformation, OwnerEmail : e.target.value})}} id='email' className='text-sm xl:text-[1rem] border p-2 outline-none rounded-md' type='text' />
        </div>
        <div className='flex flex-col w-full relative'>   
        <label htmlFor='contact' className='font-medium text-semiSm xl:text-[0.9rem] text-gray-700'>Owner Contact</label>
        <span className='absolute top-[50%] text-sm xl:text-[1rem] lg:top-[50%] left-2 text-gray-600'>+63</span>
        <input maxLength={10} value={basicInformation.OwnerContact} onChange={(e)=>{setBasicInformation({...basicInformation, OwnerContact : e.target.value.replace(/[^0-9]/g, '')})}} id='contact' className='text-sm xl:text-[1rem] border p-2 ps-8 lg:ps-9 outline-none rounded-md' type='text' />
        </div>
        </div>

         {/* Service Description */}
         <div className='w-full h-[500px] sm:h-full flex flex-col'>
         <label htmlFor='description' className='font-medium text-semiSm xl:text-[0.9rem] text-gray-700'>Service Description</label>
        <div className='w-full flex flex-col justify-start h-full border p-2'>   
        <textarea value={basicInformation.Description} onChange={(e)=>{setBasicInformation({...basicInformation, Description : e.target.value})}} id='description' className='text-sm xl:text-[0.9rem] p-2 outline-none rounded-md h-full resize-none'  />
        </div>
        </div>

        <button onClick={()=>{handleUpdate()}} className={`${updating ? "bg-orange-400" : "bg-themeOrange"} px-3 py-1 w-fit text-semiSm lg:text-semiMd text-gray-100 font-medium shadow-md rounded-sm `}>Update</button>
        
    </main>
  )
}

export default BasicInformation