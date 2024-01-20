import React from 'react'
import { useAuth } from './CustomHooks/AuthProvider'

const AdminDashboard = () => {
  const {authenticated} = useAuth()

  return (
    <div>AdminDashboard</div>
  )
}

export default AdminDashboard