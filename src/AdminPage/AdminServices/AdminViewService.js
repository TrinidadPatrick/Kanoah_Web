import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import http from '../../http'
import AdminViewServicesFeaturePhotos from './AdminViewServicesFeaturePhotos';
import ServiceAndOwnerInformation from './ServiceAndOwnerInformation';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import MiscellaneousServicesOutlinedIcon from '@mui/icons-material/MiscellaneousServicesOutlined';
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined';
import AdminServiceDescription from './AdminServiceDescription';
import AdminServiceReviews from './AdminServiceReviews';
import AdminServiceServicesOffer from './AdminServiceServicesOffer';
import ResponsiveGallery from 'react-responsive-gallery';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Download from "yet-another-react-lightbox/plugins/download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import BlockIcon from "./Images/Block.png"

const AdminViewService = () => {
    const [service, setService] = useState(null)
    const [reviews, setReviews] = useState(null)
    const [windowWidth, setWindowWdith] = useState(null)
    const [windowHeight, setWindowHeight] = useState(null)
    const [selectedOptions, setSelectedOptions] = useState('Description')
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [open, setOpen] =useState(false);
    const {_id} = useParams()

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
        const getService = async () => {
            try {
                const result = await http.get(`Admin_ViewService/${_id}`, {withCredentials : true}) 
                setService(result.data.service)
                setReviews(result.data.ratings)
                } catch (error) {
                    console.log(error)
                }
        }
        if(_id)
        {
            getService()
        }
    },[])

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

    const handleImageClick = (imageSrc) => {
        const index = service.galleryImages.findIndex(image => image.src == imageSrc)
        setSelectedImageIndex(index);
        setOpen(true);
      };


  return (
    <main className='w-full h-full flex flex-col px-5 lg:px-20 '>

    {/* Popup for disabled service */}
    <div className={`w-fit rounded-sm h-fit bg-red-500 mx-auto ${service?.status.status === "Disabled" ? "flex" : "hidden"} mt-4 p-2 gap-2`}>
    <div>
    <div className=' w-full h-full flex items-center'>
      <img className='w-24 aspect-square brightness-0 invert-[1]' src={BlockIcon} alt="Block" />
    </div>
    </div>
    <div className='w-fit rounded-sm h-fit bg-red-500 mx-auto flex flex-col'>
    <h1 className='text-center font-medium text-white'>This service is currently disabled. Please see details below.</h1>
    <p className='font-normal text-gray-50'>Date Issued : {new Date(service?.status.dateDisabled).toLocaleDateString('EN-US', {
      month : 'long', day : '2-digit', year : 'numeric'
    })}</p>
    <p className='font-normal text-gray-50'>Reasons: </p>
    <div className='flex flex-wrap gap-2'>
    {
      service?.status?.reasons.map((reason, index)=>{
        return (
          <p key={index} className="text-gray-50 text-sm">{reason},</p>
        )
      })
    }
    </div>
    </div>
    </div>

    <nav className='w-full'>
    </nav>
    {
    service === null ? 
    <div className='w-full h-screen grid place-items-center'>
    <div className="spinner"></div>
    </div>
    :
    <>
    {/* // Top */}
    <section className='w-full h-fit flex flex-col xl:flex-row justify-between p-2 gap-1 mt-5'>
    {/* Left Part */}
    <div className='w-full shadow-sm bg-white xl:w-[60%] rounded-lg h-fit  flex flex-col p-2 space-y-3'>
    <div className='flex justify-between w-full mx-auto'>
    {/* Title and rating */}
    <div className=''>
    {/* Title */}
    <div className='flex justify-between'><span className='text-2xl md:text-3xl font-semibold'>{service.basicInformation.ServiceTitle}</span></div>
    {/* Ratings ********************************************************************/}

    <div className='flex  relative ml-0 space-x-1 justify-between items-center mt-5 w-full'>
    <div className='flex space-x-2'>
    <StyledRating className='relative left-[0.1rem]'  readOnly defaultValue={Number(service.ratings)} precision={0.1} icon={<StarRoundedIcon fontSize={windowWidth <= 450 ? "small" : "medium"} />  } emptyIcon={<StarRoundedIcon fontSize={windowWidth <= 450 ? "small" : "medium"} className='text-gray-300' />} />
    <div className='flex items-center space-x-2 '>
    <p className='text-gray-400 text-xs md:text-sm font-medium'>({service.ratings})</p> 
    <p className='text-gray-300'>|</p>
    <p className='text-gray-700 text-xs md:text-sm md:pt-[2.5px] font-medium'>{service.totalReviews} Reviews</p> 
    </div>
    </div>
    </div>
    </div>
    </div>

    {/* Featured Photos */}
    <div className='w-full'>
        <AdminViewServicesFeaturePhotos featuredImages={service.featuredImages} />
    </div>
    </div>

    {/* Right Part */}
    <div className='w-full xl:w-[450px] h-fit col-span-2 md:col-span-1 shadow-sm rounded-lg bg-white p-2 flex flex-col space-y-4'>
    {/* Service and Owner Information and contact */}
    <ServiceAndOwnerInformation service={service} />
    </div>
    </section>

    {/* // Description Services and Reviews */}
    <section className='w-full mt-10 p-2'>
    <div className='misc_container w-full bg-white rounded-md overflow-x-scroll'>
          {/* Buttons container */}
          <div className=' flex w-full'>
            {/* Description Button */}
            <div className='border border-r-0 border-l-0 rounded-ss-md'>
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
            
            <button className='border border-r-0 w-full'></button>
          </div>
          {/* Description container */}
          <article className='w-full '>
          {selectedOptions == "Description" ? (<AdminServiceDescription description={service.basicInformation.Description} />) : selectedOptions == "Reviews" ? (<AdminServiceReviews reviews={reviews} />) : (<AdminServiceServicesOffer serviceOffers={service.serviceOffers} />)}
          
          </article>
          </div>
    </section>

    {/* Gallery */}
    <section className='w-full   mt-10 p-2'>
        <div className=' w-full max-h-[550px] bg-white rounded-lg h-[550px] border-2 px-6 relative'>
        <h1 className='text-4xl text-center font-semibold mt-0 bg-white p-4 sticky top-0 z-10'>Gallery</h1>
        <div className='galleryContainer bg-white mb-2 max-h-[460px] overflow-auto'>
        <ResponsiveGallery mediaClassName="hello" mediaStyle={{borderRadius : "5px"}} key={service.galleryImages} onClick={(image)=>{handleImageClick(image)}}  mediaMaxWidth={{xxl: 100}} colsPadding={{xs:1,s:2,m:2,l:2, xl:2,xxl:2}} useLightBox={false} numOfMediaPerRow={{xs:2,s: 2,m:3, l: 3, xl:4 ,xxl : 4}} media={service.galleryImages} />
        </div>
        <Lightbox
        index={selectedImageIndex}
        plugins={[Download,Fullscreen]}
        open={open}
        close={() => setOpen(false)}
        slides={service.galleryImages}
      />
      </div>
      </section>
    </>
    }
    </main>
  )
}

export default AdminViewService