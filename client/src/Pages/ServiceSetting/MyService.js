import React from 'react'
import { useState, useEffect } from 'react';
import pic3 from '../ViewService/img/pic3.avif'
import FeaturedPhotos from './FeaturedPhotos';
import Gallery from './Gallery';
import { useDispatch, useSelector } from 'react-redux';
import { setUserId, selectUserId } from '../../ReduxTK/userSlice';
import { useNavigate } from 'react-router-dom'
import http from '../../http';


const MyService = () => {
  const [serviceInformation, setServiceInformation] = useState(null)
  const [selectedFolder, setSelectedFolder] = useState("Gallery")
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  
  const getService = async () => {
    http.get(`getService/${userId}`).then((res)=>{
        setServiceInformation(res.data.response)
    }).catch((err)=>{
        console.log(err)
    })
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
    <div className='w-full h-screen bg-white pt-24 px-10'>
    {/* Top Layer */}
    {
        serviceInformation == null ? ("") :
        (
    <>
    <section className='flex space-x-5 '>

    <div className='w-[250px] h-[170px] rounded-lg border-2 overflow-hidden object-cover'>
    <img className='w-full h-full object-cover' src={pic3} alt="service profile" />
    </div>
    {/* Informations */}
    <div>
    {/* Service Title and buttons */}
    <div className='h-full flex flex-col'>
    <div className='flex flex-col justify-start space-y-3 h-full'>
    <h1 className='text-4xl font-semibold text-themeBlue'>{serviceInformation.basicInformation.ServiceTitle}</h1>
    <h2 className='text-gray-600 text-lg font-semibold'>{serviceInformation.basicInformation.OwnerEmail}</h2>
    <h2 className='text-gray-600 text-sm font-semibold'>+63{serviceInformation.basicInformation.OwnerContact}</h2>
    </div>
    {/* Buttons */}
    <div className='space-x-3 relative justify-self-end'>
    <button className='px-4 w-fit py-2 rounded-3xl bg-gray-300 text-gray-600 text-sm'>Edit Service</button>
    <button className='px-4 w-fit py-2 rounded-3xl bg-gray-300 text-gray-600 text-sm'>View Service</button>
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