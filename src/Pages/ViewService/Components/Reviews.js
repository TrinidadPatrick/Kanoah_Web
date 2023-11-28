import React from 'react'
import profile1 from '../img/Profile3.jpg'
import profile2 from '../img/Profile2.jpg'
import profile3 from '../img/Profile1.jpg'
import { styled } from '@mui/material/styles';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Rating from '@mui/material/Rating';

const Reviews = () => {
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
        <div>
            {/* Header */}
            <div className='flex'>
            <img className='w-12 h-12 object-cover rounded-full' src={profile1} alt="profile picture" />
            <div className='ml-2'>
            <p className='font-medium text-gray-700'>John Patrick Trinidad</p>
            <StyledRating className='relative'  readOnly defaultValue={4.1} precision={0.1} icon={<StarRoundedIcon fontSize='small' />  } emptyIcon={<StarRoundedIcon fontSize='small' className='text-gray-300' />} />
            </div>
            </div>
            {/* Comment */}
            <div className='mt-2'>
            <p className='text-sm'>It was wonderful, the staff and workers are very hardworking</p>
            </div>
            
        </div>
        <div>
            {/* Header */}
            <div className='flex'>
            <img className='w-12 h-12 object-cover rounded-full' src={profile2} alt="profile picture" />
            <div className='ml-2'>
            <p className='font-medium text-gray-700'>Kyla Austria</p>
            <StyledRating className='relative'  readOnly defaultValue={4.1} precision={0.1} icon={<StarRoundedIcon fontSize='small' />  } emptyIcon={<StarRoundedIcon fontSize='small' className='text-gray-300' />} />
            </div>
            </div>
            {/* Comment */}
            <div className='mt-2'>
            <p className='text-sm'>It was wonderful, the staff and workers are very hardworking</p>
            </div>
            
        </div>
        <div>
            {/* Header */}
            <div className='flex'>
            <img className='w-12 h-12 object-cover rounded-full' src={profile3} alt="profile picture" />
            <div className='ml-2'>
            <p className='font-medium text-gray-700'>Diane G Rivera</p>
            <StyledRating className='relative'  readOnly defaultValue={4.1} precision={0.1} icon={<StarRoundedIcon fontSize='small' />  } emptyIcon={<StarRoundedIcon fontSize='small' className='text-gray-300' />} />
            </div>
            </div>
            {/* Comment */}
            <div className='mt-2'>
            <p className='text-sm'>It was wonderful, the staff and workers are very hardworking</p>
            </div>
            
        </div>
    </div>
    )
}
    


export default Reviews