import React, { useContext } from 'react'
import { useState, useEffect } from 'react';
import { pageContext } from './ServiceRegistrationPage';


const BusinessInformation = () => {
    const [page, setStep, userId, serviceInformation, setServiceInformation] = useContext(pageContext)
    const [errors, setErrors] = useState({
      //0 for not input, 1 for invalid
      TitleError : null,
      OwnerEmailError : null,
      OwnerContactError : null,
      DescriptionError : null,
    })
    const [descriptionInput, setDescriptionInput] = useState(''); // State to track textarea content
    const [basicInformation, setBasicInformation] = useState({
    })

    // So that what the user type in the description, its the same format as the output
    // const formatText = (input) => {
    //   const lines = input.split('\n')
    //   const formattedLines = lines.map((line, index)=>(
    //     <li key={index} >{line}</li>
    //   ))

    //   return <ul>{formattedLines}</ul>
    // }
    // const handleDescriptionChange = (e) => {
    //   const descriptionText = e.target.value
    //   setDescriptionInput(descriptionText)
      
      
    //   const formattedText = formatText(descriptionText)
    //   setDescription(formattedText)
    // }
    const submitBasicInfo = (e) => {
      e.preventDefault()
     const checkError = (input, errorKey) => (
      setErrors((prevErrors)=>({...prevErrors, [errorKey] : basicInformation[input] === "" ? 0  : null}))
     )

      checkError("ServiceTitle", "TitleError")
      checkError("OwnerEmail", "OwnerEmailError")
      checkError("OwnerContact", "OwnerContactError")
      checkError("Description", "DescriptionError")
      if(basicInformation["Title"] !== "" && basicInformation["OwberEmail"] !== "" && basicInformation["OwnerContact"] !== "" && basicInformation["Description"] !== ""){
      setServiceInformation({...serviceInformation, basicInformation : basicInformation});setStep(2)}
    }

    useEffect(()=>{
      setBasicInformation(serviceInformation.basicInformation)
    },[page])
    // console.log()

    console.log(basicInformation)
  return (
    
    <form onSubmit={(e)=>{submitBasicInfo(e)}} className='flex flex-col w-full bg-white h-full md:h-full  relative p-1'>
    {/* Business Information */}

    <div className="mb-5">
        <label className={` block text-sm text-gray-500 font-semibold mb-2" htmlFor="businessTitle`}>Service Title</label>
        <input value={basicInformation.ServiceTitle} onChange={(e)=>{setBasicInformation({...basicInformation, ServiceTitle : e.target.value})}} type="text" id="businessTitle" className={`${errors.TitleError == 0 ? " border-2 border-red-500" : ""} w-full p-2 border rounded outline-none shadow-sm`} placeholder="Enter business title"/>
        <p className='text-[0.65rem] text-red-500'>{errors.TitleError == 0 ? "This field cannot be empty" : ""}</p>
    </div>

    {/* Business email and contact */}
    <div className="flex w-full space-x-3  ">
        <div className='w-1/2'> 
            <label className={`emailLabel block text-sm text-gray-500 font-semibold mb-2`} htmlFor="email">Owner's Email</label>
            <input value={basicInformation.OwnerEmail} onChange={(e)=>{setBasicInformation({...basicInformation, OwnerEmail : e.target.value})}} type="email" id="email" className={`${errors.OwnerEmailError == 0 ? " border-2 border-red-500" : ""} w-full p-2 border rounded outline-none shadow-sm`} placeholder="example@email.com" />
            <p className='text-[0.65rem] text-red-500'>{errors.OwnerEmailError == 0 ? "This field cannot be empty" : ""}</p>
        </div>
        <div className='w-1/2 relative'> 
            <label className="block text-sm text-gray-500 font-semibold mb-2" htmlFor="contact">Owner's Contact</label>
            <span className='absolute top-[2.303rem] text-gray-400 left-2'>+63</span>
            <input maxLength={10} minLength={10} value={basicInformation.OwnerContact} onChange={(e)=>{setBasicInformation({...basicInformation, OwnerContact : e.target.value})}} type="tel" id="contact" className={`${errors.OwnerContactError == 0 ? " border-2 border-red-500" : ""} w-full ps-9 p-2 border rounded outline-none shadow-sm`} placeholder="1234567890" />
            <p className='text-[0.65rem] text-red-500'>{errors.OwnerContactError == 0 ? "This field cannot be empty" : ""}</p>
        </div>
    </div>
    {/* Description */}
    <div className="h-full mt-5  flex flex-col"> 
        <label className="block text-sm text-gray-500 font-semibold mb-2" htmlFor="description">Service Description</label>
        <div className={`${errors.DescriptionError == 0 ? " border-2 border-red-500" : ""} border h-[200px]  md:h-[90%]`}>
        <textarea
        maxLength={1000}
        id="description"
        value={basicInformation.Description} onChange={(e)=>{setBasicInformation({...basicInformation, Description : e.target.value})}}
        className="w-full p-2  resize-none outline-none min-h-[20px] max-h-[260px] "
        rows={descriptionInput.split('\n').length + 1} 
        placeholder="Enter business description..."
      ></textarea>

      </div>
      <p className='text-[0.65rem] text-red-500'>{errors.DescriptionError == 0 ? "This field cannot be empty" : ""}</p>
    </div>

    {/* <div>{description}</div> */}

    {/* Next button */}
    <div className='text-end mt-3'>
    <button type='submit' className='px-3 rounded-sm py-1 bg-themeOrange text-white'>Next</button>
    </div>
    </form>
  )
}

export default BusinessInformation