import React from 'react'
import CategoryManagement from './Components/CategoryManagement'

const Management = () => {

  return (
    <div className='w-full h-full p-3 flex flex-col bg-[#f9f9f9]'>
        <h1 className='text-2xl font-semibold px-2'>Management</h1>

        <div className='flex border w-full h-full p-2'>
            {/* Categories */}
            <CategoryManagement />
        </div>
    </div>
  )
}

export default Management