import React, { useEffect } from 'react'
import { createContext, useContext, useState } from 'react'
import http from '../../http'
import { useAuth } from './AuthProvider'

const useAdminInfo = () => {
    const {authenticated} = useAuth()
    const [adminInformation, setAdminInformation] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    
    useEffect(()=>{
        async function fetchAdminData(){
            if(authenticated)
            {
                try {
                    const result = await http.get('getAdminInfo', {withCredentials : true})
                    if(result.status === 200 && result)
                    {
                        setAdminInformation(result.data)
                        
                    }
                    
                } catch (error) {
                    setError(error)
                } finally {
                    setLoading(false)
                }
            }
            
        }

        fetchAdminData()
    },[authenticated])
    
        return {
          adminInformation,
          loading,
          error
        };
      
}

export default useAdminInfo;