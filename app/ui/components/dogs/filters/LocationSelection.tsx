import React, { useState, useContext, useCallback } from 'react';
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
  initialTab?: 'zipCode' | 'cityState' | 'geoLocation';
  className?: string;
}

// This is a mock function that would be replaced with a real API call
// to get zip codes based on city and state
const fetchZipCodesByCityState = async (city: string, states: string[]): Promise<string[]> => {
  // This would be a real API call in your implementation
  console.log('Fetching zip codes for', city, states);
  // Mock response - in reality, this would come from your backend
  return ['12345', '67890'];
};

// This is a mock function that would be replaced with a real API call
// to get zip codes based on geolocation
const fetchZipCodesByGeoLocation = async (lat: number, lon: number, radius: number): Promise<string[]> => {
  // This would be a real API call in your implementation
  console.log('Fetching zip codes for coordinates', lat, lon, 'within', radius, 'miles');
  // Mock response - in reality, this would come from your backend
  return ['54321', '09876'];
};

const LocationSelection: React.FC<LocationSelectionProps> = ({ 
  initialTab = 'zipCode',
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'zipCode' | 'cityState' | 'geoLocation'>(initialTab);
  
  const { 
    zipCodes, 
    handleZipCodeChange,
    geoLocationOptions,
    useGeoLocation,
    handleUseGeoLocationChange,
    handleSearchParamsChange, 
    handleGeoLocationOptionsChange 
  } = useContext(LocationContext);

  const [zipCodeInput, setZipCodeInput] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Handle tab selection
  const handleTabChange = (tab: 'zipCode' | 'cityState' | 'geoLocation') => {
    setActiveTab(tab);
  };

  // Handle direct zip code input
  const handleZipCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCodeInput.trim()) {
      const newZipCode = zipCodeInput.trim();
      if (typeof handleZipCodeChange === 'function') {
        handleZipCodeChange(newZipCode);
      }
      setZipCodeInput('');
    }
  };

  // Handle zip code removal
  const handleRemoveZipCode = useCallback((zipCode: string) => {
    if (typeof handleZipCodeChange === 'function') {
      handleZipCodeChange(zipCode);
    }
  }, [handleZipCodeChange]);

  // Handle city input change
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCity = e.target.value;
    setCity(newCity);
  };

  // Handle state selection
  const handleStateToggle = (state: string) => {
    let newStates: string[];
    
    if (selectedStates.includes(state)) {
      newStates = selectedStates.filter(s => s !== state);
    } else {
      newStates = [...selectedStates, state];
    }
    
    setSelectedStates(newStates);
  };

  // Handle searching for zip codes based on city and state
  const handleCityStateSearch = async () => {
    if (!city || selectedStates.length === 0) {
      setSearchError('Please enter a city and select at least one state');
      return;
    }
    
    setIsSearching(true);
    setSearchError(null);
    
    try {
      // This would be replaced with your real API call
      const newZipCodes = await fetchZipCodesByCityState(city, selectedStates);
      
      // Add the returned zip codes to our selected zip codes
      newZipCodes.forEach(zipCode => {
        if (!zipCodes.includes(zipCode)) {
          handleZipCodeChange(zipCode);
        }
      });
      
      // Switch to zip code tab to show results
      setActiveTab('zipCode');
      
      // Clear the city and state selections
      setCity('');
      setSelectedStates([]);
      
    } catch (error) {
      console.error('Error fetching zip codes:', error);
      setSearchError('Error fetching zip codes. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle geolocation toggle
  const handleGeolocationToggle = useCallback(() => {
    if (typeof handleUseGeoLocationChange === 'function') {
      handleUseGeoLocationChange(!useGeoLocation);
    }
    
    if (!useGeoLocation) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const radius = geoLocationOptions?.radius || 25;
            
            // Update the context
            handleUseGeoLocationChange(true);
            
            // Fetch zip codes for this location
            setIsSearching(true);
            try {
              const newZipCodes = await fetchZipCodesByGeoLocation(latitude, longitude, radius);
              
              // Add the returned zip codes
              newZipCodes.forEach(zipCode => {
                if (!zipCodes.includes(zipCode)) {
                  handleZipCodeChange(zipCode);
                }
              });
              
              // Switch to zip code tab to show results
              setActiveTab('zipCode');
            } catch (error) {
              console.error('Error fetching zip codes by location:', error);
              setSearchError('Error fetching zip codes for your location. Please try again.');
            } finally {
              setIsSearching(false);
            }
          },
          (error) => {
            console.error('Geolocation error:', error.message);
            switch (error.code) {
              case error.PERMISSION_DENIED:
                setSearchError('Please allow location access to use this feature.');
                break;
              case error.POSITION_UNAVAILABLE:
                setSearchError('Location information is unavailable.');
                break;
              case error.TIMEOUT:
                setSearchError('The request to get user location timed out.');
                break;
              default:
                setSearchError('An unknown error occurred when trying to access your location.');
                break;
            }
            handleUseGeoLocationChange(false);
          }
        );
      } else {
        setSearchError('Geolocation is not supported by your browser.');
        handleUseGeoLocationChange(false);
      }
    }
  }, [useGeoLocation, zipCodes, handleUseGeoLocationChange, handleZipCodeChange, geoLocationOptions]);

  // Handle radius change and update search
  const handleRadiusChange = async (radius: number) => {
    // Update the radius in context
    handleGeoLocationOptionsChange({ 
      ...geoLocationOptions,
      radius 
    });
    
    // If geolocation is active, re-fetch zip codes with the new radius
    if (useGeoLocation && 'geolocation' in navigator) {
      setIsSearching(true);
      setSearchError(null);
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const newZipCodes = await fetchZipCodesByGeoLocation(latitude, longitude, radius);
            
            // Clear existing geolocation-based zip codes
            // This is a simplification - in a real app you'd track which zip codes came from geo
            // and only remove those before adding the new ones
            
            // Add the new zip codes
            newZipCodes.forEach(zipCode => {
              if (!zipCodes.includes(zipCode)) {
                handleZipCodeChange(zipCode);
              }
            });
            
            // Switch to zip code tab to show results
            setActiveTab('zipCode');
          } catch (error) {
            console.error('Error updating zip codes by location:', error);
            setSearchError('Error updating zip codes for your location. Please try again.');
          } finally {
            setIsSearching(false);
          }
        },
        (error) => {
          console.error('Geolocation error during radius update:', error);
          setIsSearching(false);
          setSearchError('Could not access your location to update the search radius.');
        }
      );
    }
  };
  
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
      
      {/* Error Message Display */}
      {searchError && (
        <div className="search-error">
          {searchError}
          <button 
            className="close-error" 
            onClick={() => setSearchError(null)}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}
      
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
            
            <div className="search-actions">
              <button 
                className="search-button" 
                onClick={handleCityStateSearch}
                disabled={isSearching || !city || selectedStates.length === 0}
              >
                {isSearching ? 'Searching...' : 'Find Zip Codes'}
              </button>
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
                    disabled={isSearching}
                  >
                    5 miles
                  </button>
                  <button 
                    className={`filter-button ${geoLocationOptions.radius === 10 ? 'active' : ''}`}
                    onClick={() => handleRadiusChange(10)}
                    disabled={isSearching}
                  >
                    10 miles
                  </button>
                  <button 
                    className={`filter-button ${geoLocationOptions.radius === 25 ? 'active' : ''}`}
                    onClick={() => handleRadiusChange(25)}
                    disabled={isSearching}
                  >
                    25 miles
                  </button>
                  <button 
                    className={`filter-button ${geoLocationOptions.radius === 50 ? 'active' : ''}`}
                    onClick={() => handleRadiusChange(50)}
                    disabled={isSearching}
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
