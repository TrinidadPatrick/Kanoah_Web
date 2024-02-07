import React, { useEffect, useState } from 'react'
import http from '../http'
import UseInfo from './UseInfo'

const UseNotif = () => {
  const {authenticated, userInformation} = UseInfo()
  const [notifications, setNotifications] = useState(null)

  const getNotifications = async () => {
    try {
      const result = await http.get('getNotifications', {withCredentials : true})
      setNotifications(result.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(()=>{
    if(authenticated)
    {
      getNotifications()
    }
  },[authenticated])
  return {
    notifications
  }
}

export default UseNotif