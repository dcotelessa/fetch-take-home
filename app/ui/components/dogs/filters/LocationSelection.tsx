import React, { useState, useContext, useEffect, useCallback } from 'react';
import { LocationContext } from '@/app/context/LocationContext';
import './LocationSelection.css';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

interface LocationSelectionProps {
  // Optional props to make the component more flexible
  initialTab?: 'zipCode' | 'cityState' | 'geoLocation';
  className?: string;
}

const LocationSelection: React.FC<LocationSelectionProps> = ({ 
  initialTab = 'zipCode',
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'zipCode' | 'cityState' | 'geoLocation'>(initialTab);
  
  const { 
    zipCodes, 
    searchParams, 
    geoLocationOptions,
    useGeoLocation,
    handleZipCodeChange,
    handleUseGeoLocationChange,
    handleSearchParamsChange, 
    handleGeoLocationOptionsChange 
  } = useContext(LocationContext);

  const [zipCodeInput, setZipCodeInput] = useState<string>('');
  const [city, setCity] = useState<string>(searchParams.city || '');
  const [selectedStates, setSelectedStates] = useState<string[]>(searchParams.states || []);

  const handleTabChange = (tab: 'zipCode' | 'cityState' | 'geoLocation') => {
    setActiveTab(tab);
  };

  const handleZipCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCodeInput.trim()) {
      const newZipCode = zipCodeInput.trim();
      // Use the handleZipCodeChange directly from context if available
      // Otherwise implement locally
      if (typeof handleZipCodeChange === 'function') {
        handleZipCodeChange(newZipCode);
      } else {
        // Fallback implementation if context function is unavailable
        const updatedZipCodes = [...zipCodes];
        if (!updatedZipCodes.includes(newZipCode)) {
          updatedZipCodes.push(newZipCode);
          // If we have a search params handler, update through that
          if (typeof handleSearchParamsChange === 'function') {
            handleSearchParamsChange({
              ...searchParams,
              zipCodes: updatedZipCodes
            });
          }
        }
      }
      setZipCodeInput('');
    }
  };

  const handleRemoveZipCode = useCallback((zipCode: string) => {
    // Use the handleZipCodeChange directly from context if available
    // Otherwise implement locally
    if (typeof handleZipCodeChange === 'function') {
      handleZipCodeChange(zipCode); // Context will handle the toggle
    } else {
      // Fallback implementation if context function is unavailable
      const updatedZipCodes = zipCodes.filter(code => code !== zipCode);
      // If we have a search params handler, update through that
      if (typeof handleSearchParamsChange === 'function') {
        handleSearchParamsChange({
          ...searchParams,
          zipCodes: updatedZipCodes
        });
      }
    }
  }, [zipCodes, handleZipCodeChange, handleSearchParamsChange, searchParams]);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCity = e.target.value;
    setCity(newCity);
    handleSearchParamsChange({
      ...searchParams,
      city: newCity
    });
  };

  const handleStateToggle = (state: string) => {
    let newStates: string[];
    
    if (selectedStates.includes(state)) {
      newStates = selectedStates.filter(s => s !== state);
    } else {
      newStates = [...selectedStates, state];
    }
    
    setSelectedStates(newStates);
    handleSearchParamsChange({
      ...searchParams,
      states: newStates
    });
  };

  const handleGeolocationToggle = useCallback(() => {
    if (typeof handleUseGeoLocationChange === 'function') {
      handleUseGeoLocationChange(!useGeoLocation);
    }
    
    if (!useGeoLocation) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Success - will be handled by context
            // But we can also update parameters directly here as a fallback
            const { latitude, longitude } = position.coords;
            const radius = geoLocationOptions?.radius || 25;
            
            // Calculate bounding box
            const latRadius = radius / 69; // miles to degrees lat
            const lonRadius = radius / (Math.cos(latitude * Math.PI / 180) * 69); // miles to degrees lon, adjusted for latitude
            
            const geoBoundingBox = {
              top_left: {
                lat: latitude + latRadius,
                lon: longitude - lonRadius
              },
              bottom_right: {
                lat: latitude - latRadius,
                lon: longitude + lonRadius
              }
            };
            
            // Update search params if the context didn't already handle this
            if (typeof handleSearchParamsChange === 'function') {
              handleSearchParamsChange({
                ...searchParams,
                geoBoundingBox
              });
            }
          },
          (error) => {
            // Handle errors
            console.error('Geolocation error:', error.message);
            // Provide user feedback about the error
            switch (error.code) {
              case error.PERMISSION_DENIED:
                alert('Please allow location access to use this feature.');
                break;
              case error.POSITION_UNAVAILABLE:
                alert('Location information is unavailable.');
                break;
              case error.TIMEOUT:
                alert('The request to get user location timed out.');
                break;
              default:
                alert('An unknown error occurred when trying to access your location.');
                break;
            }
            // Revert the toggle since we couldn't get location
            if (typeof handleUseGeoLocationChange === 'function') {
              handleUseGeoLocationChange(false);
            }
          }
        );
      } else {
        // Geolocation not supported by browser
        alert('Geolocation is not supported by your browser.');
        // Revert the toggle
        if (typeof handleUseGeoLocationChange === 'function') {
          handleUseGeoLocationChange(false);
        }
      }
    }
  }, [useGeoLocation, handleUseGeoLocationChange, handleSearchParamsChange, searchParams, geoLocationOptions]);

  const handleRadiusChange = (radius: number) => {
    handleGeoLocationOptionsChange({ 
      ...geoLocationOptions,
      radius 
    });
  };

  useEffect(() => {
    // This could be expanded to load from URL params or localStorage
    // For now, we're just setting up the infrastructure
    const loadSavedData = () => {
      try {
        // Example: Load from localStorage if available
        const savedLocationData = localStorage.getItem('locationFilterData');
        if (savedLocationData) {
          const parsedData = JSON.parse(savedLocationData);
          
          // Set city if available
          if (parsedData.city && typeof parsedData.city === 'string') {
            setCity(parsedData.city);
            if (typeof handleSearchParamsChange === 'function') {
              handleSearchParamsChange({
                ...searchParams,
                city: parsedData.city
              });
            }
          }
          
          // Set states if available
          if (Array.isArray(parsedData.states)) {
            setSelectedStates(parsedData.states);
            if (typeof handleSearchParamsChange === 'function') {
              handleSearchParamsChange({
                ...searchParams,
                states: parsedData.states
              });
            }
          }
        }
      } catch (error) {
        console.error('Error loading saved location data:', error);
      }
    };
    
    loadSavedData();
  }, []);
  
  return (
    <div className={`location-filter ${className}`}>
      <h2>Filter by Location</h2>
      
      {/* Tab Navigation */}
      <div className="location-tabs">
        <button 
          className={`tab-button ${activeTab === 'zipCode' ? 'active' : ''}`} 
          onClick={() => handleTabChange('zipCode')}
        >
          Zip Codes
        </button>
        <button 
          className={`tab-button ${activeTab === 'cityState' ? 'active' : ''}`} 
          onClick={() => handleTabChange('cityState')}
        >
          City & State
        </button>
        <button 
          className={`tab-button ${activeTab === 'geoLocation' ? 'active' : ''}`} 
          onClick={() => handleTabChange('geoLocation')}
        >
          Geo Location
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="tab-content">
        {/* Zip Code Tab */}
        {activeTab === 'zipCode' && (
          <div className="zip-code-tab">
            <form onSubmit={handleZipCodeSubmit}>
              <input 
                type="text" 
                value={zipCodeInput} 
                onChange={(e) => setZipCodeInput(e.target.value.replace(/[^0-9]/g, '').substring(0, 5))} 
                placeholder="Enter zip code"
                pattern="[0-9]{5}"
                maxLength={5}
                aria-label="Zip code input"
              />
              <button type="submit">Add</button>
            </form>
            
            {zipCodes.length > 0 ? (
              <div className="zip-codes-list">
                <h3>Selected Zip Codes:</h3>
                <div className="zip-codes-grid">
                  {zipCodes.map((zipCode, index) => (
                    <div key={`zip-${zipCode}-${index}`} className="zip-code-item">
                      <span>{zipCode}</span>
                      <button 
                        onClick={() => handleRemoveZipCode(zipCode)}
                        aria-label={`Remove zip code ${zipCode}`}
                        title={`Remove ${zipCode}`}
                      >×</button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="empty-message">No zip codes selected</p>
            )}
          </div>
        )}
        
        {/* City & State Tab */}
        {activeTab === 'cityState' && (
          <div className="city-state-tab">
            <div className="city-input">
              <label htmlFor="city-input">City:</label>
              <input 
                id="city-input"
                type="text" 
                value={city} 
                onChange={handleCityChange} 
                placeholder="Enter city"
              />
            </div>
            
            <div className="states-selection">
              <h3>Select States:</h3>
              <div className="states-grid">
                {US_STATES.map((state) => (
                  <div 
                    key={state} 
                    className={`state-item ${selectedStates.includes(state) ? 'selected' : ''}`}
                    onClick={() => handleStateToggle(state)}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedStates.includes(state)} 
                      onChange={() => handleStateToggle(state)} 
                      id={`state-${state}`}
                    />
                    <label htmlFor={`state-${state}`}>{state}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Geo Location Tab */}
        {activeTab === 'geoLocation' && (
          <div className="geo-location-tab">
            <div className="geo-location-toggle">
              <input 
                type="checkbox" 
                id="use-geo-location" 
                checked={useGeoLocation} 
                onChange={handleGeolocationToggle} 
              />
              <label htmlFor="use-geo-location">Use current location</label>
            </div>
            
            {useGeoLocation && (
              <div className="radius-selection">
                <h3>Select Radius:</h3>
                <div className="radius-buttons">
                  <button 
                    className={`filter-button ${geoLocationOptions.radius === 5 ? 'active' : ''}`}
                    onClick={() => handleRadiusChange(5)}
                  >
                    5 miles
                  </button>
                  <button 
                    className={`filter-button ${geoLocationOptions.radius === 10 ? 'active' : ''}`}
                    onClick={() => handleRadiusChange(10)}
                  >
                    10 miles
                  </button>
                  <button 
                    className={`filter-button ${geoLocationOptions.radius === 25 ? 'active' : ''}`}
                    onClick={() => handleRadiusChange(25)}
                  >
                    25 miles
                  </button>
                  <button 
                    className={`filter-button ${geoLocationOptions.radius === 50 ? 'active' : ''}`}
                    onClick={() => handleRadiusChange(50)}
                  >
                    50 miles
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSelection;
