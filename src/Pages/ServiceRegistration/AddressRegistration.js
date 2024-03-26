import React from 'react'
import { useState,useEffect, useContext } from 'react';
import phil from 'phil-reg-prov-mun-brgy';
// import ReactMapGL, { GeolocateControl, Marker } from 'react-map-gl'
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
import axios from 'axios';
import { pageContext } from './ServiceRegistrationPage'
import 'mapbox-gl/dist/mapbox-gl.css';

const AddressRegistration = () => {
const [street, setStreet] = useState('')
const [fullAddress, setFullAddress] = useState({})
const [step, setStep, serviceInformation, setServiceInformation] = useContext(pageContext)
const [places, setPlaces] = useState([])
const [locationFilterValue, setLocationFilterValue] = useState({
        location : '',
        longitude : '',
        latitude : ''
})
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

// Handles the location seleced by the user
const handleLocationSelect = (value, index) => {
        const newData = [...locCodesSelected]
        newData.splice(index, 1, value)
        setLocCodesSelected(newData)
        
}

// Submits the selected address
const submitAddress = () => {
        
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
      setErrors((prevErrors)=>({...prevErrors, [errorKey] : address[input].name == "" ? true : false}))
    )

    checkError("region", "RegionError")
    checkError("province", "ProvinceError")
    checkError("municipality", "CityError")
    checkError("barangay", "BarangayError")

    // setFullAddress(address)
    if(address.region.name != "" && address.province.name != "" && address.municipality.name != "" && address.barangay.name != "")
    {
      setServiceInformation({...serviceInformation, address : address})
      setStep(4)
    }
    
}

// Get my location
useEffect(() => {
        // Use the Geolocation API to get the user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation({ latitude, longitude });
              
            },
            (error) => {
              // Handle any errors here
              console.error('Geolocation error:', error);
            }
          );
        } else {
          // Geolocation is not available in this browser
          console.error('Geolocation is not available.');
        }
}, []);

