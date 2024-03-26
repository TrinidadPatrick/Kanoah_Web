import React, { useEffect } from 'react'
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
import { useState } from 'react';

const GoogleMap = ({location, setLocation}) => {
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

      
   
  return (
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
        defaultCenter={position} center={center} defaultZoom={15}>
        <Marker draggable onDragEnd={(e)=>{setLocation({longitude : e.latLng.lng(), latitude : e.latLng.lat()});setCenter({lat : e.latLng.lat(), lng : e.latLng.lng()})}} position={position} />
        </Map>
    </APIProvider>

    </div>
  )
}

export default GoogleMap