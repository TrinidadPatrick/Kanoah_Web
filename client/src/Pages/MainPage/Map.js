import React from 'react'
import Maps, {FullscreenControl, GeolocateControl, Marker, Source, Layer, NavigationControl} from 'react-map-gl'
import { useState } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css';


const Map = () => {

    const [viewState, setViewState] = React.useState({
        longitude: -100,
        latitude: 40,
        zoom: 3.5
      });
      

  return (
    <Maps
    
    {...viewState}
    mapboxAccessToken="pk.eyJ1IjoicGF0cmljazAyMSIsImEiOiJjbG8ydzQ2YzYwNWhvMmtyeTNwNDl3ejNvIn0.9n7wjqLZye4DtZcFneM3vw"
    onMove={evt => setViewState(evt.viewState)}
    mapStyle="mapbox://styles/patrick021/clo2m5s7f006a01rf9mtv318u"
    style={{width: "800px", height: "100vh", marginTop: "300px", position: "absolute"}}
    
  >
    <GeolocateControl
        
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
        auto
      />
    <FullscreenControl />
    <NavigationControl />
</Maps>
  )



  
}

export default Map