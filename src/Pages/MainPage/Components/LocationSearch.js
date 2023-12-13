import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import SearchIcon from '@mui/icons-material/Search';
import LocationSearchingOutlinedIcon from '@mui/icons-material/LocationSearchingOutlined';
import NearMeRoundedIcon from '@mui/icons-material/NearMeRounded';
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
  <div className='mainSearchButton relative flex flex-col sm:flex-row rounded-4xl'>
    {/* Search Field */}

  <LocationSearchingOutlinedIcon fontSize='small' className='absolute text-white top-5 md:top-6 left-5' />
  <input onChange={(e)=>{setSearchInput(e.target.value)}} className='text-white font-light w-[65%] text-sm md:text-lg py-5 ps-[3rem] px-6 bg-themeBlue rounded-s-4xl outline-none ' onKeyDown={(e)=>{if(e.key === "Enter"){navigate(`explore?search=${searchInput}&longitude=${locationCoordinates.longitude}&latitude=${locationCoordinates.latitude}&rd=5&page=1`)}}} type="text" placeholder='Search for service' />
  <div className='w-1/2 relative'>
  <NearMeRoundedIcon fontSize='small' className='text-white absolute top-5 md:top-6 left-5' />
  <input onKeyDown={(e)=>{if(e.key === "Enter"){navigate(`explore?search=${searchInput}&longitude=${locationCoordinates.longitude}&latitude=${locationCoordinates.latitude}&rd=5&page=1`)}}} value={locationFilterValue} onChange={(e)=>{setLocationFilterValue(e.target.value)}} type='text' className='text-white w-full font-light text-sm md:text-lg ps-[3rem] py-5 px-6 bg-themeBlue rounded-s-4xl sm:border-s-2 border-slate-800 rounded-e-4xl outline-none' placeholder='Your Location' />
  {/* Places dropdown */}
  <div id='placeDropdown' className={`${locationFilterValue != "" ? "absolute" : "hidden"} w-[300px] overflow-auto pt-3 flex flex-col space-y-4 justify-start h-[200px] bg-themeBlue absolute`}>
  {
    places.map((place)=>(
      <div key={place.id} className='flex items-center px-2 hover:bg-gray-200'>
      <FmdGoodOutlinedIcon fontSize='small text-gray-500 mr-1' />
      <button onClick={()=>{setLocationCoordinates({longitude : place.geometry.coordinates[0], latitude : place.geometry.coordinates[1]});setLocationFilterValue(place.place_name);document.getElementById('placeDropdown').classList.add('hidden')}} className='text-start  pe-5 py-3 text-white overflow-hidden whitespace-nowrap text-ellipsis text-sm'>{place.place_name}</button>
      </div>
    ))
  }
  </div>
  </div>
  <button onClick={()=>{navigate(`explore?search=${searchInput}&longitude=${locationCoordinates.longitude}&latitude=${locationCoordinates.latitude}&rd=5`)}} className='absolute bg-white hidden sm:flex text-themeBlue px-2.5 lg:px-6 py-2.5 rounded-3xl top-[8px] md:top-[12px] lg:top-[11.6px] space-x-2 right-2 md:right-3'><SearchIcon /> <span className='hidden lg:block'>Search</span></button>
  <button onClick={()=>{navigate(`explore?search=${searchInput}&longitude=${locationCoordinates.longitude}&latitude=${locationCoordinates.latitude}&rd=5`)}} className=' mx-2 mb-2 bg-white  justify-center font-medium sm:hidden text-themeBlue px-2.5 md:px-6 py-2.5 rounded-3xl  space-x-2 right-3 '>Search</button>
  </div>
  )
}

export default LocationSearch