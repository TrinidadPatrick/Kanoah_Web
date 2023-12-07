import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios'

const LocationSearch = () => {
    const navigate = useNavigate()
    const [locationFilterValue, setLocationFilterValue] = useState('')
    const [locationCoordinates, setLocationCoordinates] = useState({longitude : 0, latitude : 0})
    const [searchInput,setSearchInput] = useState('')
    const [places, setPlaces] = useState([])

    useEffect(() => {
        const accessToken = 'pk.eyJ1IjoicGF0cmljazAyMSIsImEiOiJjbG8ydzQ2YzYwNWhvMmtyeTNwNDl3ejNvIn0.9n7wjqLZye4DtZcFneM3vw'; // Replace with your actual Mapbox access token
        const location = locationFilterValue; // Replace with your desired location
              
        axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${accessToken}`)
        .then((res) => {
        setPlaces(res.data.features) // Logging the response data
        
        })
        .catch((err) => {
        console.log(err);
        });
        }, [locationFilterValue]);


  return (
  <div className='p-1 relative flex '>
    {/* Search Field */}
  <input onChange={(e)=>{setSearchInput(e.target.value)}} className='text-black font-light w-[65%] text-md md:text-md py-5 px-6 bg-[#f0f0f0] rounded-s-4xl outline-none ' onKeyDown={(e)=>{if(e.key === "Enter"){navigate(`explore?search=${e.target.value}&longitude=${locationCoordinates.longitude}&latitude=${locationCoordinates.latitude}&rd=5`)}}} type="text" placeholder='Search for service' />
  <div className='w-1/2 '>
  <input onKeyDown={(e)=>{if(e.key === "Enter"){navigate(`explore?search=${searchInput}&longitude=${locationCoordinates.longitude}&latitude=${locationCoordinates.latitude}&rd=5`)}}} value={locationFilterValue} onChange={(e)=>{setLocationFilterValue(e.target.value)}} type='text' className='text-gray-700 w-full font-light text-md md:text-md py-5 px-6 bg-[#f0f0f0] border-s-1 rounded-e-4xl outline-none' placeholder='Your Location' />
  {/* Places dropdown */}
  <div id='placeDropdown' className={`${locationFilterValue != "" ? "absolute" : "hidden"} w-[300px] overflow-auto pt-3 flex flex-col space-y-4 justify-start h-[200px] bg-[#f0f0f0] absolute`}>
  {
    places.map((place)=>(
      <div key={place.id} className='flex items-center px-2 hover:bg-gray-200'>
      <FmdGoodOutlinedIcon fontSize='small text-gray-500 mr-1' />
      <button onClick={()=>{setLocationCoordinates({longitude : place.geometry.coordinates[0], latitude : place.geometry.coordinates[1]});setLocationFilterValue(place.place_name);document.getElementById('placeDropdown').classList.add('hidden')}} className='text-start  pe-5 py-3 overflow-hidden whitespace-nowrap text-ellipsis text-sm'>{place.place_name}</button>
      </div>
    ))
  }
  </div>
  </div>
  <button onClick={()=>{navigate(`explore?search=${searchInput}&longitude=${locationCoordinates.longitude}&latitude=${locationCoordinates.latitude}&rd=5`)}} className='absolute bg-themeBlue text-white px-2.5 md:px-6 py-2.5 rounded-3xl top-[12px] md:top-[14.3px] flex space-x-2 right-3 md:right-3'><SearchIcon /> <span className='hidden md:block'>Search</span></button>
  </div>
  )
}

export default LocationSearch