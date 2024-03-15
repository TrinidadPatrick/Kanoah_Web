import React from 'react'
import { useState, useEffect } from 'react'

const AdminServiceDescription = ({description}) => {
    const [formattedDescription, setFormattedDescription] = useState(null)

    // So that what the user type in the description, its the same format as the output
    const formatText = (input) => {
    const lines = input.split('\n')
    const formattedLines = lines.map((line, index)=>(
      <li key={index} >{line}</li>
    ))

    return <ul>{formattedLines}</ul>
    }

  useEffect(()=>{
    const formattedText = formatText(description)
    setFormattedDescription(formattedText)
  },[])
  return (
    <div className='p-3'>
    <h1 className='text-lg md:text-xl font-semibold mt-4'>Description</h1>
          {/* Description box */}
          <div className='overflow-auto text-sm md:text-base max-h-[300px] mt-2'>
          {formattedDescription}
          </div>
    </div>
  )
}

export default AdminServiceDescription