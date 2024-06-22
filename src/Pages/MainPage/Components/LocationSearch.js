import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import SearchIcon from '@mui/icons-material/Search';
import LocationSearchingOutlinedIcon from '@mui/icons-material/LocationSearchingOutlined';
import PlacesAutocomplete, {geocodeByAddress,getLatLng,} from 'react-places-autocomplete';
import NearMeRoundedIcon from '@mui/icons-material/NearMeRounded';
import axios from 'axios'

const LocationSearch = () => {
    const navigate = useNavigate()
    const [locationCoordinates, setLocationCoordinates] = useState({longitude : 0, latitude : 0})
    const [searchInput,setSearchInput] = useState('')
    const [placesSuggestion, setPlacesSuggestion] = useState([])
    const [locationFilter, setLocationFilter] = useState({address : '', longitude : 0, latitude : 0})
    const [loadInput, setLoadInput] = useState(false)

    const handleSelect = address => {
      setLocationFilter({address : address.place_name, longitude : address.center[0], latitude : address.center[1]})
      setPlacesSuggestion([])
    };

    const handleInputChange = async (value) => {
      setLocationFilter({...locationFilter, address : value})
      if (value.length > 2) {
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json`, {
            params: {
                access_token: process.env.REACT_APP_MAPBOX_TOKEN,
                autocomplete: true,
                limit: 5
            }
        });
        setPlacesSuggestion(response.data.features);
    } else {
        setPlacesSuggestion([]);
    }
    }


  return (
  <div className='mainSearchButton relative flex flex-col sm:flex-row rounded-4xl'>
    {/* Search Field */}

  <LocationSearchingOutlinedIcon fontSize='small' className='absolute text-white top-5 md:top-6 left-5' />
  <input onChange={(e)=>{setSearchInput(e.target.value)}} className='text-white font-light w-[65%] text-sm md:text-lg py-5 border-0 ps-[3rem] px-6 bg-themeBlue rounded-s-4xl outline-none ' onKeyDown={(e)=>{if(e.key === "Enter"){navigate(`explore?search=${searchInput}&longitude=${locationCoordinates.longitude}&latitude=${locationCoordinates.latitude}&rd=5&page=1`)}}} type="text" placeholder='Search for service' />
  <div className='w-1/2 relative'>
  <NearMeRoundedIcon fontSize='small' className='text-white absolute z-20 top-5 md:top-6 left-5' />
    <div className='w-full h-full  '>
      {
        placesSuggestion.length !== 0 &&
          <div className='absolute flex flex-col bg-white shadow rounded p-2 bottom-11 gap-0'>
          {
          placesSuggestion?.map((place, index)=>(
          <button key={index} onClick={()=>handleSelect(place)} className='text-xs hover:bg-gray-100 text-start py-2'>{place.place_name}</button>
          ))
          }
          </div>
      }
      <input value={locationFilter.address} placeholder='Enter location' className='w-full ps-14 text-white h-full bg-transparent' type='text' onChange={(e)=>handleInputChange(e.target.value)} />
    </div>
  </div>
  <button onClick={()=>{navigate(`exploreService?search=${searchInput}&longitude=${locationFilter.longitude}&latitude=${locationFilter.latitude}&rad=3&address=${locationFilter.address}`)}} className='absolute bg-white hidden sm:flex text-themeBlue px-2.5 lg:px-2.5 py-2.5 rounded-3xl top-[8px] md:top-[12px] lg:top-[11.6px] space-x-2 right-2 md:right-3'><SearchIcon /> </button>
  <button onClick={()=>{navigate(`exploreService?search=${searchInput}&longitude=${locationFilter.longitude}&latitude=${locationFilter.latitude}&rad=3&address=${locationFilter.address}`)}} className=' mx-2 mb-2 bg-white  justify-center font-medium sm:hidden text-themeBlue px-2.5 md:px-6 py-2.5 rounded-3xl  space-x-2 right-3 '>Search</button>
  </div>
  )
}

export default LocationSearch