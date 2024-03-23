import React, { useEffect, useState } from 'react'
import http from '../../http'

const useAdminReviews = () => {
    const [reviews, setReviews] = useState([])

    useEffect(()=>{
        const getReviews = async () => {
            try {
                const result = await http.get('AdminGetAllReviews', {withCredentials : true})
                setReviews(result.data)
            } catch (error) {
                console.log(error)
            }
        }

        getReviews()
    },[])
  return {
    reviews
  }
}

export default useAdminReviews