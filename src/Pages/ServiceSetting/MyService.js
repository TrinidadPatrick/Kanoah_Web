import React from 'react'
import { useState, useEffect } from 'react';
import pic3 from '../ViewService/img/pic3.avif'
import FeaturedPhotos from './FeaturedPhotos';
import Gallery from './Gallery';
import { useDispatch, useSelector } from 'react-redux';
import { setUserId, selectUserId } from '../../ReduxTK/userSlice';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { Link, useNavigate } from 'react-router-dom'
import cloudinaryCore from '../../CloudinaryConfig';
import axios from 'axios';
import http from '../../http';


const MyService = () => {
  const [serviceInformation, setServiceInformation] = useState(null)
  const [selectedFolder, setSelectedFolder] = useState("Gallery")
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  
  const getService = async () => {
    http.get(`getService/${userId}`, {
      withCredentials : true
    }).then((res)=>{
        setServiceInformation(res.data.result)
    }).catch((err)=>{
        console.log(err)
    })
  }

  // Update profile image
  const handleProfileChange = async (files) => {
    const file = files[0]

    if(file){
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'KanoahProfileUpload');

      await axios.post(`https://api.cloudinary.com/v1_1/${cloudinaryCore.config().cloud_name}/image/upload`, formData).then((res)=>{
        http.post("updateProfilePicture", {userId, profile : res.data.secure_url}).then((res)=>{
          console.log(res)
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
  }

  useEffect(()=>{
    const accessToken = localStorage.getItem("accessToken")
    if(accessToken == null)
    {
    console.log("Not Logged IN")
    }
    else
    {
    getService()
    }
  },[userId])

  return (
    <div className='w-full h-full bg-white  px-10'>
    {/* Top Layer */}
    {
        serviceInformation == null ? (
          <div className='w-full h-screen grid place-items-center'>
            <div className="spinner"></div>
            </div>
        ) :
        (
    <>
    <section className='flex space-x-5 '>
    {/* Profile Picture */}
    <div className='w-[200px] md:w-[250px] md:h-[170px] relative group hover:brightness-50 cursor-pointer rounded-lg border-2 overflow-hidden object-cover'>
    <div className='absolute hidden group-hover:block cursor-pointer text-white top-[40%] left-[43%]'>
    <div className={`loaderImage ${uploading ? "block" : "hidden"} `}></div>
    {/* <CameraAltOutlinedIcon fontSize='large' className={`${uploading ? "hidden" : 'hidden'}`} /> */}
    </div>
    <label htmlFor="fileInput" className='cursor-pointer'>
        <img id='profile' className='w-full h-full object-cover ' src={serviceInformation.serviceProfileImage == null ? "" : serviceInformation.serviceProfileImage} alt="service profile" />
    </label>
    
    <input onChange={(e)=>{handleProfileChange(e.target.files)}} type="file" id="fileInput" className='hidden'/>
</div>
    {/* Informations */}
    <div>
    {/* Service Title and buttons */}
    <div className='h-full flex flex-col'>
    <div className='flex flex-col justify-start space-y-3 h-full'>
    <h1 className='text-[1rem] semiSm:text-[1.2rem] sm:text-2xl lg:text-4xl font-semibold text-themeBlue'>{serviceInformation.basicInformation.ServiceTitle}</h1>
    <h2 className='text-gray-600 text-semiXs md:text-sm font-semibold'>{serviceInformation.basicInformation.OwnerEmail}</h2>
    <h2 className='text-gray-600 text-semiXs md:text-sm font-semibold'>+63{serviceInformation.basicInformation.OwnerContact}</h2>
    </div>
    {/* Buttons */}
    <div className='space-x-3 flex relative justify-self-end mt-2'>
    <Link to={`/myService/editService/basicInformation`} className='px-2 md:px-4 w-fit h-fit py-1 md:py-2 rounded-md hover:bg-gray-200 whitespace-nowrap bg-gray-300 text-gray-600 text-[0.5rem] semiXs:text-[0.7rem] md:text-sm'>Edit Service</Link>
    <button className='px-2 md:px-4 w-fit h-fit py-1 md:py-2 rounded-md bg-gray-300 text-gray-600 text-[0.5rem] semiXs:text-[0.7rem] hover:bg-gray-200  whitespace-nowrap md:text-sm'>View Service</button>
    </div>
    </div>
    {/* End of Information */}
    </div> 
    </section>

    {/* Gallery and Featured Photos */}
    <section>
    {/* Top Part */}
    <header className='text-start mb-3 w-full border-b-2 mt-5'>
    <button className={`px-3 py-1 font-medium text-gray-600 ${selectedFolder == "Gallery" ? "border-b-2 border-stone-600" : ""} `} onClick={()=>{setSelectedFolder("Gallery")}}>Gallery</button>
    <button className={`px-3 py-1 font-medium text-gray-600 ${selectedFolder == "Featured" ? "border-b-2 border-stone-600" : ""} `} onClick={()=>{setSelectedFolder("Featured")}}>Featured Photos</button>
    </header>
    {selectedFolder == "Gallery" ? (<Gallery value={{id : serviceInformation._id, galleryImages : serviceInformation.galleryImages}} />) : (<FeaturedPhotos value={{id : serviceInformation._id, galleryImages : serviceInformation.galleryImages}} />)}
    
    </section>
    </>
        )
    }
    
    </div>
  )
}

export default MyService