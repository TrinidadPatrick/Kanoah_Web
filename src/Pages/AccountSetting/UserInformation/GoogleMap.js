import React, { useEffect } from 'react'
import mapMarker from '../../../Utilities/mapMarker.png'
import ReactMapGL, { Marker, GeolocateControl, NavigationControl } from 'react-map-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
import { useState } from 'react';
import axios from 'axios';

const GoogleMap = ({location, setLocation}) => {
    const position = {latitude: location.latitude, longitude: location.longitude};
    const [placesSuggestion, setPlacesSuggestion] = useState([])
    const [locationFilter, setLocationFilter] = useState({address : '', longitude : 0, latitude : 0})
    const [viewport, setViewport] = useState({
      latitude: location.latitude,
      longitude: location.longitude,
      zoom: 15,
      width: "100px",
      height: "100px"
  });

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
    <div className='w-full h-[250px] relative'>
      <div className='w-[200px]  z-20 absolute top-2 '>
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
                {...viewport}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                onMove={viewport => setViewport(viewport)}
            >
            <Marker draggable onDragEnd={(e)=>{setLocation({longitude : e.lngLat.lng, latitude : e.lngLat.lat})}} latitude={position?.latitude} longitude={position?.longitude}>
                      <div className="marker">
                            <img className='w-10' src={mapMarker} alt="Marker" />
                        </div>
            </Marker>
      </ReactMapGL>

    </div>
  )
}

export default GoogleMap