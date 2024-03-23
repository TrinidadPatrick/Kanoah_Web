import React, { useEffect, useState } from 'react'
import http from '../../http'

const useAdminServices = () => {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(null)

    const getServices = async () => {
        try {
            const result = await http.get('Admin_GetServices', {withCredentials : true})
            setServices(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        setLoading(true)
        const getServices = async () => {
            try {
                const result = await http.get('Admin_GetServices', {withCredentials : true})
                setServices(result.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        getServices()
    },[])

  return {
    services, getServices, loading
  }
}

export default useAdminServices