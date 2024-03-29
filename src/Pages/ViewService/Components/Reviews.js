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
        {/* Card */}
        {
          reviews?.filter((review)=>review.status === "Active").map((review)=>{
            return (
              <div>
              {/* Header */}
              <div className='flex'>
              <img className='w-12 h-12 object-cover rounded-full' src={review.user.profileImage} alt="profile picture" />
              <div className='ml-2'>
              <p className='font-medium text-gray-700'>{review.user.firstname} {review.user.lastname}</p>
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