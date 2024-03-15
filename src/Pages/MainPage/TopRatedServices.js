import React, { useEffect } from 'react'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useState } from 'react';
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
import UseInfo from '../../ClientCustomHook/UseInfo';
import UseDNS from '../../ClientCustomHook/DNSProvider';
import useAllRatings from '../../ClientCustomHook/AllRatingsProvider';
import 'swiper/css';
import { Link } from 'react-router-dom';
import http from '../../http';



const TopRatedServices = ({services}) => {
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
        className={` mx-1 bg-black transition-all duration-300 rounded-full mb-0 ${active ? " w-[12px] max-w-[12px] h-3 bg-gray-700" : "inactive bg-gray-400 w-3 h-3"}`}
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
    
    <div className='Header w-full items-center  p-1 flex flex-col space-y-0'>
      <h1 className='text-gray-700 text-center text-4xl md:text-4xl font-bold'>Top Rated Services</h1>
    <div className='w-1/4 mx-auto flex items-center justify-center'>
    <div className='h-[3px] w-[30%] bg-gray-500'></div>
      <EmojiEventsIcon className='mx-2 text-themeGray text-4xl'/>
    <div className='h-[3px] w-[30%] bg-gray-500'></div>
    </div>
    <h3 className='text-themeGray font-medium'>Highest Rated Services</h3>
    </div>
    {
      services == null || services == ""
      ?
      <div className="lds-dual-ring w-full  mx-auto h-screen"></div>
      :
      (
      <section className='TRS_Container  mt-5 w-[100%] md:w-[100%] xl:w-[90vw] max-w-[100vw] mx-auto h-fit overflow-hidden'>

      <Carousel
      className='absolute w-full xl:w-[90%] mx-auto  py-5'
      swipeable={true}
      draggable={true}
      showDots={true}
      responsive={responsive}
      ssr={true} // means to render carousel on server-side.
      infinite={false}
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
      services.sort((a, b) => new Date(b.ratings) - new Date(a.ratings)).slice(0,10).map((service)=>{
        return (
          <div key={service._id} className='w-full h-fit sm:h-[400px] flex items-center justify-center  py-4'>
                {/* Cards */}
                <div className='TRS semiXs:w-[400px] p-2 sm:w-[300px] md:w-[350px] semiMd:w-[400px] lg:w-[330px] xl:w-[330px] service_card relative h-fit sm:h-fit pb-2 rounded-lg bg-white overflow-hidden'>
                <Link   to={`/explore/viewService/${service._id}`}>
                <img className='h-[200px] rounded-md w-full semiXs:h-[250px] object-cover semiXs:w-[400px] sm:h-[200px] sm:w-[300px] md:h-[200px] md:w-[350px] semiMd:h-[220px] semiMd:w-[400px]  lg:h-[200px] lg:w-[330px] xl:h-[200px] xl:w-[330px] ' src={service.serviceProfileImage} />
                </Link>
                {/* Profile */}
                <div className='w-16 h-16 absolute left-5 top-[10.5rem] semiXs:top-[13.5rem] sm:top-[10.5rem] semiMd:top-[11.6rem] lg:top-[10.5rem] xl:top-[10.5rem] sm:left-5 rounded-full border-4 border-gray-700 bg-cover' style={{backgroundImage : `url(${service.owner.profileImage})`}}></div>
                <div className='relative mt-7 flex flex-col space-y-1 pe-3'>
                  {/* Service Title */}
                <p className='text-black ml-3 font-semibold mt-2 text-lg whitespace-nowrap overflow-hidden'>{service.basicInformation.ServiceTitle}</p>
                <div className='flex items-center space-x-2'>
                <p className='text-gray-400 ml-3 font-medium mt-0 text-sm'>{service.owner.firstname + service.owner.lastname}</p>
                <span className='w-1 h-1 bg-gray-600 rounded-full'></span>
                <p className='text-gray-400 ml-3 font-normal mt-0 text-sm'>{service.createdAgo}</p> 
                </div>
                
                {/* More Options Button */}
                <OutsideClickHandler onOutsideClick={()=>{
                    setActiveId(null)
                  }}>
                  <MoreVertIcon onClick={()=>{openMoreOptions(service._id)}} className={`absolute ${service._id == activeId ? "text-gray-300" : "text-gray-600"} cursor-pointer hover:text-gray-300 -top-5 right-1`} />
                  <div id={service._id} className={`${service._id == activeId ? "absolute" : "hidden"} options ease-in-out duration-200  bg-gray-50 shadow-md rounded-md -top-20 right-7`}>
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
                  <StyledRating className='relative -left-1'  readOnly defaultValue={service.ratingRounded} precision={0.1} icon={<StarRoundedIcon fontSize='small' />  } emptyIcon={<StarRoundedIcon fontSize='small' className='text-gray-300' />} />
                  <p className='text-gray-400 text-sm font-medium'>{service.ratings}</p> 
                  <p className='text-gray-300'>|</p>
                  <p className='text-gray-700 text-sm pt-[2.5px] font-medium'>{service.totalReviews + " Reviews"}</p> 
                  </div>
                  {/* Address */}
                  <div className='flex items-center ml-2'>
                  <PlaceOutlinedIcon className='text-gray-400' />
                  <p className='mt-0 font-normal text-gray-400 text-sm ml-1 me-4 whitespace-nowrap overflow-hidden text-ellipsis'>{service.address.barangay.name + " " + service.address.municipality.name +", " + service.address.province.name}</p>
                  </div>
                </div>
                </div>
                </div>
        )
      })
      }
      
      </Carousel>
        </section>
    
      )
    }

    {/* // Services */}
   
    </div>
    
    
  )
}

export default TopRatedServices