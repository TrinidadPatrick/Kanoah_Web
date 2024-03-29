import React, { useEffect } from 'react'
import {APIProvider, Map, Marker, useMapsLibrary } from '@vis.gl/react-google-maps';
// import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
import GooglePlacesAutocomplete from 'react-google-autocomplete';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { useState } from 'react';

const GoogleMap = ({location, setLocation}) => {
    const [center, setCenter] = useState({ lat:  location.latitude, lng:  location.longitude});
    const [value, setValue] = useState(null);
    const position = {lat: location.latitude, lng: location.longitude};
    const key = process.env.REACT_APP_MAP_API_KEY
    const [address, setAddress] = useState('');

  const handleChange = address => {
    setAddress(address);
  };

  const handleSelect = address => {
    setAddress(address)
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {setLocation({latitude : latLng.lat, longitude : latLng.lng})})
      .catch(error => console.error('Error', error));
  };

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
    <PlacesAutocomplete
      value={address}
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
                  <p className='py-1 px-2 text-xs cursor-pointer '>{suggestion.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
    </div>
    <APIProvider apiKey={key}>
        <Map mapTypeControlOptions={false} mapTypeControl={false} streetViewControl={false} zoomControl={false} onDragstart={(map) => handleMapDrag(map)}
        defaultCenter={position} center={position} defaultZoom={15}>
        <Marker draggable onDragEnd={(e)=>{setLocation({longitude : e.latLng.lng(), latitude : e.latLng.lat()});setCenter({lat : e.latLng.lat(), lng : e.latLng.lng()})}} position={position} />
        </Map>
    </APIProvider>

    </div>
  )
}

export default GoogleMap