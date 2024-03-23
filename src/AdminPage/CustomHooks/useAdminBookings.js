import React from 'react'
import { useState, useEffect } from 'react'
import http from '../../http'

const useAdminBookings = () => {
    const [bookings, setBookings] = useState([])

    useEffect(()=>{
        const getBookings = async () => {
            try {
                const result = await http.get(`AdminGetAllBookings`, {withCredentials : true})
                setBookings(result.data)
            } catch (error) {
                console.log(error)
            }
        }

        getBookings()
    },[])
  return {
    bookings
  }
}

export default useAdminBookings