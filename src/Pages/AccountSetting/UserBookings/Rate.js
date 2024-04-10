import React, { useEffect } from 'react'
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { useState } from 'react';
import http from '../../../http';
import { io } from 'socket.io-client';

const Rate = ({serviceToRate, setRateModalIsOpen, completedBookings, setCompletedBookings, ratings, setRatings}) => {
    const service = serviceToRate.shop._id
    const booking = serviceToRate._id
    const receiver = serviceToRate.shop.owner
    const dateNow = new Date()
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('')
    const [loading, setLoading] = useState(false)
    const [socket, setSocket] = useState('')
    const StyledRating = styled(Rating)({
        '& .MuiRating-iconFilled': {
          color: '#ffa534',
          fontSize: "medium"
        },
        '& .MuiRating-iconHover': {
          color: '#ffa534',
          
        },
        '& .MuiRating-iconEmpty': {
          color: '#ffa534',
          fontSize: "large"
          
        },
    
    });

    useEffect(()=>{
      setSocket(io("https://kanoah.onrender.com"))
    },[])
   
    const notifyUser = async () => {
      try {
          const notify = await http.post('addNotification', {
              notification_type : "New_Rating", 
              createdAt : new Date(),
              content : {
                subject : `You have a new rating!`,
                service : serviceToRate.service.selectedService,
                rating : rating, 
                review : review, 
              }, 
              client : serviceToRate.client,
              notif_to : receiver,
              reference_id : serviceToRate._id
          })

      } catch (error) {
          console.error(error)
      }
  }

    const submitReview = async () => {
      setLoading(true)
        const data = {
            rating, review, service, booking, dateNow
        }
        const newRating = [...ratings]
        newRating.push(data)
        setRatings(newRating)
        const newData = [...completedBookings]
        const index = completedBookings.findIndex((bookings) => bookings._id === booking)
        newData[index].rated = true
        setCompletedBookings(newData)

        try {
            const result = await http.post('AddRating', data, {withCredentials : true})
            setRateModalIsOpen(false)
            setLoading(false)
            socket.emit('New_Notification', {notification : 'New_Rating', receiver : receiver}); //notify user theres a new booking
            notifyUser()
        } catch (error) {
            console.error(error)
        }
    }

    
  return (
    <div className='w-[300px] h-fit border p-3 flex flex-col space-y-3'>
        <h1 className='font-semibold text-gray-700 text-lg'>Overall rating</h1>
        {/* Rating */}
        <div className=''>
        <span className='text-semiXs block text-gray-500'>Rating ({rating}/5)</span>
        <StyledRating onChange={(e, value)=>setRating(value)} className='relative left-[0.1rem]' defaultValue={rating} precision={1} icon={<StarRoundedIcon fontSize='large' />  } emptyIcon={<StarRoundedIcon fontSize='large' className='text-gray-300' />} />
        </div>
        {/* Review */}
        <div className='w-full h-[200px] flex flex-col'>
        <span className='text-semiXs text-gray-500'>Review</span>
            <textarea value={review} onChange={(e)=>setReview(e.target.value)} className='w-full h-full border outline-none rounded-md resize-none text-sm p-1.5 ' />
        </div>
        {/* Buttons */}
        <div className='w-full flex justify-between'>
            <button onClick={()=>{setRateModalIsOpen(false)}} className='bg-gray-100 border rounded-md text-gray-600 text-sm px-2 py-1'>Cancel</button>
            <button disabled={rating === 0 || rating === null} onClick={()=>submitReview()} className={`${loading ? "bg-blue-400" : "bg-themeBlue"} disabled:bg-gray-300 border rounded-md text-white text-sm px-2 py-1`}>Post</button>
        </div>
    </div>
  )
}

export default Rate