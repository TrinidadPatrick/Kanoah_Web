import React from 'react'
import { useState } from 'react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import { FaFacebook, FaInstagram, FaMapLocation, FaPhone, FaRegEnvelope, FaSquareFacebook, FaYoutube } from 'react-icons/fa6';
import ReactMapGL, { GeolocateControl, Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';

const ServiceAndOwnerInformation = ({service}) => {
    const [location, setLocation] = useState({
        longitude : null,
        latitude : null
    })
      
    // For map location
    const [viewport, setViewPort] = useState({    
        width: "100%",
        height: "100%",
        zoom : 16
    })
  return (
            <>
            <div className='flex  bg-gray-100 p-2'>
            {/* Img container */}
            <div className='w-[100px] min-w-[100px]  flex justify-center items-center'>
            <img className='w-20 h-20 rounded-full object-cover' src={service.owner.profileImage} />
            </div>
            {/* Personal Information */}
            <div className=' w-full  p-1 flex flex-col space-y-2 px-2'>
            <p className='flex items-center justify-start gap-2 text-gray-700'><AccountCircleOutlinedIcon fontSize="medium" className='text-gray-500 ' />{service.owner.firstname + " " + service.owner.lastname}</p>
            <p className='flex items-center justify-start gap-2 text-gray-700'><EmailOutlinedIcon fontSize="medium" className='text-gray-500 ' />{service.basicInformation.OwnerEmail}</p>
            <p className='flex items-center justify-start gap-2 text-gray-700'><CallOutlinedIcon fontSize="medium" className='text-gray-500 ' />+63{service.basicInformation.OwnerContact}</p>
            </div>
            </div>
            
            <div className=' p-1'>
              <h1 className='text-xl font-semibold mb-3'>Service Contact</h1>
              {/* Accounts and social media */}
              <div className='flex flex-col space-y-3'>
              <p className=' tracking-wide text-sm flex items-center gap-2'><FaPhone className='text-gray-500' fontSize={15} /> {service.advanceInformation.ServiceFax == "" ? "N/A" : service.advanceInformation.ServiceFax} | {service.advanceInformation.ServiceContact}</p>
              <p className=' tracking-wide text-sm flex items-center gap-2'><FaRegEnvelope className='text-gray-500' fontSize={20} />{service.advanceInformation.ServiceEmail}</p>
              <div className='flex space-x-3 items-center'>
              <FaYoutube onClick={() => { window.open(service.advanceInformation.SocialLink[0].link, '_blank'); }}  className={`text-red-500 cursor-pointer ${service.advanceInformation.SocialLink[0].link !== "" ? "block" : "hidden"}`} fontSize={30}  />
              <FaFacebook onClick={() => { window.open(service.advanceInformation.SocialLink[1].link, '_blank'); }} className={`${service.advanceInformation.SocialLink[1].link !== "" ? "block" : "hidden"} text-blue-500 cursor-pointer`} fontSize={30}   />
              <FaInstagram onClick={() => { window.open(service.advanceInformation.SocialLink[2].link, '_blank'); }} className={`${service.advanceInformation.SocialLink[2].link !== "" ? "block" : "hidden"} w-7 h-7 cursor-pointer`}  />
              </div>
              </div>
              {/* Information */}
              <h1 className='text-xl font-semibold mb-3 mt-3'>Service Information</h1>
    
              <p className='font-medium'>Service Options</p>
              <div className='flex my-2'>
                {
                  service.advanceInformation.ServiceOptions.map((options, index)=>(
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
                <p onClick={()=>{window.open(`https://www.google.com/maps/dir/?api=1&destination=${service.address.latitude},${service.address.longitude}`, '_black')}} className=' cursor-pointer' >
                {service.address.barangay.name + " " + service.address.municipality.name + ", " + service.address.province.name } 
                </p>
              </div>
              <ReactMapGL
              onClick={()=>{window.open(`https://www.google.com/maps/dir/?api=1&destination=${service.address.latitude},${service.address.longitude}`, '_black')}}
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
                latitude={service.address.latitude}
                longitude={service.address.longitude}
                >
                <Marker
                latitude={service.address.latitude}
                longitude={service.address.longitude}
                draggable={false}
                onDrag={evt => setLocation({longitude : evt.lngLat.lng, latitude : evt.lngLat.lat})}
                >
            
                </Marker>
              </ReactMapGL>
            </div>
            </div>
            </>
  )
}

export default ServiceAndOwnerInformation