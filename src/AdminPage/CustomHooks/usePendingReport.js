import React, { useEffect, useState } from 'react'
import http from '../../http'

const usePendingReport = () => {
    const [pendingReports, setPendingReports] = useState(null)

    const getReports = async () =>{
        try {
            const result = await http.get('AdminGetPendingReports', {withCredentials : true})
            setPendingReports(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{

    getReports()
    },[])
    
  return {pendingReports, setPendingReports}
}

export default usePendingReport