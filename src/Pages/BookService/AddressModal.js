import React from 'react'
import { useState, useEffect } from 'react';
import phil from 'phil-reg-prov-mun-brgy';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ReactMapGL, { GeolocateControl, Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSelector } from 'react-redux';
import { selectContactAndAddress } from '../../ReduxTK/BookingSlice';
import axios from 'axios';

const AddressModal = ({userContext, closeAddressModal, submitAddressInfo}) => {
    const [isDragging, setIsDragging] = useState(false);
    const contactAndAddress = useSelector(selectContactAndAddress)
    const [closeAutofill, setCloseAutofill] = useState(false)
    const [places, setPlaces] = useState([])
    const [street, setStreet] = useState('')
    const [locCodesSelected, setLocCodesSelected] = useState([
        ['', '-1'], //Region
        ['','-1'], //Province
        ['','-1'], //Municipality
        ['','-1'] //Barangay
    ])
    const [locationFilterValue, setLocationFilterValue] = useState({
        location : '',
        longitude : '',
        latitude : ''
    })
    const [location, setLocation] = useState({
        longitude : 122.5320,
        latitude : 13.4124
    })

    // Map Viewport
    const [viewport, setViewPort] = useState({    
        width: "100%",
        height: "100%",
        zoom : 16,
        latitude : location.latitude,
        longitude : location.longitude
    })

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
        
        const address = {
          region : {name : locCodesSelected[0][0], reg_code : locCodesSelected[0][1]},
          province :  {name : locCodesSelected[1][0], prov_code : locCodesSelected[1][1]},
          municipality : {name : locCodesSelected[2][0], mun_code : locCodesSelected[2][1]},
          barangay : {name : locCodesSelected[3][0], brgy_code : locCodesSelected[3][1]},
          street : street,
          longitude : location.longitude,
          latitude : location.latitude
        }

        submitAddressInfo(address)
        
    }

    useEffect(()=>{
        if(contactAndAddress === null)
        {

            setLocation({
                longitude : userContext.Address.longitude,
                latitude : userContext.Address.latitude
            })


        setLocCodesSelected(
          [
            [userContext.Address.region.name, userContext.Address.region.reg_code],
            [userContext.Address.province.name, userContext.Address.province.prov_code],
            [userContext.Address.municipality.name, userContext.Address.municipality.mun_code],
            [userContext.Address.barangay.name, userContext.Address.barangay.brgy_code]
          ]
        )

        setStreet(userContext.Address.street)
      
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
    <div className='p-4'>
                <h1 className='font-medium'>Address</h1>
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
                <div className="mb-4">
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


                {/* Cities ***********************************************************/}
                <div className='flex gap-3'>
                <div className="mb-4">
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
                <div className="mb-4">
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

            <div className='w-full'>
            <label htmlFor="barangay" className="text-sm text-gray-600">Street</label>
                <textarea value={street} onChange={(e)=>{setStreet(e.target.value)}} className='w-full border resize-none text-sm' row={3} />
            </div>

                {/* MAP******************************************************************* */}
            <div className='relative'>
            <ReactMapGL
            {...viewport}
            onViewportChange={(newViewport) => setViewPort(newViewport)}
            // onClick={()=>{window.open(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`, '_black')}}
            draggable={true}
            onMove={evt => setViewPort(evt.viewport)}
            mapboxAccessToken="pk.eyJ1IjoicGF0cmljazAyMSIsImEiOiJjbG8ybWJhb2MwMmR4MnFyeWRjMWtuZDVwIn0.mJug0iHxD8aq8ZdT29B-fg"
            mapStyle="mapbox://styles/patrick021/clo2m5s7f006a01rf9mtv318u"
            style={{
              width: "100%",
              height: "230px",
              backgroundColor : "none",
              position: "relative",
              borderRadius: "10px",
              marginBottom: "7px",
              top: "10px", // Use top instead of marginTop
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
            onDragStart={()=>{setIsDragging(true)}}
            // onDrag={(evt) => {setLocation({longitude : evt.lngLat.lng, latitude : evt.lngLat.lat});setViewPort({longitude : evt.lngLat.lng, latitude : evt.lngLat.lng})}}
            onDrag={(evt) => {
                const sensitivityFactor = 1;
                const newLocation = {
                  longitude: evt.lngLat.lng / sensitivityFactor,
                  latitude: evt.lngLat.lat / sensitivityFactor,
                };
                setLocation(newLocation);
                setViewPort((prevViewport) => ({
                  ...prevViewport,
                  latitude: newLocation.latitude,
                  longitude: newLocation.longitude ,
                }));
              }}
            onDragEnd={()=>[setIsDragging(false)]}
            >
        
            </Marker>
            <GeolocateControl />
            
            </ReactMapGL>
            {/* Location Filter Search*/}
            <div className='flex flex-col w-1/2 space-y-1 absolute top-4 left-2'>
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
            </div>
            </div>
            <div className=' flex justify-end space-x-2'>
            <button onClick={()=>{submitAddress();closeAddressModal()}} className='px-3 text-semiSm py-1 bg-themeBlue hover:bg-slate-700 text-white rounded-sm mt-4'>Save</button>
            </div>
            
    </div>
  )
}

export default AddressModal