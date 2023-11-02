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
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import MiscellaneousServicesOutlinedIcon from '@mui/icons-material/MiscellaneousServicesOutlined';
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined';
import FacebookIcon from '@mui/icons-material/Facebook';
import ImageGallery from "react-image-gallery";
import 'react-image-gallery/styles/css/image-gallery.css'
import { useState, useEffect, useCallback, useRef } from 'react';
import 'react-gallery-carousel/dist/index.css';
import { FaInstagram, FaMapLocation, FaPhone, FaRegEnvelope, FaSquareFacebook } from 'react-icons/fa6';
import ReactMapGL, { GeolocateControl, Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { Link } from 'react-router-dom';
import axios from 'axios';


const ViewService = () => {
  const [description, setDescription] = useState(null)
  const [location, setLocation] = useState({
    longitude : null,
    latitude : null
  })

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

  // convert long lat to place name
  const getPlaceNameFromLatLng = async () => {
    // Construct the MapQuest Geocoding API URL for reverse geocoding
    const geocodingUrl = `http://www.mapquestapi.com/geocoding/v1/reverse?key=znl7fsvPy4mHHjWLGW6ULUo6bOzXgwFz&location=${location.latitude},${location.longitude}`;
  
    // Make an HTTP GET request to the API
    await fetch(geocodingUrl)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results[0] && data.results[0].locations) {
          const location = data.results[0].locations[0];
          const street = location.adminArea6
          const city = location.adminArea5
          const province = location.adminArea4
          console.log(street + " " + city + ", " + province);
        } else {
          console.error('Geocoding failed. Check the API response.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  // convert long lat to place name
  useEffect(()=>{
    if(location.longitude == null && location.latitude == null){
      
    }else{
      getPlaceNameFromLatLng()
    }
    
  },[location])

  
  return (
    <div className='w-full h-full bg-[#f7f7f7] md:px-12 lg:px-20 xl:px-32 pb-10 pt-20 flex flex-col'>
        {/* Top Layer *******************************************************************/}
        <section className='w-full  h-fit flex flex-col xl:flex-row justify-between p-2 gap-1 mt-5' >

        {/* Left Side ********************************************************************/}
        <div className='w-full bg-white shadow-sm xl:w-[60%] rounded-lg h-fit  flex flex-col p-2 space-y-3'>
        {/* Header ********************************************************************/}
        <div className='flex justify-between w-full mx-auto'>
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
        <div className='w-full h-[fit]  flex items-center justify-center '>
        <div className='w-full relative z-10'>
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
        <div className='w-full xl:w-[450px] h-fit col-span-2 md:col-span-1 shadow-sm rounded-lg bg-white p-2 flex flex-col space-y-4'>
        {/* Header */}
        <div className='flex  bg-gray-100 p-2'>
        {/* Img container */}
        <div className='w-[100px] min-w-[100px]  flex justify-center items-center'>
        <img className='w-20 h-20 rounded-full object-cover' src={profile} />
        </div>
        {/* Personal Information */}
        <div className=' w-full  p-1 flex flex-col space-y-2 px-2'>
        <p className='flex items-center justify-start gap-2 text-gray-700'><AccountCircleOutlinedIcon fontSize="medium" className='text-gray-500 ' />John Patrick C. Trinidad</p>
        <p className='flex items-center justify-start gap-2 text-gray-700'><EmailOutlinedIcon fontSize="medium" className='text-gray-500 ' />Ptrinidad765@gmail.com</p>
        <p className='flex items-center justify-start gap-2 text-gray-700'><CallOutlinedIcon fontSize="medium" className='text-gray-500 ' />+63 991 413 8519</p>
        </div>
        </div>
        {/* Business Information */}
        <div className=' p-1'>
          <h1 className='text-xl font-semibold mb-3'>Service Contact</h1>
          {/* Accounts and social media */}
          <div className='flex flex-col space-y-3'>
          <p className=' tracking-wide text-sm flex items-center gap-2'><FaPhone className='text-gray-500' fontSize={15} /> 555-3327/09673143709</p>
          <p className=' tracking-wide text-sm flex items-center gap-2'><FaRegEnvelope className='text-gray-500' fontSize={20} /> KanoahSF@gmail.com</p>
          <p className=' tracking-wide text-sm flex items-center gap-2 text-blue-500 underline'><FaSquareFacebook className='text-gray-500' fontSize={20}  /> www.facebook.com/34124/asq3e</p>
          <p className=' tracking-wide text-sm flex items-center gap-2 text-blue-500 underline'><FaInstagram className='text-gray-500' fontSize={20}   /> www.instagram.com/341/asghtrq3e</p>
          </div>
          {/* Information */}
          <h1 className='text-xl font-semibold mb-3 mt-3'>Service Information</h1>
          {/* Payment methods */}
          <p className='font-medium'>Payment methods</p>
          <div className='flex mt-2 mb-2'>
          <p className='w-20 text-gray-700 bg-gray-50 border shadow-sm py-1 rounded-sm font-semibold mx-1 disabled cursor-text flex justify-center items-center gap-2 text-sm'>Paypal</p>
          <p className='w-20 text-gray-700 bg-gray-50 border shadow-sm py-1 rounded-sm font-semibold mx-1 disabled cursor-text flex justify-center items-center gap-2 text-sm'>Gcash</p>
          <p className='w-20 text-gray-700 bg-gray-50 border shadow-sm py-1 rounded-sm font-semibold mx-1 disabled cursor-text flex justify-center items-center gap-2 text-sm'>Cash</p>
          </div>

          <p className='font-medium'>Service Options</p>
          <div className='flex my-2'>
          <p className='w-32 text-gray-700 bg-gray-50 border shadow-sm py-1 rounded-sm font-semibold mx-1 disabled cursor-text flex justify-center items-center gap-2 text-sm'>Home Service</p>
          <p className='w-20 text-gray-700 bg-gray-50 border shadow-sm py-1 rounded-sm font-semibold mx-1 disabled cursor-text flex justify-center items-center gap-2 text-sm'>Walk in</p>
          </div>
          {/* Location */}
          <div className='flex flex-col  h-fit' style={{ position: 'relative' }}>
          <p className='text-start font-medium'>Location</p>
          <div className='flex items-center gap-2 text-gray-700 font-semibold'>
          <FaMapLocation className='text-black' />
            <a className=' cursor-pointer' onClick={()=>{window.open(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`, '_black');}}>B. Leviste Street Poblacion Malvar Batangas</a>
          </div>
          <ReactMapGL
          onClick={()=>{window.open(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`, '_black')}}
            draggable={false}
            onMove={evt => setViewPort(evt.viewport)}
            mapboxAccessToken="pk.eyJ1IjoicGF0cmljazAyMSIsImEiOiJjbG8ybWJhb2MwMmR4MnFyeWRjMWtuZDVwIn0.mJug0iHxD8aq8ZdT29B-fg"
            mapStyle="mapbox://styles/patrick021/clo2m5s7f006a01rf9mtv318u"
            style={{
              width: "250px",
              height: "150px",
              // position: "relative",
              borderRadius: "10px",
              marginBottom: "7px",
              top: "10px", // Use top instead of marginTop
              transition: "width 0.5s, height 0.5s, top 0.5s",
            }}
            {...viewport}
            latitude={location.latitude}
            longitude={location.longitude}
            >
            <Marker
            latitude={location.latitude}
            longitude={location.longitude}
            draggable={false}
            onDrag={evt => setLocation({longitude : evt.lngLat.lng, latitude : evt.lngLat.lat})}
            >
        
            </Marker>
            <GeolocateControl />
          </ReactMapGL>
        </div>
        </div>
        </div>

        </section>

        {/* Description reviews and services */}
        <section className='w-full border-2 border-black mt-10 p-2'>
          {/* Main Container */}
          <div className='misc_container'>
          {/* Buttons container */}
          <div className=' flex'>
            <button className='border border-r-0 border-b-[3px] border-b-themeOrange w-40 py-3 flex items-center justify-center gap-1'><DescriptionOutlinedIcon /> Description</button>
            <button className='border border-r-0 w-40 py-3 flex items-center justify-center gap-1'><ReviewsOutlinedIcon /> Reviews</button>
            <button className='border w-40 py-3 flex items-center justify-center gap-1'><MiscellaneousServicesOutlinedIcon /> Services</button>
          </div>
          {/* Description container */}
          <article className='w-full p-2'>
          <h1 className='text-3xl font-semibold mt-4'>Description</h1>
          {/* Description box */}
          <div>
            {/* <p>Revitalize Your Vehicle with Our Premium Carwash Service

Is your car in need of some serious TLC? Look no further! Our carwash service is your one-stop destination for a complete automotive transformation. We take pride in delivering the most comprehensive and professional car cleaning experience available.

Why Choose Our Carwash Service:

1. Unparalleled Quality:

We set the industry standard for superior car cleaning. Your vehicle deserves the best, and that's exactly what we offer.
2. Expert Team:

Our skilled team of automotive enthusiasts knows every inch of your car. We handle your vehicle with the utmost care and attention.
3. State-of-the-Art Equipment:

We invest in cutting-edge equipment and technology to ensure an impeccable finish, from the exterior to the interior.
4. Environmentally Conscious:

We care about the planet. Our eco-friendly products and practices help reduce our carbon footprint while keeping your car pristine.
Our Comprehensive Carwash Services:

1. Exterior Bliss:

Witness the magic of our high-pressure wash, removing dirt and grime with ease. Our meticulous hand-drying process ensures a spotless shine.
2. Interior Elegance:

Step into a clean and fresh interior. We vacuum, shampoo, and sanitize, leaving no corner untouched. Say goodbye to those stubborn stains!
3. Paint Protection:

Our wax and sealant application safeguards your car's finish from the elements, preserving that showroom-worthy shine.
4. Attention to Detail:

We love your car as much as you do. Our team takes pride in the little things, like tire dressing, wheel cleaning, and window perfection.
5. Tailored Packages:

We offer a variety of packages to suit your car's unique needs. From a quick refresh to a complete rejuvenation, there's an option for everyone.
Convenience Is Our Promise:

Don't waste time waiting in long lines. Our efficient service ensures you get back on the road in no time. While you relax, we work our magic on your vehicle.

A Clean Car, A Happy You:

We understand that your car isn't just a machine; it's a part of your life. Our carwash service ensures your vehicle is not only spotless but also a source of pride.

Visit Us Today:

Experience the ultimate car cleaning service. Trust us to give your vehicle the care and attention it deserves. Your car will thank you.

Address: [Insert Address]
Phone: [Insert Phone Number]

Rediscover the joy of driving with a car that's as clean as the day you bought it. Book your appointment with us today and let us bring your vehicle back to life.

Feel free to customize and adapt this long description to fit the specific details and offerings of your carwash service. Your description should emphasize the quality, care, and attention to detail your service provides, and the benefits of choosing your carwash over others.






            </p> */}
            <div>
     
      </div>
          </div>
          </article>
          </div>
        </section>
    </div>
  )
}

export default ViewService