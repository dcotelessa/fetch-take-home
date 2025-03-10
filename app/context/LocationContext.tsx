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
  zipCodes: string[]; // Consistent typing as string[] throughout
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
  
  // Extract zipCodes from URL search params and ensure they're strings
  const zipCodesParam = searchParams.get('zipCodes')?.split(',') || [];

  // Initialize state with values from URL params
  const [zipCodes, setZipCodes] = useState<string[]>(zipCodesParam);
  // Since we're not using setLocations, let's just keep locations as an empty array
  // or we could fetch location data if needed
  const locations: Location[] = [];
  const [locationSearchParams, setLocationSearchParams] = useState<LocationSearchParams>({});
  const [geoLocationOptions, setGeoLocationOptions] = useState<GeoLocationOptions>({ radius: 25 });
  const [useGeoLocation, setUseGeoLocation] = useState(false);

  // This will toggle a zipCode (add if not present, remove if present)
  const handleZipCodeChange = (zipCode: string) => {
    if (zipCodes.includes(zipCode)) {
      setZipCodes(zipCodes.filter((code) => code !== zipCode));
    } else {
      setZipCodes([...zipCodes, zipCode]);
    }
  };

  // Controls the geo location toggle
  const handleUseGeoLocationChange = (geoLocationEnabled: boolean) => {
    setUseGeoLocation(geoLocationEnabled);
  };

  // Updates the search parameters used for querying
  const handleSearchParamsChange = (params: LocationSearchParams) => {
    setLocationSearchParams({
      ...locationSearchParams,
      ...params
    });
  };

  // Updates geolocation options (radius)
  const handleGeoLocationOptionsChange = (options: GeoLocationOptions) => {
    setGeoLocationOptions(options);
  };

  // When the component mounts, load zipCodes from URL
  useEffect(() => {
    const zipCodesFromUrl = searchParams.get('zipCodes')?.split(',') || [];
    if (zipCodesFromUrl.length > 0) {
      setZipCodes(zipCodesFromUrl);
    }
  }, [searchParams]);

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
