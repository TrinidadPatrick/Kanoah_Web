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
    const [locationFilterValue, setLocationFilterValue] = useState('')
    const [locationCoordinates, setLocationCoordinates] = useState({longitude : 0, latitude : 0})
    const [searchInput,setSearchInput] = useState('')
    const [places, setPlaces] = useState([])
    const [locationFilter, setLocationFilter] = useState({address : '', longitude : 0, latitude : 0})
    const [loadInput, setLoadInput] = useState(false)

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

    const handleChange = (addressValue) => {
      setLocationFilter({...locationFilter, address : addressValue});
    };

    const handleSelect = address => {
      // setLocationFilterValue(address)
      geocodeByAddress(address)
        .then(results => getLatLng(results[0]))
        .then(latLng => {setLocationFilter({address, longitude : latLng.lng, latitude : latLng.lat})})
        .catch(error => console.error('Error', error));
    };

    useEffect(()=>{
      setTimeout(()=>{
        setLoadInput(true)
      },500)
    },[])


  return (
  <div className='mainSearchButton relative flex flex-col sm:flex-row rounded-4xl'>
    {/* Search Field */}

  <LocationSearchingOutlinedIcon fontSize='small' className='absolute text-white top-5 md:top-6 left-5' />
  <input onChange={(e)=>{setSearchInput(e.target.value)}} className='text-white font-light w-[65%] text-sm md:text-lg py-5 border-0 ps-[3rem] px-6 bg-themeBlue rounded-s-4xl outline-none ' onKeyDown={(e)=>{if(e.key === "Enter"){navigate(`explore?search=${searchInput}&longitude=${locationCoordinates.longitude}&latitude=${locationCoordinates.latitude}&rd=5&page=1`)}}} type="text" placeholder='Search for service' />
  <div className='w-1/2 relative'>
  <NearMeRoundedIcon fontSize='small' className='text-white absolute z-20 top-5 md:top-6 left-5' />
  {
    loadInput &&
    <PlacesAutocomplete
            value={locationFilter.address} onChange={handleChange} onSelect={handleSelect}>
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div className='w-full '>
                    <input type='text' {...getInputProps({placeholder: 'Search Places ...', className : 'text-white shadow-none w-full font-light text-sm md:text-lg ps-[3rem] py-5 px-6 bg-themeBlue rounded-s-4xl sm:border-s-2 border-slate-800 rounded-e-4xl outline-none',})}/>
                <div className={`${suggestions.length !== 0 ? "" : "hidden"} bg-white absolute z-30 bottom-10 shadow-md rounded-md autocomplete-dropdown-container mt-1 origin-bottom h-fit overflow-auto`}>
                {suggestions.map((suggestion, index) => {
                return (
                <div className='bg-white' key={index} {...getSuggestionItemProps(suggestion)}>
                  <p className='py-1 px-2 text-sm cursor-pointer '>{suggestion.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
        </PlacesAutocomplete>
  }
  </div>
  <button onClick={()=>{navigate(`exploreService?search=${searchInput}&longitude=${locationFilter.longitude}&latitude=${locationFilter.latitude}&rad=3&address=${locationFilter.address}`)}} className='absolute bg-white hidden sm:flex text-themeBlue px-2.5 lg:px-2.5 py-2.5 rounded-3xl top-[8px] md:top-[12px] lg:top-[11.6px] space-x-2 right-2 md:right-3'><SearchIcon /> </button>
  <button onClick={()=>{navigate(`exploreService?search=${searchInput}&longitude=${locationFilter.longitude}&latitude=${locationFilter.latitude}&rad=3&address=${locationFilter.address}`)}} className=' mx-2 mb-2 bg-white  justify-center font-medium sm:hidden text-themeBlue px-2.5 md:px-6 py-2.5 rounded-3xl  space-x-2 right-3 '>Search</button>
  </div>
  )
}

export default LocationSearch