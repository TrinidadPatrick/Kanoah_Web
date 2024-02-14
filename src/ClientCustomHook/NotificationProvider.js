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

  const countUnreadNotifs = async () => {
    try {
      const result = await http.get('countUnreadNotifs', {withCredentials : true})
      return Promise.resolve(result.data)
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
    notifications, getNotifications, countUnreadNotifs
  }
}

export default UseNotif