import React from 'react'
import ImageGallery from "react-image-gallery";
import 'react-image-gallery/styles/css/image-gallery.css'
import NoImage from "./Images/NoImage.png"

const AdminViewServicesFeaturePhotos = ({featuredImages}) => {
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

  return (
    <div className='w-full h-[fit] flex items-center justify-center '>
    {
      featuredImages.length === 0
      ?
    <div className='w-full h-[520px] bg-white flex flex-col justify-center items-center'>
    <img src={NoImage} className='w-28 h-28' />
    <div className='mt-5 flex flex-col justify-center'>
      <p className='text-2xl font-bold text-gray-600'>Looks like there are no images here.</p>
    </div>
    </div>
    :
    <div className={ ` w-full rounded-md overflow-hidden relative z-10 `}>
      <ImageGallery 
      autoPlay={true} 
      slideDuration={500} 
      slideInterval={6000} 
      showFullscreenButton={false} 
      showPlayButton={false} 
      renderItem={(item) => <CustomSlide item={item} />}
      items={generatedFeaturedImages(featuredImages)}
      />
    </div>
    }
    
    </div>
  )
}

export default AdminViewServicesFeaturePhotos