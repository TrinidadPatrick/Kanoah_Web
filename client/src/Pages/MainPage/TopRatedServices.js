import React from 'react'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useState } from 'react';
import StarRatings from 'react-star-ratings';
import { services } from './Components/Services/Services';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import HideSourceIcon from '@mui/icons-material/HideSource';
import ReportIcon from '@mui/icons-material/Report';

const TopRatedServices = () => {
  const [showMoreOption, setShowMoreOption] = useState(false)
  const [activeId, setActiveId] = useState(0)
  
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


  const openMoreOptions = (id) => {
    
    if(activeId == id){
      setActiveId(null)
    }else {
      setActiveId(id)
    }
    // const elements = document.getElementById(id)
    // if(showMoreOption){
    //   elements.classList.replace( "absolute", "hidden" )
    //   setShowMoreOption(false)
    // }else{
    //   elements.classList.replace( "hidden", "absolute" )
    //   setShowMoreOption(true)

    // }
  }


  
  return (
    
    <div>
    {/* // HEADER */}
    
    <div className='Header w-full items-center  p-1 flex flex-col space-y-2'>
        <h1 className='text-themeGray text-center text-4xl md:text-5xl font-bold'>Top rated services</h1>

        <div className='w-1/4 mx-auto flex items-center justify-center'>
            <div className='h-[3px] w-2/5 bg-themeGray'></div>
            <EmojiEventsIcon className='mx-2 text-themeBlue text-4xl'/>
            <div className='h-[3px] w-2/5 bg-themeGray'></div>
        </div>
        <h3 className='text-themeGray font-medium'>Best Services</h3>
    </div>


    {/* // Services */}
    <section className='TRS_Container mt-5 w-[80vw] max-w-[80vw] mx-auto h-96 snap-x  whitespace-nowrap overflow-auto'>
     
      {
        services.map((service, index)=>{
          const ratings = service.rating; // Assuming "services" is the array of services
          const ratingTotal = ratings['5star'] + ratings['4star'] + ratings['3star'] + ratings['2star'] + ratings['1star'];
          const ratingAverage = (5 * ratings['5star'] + 4 * ratings['4star'] + 3 * ratings['3star'] + 2 * ratings['2star'] + 1 * ratings['1star']) / ratingTotal;
          const rounded = Math.round(ratingAverage * 100) / 100;

          return (
            
            <div key={index} className='TRS relative rounded-[0.95rem] pb-3 h-fit mr-4 snap-start bg-white inline-block w-[100%] sm:w-[48.5%] md:w-[48.8%] lg:w-[32.5%] '>
            <img className='w-full border-b-4 h-64 sm:h-44 xl:h-56 rounded-t-[0.95rem]' src={service.image} alt="Pizza" />
            {/* Profile */}
            <div className='w-16 h-16 absolute top-[13.8rem] sm:top-[8.8rem] md:top-[8.8rem] lg:top-[8.8rem] xl:top-[11.9rem] left-4 rounded-full border-4 bg-cover' style={{backgroundImage : `url(${service.profile})`}}></div>
            {/* <img className='w-14 h-14 absolute top-48 left-4 rounded-full border-4' src={service.profile} /> */}
            <div className='relative mt-7 flex flex-col space-y-1 '>
            <p className='text-themeBlue ml-3 font-bold mt-2 text-xl'>{service.title}</p> 
            {/* <FavoriteBorderIcon fontSize='medium' className='absolute right-2 top-0'/> */}
            {/* dropSide */}
            
            <MoreVertIcon onClick={()=>{openMoreOptions(service.id)}} className='absolute cursor-pointer hover:text-gray-300 -top-6 right-1 text-gray-500' />
            <div id={service.id} className={`${service.id == activeId ? "absolute" : "hidden"} options ease-in-out duration-200  bg-gray-50 shadow-md rounded-md -top-20 right-7`}>
            <div id='optionMenu' className='flex  hover:bg-gray-300 cursor-pointer items-center px-2 py-2'>
            <LibraryAddIcon />
            <p className=' px-4  text-gray-600 rounded-md cursor-pointer py-1'>Add to Library</p>
            </div>
            
            <div id='optionMenu' className='flex  hover:bg-gray-300 cursor-pointer items-center px-2 py-2'>
            <HideSourceIcon />
            <p className=' px-4  text-gray-600 rounded-md cursor-pointer py-1'>Do not show</p>
            </div>
            
            <div id='optionMenu' className='flex  hover:bg-gray-300 cursor-pointer items-center px-2 py-2'>
            <ReportIcon />
            <p className=' px-4  text-gray-600 rounded-md cursor-pointer py-1'>Report</p>
            </div>
            </div>
            
         {/* Rating */}
            <div className='flex relative items-center ml-3 space-x-2'>
            <StyledRating className='relative -left-1'  readOnly defaultValue={rounded} precision={0.1} icon={<StarRoundedIcon fontSize='medium' />  } emptyIcon={<StarRoundedIcon fontSize='medium' className='text-gray-300' />} />
            <p className='text-gray-500 text-sm font-medium'>({rounded.toFixed(1)})</p>   
            </div>
        {/* Address */}
            <div className='flex items-center ml-2'>
            <PlaceOutlinedIcon className='text-gray-400' />
            <p className='mt-1 font-normal text-gray-400 ml-1 me-4'>{service.Address}</p>
            </div>
            </div>
            </div>
          )
        })
      }
      
    </section>

    </div>
    
  )
}

export default TopRatedServices