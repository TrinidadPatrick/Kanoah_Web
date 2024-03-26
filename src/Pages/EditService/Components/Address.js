import React from 'react'
import { useState,useEffect, useContext } from 'react';
import phil from 'phil-reg-prov-mun-brgy';
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
import http from '../../../http';

const Address = ({serviceInformation}) => {
const [updating, setUpdating] = useState(false)
const [loading, setLoading] = useState(true)
const [street, setStreet] = useState('')
const [address, setAddress] = useState({})
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
        <div className='relative mt-1 h-full  w-full  md:h-full mb-1 py-2 sm:w-[100%] md:w-[100%] lg:w-[100%]'>
        <div className='w-full h-full relative'>
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
        defaultCenter={position} center={position} defaultZoom={15}>
        <Marker draggable onDragEnd={(e)=>{setLocation({longitude : e.latLng.lng(), latitude : e.latLng.lat()});setCenter({lat : e.latLng.lat(), lng : e.latLng.lng()})}} position={position} />
        </Map>
    </APIProvider>

    </div>
            {/* <ReactMapGL
            {...viewport}
            onViewportChange={(newViewport) => setViewPort(newViewport)}
            // onClick={()=>{window.open(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`, '_black')}}
            draggable={true}
            onMove={evt => setViewPort(evt.viewport)}
            mapboxAccessToken="pk.eyJ1IjoicGF0cmljazAyMSIsImEiOiJjbG8ybWJhb2MwMmR4MnFyeWRjMWtuZDVwIn0.mJug0iHxD8aq8ZdT29B-fg"
            mapStyle="mapbox://styles/patrick021/clo2m5s7f006a01rf9mtv318u"
            style={{
              width: "100%",
              height: "100%",
              backgroundColor : "none",
              position: "relative",
              borderRadius: "10px",
              marginBottom: "7px",
              transition: "width 0.5s, height 0.5s, top 0.5s",
            }}
            onLoad={() => {
                const newViewport = {
                  ...viewport,
                  latitude: location.latitude,
                  longitude: location.longitude,
                };
                setViewPort(newViewport);
              }}

            >
            <Marker
            latitude={location.latitude}
            longitude={location.longitude}
            draggable={true}
            // onDrag={(evt) => {setLocation({longitude : evt.lngLat.lng, latitude : evt.lngLat.lat});setViewPort({longitude : evt.lngLat.lng, latitude : evt.lngLat.lng})}}
            onDrag={(evt) => {
                const sensitivityFactor = 1;
                const newLocation = {
                  longitude: evt.lngLat.lng / sensitivityFactor,
                  latitude: evt.lngLat.lat / sensitivityFactor,
                };
                setLocation(newLocation);
                // setViewPort((prevViewport) => ({
                //   ...prevViewport,
                //   latitude: newLocation.latitude,
                //   longitude: newLocation.longitude ,
                // }));
              }}
            >
        
            </Marker>
            <GeolocateControl />
            
            </ReactMapGL> */}
            {/* Location Filter Search*/}
            {/* <div className='flex flex-col w-1/2 space-y-1 absolute top-4 left-2'>
            <div className="w-full shadow-sm mx-auto rounded-lg overflow-hidden md:max-w-xl">
            <div className="md:flex">
            <div className="w-full">
            <div className="relative">
            <SearchOutlinedIcon fontSize='small' className="absolute text-gray-400 top-[0.69rem] left-2"/>
            <input value={locationFilterValue.location} onChange={(e)=>{setLocationFilterValue({location : e.target.value});setCloseAutofill(false)}} placeholder="Enter location" type="text" className="bg-white h-10 w-full ps-8 pe-2 text-semiXs border rounded-lg focus:outline-none hover:cursor-arrow" />
            </div> 
            </div>
            </div>
            </div>

            <div className={`${closeAutofill == true && locationFilterValue.location != "" ? "hidden" : locationFilterValue.location != "" && !closeAutofill ? "relative"  : "hidden"} bg-white h-44 overflow-auto flex flex-col shadow-sm border rounded-sm`}>
            {
            places.map((place, index) => {
                return (
                <div
                    key={index}
                    onClick={() => {
                    setLocationFilterValue({
                        location: place.place_name,
                        longitude: place.center[0],
                        latitude: place.center[1],
                    });
                    setLocation({
                        longitude: place.center[0],
                        latitude: place.center[1],
                    });

                    // Update the location first and then set the viewport
                    const newViewport = {
                        ...viewport,
                        latitude: place.center[1],  // Use the new latitude
                        longitude: place.center[0], // Use the new longitude
                    };
                    setViewPort(newViewport);
                    setCloseAutofill(true)
                    }}
                    className='m-3 flex flex-col items-start cursor-pointer '
                >
                    <h1 className=' text-sm font-semibold'>{place.text}</h1>
                    <p className=' text-[0.72rem]'>{place.place_name}</p>
                </div>
                );
            })
                }
            </div>
            </div> */}
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