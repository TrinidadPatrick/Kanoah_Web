import React from 'react'
import axios from 'axios'

const useNotify = () => {

    const pushNotify = async (title, message) => {
        axios.post(`https://app.nativenotify.com/api/indie/notification`, {
            subID: '65558b149b1c96741ce7da13',
            appId: 19825,
            appToken: 'bY9Ipmkm8sFKbmXf7T0zNN',
            title: 'New message',
            message: 'You have a new Message'
       });
    }

  return pushNotify
}

export default useNotify