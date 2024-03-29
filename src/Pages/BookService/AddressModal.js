import React from 'react'
import { useState, useEffect } from 'react';
import phil from 'phil-reg-prov-mun-brgy';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSelector } from 'react-redux';
import { selectContactAndAddress } from '../../ReduxTK/BookingSlice';
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
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

  
  return (
    <div className='p-4 w-[400px]'>
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
              <div className='w-full h-[250px] relative'>
                <div className='absolute z-20 w-[250px] top-2 left-2'>
                  <GooglePlacesAutocomplete
                  selectProps={{value, onChange: setValue,}}
                  place apiKey={key} />
                </div>
                <APIProvider apiKey={key}>
                <Map  mapTypeControlOptions={false} mapTypeControl={false} streetViewControl={false} zoomControl={false} onDragstart={(map) => handleMapDrag(map)}
                defaultCenter={position} center={position} defaultZoom={15}>
                <Marker draggable onDragEnd={(e)=>{setLocation({longitude : e.latLng.lng(), latitude : e.latLng.lat()});setCenter({lat : e.latLng.lat(), lng : e.latLng.lng()})}} position={position} />
                </Map>
            </APIProvider>
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