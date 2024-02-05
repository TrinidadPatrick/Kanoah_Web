import React from 'react'
import { useState, useEffect } from 'react'
import http from '../http'

const useAllRatings = () => {
    const [ratings, setRatings] = useState(null)
    const getRatings = async () => {
        try {
            const result = await http.get('getAllRatings')
            setRatings(result.data)
            return Promise.resolve(result.data)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(()=>{
        

        getRatings()
    },[])
  return {
    ratings, getRatings
  }
}

export default useAllRatings