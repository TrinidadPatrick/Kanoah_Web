import React from 'react'
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import MiscellaneousServicesOutlinedIcon from '@mui/icons-material/MiscellaneousServicesOutlined';
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined';
import ImageGallery from "react-image-gallery";
import 'react-image-gallery/styles/css/image-gallery.css'
import { useState, useEffect, useCallback, useRef } from 'react';
import 'react-gallery-carousel/dist/index.css';
import { FaFacebook, FaInstagram, FaMapLocation, FaPhone, FaRegEnvelope, FaSquareFacebook, FaYoutube } from 'react-icons/fa6';
// import ReactMapGL, { GeolocateControl, Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import Description from './Components/Description';
import Reviews from './Components/Reviews';
import ResponsiveGallery from 'react-responsive-gallery';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Download from "yet-another-react-lightbox/plugins/download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {APIProvider, Map, Marker, useMapsLibrary } from '@vis.gl/react-google-maps';
import { setUserId, selectUserId, setLoggedIn,setShowLoginModal, selectLoggedIn, selectShowLoginModal } from '../../ReduxTK/userSlice';
import http from '../../http';
import instagram from './img/instagram.png'
import holidays from 'date-holidays'
import Footer from '../MainPage/Footer';
import Modal from 'react-modal';
import BookService from '../BookService/BookService';
import UseInfo from '../../ClientCustomHook/UseInfo';
import ServiceOffers from './Components/ServiceOffers';





