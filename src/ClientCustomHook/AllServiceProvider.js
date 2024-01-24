import React, { useEffect, useState } from 'react'
import http from '../http'

const UserAllServices = () => {
    const [services, setServices] = useState(null)
    
    const getServices = async () => {
        try {
            const result = await http.get("getServices");
            setServices(result.data.service)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(()=>{
        getServices()
    },[])

  return {
    services
  }
}

export default UserAllServices