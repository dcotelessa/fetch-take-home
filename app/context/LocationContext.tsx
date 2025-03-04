'use client';

import React from 'react';
import { createContext, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Coordinates } from '@/app/hooks/useLocation';

interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

interface LocationSearchParams {
  city?: string;
  states?: string[];
  geoBoundingBox?: {
    top_left?: Coordinates;
    bottom_right?: Coordinates;
  };
  size?: number;
  from?: number;
}

interface GeoLocationOptions {
  radius: number; // miles
}

interface LocationContextValue {
  zipCodes: string[];
  locations: Location[];
  searchParams: LocationSearchParams;
  geoLocationOptions: GeoLocationOptions;
  useGeoLocation: boolean;
  handleZipCodeChange: (zipCode: string) => void;
  handleUseGeoLocationChange: (useGeoLocation: boolean) => void;
  handleSearchParamsChange: (searchParams: LocationSearchParams) => void;
  handleGeoLocationOptionsChange: (geoLocationOptions: GeoLocationOptions) => void;
}

const LocationContext = createContext<LocationContextValue>({
  zipCodes: [],
  locations: [],
  searchParams: {},
  geoLocationOptions: { radius: 25 }, // default radius
  useGeoLocation: false,
  handleZipCodeChange: () => {},
  handleUseGeoLocationChange: () => {},
  handleSearchParamsChange: () => {},
  handleGeoLocationOptionsChange: () => {},
});

const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const zipCodesParam = searchParams.getAll('zipCodes');

  const [zipCodes, setZipCodes] = useState<string[]>(zipCodesParam || []);
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationSearchParams, setLocationSearchParams] = useState<LocationSearchParams>({});
  const [geoLocationOptions, setGeoLocationOptions] = useState<GeoLocationOptions>({ radius: 25 });
  const [useGeoLocation, setUseGeoLocation] = useState(false);
  const [geoBoundingBox, setGeoBoundingBox] = useState<{
    top_left?: Coordinates;
    bottom_right?: Coordinates;
  }>({});

  // Effect to update geolocation bounding box when activated
  useEffect(() => {
    if (useGeoLocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Calculate the coordinates of the bounding box
        const radius = geoLocationOptions.radius; // miles
        const latRadius = radius / 69; // miles to degrees
        const lonRadius = radius / 54.6; // miles to degrees

        const newGeoBoundingBox = {
          top_left: {
            lat: lat + latRadius,
            lon: lon - lonRadius
          },
          bottom_right: {
            lat: lat - latRadius,
            lon: lon + lonRadius
          }
        };

        setGeoBoundingBox(newGeoBoundingBox);
        
        setLocationSearchParams(prev => ({
          ...prev,
          geoBoundingBox: newGeoBoundingBox
        }));
      });
    }
  }, [useGeoLocation, geoLocationOptions.radius]);

  const handleZipCodeChange = (zipCode: string) => {
    if (zipCodes.includes(zipCode)) {
      setZipCodes(zipCodes.filter((code) => code !== zipCode));
    } else {
      setZipCodes([...zipCodes, zipCode]);
    }
  };

  const handleUseGeoLocationChange = (useGeoLocation: boolean) => {
    setUseGeoLocation(useGeoLocation);
  };

  const handleSearchParamsChange = (params: LocationSearchParams) => {
    setLocationSearchParams({
      ...locationSearchParams,
      ...params
    });
  };

  const handleGeoLocationOptionsChange = (options: GeoLocationOptions) => {
    setGeoLocationOptions(options);
  };

  return (
    <LocationContext.Provider value={{
      zipCodes,
      locations,
      searchParams: locationSearchParams,
      geoLocationOptions,
      useGeoLocation,
      handleZipCodeChange,
      handleUseGeoLocationChange,
      handleSearchParamsChange,
      handleGeoLocationOptionsChange,
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export { LocationProvider, LocationContext };
