import React from 'react'
import { useState, useEffect } from 'react';
import phil from 'phil-reg-prov-mun-brgy';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSelector } from 'react-redux';
import { selectContactAndAddress } from '../../ReduxTK/BookingSlice';
import mapMarker from '../../Utilities/mapMarker.png'
import ReactMapGL, { Marker} from 'react-map-gl';
import axios from 'axios';

const AddressModal = ({userContext, closeAddressModal, submitAddressInfo}) => {
    const contactAndAddress = useSelector(selectContactAndAddress)
    const [street, setStreet] = useState('')
    const [locCodesSelected, setLocCodesSelected] = useState([
        ['', '-1'], //Region
        ['','-1'], //Province
        ['','-1'], //Municipality
        ['','-1'] //Barangay
    ])
    const [location, setLocation] = useState({
        longitude : 122.5320,
        latitude : 13.4124
    })
    const [error, setError] = useState({
      region : false,
      province : false,
      municipality : false,
      barangay : false,
    })
    const [placesSuggestion, setPlacesSuggestion] = useState([])
    const [locationFilter, setLocationFilter] = useState({address : '', longitude : 0, latitude : 0})
    const [viewport, setViewport] = useState({
      latitude: location.latitude,
      longitude: location.longitude,
      zoom: 15,
      width: "100px",
      height: "100px"
    });

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
  
      const submitAddress = () => {
          let hasError = false
          const address = {
            region : {name : locCodesSelected[0][0], reg_code : locCodesSelected[0][1]},
            province :  {name : locCodesSelected[1][0], prov_code : locCodesSelected[1][1]},
            municipality : {name : locCodesSelected[2][0], mun_code : locCodesSelected[2][1]},
            barangay : {name : locCodesSelected[3][0], brgy_code : locCodesSelected[3][1]},
            street : street,
            longitude : location.longitude,
            latitude : location.latitude
          }
  
          Object.entries(address).map(([key, value])=>{
            if(typeof value === "object" && (value.name === undefined || value.name === '')){
              hasError = true
              setError((prevError) => ({...prevError, [key] : true}))
            }
            else{
              // console.log(`${key} has value`)
              setError((prevError) => ({...prevError, [key] : false}))
            }
          })
  
          if(!hasError)
          {
            submitAddressInfo(address)
            closeAddressModal()
          }
          
          
      }
  
      useEffect(()=>{
          if(contactAndAddress === null)
          {
  
              setLocation({
                  longitude : userContext.Address === null ? 120.8236601 : userContext.Address?.longitude ,
                  latitude : userContext.Address === null ? 14.5964466 : userContext.Address?.latitude
              })
              setLocCodesSelected(
            [
              [userContext.Address?.region.name, userContext.Address?.region.reg_code],
              [userContext.Address?.province.name, userContext.Address?.province.prov_code],
              [userContext.Address?.municipality.name, userContext.Address?.municipality.mun_code],
              [userContext.Address?.barangay.name, userContext.Address?.barangay.brgy_code]
            ]
              )
  
              setStreet(userContext.Address?.street)
        
          }
          else
          {
              setLocation({
                  longitude : contactAndAddress.Address.longitude,
                  latitude : contactAndAddress.Address.latitude
              })
              setLocCodesSelected(
                  [
                    [contactAndAddress.Address.region.name, contactAndAddress.Address.region.reg_code],
                    [contactAndAddress.Address.province.name, contactAndAddress.Address.province.prov_code],
                    [contactAndAddress.Address.municipality.name, contactAndAddress.Address.municipality.mun_code],
                    [contactAndAddress.Address.barangay.name, contactAndAddress.Address.barangay.brgy_code]
                  ]
              )
  
              setStreet(contactAndAddress.Address.street)
          }
      },[])

    const handleSelect = address => {
      setLocationFilter({address : address.place_name, longitude : address.center[0], latitude : address.center[1]})
      setLocation({...location, longitude : address.center[0], latitude : address.center[1]})
      setViewport({...viewport, longitude : address.center[0], latitude : address.center[1]})
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
    <div className='p-4 w-[400px] h-[95vh] overflow-auto'>
                <h1 className='font-medium'>Address</h1>
                {/* Regions ***************************************/}
                <div className="mb-4">
                <label htmlFor="region" className="text-sm text-gray-600">Region <span className={`text-red-500 ${error.region ? "" : "hidden"} text-xs`}>*required</span></label>
                <select
                onChange={(e)=>{handleLocationSelect(e.target.value.split(','), 0, 'region');}}
                id="region"
                name="region"
                value={locCodesSelected[0][0] + ',' + locCodesSelected[0][1]}
                className={`block text-sm w-full mt-1 p-2 border ${error.region ? "border-red-500" : "border-gray-300"} rounded-md focus:ring focus:ring-indigo-200`}
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
                <div className="mb-4">
                <label htmlFor="province" className="text-sm text-gray-600">Province <span className={`text-red-500 ${error.province ? "" : "hidden"} text-xs`}>*required</span></label>
                <select
                 disabled={`${locCodesSelected[0][1] == "-1" ? "disabled" : ""}`}
                 onChange={(e)=>{handleLocationSelect(e.target.value.split(','), 1, 'province')}}
                 id="province"
                 name="province"
                 value={locCodesSelected[1][0] + ',' + locCodesSelected[1][1]}
                className={`block text-sm w-full mt-1 p-2 border ${error.province ? "border-red-500" : "border-gray-300"} rounded-md focus:ring focus:ring-indigo-200`}
                >
                <option value=""  >Select Province</option>
                {
                phil.getProvincesByRegion(locCodesSelected[0][1]).sort((a, b) => a.name.localeCompare(b.name)).map((province, index)=>(
                <option key={index} value={[province.name.charAt(0).toUpperCase() + province.name.slice(1).toLowerCase() , province.prov_code]}>{province.name.charAt(0).toUpperCase() + province.name.slice(1).toLowerCase()}</option>
                ))
                }
                </select>
                </div>


                {/* Cities ***********************************************************/}
                <div className='flex gap-3 w-full'>
                <div className="mb-4 w-full">
                <label htmlFor="city" className="text-sm text-gray-600">City <span className={`text-red-500 ${error.municipality ? "" : "hidden"} text-xs`}>*required</span></label>
                <select
                disabled={`${locCodesSelected[1][1] == "-1" ? "disabled" : ""}`}
                onChange={(e)=>{handleLocationSelect(e.target.value.split(','),2, 'city')}}
                id="city"
                name="city"
                value={locCodesSelected[2][0] + ',' + locCodesSelected[2][1]}
                className={` text-sm w-full mt-1 p-2 border ${error.municipality ? "border-red-500" : "border-gray-300"} rounded-md focus:ring focus:ring-indigo-200`}
                >
                <option value=""  >Select City</option>
                {
                phil.getCityMunByProvince(locCodesSelected[1][1]).sort((a, b) => a.name.localeCompare(b.name)).map((city, index) => (
                <option key={index}  value={[city.name.charAt(0).toUpperCase() + city.name.slice(1).toLowerCase(), city.mun_code]}>
                {city.name.charAt(0).toUpperCase() + city.name.slice(1).toLowerCase()}
                </option>
                ))
                }
                </select>
                </div>


                {/* Barangays *****************************************************************8*/}
                <div className="mb-4 w-full">
                <label htmlFor="barangay" className="text-sm text-gray-600">Barangay <span className={`text-red-500 ${error.barangay ? "" : "hidden"} text-xs`}>*required</span></label>
                <select
                disabled={`${locCodesSelected[2][1] == "-1" ? "disabled" : ""}`}
                onChange={(e)=>{handleLocationSelect(e.target.value.split(','),3, 'barangay')}}
                id="barangay"
                name="barangay"
                value={locCodesSelected[3][0] + ',' + locCodesSelected[3][1]}
                className={` text-sm w-full mt-1 p-2 border ${error.barangay ? "border-red-500" : "border-gray-300"} rounded-md focus:ring focus:ring-indigo-200`}

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

            <div className='w-full'>
            <label htmlFor="barangay" className="text-sm text-gray-600">Street</label>
                <textarea value={street} onChange={(e)=>{setStreet(e.target.value)}} className='w-full p-1 rounded-md border resize-none text-sm' row={3} />
            </div>

                {/* MAP******************************************************************* */}
            <div className='relative'>
            <label htmlFor="region" className="text-xs xl:text-sm text-gray-600">Pin location</label>
              <div className='w-full h-[250px] relative'>
              <div className='w-[200px]  z-20 absolute top-2 left-2 '>
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
              <input value={locationFilter.address} placeholder='Enter location' className='w-full text-sm shadow rounded text-black p-2 h-full bg-white z-20' type='text' onChange={(e)=>handleInputChange(e.target.value)} />
              </div>
              <ReactMapGL
              doubleClickZoom
                        dragPan={true}
                        longitude={location.longitude}
                        latitude={location.latitude}
                        zoom={15}
                        mapStyle="mapbox://styles/mapbox/streets-v9"
                        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                        onMove={e => setLocation({longitude : e.viewState.longitude, latitude : e.viewState.latitude})}
                    >
                    <Marker draggable onDragEnd={(e)=>{setLocation({longitude : e.lngLat.lng, latitude : e.lngLat.lat})}} latitude={location?.latitude} longitude={location?.longitude}>
                              <div className="marker">
                                    <img className='w-10' src={mapMarker} alt="Marker" />
                                </div>
                    </Marker>
              </ReactMapGL>
              </div>
              </div>
            <div className=' flex justify-end space-x-2'>
            <button onClick={()=>{closeAddressModal()}} className='px-3 text-semiSm py-1   text-gray-600 rounded-sm mt-4'>Cancel</button>
            <button onClick={()=>{submitAddress()}} className='px-3 text-semiSm py-1 bg-themeBlue hover:bg-slate-700 text-white rounded-sm mt-4'>Save</button>
            </div>
            
    </div>
  )
}

export default AddressModal