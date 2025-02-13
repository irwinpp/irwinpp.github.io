import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const GoogleMapComponent = () => {
  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  const defaultCenter = {
    lat: 40.73061, // Example default latitude
    lng: -73.935242, // Example default longitude
  };

  const [location, setLocation] = useState(defaultCenter);
  const [error, setError] = useState(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        setLocation(newLocation);
        console.log('Updated location:', newLocation); // Log the updated location
      },
      (err) => {
        setError(err.message);
        console.error('Geolocation error:', err); // Log any geolocation errors
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    // Clean up the watch on component unmount
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    console.log('Current location state:', location);
  }, [location]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location} // Use updated location
        zoom={10}
      >
        {location.lat && location.lng && (
          <Marker position={location} />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
