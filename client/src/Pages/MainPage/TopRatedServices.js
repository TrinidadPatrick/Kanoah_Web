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
import OutsideClickHandler from 'react-outside-click-handler';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';



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
        className={` mx-1 bg-black transition-all duration-300 rounded-full mb-4 ${active ? "active w-3 h-3 bg-gray-700" : "inactive bg-gray-400 w-3 h-3"}`}
        onClick={() => onClick()}
      >
      </button>
    );
  };


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
    
    <div className='Header w-full items-center  p-1 flex flex-col space-y-2'>
        <h1 className='text-themeBlue text-center text-4xl md:text-5xl font-bold'>Top rated services</h1>

        <div className='w-1/4 mx-auto flex items-center justify-center'>
            <div className='h-[3px] w-2/5 bg-themeGray'></div>
            <EmojiEventsIcon className='mx-2 text-themeBlue text-4xl'/>
            <div className='h-[3px] w-2/5 bg-themeGray'></div>
        </div>
        <h3 className='text-themeGray font-medium'>Best Services</h3>
    </div>


    {/* // Services */}
    <section className='TRS_Container  mt-5 w-[100%] md:w-[100%] xl:w-[90vw] max-w-[100vw] mx-auto h-fit overflow-hidden'>

    <Carousel
    className='absolute w-full xl:w-[90%] mx-auto  py-5'
  swipeable={true}
  draggable={true}
  showDots={true}
  responsive={responsive}
  ssr={true} // means to render carousel on server-side.
  infinite={true}
  autoPlaySpeed={1000}
  keyBoardControl={true}
  containerClass="carousel-container"
  removeArrowOnDeviceType={["tablet", "mobile"]}
  dotListClass="custom-dot-list-style"
  itemClass="carousel-item-padding-40-px"
  arrows={true}
  customDot={<CustomDot />}
  
>
  

  {
    services.map((service)=>{
      const ratings = service.rating; // Assuming "services" is the array of services
          const ratingTotal = ratings['5star'] + ratings['4star'] + ratings['3star'] + ratings['2star'] + ratings['1star'];
          const ratingAverage = (5 * ratings['5star'] + 4 * ratings['4star'] + 3 * ratings['3star'] + 2 * ratings['2star'] + 1 * ratings['1star']) / ratingTotal;
          const rounded = Math.round(ratingAverage * 100) / 100;
      return (
        <div key={service.id} className='w-full h-[400px] flex items-center justify-center  py-4'>
          {/* Cards */}
          <div className='TRS service_card h-fit w-[80%] sm:w-[92%] sm:h-fit pb-2 rounded-lg bg-white overflow-hidden'>
          <img className='h-48 w-full ' src={service.image} />
          {/* Profile */}
          <div className='w-16 h-16 absolute left-20 top-[12.2rem] sm:top-[12.2rem] md:top-[12.2rem] lg:top-[12.1rem] xl:top-[12.3rem] sm:left-8 rounded-full border-4 border-gray-700 bg-cover' style={{backgroundImage : `url(${service.profile})`}}></div>
          <div className='relative mt-7 flex flex-col space-y-1 '>
            {/* Service Title */}
          <p className='text-black ml-3 font-semibold mt-2 text-lg'>{service.title}</p> 
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
            <p className='mt-1 font-normal text-gray-400 ml-1 me-4'>{service.Address}</p>
            </div>

          </div>
          </div>
        </div>
      )
    })
  }
  
</Carousel>
    </section>

    </div>
    
    
  )
}

export default TopRatedServices