import React from 'react'
import { Link } from 'react-router-dom'

const ExploreServiceList = ({services}) => {
  return (
    <main className='w-full flex-col gap-5 '>
    {
      services?.map((service, index)=>{
        return (
          <div className='w-full flex-row'>
            {/* Image Container */}
            <div className=''>

            </div>
          </div>
        )
      })
    }
    </main>
  )
}

export default ExploreServiceList