import React from 'react'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useState } from 'react';
import StarRatings from 'react-star-ratings';
import { services } from './Components/Services/Services';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import { fontSize } from '@mui/system';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';

const TopRatedServices = () => {
  
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
    <>
    {/* // HEADER */}
    <div className='Header w-full items-center  p-1 flex flex-col space-y-2'>
        <h1 className='text-themeBlue text-center text-4xl md:text-5xl font-bold'>Top rated services</h1>

        <div className='w-1/2 md:w-1/4 mx-auto flex items-center justify-center'>
            <div className='h-[3px] w-3/4 md:w-2/5 bg-themeBlue'></div>
            <EmojiEventsIcon className='mx-2 text-4xl'/>
            <div className='h-[3px] w-3/4 md:w-2/5 bg-themeBlue'></div>
        </div>
        <h3 className='text-themeBlue text-sm md:text-lg font-medium'>Best Services</h3>
    </div>


    {/* // Services */}
  <div className="carousel w-[90vw] md:w-[100vw] px-28 md:px-0 mx-auto py-4 carousel-center flex   space-x-40 md:space-x-14 rounded-box mt-10">
  {
  services.map((service, index) => {
    const ratings = service.rating; // Assuming "services" is the array of services

    const ratingTotal = ratings['5star'] + ratings['4star'] + ratings['3star'] + ratings['2star'] + ratings['1star'];
    const ratingAverage = (5 * ratings['5star'] + 4 * ratings['4star'] + 3 * ratings['3star'] + 2 * ratings['2star'] + 1 * ratings['1star']) / ratingTotal;
    const rounded = Math.round(ratingAverage * 100) / 100;
    return (
      <div className="TRS bg-white carousel-item flex-col pb-3 h-fit rounded-[0.95rem] overflow-hidden" key={index}>
        {/* Cover Image */}
        <img className='w-[90vw] sm:w-[450px] sm:h-64 lg:w-[360px] lg:h-56 ' src={service.image} alt="Pizza" />
        {/* Title */}
        <div className='relative mt-2 flex flex-col space-y-1'>
        <p className='text-themeBlue ml-3 font-bold mt-2 md:text-xl'>{service.title}</p> 
        <FavoriteBorderIcon  className='absolute right-2 top-0'/>
         {/* Rating */}
        <div className='flex relative items-center ml-3 space-x-2'>
          <StyledRating className='relative -left-1'  readOnly defaultValue={rounded} precision={0.1} icon={<StarRoundedIcon fontSize='medium' />  } emptyIcon={<StarRoundedIcon fontSize='medium' className='text-gray-300' />} />
          <p className='text-gray-500 text-sm font-medium'>({rounded.toFixed(1)})</p>   
        </div>
        {/* Address */}
        <div className='flex  items-center ml-2 '>
        <PlaceOutlinedIcon />
        <p className='mt-1 font-medium text-sm md:text-lg text-gray-400 ml-1'>{service.Address}</p>
        </div>
        </div>
      </div>
    );
  })
  
}

</div>


    </>
  )
}

export default TopRatedServices