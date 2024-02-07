import React, { useEffect } from 'react'
import { createContext, useContext, useState } from 'react'
import http from '../http'
import { useDispatch } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
import {io} from 'socket.io-client'
import { selectNewMessage, setNewMessage, selectOnlineUsers, setOnlineUsers } from '../ReduxTK/chatSlice'
import UseInfo from './UseInfo'

const ChatProvider = ({socket, setNewBooking}) => {

const dispatch = useDispatch()
  const {authenticated, userInformation} = UseInfo()

    // Check for unread Messages
    const checkUnreadMessage = async () => {
      
        try {
          const unreadMessages = await http.get(`checkUnreadMessages`, {
            withCredentials: true,
          })
          if(unreadMessages.data.length !== 0)
          {
            dispatch(setNewMessage(true))
          }
          else{
            dispatch(setNewMessage(false))
          }
          return unreadMessages;
        } catch (error) {
          console.error(error)
        }


    }

    //emit the userId to socket
    useEffect(()=>{
        if(authenticated !== null && authenticated)
        {
          console.log("")
          socket?.emit('loggedUser', userInformation._id)
        }
    }, [authenticated])

    // Notify user if there is new message
    useEffect(()=>{
        socket?.on('message', (message)=>{
          if(message == 'newMessage')
          {
            dispatch(setNewMessage(true))
          }
        })
  
        return () => {
          // Clean up the socket event listeners when the component unmounts
          socket?.off('message');
        };
    },[socket])

    // Notify user if there is new booking
    useEffect(()=>{
        socket?.on('Booking_Notification', (notification)=>{
          if(notification == 'New_Booking')
          {
            setNewBooking(true)
          }
        })
  
        return () => {
          // Clean up the socket event listeners when the component unmounts
          socket?.off('Booking_Notification');
        };
    },[socket])

    // Check all online users
    useEffect(()=>{
        socket?.on('onlineUsers', (onlineUsers)=>{
        dispatch(setOnlineUsers(onlineUsers))
        })
      },[authenticated])

      useEffect(()=>{
        if(authenticated !== null && authenticated)
        {
          checkUnreadMessage()
        }
      },[authenticated])

}

export default ChatProvider
