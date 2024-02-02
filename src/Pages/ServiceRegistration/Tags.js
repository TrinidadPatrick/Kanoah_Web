import React from 'react'
import { useState, useContext, useEffect } from 'react'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { pageContext } from './ServiceRegistrationPage'
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import UseInfo from '../../ClientCustomHook/UseInfo';
import http from '../../http'

const Tags = () => {
  const {userInformation} = UseInfo()
  const navigate = useNavigate()
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentDay = currentDate.getDate().toString().padStart(2, '0');
  const thisDate = currentYear + "-" + currentMonth + "-" + currentDay
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [input, setInput] = useState('')
  const [tags, setTags] = useState([])
  const [step, setStep, serviceInformation, setServiceInformation] = useContext(pageContext)

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

  // Modal Style
const submitModalDesign = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding : '0'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Adjust the color and transparency here
  },
};

// handle submit modal
const openSubmitModal = () => {
  setSubmitModalOpen(true)
}
const closeSubmitModal = () => {
  setSubmitModalOpen(false)
}

const submitTag = () => {
  setServiceInformation({...serviceInformation, tags : tags})
  openSubmitModal()
}
const submitService = () => {
    const userId = userInformation._id
    http.post("addService", {serviceInformation, userId, createdAt :thisDate}).then((res)=>{
      console.log(res.data)
      navigate("/")
    }).catch((err)=>{
      console.log(err)
    })
    
}

  const submitAndRedirect = () => {
    const userId = userInformation._id
    http.post("addService", {serviceInformation, userId, createdAt :thisDate}).then((res)=>{
      navigate("/myService/editService/Booking")
    }).catch((err)=>{
      console.log(err)
    })
  }

  useEffect(()=>{
    setTags(serviceInformation.tags)
  },[step])

  return (
    <div className='h-full  flex flex-col justify-stretch items-stretch w-full'>
      <div className='w-3/4 mx-auto '>
      <h1 className='text-center mt-2 text-3xl font-semibold '>Add Tags</h1>
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
    <div className='w-3/4 border h-full max-h-full overflow-auto rounded-md flex flex-wrap justify-start items-start mx-auto my-3'>
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
        <div className='w-full space-x-2 flex justify-end'>
        <button onClick={()=>{setStep(4)}} className='px-3 text-[0.75rem] md:text-sm rounded-sm py-1 bg-gray-200 text-gray-500'>Back</button>
  <button onClick={()=>{submitTag()}} className='px-3 text-[0.75rem] md:text-sm rounded-sm py-1 bg-themeBlue text-white'>submit</button>
        </div>

       {/*  submit Modal */}
       <Modal isOpen={submitModalOpen} style={submitModalDesign} >
      <div className='w-[300px] p-2'>
        <div className='flex justify-between items-center'>
        <h1 className='text-lg font-semibold'>Setup Booking</h1>
        <CloseOutlinedIcon className='cursor-pointer' onClick={()=>{closeSubmitModal()}} fontSize='small' />
        </div>
          <div className="mb-4 mt-3">
            <p className="text-[0.9rem] font-normal text-start">Do you want to enable and setup Booking information?</p>
          </div>
        <div className="flex justify-start">
          <button onClick={()=>{submitAndRedirect()}} className="px-3 text-[0.8rem] py-1 mr-2 text-white bg-themeOrange rounded-sm hover:bg-orange-300 focus:outline-none focus:ring " >Yes</button>
          <button className="px-3 text-[0.8rem] py-1 text-gray-700 bg-gray-300 rounded-sm hover:bg-gray-400 focus:outline-none focus:ring " onClick={()=>{submitService()}}>No, finish setup</button>
        </div>
      </div>
      </Modal>
</div>

    // Submit Modal
    
  )
}

export default Tags