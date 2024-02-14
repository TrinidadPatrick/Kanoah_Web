import React from 'react'
import { useState, useEffect } from 'react'
import UseInfo from './UseInfo'
import http from '../http'

const useService = () => {
    const {authenticated} = UseInfo()
    const [serviceInformation, setServiceInformation] = useState(null)

    const getService = async () => {
        try {
          const result = await http.get(`getServiceProfile`, {
             withCredentials : true
            })
            setServiceInformation(result.data)
      } catch (error) {
          console.error('Erro fetching data: ' + error)
      }
      
       
    }

    useEffect(()=>{
        getService()
    },[authenticated])
  return {
    serviceInformation
  }
}

export default useService