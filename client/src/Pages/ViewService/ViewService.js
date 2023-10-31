import React from 'react'
import Rating from '@mui/material/Rating';
import pic1 from './img/pic1.jpg'
import pic2 from './img/pic2.jpg'
import pic3 from './img/pic3.avif'
import pic4 from './img/pic4.jpg'
import pic5 from './img/pic5.jpg'
import pic6 from './img/pic6.jpg'
import profile from './img/Profile3.jpg'
import { styled } from '@mui/material/styles';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import ImageGallery from "react-image-gallery";
import 'react-image-gallery/styles/css/image-gallery.css'
import { useState, useEffect, useCallback, useRef } from 'react';
import 'react-gallery-carousel/dist/index.css';

const ViewService = () => {

  // Images for gallery
  const images = [
    {
      original : pic1,
      thumbnail : pic1,
      originalClass: 'image-gallery-original', // Apply the custom CSS class for original image
      thumbnailClass: 'image-gallery-thumbnail', // Apply the custom CSS class for thumbnails
      
    },
    {
      original : pic2,
      thumbnail : pic2,
      originalClass: 'image-gallery-original', // Apply the custom CSS class for original image
    thumbnailClass: 'image-gallery-thumbnail', // Apply the custom CSS class for thumbnails
    },
    {
      original : pic3,
      thumbnail : pic3,
      originalClass: 'image-gallery-original', // Apply the custom CSS class for original image
    thumbnailClass: 'image-gallery-thumbnail', // Apply the custom CSS class for thumbnails
    },
    {
      original : pic4,
      thumbnail : pic4,
      originalClass: 'image-gallery-original', // Apply the custom CSS class for original image
    thumbnailClass: 'image-gallery-thumbnail', // Apply the custom CSS class for thumbnails
    },
    {
      original : pic5,
      thumbnail : pic5,
      originalClass: 'image-gallery-original', // Apply the custom CSS class for original image
    thumbnailClass: 'image-gallery-thumbnail', // Apply the custom CSS class for thumbnails
    },
    {
      original : pic6,
      thumbnail : pic6,
      originalClass: 'image-gallery-original', // Apply the custom CSS class for original image
    thumbnailClass: 'image-gallery-thumbnail', // Apply the custom CSS class for thumbnails
    },
  ]

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
    <div className='w-full h-full bg-[#F9F9F9] md:px-12 lg:px-20 xl:px-32 pb-10 pt-20 flex flex-col'>
        {/* Top Layer *******************************************************************/}
        <section className='w-full h-screen grid grid-cols-1 md:grid-cols-2 p-2 gap-1 mt-5' style={{ gridTemplateColumns: '70% 30%' }}>

        {/* Left Side ********************************************************************/}
        <div className='w-full h-full col-span-2 md:col-span-1  flex flex-col p-2 space-y-3'>
        {/* Header ********************************************************************/}
        <div className='flex justify-between w-[80%] mx-auto'>
        {/* Title and rating */}
        <div className=''>
        <div className='flex justify-between'><span className='text-3xl font-semibold'>R & Next Carwash</span></div>
        {/* Ratings ********************************************************************/}
        <div className='flex  relative ml-0 space-x-1 justify-between items-center mt-5 w-full'>
        <div className='flex space-x-2'>
        <StyledRating className='relative left-[0.1rem]'  readOnly defaultValue={4.1} precision={0.1} icon={<StarRoundedIcon fontSize='medium' />  } emptyIcon={<StarRoundedIcon fontSize='medium' className='text-gray-300' />} />
        <div className='flex items-center space-x-2'>
        <p className='text-gray-400 text-sm font-medium'>(4)</p> 
        <p className='text-gray-300'>|</p>
        <p className='text-gray-700 text-sm pt-[2.5px] font-medium'>{"77 Reviews"}</p> 
        </div>
        </div>
        </div>
        </div>
        {/* Buttons */}
        <div className='flex flex-col space-y-2 '>
        <button className='text-lg font-semibold bg-green-500 h-full text-white w-36 rounded-[0.150rem]'>Chat now</button>
        <button className='text-lg font-semibold bg-themeOrange h-full text-white w-36 rounded-[0.150rem]'>Book Service</button>
        </div>
        </div>

        {/* Image Gallery Container */}
        <div className='w-full h-[450px]  flex items-center justify-center '>
          <div className='w-[80%] relative z-10'>
          <ImageGallery 
          autoPlay={true} 
          slideDuration={500} 
          slideInterval={6000} 
          showFullscreenButton={false} 
          showPlayButton={false} 
          items={images}
          
          />
          </div>
        
        {/* <Carousel hasThumbnails={false} shouldLazyLoad={true} hasTransition={true} hasIndexBoard={false } playIcon={false} thumbnailHeight="80px" thumbnailClass="tmb" thumbnailWidth='150px'  images={images} style={{ height: "", width: "80%", display: "flex" }} /> */}
        </div>
        </div>


        {/* ************************************************************************************************************************************************************* */}
        {/* Right Side */}
        <div className='w-full h-full col-span-2 md:col-span-1 border-2 bg-white p-2 border-black flex flex-col'>
        {/* Header */}
        <div className='flex bg-gray-100 p-2'>
        {/* Img container */}
        <div className='w-[35%]  flex justify-center items-center'>
        <img className='w-20 h-20 rounded-full object-cover' src={profile} />
        </div>
        {/* Personal Information */}
        <div className=' w-full p-1 flex flex-col space-y-2 px-2'>
        <p className='flex items-center justify-start gap-2 text-gray-700'><AccountCircleOutlinedIcon fontSize="medium" className='text-gray-500 ' />John Patrick C. Trinidad</p>
        <p className='flex items-center justify-start gap-2 text-gray-700'><EmailOutlinedIcon fontSize="medium" className='text-gray-500 ' />Ptrinidad765@gmail.com</p>
        <p className='flex items-center justify-start gap-2 text-gray-700'><CallOutlinedIcon fontSize="medium" className='text-gray-500 ' />+63 991 413 8519</p>
        </div>
        </div>
        </div>

        </section>
    </div>
  )
}

export default ViewService