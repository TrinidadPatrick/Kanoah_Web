import React, { useEffect, useState, useContext } from 'react'
import { createContext } from 'react'
import UseInfo from './UseInfo'
import http from '../http'

const UserAllServices = () => {
    const {authenticated, userInformation} = UseInfo()
    
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