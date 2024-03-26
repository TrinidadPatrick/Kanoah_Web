import React from 'react'
import { useState, useEffect, useCallback } from 'react';
import pic3 from '../ViewService/img/pic3.avif'
import FeaturedPhotos from './FeaturedPhotos';
import Gallery from './Gallery';
import { useDispatch, useSelector } from 'react-redux';
import UseInfo from '../../ClientCustomHook/UseInfo';
import { Link, useNavigate } from 'react-router-dom'
import cloudinaryCore from '../../CloudinaryConfig';
import axios from 'axios';
import http from '../../http';
import Cropper from 'react-easy-crop'
import Modal from 'react-modal';
import getCroppedImg from './ForCropping/CreateImage';
import emptyImages from '../../Utilities/emptyImage.jpg'


const MyService = () => {
  Modal.setAppElement('#root');
  const [modalIsOpen, setIsOpen] = useState(false);
  const {authenticated, userInformation} = UseInfo()
  const [serviceInformation, setServiceInformation] = useState(null)
  const [image, setImage] = useState("")
  const [selectedFolder, setSelectedFolder] = useState("Gallery")
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const ModalStyle = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding : "0"
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Change the color and opacity as needed
      zIndex: 998,
    },
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels
      );
      handleProfileChange(croppedImage)
      setIsOpen(false)
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, image]);

  
  const getService = async () => {
    http.get(`getService/${userInformation._id}`, {
      withCredentials : true
    }).then((res)=>{
        setServiceInformation(res.data.result)
    }).catch((err)=>{
        console.log(err)
    })
  }

  const cropImage = (files) => {
    const file = files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setImage(reader.result);
        setIsOpen(true)
      };

      reader.readAsDataURL(file);
    }
  }

  // Update profile image
  const handleProfileChange = async (croppedImage) => {
    // const file = files[0]

    const upload = async (formData) => {
      await axios.post(`https://api.cloudinary.com/v1_1/${cloudinaryCore.config().cloud_name}/image/upload`, formData).then((res)=>{
        setImage(res.data.secure_url)
        http.post("updateProfilePicture", {userId : userInformation._id, profile : res.data.secure_url}).then((res)=>{
          getService()
        }).catch((err)=>{
          console.log(err)
        })
      }).catch((err)=>{
          console.log(err)
      }).finally(()=>{
        setUploading(false)
      })
    }

    if(croppedImage){
      setUploading(true)

      fetch(croppedImage)
      .then(response => response.blob())
      .then(blobData => {
        const formData = new FormData();
        formData.append('file', blobData, 'filename.jpg');
        formData.append('upload_preset', 'KanoahProfileUpload');
        upload(formData)
      })


      
  }
  }

  useEffect(()=>{
    if(authenticated)
    {
      getService()
    }
    else if (authenticated === false)
    {
      navigate("/")
    }
    
  },[authenticated])




  return (
    <div className='w-full h-full overflow-auto flex flex-col bg-white pb-2 pt-6 px-10'>
    {/* Top Layer */}
    {
        serviceInformation == null ? (
          <div className='w-full h-screen grid place-items-center'>
            <div className="spinner"></div>
            </div>
        ) :
        (
    <>
    <section className='flex space-x-5 h-fit '>
    {/* Profile Picture */}
    <div className=' relative group hover:brightness-50 cursor-pointer h-fit rounded-lg border-2 overflow-hidden'>
    <div className={`loaderImage ${uploading ? "block" : "hidden"} absolute top-[40%] left-[42%]  `}></div>
    <label htmlFor="fileInput" className='cursor-pointer'>
      {
        serviceInformation.serviceProfileImage === null ? 
        <img id='profile' className='h-[70px] semiXs:h-[100px] md:h-[120px] aspect-video object-cover ' src={emptyImages} alt="service profile" />
        :
        <img id='profile' className='h-[70px] semiXs:h-[100px] md:h-[120px] aspect-video object-cover ' src={serviceInformation.serviceProfileImage} alt="service profile" />

      }
    </label>
    
    <input onChange={(e)=>{cropImage(e.target.files)}} type="file" id="fileInput" className='hidden'/>
    </div>
    {/* Informations */}
    <div>
    {/* Service Title and buttons */}
    <div className='h-full flex flex-col'>
    <div className='flex flex-col justify-start space-y-1 h-full'>
    <h1 className='text-[1rem] semiSm:text-[1.2rem] sm:text-2xl lg:text-2xl font-semibold text-themeBlue'>{serviceInformation.basicInformation.ServiceTitle}</h1>
    <h2 className='text-gray-600 text-semiXs md:text-sm font-semibold'>{serviceInformation.basicInformation.OwnerEmail}</h2>
    <h2 className='text-gray-600 hidden semiXs:block text-semiXs md:text-sm font-semibold'>+63{serviceInformation.basicInformation.OwnerContact}</h2>
    </div>
    {/* Buttons */}
    <div className='space-x-3 flex relative justify-self-end mt-2'>
    <Link to={`/myService/editService/basicInformation`} className='px-2 md:px-3 w-fit h-fit py-1 md:py-1.5 rounded-sm hover:bg-gray-200 whitespace-nowrap bg-gray-300 text-gray-600 text-[0.5rem] semiXs:text-[0.7rem] md:text-semiSm'>Edit Service</Link>
    <button className='px-2 md:px-3 w-fit h-fit py-1 md:py-1.5 rounded-sm bg-themeOrange text-white text-[0.5rem] semiXs:text-[0.7rem] hover:bg-blue-300  whitespace-nowrap md:text-semiSm'>View Service</button>
    </div>
    </div>
    {/* End of Information */}
    </div> 
    </section>

    {/* Gallery and Featured Photos */}
    <section className='h-full w-full max-h-full overflow-auto flex flex-col'>
    {/* Top Part */}
    <header className='text-start mb-3 w-full border-b-2 mt-5'>
    <button className={`px-3 text-semiSm semiSm:text-base py-1 font-medium text-gray-600 ${selectedFolder == "Gallery" ? "border-b-2 border-themeOrange" : ""} `} onClick={()=>{setSelectedFolder("Gallery")}}>Gallery</button>
    <button className={`px-3 text-semiSm semiSm:text-base py-1 font-medium text-gray-600 ${selectedFolder == "Featured" ? "border-b-2 border-themeOrange" : ""} `} onClick={()=>{setSelectedFolder("Featured")}}>Featured Photos</button>
    </header>
    {selectedFolder == "Gallery" ? (<Gallery value={{id : serviceInformation._id, galleryImages : serviceInformation.galleryImages}} />) : (<FeaturedPhotos value={{id : serviceInformation._id, featuredImages : serviceInformation.featuredImages}} />)}
    </section>
    </>
        )
    }
    <Modal isOpen={modalIsOpen} style={ModalStyle} contentLabel="Cropper Modal">
  <div className='w-[500px] h-[500px] flex flex-col relative'>
    <div className=''>
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={16 / 9}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
      />
    </div>
    <div className='text-center absolute py-1 bottom-0 bg-themeBlue text-white mx-2 mb-2 rounded-sm left-0 right-0'>
      <button onClick={()=>showCroppedImage()} className='py-1 px-2'>Upload</button>
    </div>
  </div>
  
    </Modal>

    
    </div>
  )
}

export default MyService