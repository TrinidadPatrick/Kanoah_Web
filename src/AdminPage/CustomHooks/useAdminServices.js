import React, { useEffect, useState } from 'react'
import http from '../../http'

const useAdminServices = () => {
    const [services, setServices] = useState([])

    useEffect(()=>{
        const getServices = async () => {
            try {
                const result = await http.get('Admin_GetServices', {withCredentials : true})
                setServices(result.data)
            } catch (error) {
                console.log(error)
            }
        }

        getServices()
    },[])

  return {
    services
  }
}

export default useAdminServices