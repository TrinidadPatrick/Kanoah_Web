import React from 'react'
import { useState, useContext, useEffect } from 'react'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { useSelector } from 'react-redux';
import http from '../../../http'
import { selectServiceData } from '../../../ReduxTK/serviceSlice';
import { selectUserId } from '../../../ReduxTK/userSlice';

const Tags = () => {
const [input, setInput] = useState('')
const [tags, setTags] = useState([])
const [updating, setUpdating] = useState(false)
const serviceData = useSelector(selectServiceData)
const userId = useSelector(selectUserId)
const accessToken = localStorage.getItem('accessToken')

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

  const handleUpdate = async () => {
    setUpdating(true)
      try {
        const result = await http.patch(`updateService/${userId}`, {tags : tags},  {
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
    if(serviceData.tags !== undefined)
    {
        setTags(serviceData.tags)
    }
  },[serviceData])

  return (
    <div className='w-full h-screen sm:h-full  flex flex-col p-2'>
        <div className='w-3/4 mx-auto '>
      <h1 className='text-center mt-2 text-3xl font-semibold '>Tags</h1>
      <p className='text-center text-sm text-gray-500'>Adding tags can help your service reach more users, insert tags that best describes your service</p>
      </div>

      {/* Input field */}
    <div className='w-3/4 mx-auto mt-5'>   
    <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div className="relative">
        <input value={input} onChange={(e)=>{setInput(e.target.value)}} onKeyDown={(e)=>{if(e.key == "Enter"){addTag()}}} type="search" id="search" className="block w-full p-4 ps-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50" placeholder="Add Tags" required/>
        <button onClick={()=>{addTag()}} className="text-white absolute end-2.5 bottom-2.5  focus:outline-none  font-medium rounded-md text-sm px-4 py-2 bg-blue-600 ">Add</button>
    </div>
    </div>

    {/* Tags Container */}
    <div className='w-3/4 border rounded-md h-full max-h-full overflow-auto flex flex-wrap justify-start items-start mx-auto my-3'>
      <div className='h-fit  w-full flex flex-wrap'>
  {
    tags.map((tag, index) => (
      <div key={index} className='relative h-fit w-fit flex items-center my-2 mx-1 px-2 space-x-2 rounded-2xl bg-gray-300 shadow-sm'>
        <button className='py-1 text-sm rounded-sm text-gray-700'>{tag}</button>
        <HighlightOffOutlinedIcon onClick={()=>{removeTag(tag)}} fontSize='small' className='text-white p-0 bg-transparent rounded-full cursor-pointer' />
      </div>
    ))
  }
  </div>
</div>  
        <div className='w-full space-x-2 flex justify-end'>
        </div>


        <button onClick={()=>{handleUpdate()}} className={`${updating ? "bg-orange-400" : "bg-themeOrange"} px-3 py-1 w-fit text-gray-100 text-semiSm lg:text-semiMd font-medium shadow-md rounded-sm `}>Update</button>

    </div>
  )
}

export default Tags