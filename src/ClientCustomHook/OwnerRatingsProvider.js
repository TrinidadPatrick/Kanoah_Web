import React, { useEffect, useState } from 'react'
import http from '../http'
import UseInfo from './UseInfo'
import useService from './ServiceProvider'

const UseRatings = () => {
    const {serviceInformation} = useService()
    const [ratingList, setRatingList] = useState(null)

    const getUserRatings = async () => {
      if(serviceInformation !== null)
      {
        try {
          const result = await http.get(`getServiceRatings/${serviceInformation._id}`, {withCredentials : true})
          setRatingList(result.data)
      } catch (error) {
          console.error(error)
      }
      }
        
    }

    useEffect(()=>{
      getUserRatings()
    },[serviceInformation])
  return {
    ratingList, getUserRatings
  }
}

export default UseRatings