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
import { recentServices } from './Components/Services/Services';

const RecentServices = () => {
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
        <h1 className='text-themeGray text-center text-4xl md:text-5xl font-bold'>Recent services</h1>

        <div className='w-1/4 mx-auto flex items-center justify-center'>
            <div className='h-[3px] w-2/5 bg-themeGray'></div>
            <EmojiEventsIcon className='mx-2 text-themeBlue text-4xl'/>
            <div className='h-[3px] w-2/5 bg-themeGray'></div>
        </div>
        <h3 className='text-themeGray font-medium'>Newest Services</h3>
    </div>


    {/* // Services */}
    <section className='TRS_Container mt-5 w-[80vw] max-w-[80vw] mx-auto h-96 snap-x  whitespace-nowrap overflow-auto'>
      {
        recentServices.map((service, index)=>{
          const ratings = service.rating; // Assuming "services" is the array of services
          const ratingTotal = ratings['5star'] + ratings['4star'] + ratings['3star'] + ratings['2star'] + ratings['1star'];
          const ratingAverage = (5 * ratings['5star'] + 4 * ratings['4star'] + 3 * ratings['3star'] + 2 * ratings['2star'] + 1 * ratings['1star']) / ratingTotal;
          const rounded = Math.round(ratingAverage * 100) / 100;

          return (
            <div className='TRS rounded-[0.95rem] pb-3 h-fit mr-4 snap-start bg-white inline-block w-[100%] sm:w-[48.5%] md:w-[48.8%] lg:w-[32.5%] '>
            <img className='w-full h-64 sm:h-44 xl:h-56 rounded-t-[0.95rem]' src={service.image} alt="Pizza" />

            <div className='relative mt-2 flex flex-col space-y-1'>
            <p className='text-themeBlue ml-3 font-bold mt-2 text-xl'>{service.title}</p> 
            <FavoriteBorderIcon fontSize='medium' className='absolute right-2 top-0'/>
         {/* Rating */}
            <div className='flex relative items-center ml-3 space-x-2'>
            <StyledRating className='relative -left-1'  readOnly defaultValue={rounded} precision={0.1} icon={<StarRoundedIcon fontSize='medium' />  } emptyIcon={<StarRoundedIcon fontSize='medium' className='text-gray-300' />} />
            <p className='text-gray-500 text-sm font-medium'>({rounded.toFixed(1)})</p>   
            </div>
        {/* Address */}
            <div className='flex items-center ml-2'>
            <PlaceOutlinedIcon />
            <p className='mt-1 font-medium text-gray-400 ml-1 me-4'>{service.Address}</p>
            </div>
            </div>
            </div>
          )
        })
      }
    </section>

    </>
  )
}

export default RecentServices