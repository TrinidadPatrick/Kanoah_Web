import React, { useEffect, useState } from 'react'
import http from '../http'

const UseInfo = () => {
    const [userInformation, setUserInformation] = useState(null)
    const [authenticated, setAuthenticated] = useState(null)

    const signout = () => {
        http.get('userLogout', {withCredentials : true}).then((res)=>{
          if(res.status === 200)
          {
            window.location.reload()
          }
        }).catch((error)=>{
          alert(error)
        })
       
      }

    const getAuth = async () => {
        try {
            http.get('getUser', {withCredentials : true})
            .then((res)=>{
                if(res.data.status.status === "Disabled")
                {
                    signout()
                    return
                }
                setUserInformation(res.data)
                setAuthenticated(true)
            }).catch((error)=>{
                console.log(error)
                setAuthenticated(false)
                return false
            })
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
       getAuth()
    },[])
  return {
    userInformation,authenticated, getAuth
  }
}

export default UseInfo