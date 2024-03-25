import React from 'react'
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { useState } from 'react';

const GoogleMap = ({location, setLocation}) => {
    const [center, setCenter] = useState({ lat:  location.latitude, lng:  location.longitude});
    const position = {lat: location.latitude, lng: location.longitude};

    const handleMapDrag = (map) => {
        // Update the center coordinates when the map is dragged
        setCenter("");
      };
      const key = process.env.REACT_APP_MAP_API_KEY
   
  return (
    <div className='w-full h-[250px] '>
<GooglePlacesAutocomplete
      apiKey={key}
    />
<APIProvider apiKey={key}>
      <Map streetViewControl={false} zoomControl={false} onDragstart={(map) => handleMapDrag(map)}
 defaultCenter={position} center={center} defaultZoom={10}>
        <Marker draggable onDragEnd={(e)=>{setLocation({longitude : e.latLng.lng(), latitude : e.latLng.lat()});setCenter({lat : e.latLng.lat(), lng : e.latLng.lng()})}} position={position} />
      </Map>
    </APIProvider>

    </div>
  )
}

export default GoogleMap