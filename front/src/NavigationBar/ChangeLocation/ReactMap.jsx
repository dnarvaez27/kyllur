import React, { useState, useEffect } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const ReactMap = ({ google, center = { lat: 4.6032624, lng: -74.0652016 }, onDragend = () => { } }) => {
  const [_center, setCenter] = useState(center);

  useEffect(() => {
    setCenter(center);
  }, [center, setCenter])

  return (
    <Map
      google={google}
      zoom={15}
      initialCenter={_center}
      center={_center}
      onClick={(_mp, _m, e) => {
        const nCenter = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setCenter(nCenter);
        onDragend(nCenter);
      }}>
      <Marker position={center} />
    </Map>
  )
}

export default GoogleApiWrapper({
  //Ojo con el API KEY! ¯\_(ツ)_/¯ (Aunque me imagino que la tienen restringida)
  apiKey: 'AIzaSyALfvSRLCN3dLyVvuuZaVgBxDj-YnEF7gc',
})(ReactMap);
