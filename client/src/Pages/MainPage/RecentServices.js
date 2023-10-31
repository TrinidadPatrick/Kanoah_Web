import React from 'react'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useState, useEffect } from 'react';
import {services } from './Components/Services/Services';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import HideSourceIcon from '@mui/icons-material/HideSource';
import ReportIcon from '@mui/icons-material/Report';
import OutsideClickHandler from 'react-outside-click-handler';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';



const RecentServices = () => {
  const [newServices, setNewServices] = useState(null)
  const [showMoreOption, setShowMoreOption] = useState(false)
  const [activeId, setActiveId] = useState(0)
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentDay = currentDate.getDate().toString().padStart(2, '0');
  const thisDate = currentYear + "-" + currentMonth + "-" + currentDay
  
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

  const responsive = {
    
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    
    tablet: {
      breakpoint: { max: 1024, min: 640 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 639, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };

  const CustomDot = ({ onClick, ...rest }) => {
    const {
      onMove,
      index,
      active,
      carouselState: { currentSlide, deviceType }
    } = rest;

    // onMove means if dragging or swiping in progress.
    // active is provided by this lib for checking if the item is active or not.
    return (
      <button
        className={` mx-0.5 bg-black transition-all duration-300 rounded-full mb-4 ${active ? "active w-3 h-3 bg-gray-700" : "inactive bg-gray-400 w-3 h-3"}`}
        onClick={() => onClick()}
      >
      </button>
    );
  };

  const initializeRecentServices = () =>{
    const sorted = services.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
    const sliced = sorted.slice(0,9)
    setNewServices(sliced)
  }

  useEffect(() => {
    initializeRecentServices()
  }, [])
  

  const openMoreOptions = (id) => {
    
    if(activeId == id){
      setActiveId(null)
    }else {
      setActiveId(id)
    }

  }

  
  return (
    
    <div className=' z-10 relative flex flex-col justify-center items-center '>
    {/* // HEADER */}
    
    <div className='Header w-full items-center  p-1 flex flex-col space-y-0'>
    <h1 className='text-gray-700 text-center text-4xl md:text-4xl font-bold'>Recent Services</h1>
    <div className='w-1/4 mx-auto flex items-center justify-center'>
    <div className='h-[3px] w-[25%] bg-gray-500'></div>
      <EmojiEventsIcon className='mx-2 text-themeGray text-4xl'/>
    <div className='h-[3px] w-[25%] bg-gray-500'></div>
    </div>
    <h3 className='text-themeGray font-medium'>Newest Services</h3>
    </div>

    {/* // Services */}
    <section className='TRS_Container flex justify-center   mt-5 w-[100%] md:w-[100%] xl:w-[90vw] max-w-[100vw] mx-auto h-fit overflow-hidden'>

    {
      newServices == null
      ?
      <div className="lds-dual-ring w-full  mx-auto h-screen"></div>
      :
      (
      <Carousel
      className='absolute w-full xl:w-[90%] mx-auto  py-5'
      swipeable={true}
      draggable={true}
      showDots={true}
      responsive={responsive}
      ssr={true} // means to render carousel on server-side.
      autoPlaySpeed={1000}
      keyBoardControl={true}
      containerClass="carousel-container"
      removeArrowOnDeviceType={["tablet", "mobile"]}
      dotListClass="custom-dot-list-style"
      itemClass="carousel-item-padding-40-px"
      arrows={false}
      customDot={<CustomDot />}
  
>
  

  {
    newServices.map((service)=>{
      const ratings = service.rating; // Assuming "services" is the array of services
          const ratingTotal = ratings['5star'] + ratings['4star'] + ratings['3star'] + ratings['2star'] + ratings['1star'];
          const ratingAverage = (5 * ratings['5star'] + 4 * ratings['4star'] + 3 * ratings['3star'] + 2 * ratings['2star'] + 1 * ratings['1star']) / ratingTotal;
          const rounded = Math.round(ratingAverage * 100) / 100;
          const from = new Date(service.dateCreated);
          const to = new Date(thisDate);
          const years = to.getFullYear() - from.getFullYear();
          const months = to.getMonth() - from.getMonth();
          const days = to.getDate() - from.getDate();
      return (
        <div key={service.id} className='w-full h-[400px] flex items-center justify-center  py-4'>
              {/* Cards */}
              <div className='TRS service_card h-fit w-[80%] sm:w-[92%] sm:h-fit pb-2 rounded-lg bg-white overflow-hidden'>
              <img className='h-48 w-full ' src={service.image} />
              {/* Profile */}
              <div className='w-16 h-16 absolute left-16 top-[11.5rem] sm:top-[11.5rem] md:top-[11.5rem] lg:top-[11.5rem] xl:top-[11.6rem] sm:left-8 rounded-full border-4 border-gray-700 bg-cover' style={{backgroundImage : `url(${service.profile})`}}></div>
              <div className='relative mt-7 flex flex-col space-y-1 '>
                {/* Service Title */}
              <p className='text-black ml-3 font-semibold mt-2 text-lg'>{service.title}</p> 
              <div className='flex justify-start items-center'>
              <p className='text-gray-400 ml-3 font-medium mt-0 text-sm'>{service.owner}</p> 
              <div className='w-1 h-1 rounded-full ml-1 bg-gray-500'></div>
              {
                years > 0 ? (<p className='text-xs text-gray-400 ml-1 '>{years}{years > 1 ? " years ago" : " year ago"}</p>) : months > 0 ? (<p className='text-xs text-gray-400 ml-1 '>{months}{months > 1 ? " months ago" : " month ago"}</p>) : days > 0  ? (<p className='text-xs text-gray-400 ml-1 '>{days} {days > 1 ? " days ago" : " day ago"}</p>) : (<p className='text-xs text-gray-400 ml-1 '>Less than a day ago</p>)
              }
              </div>
              {/* More Options Button */}
              <OutsideClickHandler onOutsideClick={()=>{
                  setActiveId(null)
                }}>
                <MoreVertIcon onClick={()=>{openMoreOptions(service.id)}} className={`absolute ${service.id == activeId ? "text-gray-300" : "text-gray-600"} cursor-pointer hover:text-gray-300 -top-5 right-1`} />
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
                </OutsideClickHandler>
                {/* Rating */}
                <div className='flex relative items-center ml-3 space-x-1'>
                <StyledRating className='relative -left-1'  readOnly defaultValue={rounded} precision={0.1} icon={<StarRoundedIcon fontSize='small' />  } emptyIcon={<StarRoundedIcon fontSize='small' className='text-gray-300' />} />
                <p className='text-gray-400 text-sm font-medium'>({rounded.toFixed(1)})</p> 
                <p className='text-gray-300'>|</p>
                <p className='text-gray-700 text-sm pt-[2.5px] font-medium'>{ratingTotal + " Reviews"}</p> 
                </div>
                {/* Address */}
                <div className='flex items-center ml-2'>
                <PlaceOutlinedIcon className='text-gray-400' />
                <p className='mt-1 font-normal text-gray-400 ml-1 me-4 whitespace-nowrap overflow-hidden text-ellipsis'>{service.Address}</p>
                </div>
    
              </div>
              </div>
            </div>
      )
    })
  }
  
    </Carousel>
      )
    }
    </section>

    </div>
    
    
  )
}

export default RecentServices