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
import noImage from '../../Utilities/emptyImage.jpg'
import 'react-multi-carousel/lib/styles.css';
import { Link } from 'react-router-dom';



  const RecentServices = ({services}) => {
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
        className={` mx-0.5 bg-black transition-all duration-300 rounded-full mb-0 ${active ? " w-3 h-3 bg-gray-700" : "inactive bg-gray-400 w-3 h-3"}`}
        onClick={() => onClick()}
      >
      </button>
    );
  };

  // const ratingAverage = async (services, ratings, dns) => {
  //   const processedServices = await Promise.all(
  //     services.map((service, index) => {
  //       const serviceRatings = ratings.filter((rating)=> rating.service === service._id)
  //       const totalRatings = serviceRatings.length
  //       const sumOfRatings = serviceRatings.reduce((sum, rating) => sum + rating.rating, 0);
  //       const average = totalRatings === 0 ? 0 : sumOfRatings / totalRatings
  //       const from = new Date(service.createdAt);
  //       const to = new Date(thisDate);
  //       const years = to.getFullYear() - from.getFullYear();
  //       const months = to.getMonth() - from.getMonth();
  //       const days = to.getDate() - from.getDate();
  //       const createdAgo = years > 0 ? `${years} ${years <= 1 ? "year" : "years"} ago` : months > 0 ? `${months} ${months <= 1 ? "month" : "months"} ago` : days > 0 ? `${days} ${days <= 1 ? "day" : "days"} ago` : "Less than a day ago";
  //       return ({
  //         _id : service._id,
  //         key : index,
  //         basicInformation: service.basicInformation,
  //         advanceInformation: service.advanceInformation,
  //         address: service.address,
  //         tags: service.tags,
  //         owner : service.owner,
  //         serviceProfileImage: service.serviceProfileImage,
  //         ratings : average,
  //         ratingRounded : Math.floor(average),
  //         totalReviews : totalRatings,
  //         createdAgo : createdAgo,
  //         createdAt : service.createdAt
  //       });
  //     })
  //     )
  //     return authenticated ? processedServices.filter(service => (
  //         !dns.some(dnsService => service._id === dnsService.service._id) &&
  //         service.owner && userInformation &&
  //         service.owner._id !== userInformation._id
  //       )) : authenticated === false ? processedServices : ""
  // };

  

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
      services == null || services == ""
      ?
      <div className='w-full h-[400px] py-5 gap-24 flex items-center justify-center overflow-hidden mt-5'>
        <div className='h-full aspect-[9/10] flex flex-col gap-2 p-1'>
          <div className='w-full h-[200px] bg-gray-300 rounded-md animate-pulse'></div>
          <div className='w-[60%] h-[20px] bg-gray-300 rounded-md animate-pulse'></div>
          <div className='w-[85%] h-[20px] bg-gray-300 rounded-md animate-pulse'></div>
          <div className='w-[75%] h-[20px] bg-gray-300 rounded-md animate-pulse'></div>
          <div className='w-[55%] h-[20px] bg-gray-300 rounded-md animate-pulse'></div>
          <div className='w-[95%] h-[20px] bg-gray-300 rounded-md animate-pulse'></div>
        </div>
        <div className='h-full aspect-[9/10] flex flex-col gap-2 p-1'>
          <div className='w-full h-[200px] bg-gray-300 rounded-md animate-pulse'></div>
          <div className='w-[80%] h-[20px] bg-gray-300 rounded-md animate-pulse'></div>
          <div className='w-[75%] h-[20px] bg-gray-300 rounded-md animate-pulse'></div>
          <div className='w-[45%] h-[20px] bg-gray-300 rounded-md animate-pulse'></div>
          <div className='w-[95%] h-[20px] bg-gray-300 rounded-md animate-pulse'></div>
          <div className='w-[65%] h-[20px] bg-gray-300 rounded-md animate-pulse'></div>
        </div>
        <div className='h-full aspect-[9/10] flex flex-col gap-2 p-1'>
          <div className='w-full h-[200px] bg-gray-300 animate-pulse'></div>
          <div className='w-[40%] h-[20px] bg-gray-300 rounded-md animate-pulse'></div>
          <div className='w-[75%] h-[20px] bg-gray-300 rounded-md animate-pulse'></div>
          <div className='w-[35%] h-[20px] bg-gray-300 rounded-md animate-pulse'></div>
          <div className='w-[95%] h-[20px] bg-gray-300 rounded-md animate-pulse'></div>
          <div className='w-[25%] h-[20px] bg-gray-300 rounded-md animate-pulse'></div>
        </div>
      </div>
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
    services?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,10).map((service)=>{
      return (
        <div key={service._id} className='w-full h-fit sm:h-[400px] flex items-center justify-center  py-4'>
              {/* Cards */}
              <div className='TRS semiXs:w-[400px] p-2 sm:w-[300px] md:w-[350px] semiMd:w-[400px] lg:w-[330px] xl:w-[330px] service_card relative h-fit sm:h-fit pb-2 rounded-lg bg-white overflow-hidden'>
              <Link to={`/exploreService/viewService/${service._id}`}>
              <img className='h-[200px] w-full rounded-md object-cover semiXs:h-[250px] semiXs:w-[400px] sm:h-[200px] sm:w-[300px] md:h-[200px] md:w-[350px] semiMd:h-[220px] semiMd:w-[400px]  lg:h-[200px] lg:w-[330px] xl:h-[200px] xl:w-[330px] ' src={service.serviceProfileImage === null ? noImage : service.serviceProfileImage} />
              </Link>
              {/* Profile */}
              <img src={service.owner.profileImage} className='w-16 h-16 object-cover absolute left-5 top-[10.8rem] semiXs:top-[13.8rem] sm:top-[10.8rem] semiMd:top-[12.1rem] lg:top-[10.8rem] xl:top-[10.8rem] sm:left-5 rounded-full border-4 border-gray-700 bg-cover' >

                </img>
              <div className='relative mt-7 flex flex-col space-y-1 pe-3'>
                {/* Service Title */}
              <p className='text-black ml-3 font-semibold mt-2 text-lg whitespace-nowrap overflow-hidden'>{service.basicInformation.ServiceTitle}</p>
              <div className='flex items-center space-x-2'>
              <p className='text-gray-400 ml-3 font-medium mt-0 text-sm'>{service.owner.firstname + " " +  service.owner.lastname}</p>
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
      )
    }
    </section>

    </div>
    
    
  )
}

export default RecentServices