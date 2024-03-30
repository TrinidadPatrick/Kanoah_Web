import React from 'react'
import { useState,useEffect, useContext } from 'react';
import phil from 'phil-reg-prov-mun-brgy';
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import 'mapbox-gl/dist/mapbox-gl.css';
import http from '../../../http';

const Address = ({serviceInformation}) => {
const [updating, setUpdating] = useState(false)
const [loading, setLoading] = useState(true)
const [street, setStreet] = useState('')
const [address, setAddress] = useState({})
const [placeName, setPlaceName] = useState('')
const [location, setLocation] = useState({
        longitude : 122.5320,
        latitude : 13.4124
})
const [locCodesSelected, setLocCodesSelected] = useState([
        ['', '-1'], //Region
        ['','-1'], //Province
        ['','-1'], //Municipality
        ['','-1'] //Barangay
])

// For errors
const [errors, setErrors] = useState({
  RegionError : false,
  ProvinceError : false,
  CityError : false,
  BarangayError : false,

})

const [center, setCenter] = useState({ lat:  location.latitude, lng:  location.longitude});
const [value, setValue] = useState(null);
const position = {lat: location.latitude, lng: location.longitude};
const key = process.env.REACT_APP_MAP_API_KEY
// Handles the location seleced by the user
const handleLocationSelect = (value, index, optionChanges) => {
  const newData = [...locCodesSelected]
  switch (optionChanges) {
      case 'region':
      
        setLocCodesSelected([
          [value[0], value[1]],
          ['', '-1'], // Province
          ['', '-1'], // Municipality
          ['', '-1']  // Barangay
        ]);
        break;
      
      case 'province':

          setLocCodesSelected([
              [newData[0][0], newData[0][1]],
              [value[0], value[1]], // Province
              ['', '-1'], // Municipality
              ['', '-1']  // Barangay
          ]);
          break;
      
      case 'city':

      setLocCodesSelected([
          [newData[0][0], newData[0][1]],
          [newData[1][0], newData[1][1]], // Province
          [value[0], value[1]], // Municipality
          ['', '-1']  // Barangay
      ]);
      break;

      case 'barangay':

      setLocCodesSelected([
          [newData[0][0], newData[0][1]],
          [newData[1][0], newData[1][1]], // Province
          [newData[2][0], newData[2][1]], // Municipality
          [value[0], value[1]]  // Barangay
      ]);
      break;
    }
    
}

// Submits the selected address
const handleUpdate = async () => {
        
    const address = {
            region : {name : locCodesSelected[0][0], reg_code : locCodesSelected[0][1]},
            province :  {name : locCodesSelected[1][0], prov_code : locCodesSelected[1][1]},
            municipality : {name : locCodesSelected[2][0], mun_code : locCodesSelected[2][1]},
            barangay : {name : locCodesSelected[3][0], brgy_code : locCodesSelected[3][1]},
            street : street,
            longitude : location.longitude,
            latitude : location.latitude
    }

    const checkError = (input, errorKey) => (
      setErrors((prevErrors)=>({...prevErrors, [errorKey] : address[input] == "" ? true : false}))
    )

    checkError("region", "RegionError")
    checkError("province", "ProvinceError")
    checkError("municipality", "CityError")
    checkError("barangay", "BarangayError")

    // setFullAddress(address)
    if(address.region != "" && address.province != "" && address.municipality != "" && address.barangay != "")
    {
      setUpdating(true)
      try {
        const result = await http.patch(`updateService/${serviceInformation.userId}`, {address : address},  {
          withCredentials : true
        })
        if(result.data.status == "Success")
        {
          window.location.reload()
          return ;
        }
        else{setUpdating(false)}
      } catch (error) {
        console.error(error)
        setUpdating(false)
      }
    }
    
}

// Get my location
useEffect(() => {
        // Use the Geolocation API to get the user's location
        if(serviceInformation?.address !== undefined)
        {
          setLocation({longitude : serviceInformation?.address.longitude, latitude : serviceInformation?.address.latitude})
          setStreet(serviceInformation?.address.street)
        }
        
}, [serviceInformation]);

// Set the address from db
useEffect(()=>{
  if(serviceInformation?.address !== undefined)
  {
    setAddress(serviceInformation?.address)
    setLocCodesSelected(
      [
        [serviceInformation?.address.region.name, serviceInformation?.address.region.reg_code],
        [serviceInformation?.address.province.name, serviceInformation?.address.province.prov_code],
        [serviceInformation?.address.municipality.name, serviceInformation?.address.municipality.mun_code],
        [serviceInformation?.address.barangay.name, serviceInformation?.address.barangay.brgy_code]
      ]
    )

    setLoading(false)
  }
  
},[serviceInformation])

const handleMapDrag = (map) => {
  // Update the center coordinates when the map is dragged
  setCenter("");
};

useEffect(()=>{
  if(value !== null)
  {
      geocodeByPlaceId(value.value.place_id)
      .then(results => {
      setLocation({latitude : results[0].geometry.location.lat(), longitude : results[0].geometry.location.lng()})
      setCenter({lat : results[0].geometry.location.lat(), lng : results[0].geometry.location.lng()})
      })
      .catch(error => console.error(error));
  }
},[value])

const handleChange = address => {
  setPlaceName(address);
};

const handleSelect = address => {
  setPlaceName(address)
  geocodeByAddress(address)
    .then(results => getLatLng(results[0]))
    .then(latLng => {setLocation({latitude : latLng.lat, longitude : latLng.lng})})
    .catch(error => console.error('Error', error));
};


  return (
    <div className='w-full h-full sm:h-full flex flex-col px-5 mt-0 pt-2'>
    <div className='w-full flex flex-col sm:flex-row h-full sm:h-full sm:space-x-4 p-0'>
      {
        loading ? ("")
        :
        (      
        <>
        <div className='flex flex-col w-full justify-start'>
                <div className='w-full grid xl:grid-cols-2 xl:gap-2'>
                {/* Regions ***************************************/}
                <div className="mb-4">
                <label htmlFor="region" className="text-sm text-gray-600">Region</label>
                <select
                onChange={(e)=>{handleLocationSelect(e.target.value.split(','), 0, 'region');}}
                id="region"
                name="region"
                value={locCodesSelected[0][0] + ',' + locCodesSelected[0][1]}
                className="block w-full text-sm mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                >
                <option className='w-fit' value=""  >Select Region</option>
                {
                phil.regions.map((regions, index)=>(
                <option key={index} value={[regions.name , regions.reg_code]}>{regions.name}</option>
                ))
                }
                </select>
                </div>

                {/* Provinces***************************************************************** */}
                <div className="mb-4 w-full">
                <label htmlFor="province" className="text-sm text-gray-600">Province</label>
                <select
                 disabled={`${locCodesSelected[0][1] == "-1" ? "disabled" : ""}`}
                 onChange={(e)=>{handleLocationSelect(e.target.value.split(','), 1, 'province')}}
                 id="province"
                 name="province"
                 value={locCodesSelected[1][0] + ',' + locCodesSelected[1][1]}
                className="block text-sm w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                >
                <option value=""  >Select Province</option>
                {
                phil.getProvincesByRegion(locCodesSelected[0][1]).sort((a, b) => a.name.localeCompare(b.name)).map((province, index)=>(
                <option key={index} value={[province.name.charAt(0).toUpperCase() + province.name.slice(1).toLowerCase() , province.prov_code]}>{province.name.charAt(0).toUpperCase() + province.name.slice(1).toLowerCase()}</option>
                ))
                }
                </select>
                </div>
                </div>

                <div className='w-full grid xl:grid-cols-2 xl:gap-2'>
                {/* Cities ***********************************************************/}
                <div className="mb-4 w-full">
                <label htmlFor="city" className="text-sm text-gray-600">City</label>
                <select
                disabled={`${locCodesSelected[1][1] == "-1" ? "disabled" : ""}`}
                onChange={(e)=>{handleLocationSelect(e.target.value.split(','),2, 'city')}}
                id="city"
                name="city"
                value={locCodesSelected[2][0] + ',' + locCodesSelected[2][1]}
                className="block text-sm w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                >
                <option value=""  >Select City</option>
                {
                phil.getCityMunByProvince(locCodesSelected[1][1]).sort((a, b) => a.name.localeCompare(b.name)).map((city, index) => (
                <option key={index} onClick={()=>{console.log("Hello")}}  value={[city.name.charAt(0).toUpperCase() + city.name.slice(1).toLowerCase(), city.mun_code]}>
                {city.name.charAt(0).toUpperCase() + city.name.slice(1).toLowerCase()}
                </option>
                ))
                }
                </select>
                </div>
                


                {/* Barangays *****************************************************************8*/}
                <div className="mb-4 w-full">
                <label htmlFor="barangay" className="text-sm text-gray-600">Barangay</label>
                <select
                disabled={`${locCodesSelected[2][1] == "-1" ? "disabled" : ""}`}
                onChange={(e)=>{handleLocationSelect(e.target.value.split(','),3, 'barangay')}}
                id="barangay"
                name="barangay"
                value={locCodesSelected[3][0] + ',' + locCodesSelected[3][1]}
                className="block text-sm w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"

                >
                <option value=""   >Select Barangay</option>
                {
                phil.getBarangayByMun(locCodesSelected[2][1]).sort((a, b) => a.name.localeCompare(b.name)).map((barangay, index)=>(
                <option key={index} value={[barangay.name , barangay.mun_code]}>{barangay.name}</option>
                ))
                }
                </select>
                </div>
                </div>

                {/* Street */}
                <div className="h-full w-full  flex flex-col"> 
                <label className="block text-xs xl:text-sm text-gray-500 font-semibold mb-2" htmlFor="description">Street</label>
                <div className='border rounded-md overflow-hidden md:h-[90%]'>
                <textarea
                value={street}
                maxLength={500}
                onChange={(e)=>{setStreet(e.target.value)}}
                id="description"
                className="w-full p-2 text-xs xl:text-sm resize-none outline-none h-full "
                rows={1} 
                placeholder="Enter street no., building, exact location..."
                ></textarea>
                </div>
                </div>
                </div>   

        {/* MAP******************************************************************* */}
        <div className='relative h-full  w-full  md:h-full mb-1 sm:w-[100%] md:w-[100%] lg:w-[100%]'>
        <label htmlFor="region" className="text-xs xl:text-sm text-gray-600">Pin location</label>
        <div className='w-full h-full relative'>
        <div className='absolute z-20 w-[250px] top-2 left-2'>

        <PlacesAutocomplete
        value={placeName}
        onChange={handleChange}
        onSelect={handleSelect}
        >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className='w-full '>
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input w-full py-2 px-2 text-sm border rounded-md text-gray-600',
              })}
            />
            <div className={`${suggestions.length !== 0 ? "" : "hidden"} autocomplete-dropdown-container mt-1 h-[200px] overflow-auto`}>
              {suggestions.map((suggestion, index) => {
                return (
                  <div
                  className='bg-white'
                  key={index}
                  {...getSuggestionItemProps(suggestion)}
                  >
                    <p className='py-1 px-2 text-sm cursor-pointer '>{suggestion.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </PlacesAutocomplete>
        </div>
        <APIProvider apiKey={key}>
            <Map  mapTypeControlOptions={false} mapTypeControl={false} streetViewControl={false} zoomControl={false} onDragstart={(map) => handleMapDrag(map)}
            defaultCenter={position} center={position} defaultZoom={15}>
            <Marker draggable onDragEnd={(e)=>{setLocation({longitude : e.latLng.lng(), latitude : e.latLng.lat()});setCenter({lat : e.latLng.lat(), lng : e.latLng.lng()})}} position={position} />
            </Map>
        </APIProvider>

    </div>
    </div>

            </>
        )
        
      }
    <button onClick={()=>{handleUpdate()}} className={`${updating ? "bg-orange-400" : "bg-themeOrange"} px-3 sm:mt-2 py-1 w-fit sm:hidden text-gray-100 text-semiSm lg:text-semiMd mb-2 font-normal shadow-md rounded-sm `}>Update</button>


    </div>
    <button onClick={()=>{handleUpdate()}} className={`${updating ? "bg-orange-400" : "bg-themeOrange"} px-3 mt-2 mb-3 py-1 w-fit hidden sm:block text-gray-100 text-semiSm lg:text-semiMd font-normal shadow-md rounded-sm `}>Update</button>

    </div>
  )
}

export default Address