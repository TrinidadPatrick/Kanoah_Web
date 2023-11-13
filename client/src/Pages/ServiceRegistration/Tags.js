import React from 'react'
import { useState, useContext, useEffect } from 'react'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { pageContext } from './ServiceRegistrationPage'
import http from '../../http'

const Tags = () => {
  const [input, setInput] = useState('')
  const [tags, setTags] = useState([])
  const [step, setStep, userId, serviceInformation, setServiceInformation] = useContext(pageContext)

  const addTag = () => {
    const newInput = [...tags]
    newInput.push(input)
    setTags(newInput)
    setInput('')
  }

  const removeTag = (tagToRemove) => {
    const newTag = [...tags]
    const tagIndex = newTag.findIndex(tag => tag == tagToRemove)
    newTag.splice(tagIndex, 1)
    setTags(newTag)
  }

  const submitService = () => {
    setServiceInformation({...serviceInformation, tags : tags})

    http.post("addService", {serviceInformation, userId}).then((res)=>{
      console.log(res.data)
    }).catch((err)=>{
      console.log(err)
    })
    
  }

  useEffect(()=>{
    setTags(serviceInformation.tags)
  },[step])

  console.log(serviceInformation)
  return (
    <div className='h-full border flex flex-col justify-stretch items-stretch w-full'>
      <div className='w-3/4 mx-auto border'>
      <h1 className='text-center mt-2 text-3xl font-semibold '>Add Tags</h1>
      <p className='text-center text-sm text-gray-500'>Adding tags can help your service reach more users, insert tags that best describes your service</p>
      </div>

      {/* Input field */}
    <div className='w-3/4 mx-auto mt-5'>   
    <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div className="relative">
        <input value={input} onChange={(e)=>{setInput(e.target.value)}} onKeyDown={(e)=>{if(e.key == "Enter"){addTag()}}} type="search" id="search" className="block w-full p-4 ps-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50" placeholder="Add Tags" required/>
        <button type="submit" className="text-white absolute end-2.5 bottom-2.5  focus:outline-none  font-medium rounded-md text-sm px-4 py-2 bg-blue-600 ">Add</button>
    </div>
    </div>

    {/* Tags Container */}
    <div className='w-3/4 border h-full max-h-full overflow-auto flex flex-wrap justify-start items-start mx-auto my-3'>
      <div className='h-fit  w-full flex flex-wrap'>
  {
    tags.map((tag, index) => (
      <div key={index} className='relative h-fit w-fit flex items-center m-2 px-2 space-x-2 rounded-sm bg-blue-400 shadow-sm'>
        <button className='py-1 bg-blue-400 rounded-sm text-white'>{tag}</button>
        <HighlightOffOutlinedIcon onClick={()=>{removeTag(tag)}} fontSize='small' className='text-white cursor-pointer' />
      </div>
    ))
  }
  </div>
</div>  
        <div className='w-full flex justify-end'>
        <button onClick={()=>{setStep(4)}} className='px-2 py-1 bg-blue-700 text-white w-fit relative rounded-sm'>back</button>
        <button onClick={()=>{submitService()}} className='px-2 py-1 bg-blue-700 text-white w-fit relative rounded-sm'>Submit</button>
        </div>
        
    </div>
  )
}

export default Tags