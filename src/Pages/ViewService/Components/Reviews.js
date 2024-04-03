import React from 'react'
import { styled } from '@mui/material/styles';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Rating from '@mui/material/Rating';

const Reviews = ({reviews}) => {
    // Rating stars
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


    return (
        <div className='flex flex-col space-y-5 p-5'>
        {
        reviews?.length === 0 ? 
        <div className='w-full h-full flex flex-col justify-center items-center'>
        <h1 className='text-3xl font-medium text-gray-500'>No reviews found</h1>
        <p className='text-base font-normal text-gray-400'>This service current have 0 reviews</p>
        </div>
        :
        reviews?.filter((rating)=> rating.status !== "Removed").sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)).map((review)=>{
          const dateReviewed = new Date(review.createdAt).toLocaleDateString('EN-US', {
            month : 'short',
            day : '2-digit',
            year : 'numeric'
          })
          return (
            <div key={review._id} className='w-full'>
            {/* Header */}
            <div className='flex'>
            <img className='w-12 h-12 object-cover rounded-full' src={review.user.profileImage} alt="profile picture" />
            <div className='ml-2'>
              <div className='flex items-center gap-2'>
              <p className='font-medium text-gray-700'>{review.user.firstname} {review.user.lastname}</p>
              <p className='font-normal text-gray-500 text-xs'>{dateReviewed}</p>
              </div>
            <StyledRating className='relative'  readOnly defaultValue={Number(review.rating)} precision={0.1} icon={<StarRoundedIcon fontSize='small' />  } emptyIcon={<StarRoundedIcon fontSize='small' className='text-gray-300' />} />
            </div>
            </div>
            {/* Comment */}
            <div className='mt-2'>
            <p className='text-sm'>{review.review}</p>
            </div>
            
        </div>
          )
        })
      }
    </div>
    )
}
    


export default Reviews