const ViewService = () => {
  Modal.setAppElement('#root');
  const [dateToday, setDateToday] = useState("")
  const {userInformation,authenticated} = UseInfo()
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [windowWidth, setWindowWdith] = useState(null)
  const [windowHeight, setWindowHeight] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [serviceInfo, setServiceInfo] = useState(null)
  const { serviceId } = useParams();
  const [open, setOpen] =useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState('Description')
  const [currentDay, setCurrentDay] = useState('')
  const hd = new holidays('PH')
  const holiday = hd.getHolidays()
  const [reviews, setReviews] = useState([])
  const key = process.env.REACT_APP_MAP_API_KEY

  const [location, setLocation] = useState({
    longitude : null,
    latitude : null
  })

  const ModalStyle = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding : "0",
      zIndex: 999,
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Change the color and opacity as needed
      zIndex: 998,
    },
  };

  const handleCloseModal = () => {
    setIsOpen(false)
  }

  // Generated format for featured Images
  const generatedFeaturedImages = (featuredImages) => {
    return featuredImages?.map((image,index)=>(
      {
        key : index,
        original : image.src,
        thumbnail : image.src,
        originalClass: 'image-gallery-original', // Apply the custom CSS class for original image
        thumbnailClass: 'image-gallery-thumbnail', // Apply the custom CSS class for thumbnails
      }
    ))
  }

  const CustomSlide = ({ item }) => {
    const originalStyle = {
      backgroundImage: `url(${item.original})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100%',
      width: '100%',
      position: 'absolute',
      filter: 'blur(4px) brightness(0.7)', // Apply blur effect to the background
      zIndex: -1,
    };
    
  
    return (
      <div className="image-gallery-image" style={{ position: 'relative' }}>
        <div style={originalStyle}></div>
        <img className='' src={item.original} alt={item.description} />
      </div>
    );
  };

  const handleImageClick = (imageSrc) => {
    const index = serviceInfo.galleryImages.findIndex(image => image.src == imageSrc)
    setSelectedImageIndex(index);
    setOpen(true);
  };

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

  // For map location
  const [viewport, setViewPort] = useState({    
    width: "100%",
    height: "100%",
    zoom : 16
  })

  // Get my location
  useEffect(() => {
    // Use the Geolocation API to get the user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          
        },
        (error) => {
          // Handle any errors here
          console.error('Geolocation error:', error);
        }
      );
    } else {
      // Geolocation is not available in this browser
      console.error('Geolocation is not available.');
    }
  }, []);

  // Get current Day name
  useEffect(()=>{
    const currentDate = new Date()
    const currentDay = currentDate.getDay()
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    setCurrentDay(daysOfWeek[currentDay])
  },[])


  // Get the service information
  const getService = async () => {
    await http.get(`getServiceInfo/${serviceId}`).then((res)=>{
      setServiceInfo(res.data.service)
      setReviews(res.data.ratings)
    }).catch((err)=>{
      console.log(err)
    })
  }

  // Make logic for chatnow
  const handleChatNow = () => {
    if(authenticated)
    {
      navigate(`/chat?service=${serviceInfo.owner._id}`)
      // navigate(`/chatP?to=${serviceInfo.owner._id}&service=${serviceInfo.owner._id}`)
    }
    else{
      dispatch(setShowLoginModal(true))
    }
  }

// Get the service function
  useEffect(()=>{
    getService()
  },[])

  const handleResize = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
  
    // Update your code or perform actions based on the new size
    setWindowWdith(windowWidth)
    setWindowHeight(windowHeight)
}
  
// Attach the event listener to the window resize event
window.addEventListener('resize', handleResize);
  
// Call the function once to get the initial size
useEffect(()=>{
    handleResize();
},[])

useEffect(()=>{
  const year = new Date().getFullYear()
  const month = new Date().getMonth()
  const date = new Date().getDate()+1
  setDateToday(year+"-"+month+"-"+date)
},[])

const handleBook = () => {
  if(authenticated)
  {
    setIsOpen(true)
  }
  else{
    dispatch(setShowLoginModal(true))
  }
}

  return (

    
    
   <div className='grid place-items-center h-full  w-full '>
    
    {
      serviceInfo == null ? (
        <div className='w-full h-screen grid place-items-center'>
            <div className="spinner"></div>
            </div>
      ) :
      (
        <div className='w-full h-full bg-[#F9F9F9] md:px-12 lg:px-20 xl:px-32 pb-10 flex flex-col'>
        <section className='w-full h-fit flex flex-col xl:flex-row justify-between p-2 gap-1 mt-5' >

        {/* Left Side ********************************************************************/}
        <div className='w-full shadow-sm bg-white xl:w-[60%] rounded-lg h-fit  flex flex-col p-2 space-y-3'>
        {/* Header ********************************************************************/}
        <div className='flex justify-between w-full mx-auto'>
        {/* Title and rating */}
        <div className=''>
          {/* Title */}
        <div className='flex justify-between'><span className='text-lg md:text-3xl font-semibold'>{serviceInfo.basicInformation.ServiceTitle}</span></div>
        {/* Ratings ********************************************************************/}

        <div className='flex  relative ml-0 space-x-1 justify-between items-center mt-5 w-full'>
        <div className='flex space-x-2'>
        <StyledRating className='relative left-[0.1rem]'  readOnly defaultValue={Number(serviceInfo.ratings)} precision={0.1} icon={<StarRoundedIcon fontSize={windowWidth <= 450 ? "small" : "medium"} />  } emptyIcon={<StarRoundedIcon fontSize={windowWidth <= 450 ? "small" : "medium"} className='text-gray-300' />} />
        <div className='flex items-center space-x-2 '>
        <p className='text-gray-400 text-xs md:text-sm font-medium'>({serviceInfo.ratings})</p> 
        <p className='text-gray-300'>|</p>
        <p className='text-gray-700 text-xs md:text-sm md:pt-[2.5px] font-medium'>{serviceInfo.totalReviews} Reviews</p> 
        </div>
        </div>
        </div>
        </div>
        {/* Buttons */}
        <div className='flex flex-col space-y-2 '>
        <button onClick={()=>{handleChatNow()}} className="cursor-pointer transition-all bg-green-500 text-white px-6 py-1.5 rounded-lg
        border-green-600
        border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
        active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
          Chat now
        </button>
        <button onClick={()=>{handleBook()}} disabled={!serviceInfo.acceptBooking} className="cursor-pointer disabled:bg-blue-300 disabled:border-blue-300 transition-all bg-blue-500 text-white px-6 py-1.5 rounded-lg
        border-blue-600
        border-b-[4px] enabled:hover:brightness-110 enabled:hover:-translate-y-[1px] enabled:hover:border-b-[6px]
        active:border-b-[2px] disabled:cursor-not-allowed active:brightness-90 active:translate-y-[2px]">
          Book Service
        </button>
        </div>
        </div>

        {/* Image Featured Images Container */}
        <div className='w-full h-[fit]  flex items-center justify-center '>
        <div className='w-full relative z-10  rounded-md'>
          <ImageGallery 
          autoPlay={true} 
          slideDuration={500} 
          slideInterval={6000} 
          showFullscreenButton={false} 
          showPlayButton={false} 
          renderItem={(item) => <CustomSlide item={item} />}
          items={generatedFeaturedImages(serviceInfo.featuredImages)}
          
          />
          </div>
        
        </div>
        </div>


        {/* ************************************************************************************************************************************************************* */}
        {/* Right Side */}
        <div className='w-full xl:w-[450px] h-fit col-span-2 md:col-span-1 shadow-sm rounded-lg bg-white p-2 flex flex-col space-y-4'>
        {/* Header */}
        <div className='flex  bg-gray-100 p-2'>
        {/* Img container */}
        <div className='w-[100px] min-w-[100px]  flex justify-center items-center'>
        <img className='w-20 h-20 rounded-full object-cover' src={serviceInfo.owner.profileImage} />
        </div>
        {/* Personal Information */}
        <div className=' w-full  p-1 flex flex-col space-y-2 px-2'>
        <p className='flex items-center justify-start gap-2 text-gray-700'><AccountCircleOutlinedIcon fontSize="medium" className='text-gray-500 ' />{serviceInfo.owner.firstname + " " + serviceInfo.owner.lastname}</p>
        <p className='flex items-center justify-start gap-2 text-gray-700'><EmailOutlinedIcon fontSize="medium" className='text-gray-500 ' />{serviceInfo.basicInformation.OwnerEmail}</p>
        <p className='flex items-center justify-start gap-2 text-gray-700'><CallOutlinedIcon fontSize="medium" className='text-gray-500 ' />+63{serviceInfo.basicInformation.OwnerContact}</p>
        </div>
        </div>
        {/* Business Information */}
        <div className=' p-1'>
          <h1 className='text-xl font-semibold mb-3'>Service Contact</h1>
          {/* Accounts and social media */}
          <div className='flex flex-col space-y-3'>
          <p className=' tracking-wide text-sm flex items-center gap-2'><FaPhone className='text-gray-500' fontSize={15} /> {serviceInfo.advanceInformation.ServiceFax == "" ? "N/A" : serviceInfo.advanceInformation.ServiceFax} | {serviceInfo.advanceInformation.ServiceContact}</p>
          <p className=' tracking-wide text-sm flex items-center gap-2'><FaRegEnvelope className='text-gray-500' fontSize={20} />{serviceInfo.advanceInformation.ServiceEmail}</p>
          <div className='flex space-x-3 items-center'>
          <FaYoutube onClick={() => { window.open(serviceInfo.advanceInformation.SocialLink[0].link, '_blank'); }}  className={`text-red-500 cursor-pointer ${serviceInfo.advanceInformation.SocialLink[0].link !== "" ? "block" : "hidden"}`} fontSize={30}  />
          <FaFacebook onClick={() => { window.open(serviceInfo.advanceInformation.SocialLink[1].link, '_blank'); }} className={`${serviceInfo.advanceInformation.SocialLink[1].link !== "" ? "block" : "hidden"} text-blue-500 cursor-pointer`} fontSize={30}   />
          <img onClick={() => { window.open(serviceInfo.advanceInformation.SocialLink[2].link, '_blank'); }} className={`${serviceInfo.advanceInformation.SocialLink[2].link !== "" ? "block" : "hidden"} w-7 h-7 cursor-pointer`} src={instagram} />
          </div>
          </div>
          {/* Information */}
          <h1 className='text-xl font-semibold mb-3 mt-3'>Service Information</h1>

          <p className='font-medium'>Service Options</p>
          <div className='flex my-2'>
            {
              serviceInfo.advanceInformation.ServiceOptions.map((options, index)=>(
                <p key={index} className='px-3 text-gray-700 bg-gray-50 border shadow-sm py-1 rounded-sm font-semibold mx-1 disabled cursor-text flex justify-center items-center gap-2 text-sm'>{options}</p>
              ))
            }
          
          </div>
          {/* Location */}
          <div className='flex flex-col  h-fit' style={{ position: 'relative' }}>
          <p className='text-start font-medium'>Location</p>
          <div className='flex items-center gap-2 text-gray-700 font-semibold'>
          {/* Address */}
          <FaMapLocation className='text-black' />
            <p onClick={()=>{window.open(`https://www.google.com/maps/dir/?api=1&destination=${serviceInfo.address.latitude},${serviceInfo.address.longitude}`, '_black')}} className=' cursor-pointer' >
            {serviceInfo.address.barangay.name + " " + serviceInfo.address.municipality.name + ", " + serviceInfo.address.province.name } 
            </p>
          </div>
          <div className=' h-[180px] w-[250px] relative cursor-pointer'>
          <APIProvider apiKey={key}>
          <Map draggable={true} onClick={()=>{window.open(`https://www.google.com/maps/dir/?api=1&destination=${serviceInfo.address.latitude},${serviceInfo.address.longitude}`, '_black')}} mapTypeControlOptions={false} mapTypeControl={false} streetViewControl={false} zoomControl={false}
          defaultCenter={ {lat: serviceInfo.address.latitude, lng:serviceInfo.address.longitude}} defaultZoom={15}>
          <Marker position={ {lat: serviceInfo.address.latitude, lng:serviceInfo.address.longitude}} />
          </Map>
          </APIProvider>
          </div>
        </div>
        </div>
        </div>

        </section>

          {/* Descriptions */}
        <section className='w-full mt-10 p-2'>
          {/* Main Container */}
          <div className='misc_container bg-white rounded-md overflow-hidden'>
          {/* Buttons container */}
          <div className=' flex'>
            {/* Description Button */}
            <div className='border border-r-0 rounded-ss-md'>
            <button onClick={()=>{setSelectedOptions("Description")}} className=' px-5  md:px-10 py-3 text-sm md:text-lg flex items-center justify-center gap-1'><DescriptionOutlinedIcon /> Description</button>
            <div id="descriptionBtn" className={`${selectedOptions == "Description" ? "active" : ""} slidingBorder`}></div>
            </div>
            {/* Reviews Button */}
            <div className='border border-r-0'>
            <button  onClick={()=>{setSelectedOptions("Reviews")}} className=' px-5  md:px-10 py-3 flex text-sm md:text-lg items-center justify-center gap-1'><ReviewsOutlinedIcon /> Reviews</button>
            <div id="reviewsBtn" className={`${selectedOptions == "Reviews" ? "active" : ""} slidingBorder`}></div>
            </div>
            {/* Service Button */}
            <div className='border border-r-0'>
            <button onClick={()=>{setSelectedOptions("Services")}} className=' px-5  md:px-10 py-3 flex text-sm md:text-lg items-center justify-center gap-1'><MiscellaneousServicesOutlinedIcon /> Services</button>
            <div id="serviceBtn" className={`${selectedOptions == "Services" ? "active" : ""} slidingBorder`}></div>
            </div>
            
            <button className='border w-full'></button>
          </div>
          {/* Description container */}
          <article className='w-full'>
          {selectedOptions == "Description" ? (<Description description={serviceInfo.basicInformation.Description} />) : selectedOptions == "Reviews" ? (<Reviews reviews={reviews} />) : (<ServiceOffers serviceOffers={serviceInfo.serviceOffers} />)}
          
          </article>
          </div>
        </section>
        
        {/* Schedule or business hours */}
        <section className='w-full   mt-10 p-2'>
          {/* Schedule container */}
        <article className='w-full mt-5'>
          <div className='misc_container py-2 px-5 bg-white rounded-md'>
          <h1 className='text-xl md:text-3xl font-semibold mt-4 mb-5'>Service Schedule</h1>
          <div className='grid semiXs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 py-1 w-full'>
          {
            serviceInfo?.serviceHour.map((sched, index)=>{
              const [hours, minutes] = sched.toTime.split(':');
              const [fromHours, fromMinutes] = sched.fromTime.split(':');
              const toDateTime = new Date(0, 0, 0, hours, minutes);
              const fromDateTime = new Date(0, 0, 0, fromHours, fromMinutes);
              const toTime = toDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const fromTime = fromDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              // console.table(holiday)
              return(

                <div key={index} className={`sched_container ${sched.day == currentDay ? "border-2 border-blue-500" : holiday.some((holidayDate) => holidayDate.date === dateToday+"00:00:00")
                ? "border-2 border-red-500" :  ""} w-full flex flex-col justify-center items-center py-9 rounded-md`}>
                <CalendarMonthOutlinedIcon />
                <h1 className='text-xl font-semibold'>{sched.day}</h1>
                {
                  sched.isOpen ? 
                  (
                    <div className='flex mt-2'>
                  
                    <div className='flex items-center space-x-1  px-2'><p className='text-[1rem] font-normal text-gray-700'>{fromTime}</p></div>
                    -
                    <div className='flex items-center space-x-1  px-2'><p className='text-[1rem] font-normal text-gray-700'>{toTime}</p></div>
                    </div>
                  )
                  :
                  (
                    <h1 className='text-red-500'>Closed</h1>
                  )
                }
               
                </div>
              )
            })
          }
          </div>
          </div>
          </article>
        </section>
        
        {/* Gallery */}
        <section className='w-full   mt-10 p-2'>
        <div className=' w-full max-h-[550px] bg-white rounded-lg h-[550px] border-2 px-6 relative'>
        <h1 className='text-4xl text-center font-semibold mt-0 bg-white p-4 sticky top-0 z-10'>Gallery</h1>
        <div className='galleryContainer bg-white mb-2 max-h-[460px] overflow-auto'>
        <ResponsiveGallery mediaClassName="hello" mediaStyle={{borderRadius : "5px"}} key={serviceInfo.galleryImages} onClick={(image)=>{handleImageClick(image)}}  mediaMaxWidth={{xxl: 100}} colsPadding={{xs:1,s:2,m:2,l:2, xl:2,xxl:2}} useLightBox={false} numOfMediaPerRow={{xs:2,s: 2,m:3, l: 3, xl:4 ,xxl : 4}} media={serviceInfo.galleryImages} />
        </div>
        <Lightbox
        index={selectedImageIndex}
        plugins={[Download,Fullscreen]}
        open={open}
        close={() => setOpen(false)}
        slides={serviceInfo.galleryImages}
      />
      </div>
      </section>
      
     
     </div>
      )
    }

    {
      serviceInfo == null ? ("") :
      (
        <footer className='w-full pb-10 bg-[#0E2F41] py-[1rem] sm:px-10 md:px-16 lg:px-36'>
        <Footer />
        </footer>
      )
    }
    <Modal
        isOpen={modalIsOpen}
        style={ModalStyle}
        contentLabel="Booking Modal"
      >
        <BookService handleCloseModal={handleCloseModal}  serviceId={serviceId} />
      </Modal>
    </div>

  )
}

export default ViewService