// For autofill location search
useEffect(() => {
        const accessToken = 'pk.eyJ1IjoicGF0cmljazAyMSIsImEiOiJjbG8ydzQ2YzYwNWhvMmtyeTNwNDl3ejNvIn0.9n7wjqLZye4DtZcFneM3vw'; // Replace with your actual Mapbox access token
        const location = locationFilterValue.location; // Replace with your desired location
      
        axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=pk.eyJ1IjoicGF0cmljazAyMSIsImEiOiJjbG8ydzQ2YzYwNWhvMmtyeTNwNDl3ejNvIn0.9n7wjqLZye4DtZcFneM3vw`)
          .then((res) => {
           setPlaces(res.data.features) // Logging the response data
           

          })
          .catch((err) => {
            console.log(err);
          });
}, [locationFilterValue]);

useEffect(()=>{
  setFullAddress(serviceInformation.address)
},[step])

  return (
    <div className='w-full flex flex-col h-fit md:h-full p-1'>
    {/* <div className='p-4 bg-black h-full'> */}
            <div className='flex flex-col justify-center items-center'>
                <div className='w-full grid grid-cols-2 gap-2'>
                {/* Regions ***************************************/}
                <div className="mb-4">
                <label htmlFor="region" className="text-xs xl:text-sm text-gray-600">Region</label>
                <select
                onChange={(e)=>{handleLocationSelect(e.target.value.split(','), 0)}}
                id="region"
                name="region"
                defaultValue=""
                className={`${errors.RegionError ? "border-red-500" : ""} block w-full text-xs xl:text-sm mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200`}
                >
                <option className='w-fit' value=""  >Select Region</option>
                {
                phil.regions.map((regions, index)=>(
                <option key={index} selected={fullAddress.region == regions.name ? true : false} value={[regions.name , regions.reg_code]}>{regions.name}</option>
                ))
                }
                </select>
                </div>

                
                {/* Provinces***************************************************************** */}
                <div className="mb-4 w-full">
                <label htmlFor="province" className="text-xs xl:text-sm text-gray-600">Province</label>
                <select
                disabled={`${locCodesSelected[0][1] == "-1" ? "disabled" : ""}`}
                onChange={(e)=>{handleLocationSelect(e.target.value.split(','), 1)}}
                id="province"
                name="province"
                defaultValue=""
                className={`${errors.ProvinceError ? "border-red-500" : ""} block w-full text-xs xl:text-sm mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200`}
                >
                <option value="" disabled >Select Province</option>
                {
                phil.getProvincesByRegion(locCodesSelected[0][1]).sort((a, b) => a.name.localeCompare(b.name)).map((province, index)=>(
                <option key={index} selected={fullAddress.province == province.name ? true : false} value={[province.name.charAt(0).toUpperCase() + province.name.slice(1).toLowerCase() , province.prov_code]}>{province.name.charAt(0).toUpperCase() + province.name.slice(1).toLowerCase()}</option>
                ))
                }
                </select>
                </div>
                </div>

                <div className='w-full grid grid-cols-2 gap-2'>
                {/* Cities ***********************************************************/}
                <div className="mb-4 w-full">
                <label htmlFor="city" className="text-xs xl:text-sm text-gray-600">City</label>
                <select
                disabled={`${locCodesSelected[1][1] == "-1" ? "disabled" : ""}`}
                onChange={(e)=>{handleLocationSelect(e.target.value.split(','),2)}}
                id="city"
                name="city"
                defaultValue=""
                className={`${errors.CityError ? "border-red-500" : ""} block text-xs xl:text-sm w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200`}
                >
                <option value="" disabled >Select City</option>
                {
                phil.getCityMunByProvince(locCodesSelected[1][1]).sort((a, b) => a.name.localeCompare(b.name)).map((city, index) => (
                <option key={index} selected={fullAddress.municipality == city.name ? true : false} onClick={()=>{console.log("Hello")}}  value={[city.name.charAt(0).toUpperCase() + city.name.slice(1).toLowerCase(), city.mun_code]}>
                {city.name.charAt(0).toUpperCase() + city.name.slice(1).toLowerCase()}
                </option>
                ))
                }
                </select>
                </div>
                


                {/* Barangays *****************************************************************8*/}
                <div className="mb-4 w-full">
                <label htmlFor="barangay" className="text-xs xl:text-sm text-gray-600">Barangay</label>
                <select
                disabled={`${locCodesSelected[2][1] == "-1" ? "disabled" : ""}`}
                onChange={(e)=>{handleLocationSelect(e.target.value.split(','),3)}}
                id="barangay"
                name="barangay"
                className={`${errors.BarangayError ? "border-red-500" : ""} block text-xs xl:text-sm w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200`}
                defaultValue=""
                >
                <option value="" disabled  >Select Barangay</option>
                {
                phil.getBarangayByMun(locCodesSelected[2][1]).sort((a, b) => a.name.localeCompare(b.name)).map((barangay, index)=>(
                <option selected={fullAddress.barangay == barangay.name ? true : false} key={index} value={[barangay.name , barangay.mun_code]}>{barangay.name}</option>
                ))
                }
                </select>
                </div>
                </div>

                {/* Street */}
                <div className="h-fit w-full  flex flex-col"> 
                <label className="block text-xs xl:text-sm text-gray-500 font-semibold mb-2" htmlFor="description">Street</label>
                <div className='border rounded-sm  md:h-[90%]'>
                <textarea
                value={street}
                onChange={(e)=>{setStreet(e.target.value)}}
                id="description"
                className="w-full p-2 text-xs xl:text-sm resize-none outline-none min-h-[20px] max-h-[190px] "
                rows={1} 
                placeholder="Enter street no., building, exact location..."
                ></textarea>
                </div>
                </div>
                </div>   

    {/* MAP******************************************************************* */}
    <div className='relative mt-1 h-[200px]  md:h-full mb-1 py-2 w-[100%] md:w-full'>
    <div className='w-full h-[250px] relative'>
    <div className='absolute z-20 w-[250px] top-2 left-2'>
    <GooglePlacesAutocomplete
    selectProps={{
        value,
        onChange: setValue,
      }}
    place apiKey={key} />
    </div>
    <APIProvider apiKey={key}>
        <Map  mapTypeControlOptions={false} mapTypeControl={false} streetViewControl={false} zoomControl={false} onDragstart={(map) => handleMapDrag(map)}
        defaultCenter={position} center={position} defaultZoom={10}>
        <Marker draggable onDragEnd={(e)=>{setLocation({longitude : e.latLng.lng(), latitude : e.latLng.lat()});setCenter({lat : e.latLng.lat(), lng : e.latLng.lng()})}} position={position} />
        </Map>
    </APIProvider>
    </div>
    </div>
            
            {/* </div> */}
            <div className='w-full flex justify-end space-x-2'>
            <button onClick={()=>{setStep(2)}} className='px-3 text-[0.75rem] md:text-sm rounded-sm py-1 bg-gray-200 text-gray-500'>Back</button>
            <button onClick={()=>{submitAddress()}} className='px-3 text-[0.75rem] md:text-sm rounded-sm py-1 bg-themeBlue text-white'>Next</button>
            </div>
    </div>
  )
}

export default AddressRegistration