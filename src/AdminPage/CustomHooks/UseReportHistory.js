import React from 'react'
import { useState, useEffect } from 'react'
import http from '../../http'

const UseReportHistory = () => {
    const [reportsHistory, setReportsHistory] = useState(null)

    const getReports = async () =>{
        try {
            const result = await http.get('AdminGetReportHistory', {withCredentials : true})
            setReportsHistory(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{

    getReports()
    },[])
    
  return {reportsHistory, setReportsHistory}

}

export default UseReportHistory