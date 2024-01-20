import React from 'react'
import { useState, useEffect } from 'react'
import http from '../http'
import useService from './ServiceProvider'

const useBookings = () => {
    const {serviceInformation} = useService()
    const [bookings, setBookings] = useState(null)

   

    useEffect(()=>{
        const getBookings = async () => {
            try {
                const result = await http.get(`getBooking/${serviceInformation?._id}`, {withCredentials : true})
                setBookings(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        
        if(serviceInformation !== null && bookings === null)
        {   
            getBookings()
        }
        
    },[serviceInformation])
  return {
    bookings
  }
}

export default useBookings