import React from 'react'
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { useState } from 'react';
import http from '../../../http';

const Rate = ({serviceToRate}) => {
    const service = serviceToRate.shop._id
    const booking = serviceToRate._id
    const dateNow = new Date()
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('')
    
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

   

    const submitReview = async () => {
        const data = {
            rating, review, service, booking, dateNow
        }

        try {
            const result = await http.post('AddRating', data, {withCredentials : true})
            console.log(result.data)
        } catch (error) {
            console.error(error)
        }
    }

    
  return (
    <div className='w-[300px] h-fit border p-3 flex flex-col space-y-3'>
        <h1 className='font-semibold text-gray-700 text-lg'>Overall rating</h1>
        {/* Rating */}
        <div className='flex flex-col'>
        <span className='text-semiXs text-gray-500'>Rating ({rating}/5)</span>
        <StyledRating onChange={(e, value)=>setRating(value)} className='relative left-[0.1rem]' defaultValue={rating} precision={1} icon={<StarRoundedIcon fontSize='large' />  } emptyIcon={<StarRoundedIcon fontSize='large' className='text-gray-300' />} />
        </div>
        {/* Review */}
        <div className='w-full h-[200px] flex flex-col'>
        <span className='text-semiXs text-gray-500'>Review</span>
            <textarea value={review} onChange={(e)=>setReview(e.target.value)} className='w-full h-full border outline-none rounded-md resize-none text-sm p-1.5 ' />
        </div>
        {/* Buttons */}
        <div className='w-full flex justify-between'>
            <button className='bg-gray-100 border rounded-md text-gray-600 text-sm px-2 py-1'>Cancel</button>
            <button onClick={()=>submitReview()} className='bg-themeBlue border rounded-md text-white text-sm px-2 py-1'>Post</button>
        </div>
    </div>
  )
}

export default Rate