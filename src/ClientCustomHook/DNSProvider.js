import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import http from '../http'
import UseInfo from './UseInfo'

const UseDNS = () => {
    const {userInformation, authenticated} = UseInfo()
    const [DNS, SetDNS] = useState(null)
    const getDNS = async () => {
        try {
            const result = await http.get("getDoNotShow", {withCredentials : true})
            if(result.data)
            {
                SetDNS(result.data)
                return result.data
            }
        } catch (error) {
            console.error(error)
        }
    }
    
    useEffect(()=>{
        
        if(authenticated)
        {
            getDNS()
        }

    },[authenticated])
 return {
    DNS,
    getDNS
 }
}

export default UseDNS