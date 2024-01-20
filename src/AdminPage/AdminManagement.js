import React from 'react'
import { useParams } from 'react-router-dom'
import CategoryManagement from './Components/CategoryManagement'


const AdminManagement = () => {
  const {option} = useParams()
  
  return (
    <div className='w-full h-full flex flex-col p-5'>
      <CategoryManagement />
    </div>
  )
}

export default AdminManagement