import React, { useEffect, useState } from 'react'

const Description = (description) => {
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
    const formattedText = formatText(description.description)
    setFormattedDescription(formattedText)
  },[])
  return (
    <div>
    <h1 className='text-3xl font-semibold mt-4'>Description</h1>
          {/* Description box */}
          <div className=' overflow-auto max-h-[300px] mt-2'>
          {formattedDescription}
          </div>
    </div>
  )
}

export default Description