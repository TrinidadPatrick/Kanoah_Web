import React, { useEffect, useState } from 'react'
import http from '../http'

const UseInfo = () => {
    const [userInformation, setUserInformation] = useState(null)
    const [authenticated, setAuthenticated] = useState(null)

    useEffect(()=>{
        try {
            http.get('getUser', {withCredentials : true})
            .then((res)=>{
                setUserInformation(res.data)
                setAuthenticated(true)
            }).catch((error)=>{
                console.log(error)
                setAuthenticated(false)
            })
        } catch (error) {
            console.log(error)
        }
    },[])
  return {
    userInformation,authenticated
  }
}

export default UseInfo