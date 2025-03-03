import React, { useContext, useState } from 'react';
import { LocationContext } from '@/app/context/LocationContext';
import GeoLocationSelection from './GeoLocationSelection';
import './LocationSelection.css';

const LocationSelection = () => {
  const { searchParams, handleSearchParamsChange } = useContext(LocationContext);
  const [useGeoLocation, setUseGeoLocation] = useState(false);
  const [city, setCity] = useState('');
  const [states, setStates] = useState([]);

  const handleGeoLocationChange = () => {
    setUseGeoLocation(!useGeoLocation);
    if (useGeoLocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const coordinates = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        handleSearchParamsChange({ ...searchParams, coordinates });
      }, error => {
        console.error('Geolocation error:', error);
      });
    }
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
    handleSearchParamsChange({ ...searchParams, city: event.target.value });
  };

  const handleStatesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStates([event.target.value]);
    handleSearchParamsChange({ ...searchParams, states: [event.target.value] });
  };

  return (
    <div>
      <h2>Filter By Location</h2>
      <form>
        <div>
          <input
            type="checkbox"
            id="useGeoLocation"
            checked={useGeoLocation}
            onChange={handleGeoLocationChange}
          />
          <label htmlFor="useGeoLocation">Use Geo Location</label>
        </div>
        {useGeoLocation && (
          <GeoLocationSelection />
        )}
        <div>
          <input
            type="text"
            value={city}
            onChange={handleCityChange}
            placeholder="City"
          />
        </div>
        <div>
          <select value={states} onChange={handleStatesChange}>
            <option value="">Select a state</option>
            <option value="CA">CA</option>
            <option value="NY">NY</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default LocationSelection;
