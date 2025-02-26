'use client';

import React from 'react';
import { createContext, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface LocationContextValue {
  zipCodes: string[];
  locations: Location[];
  searchParams: LocationSearchParams;
  geoLocationOptions: GeoLocationOptions;
  useGeoLocation: boolean;
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
  handleUseGeoLocationChange: () => {},
  handleSearchParamsChange: () => {},
  handleGeoLocationOptionsChange: () => {},
});

const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const zipCodesParam = searchParams.getAll('zipCodes');

  const [zipCodes, setZipCodes] = useState<number[]>(zipCodesParam.map(Number) || []);

  const [locations, setLocations] = useState<Location[]>([]);
  const [geoLocation, setGeoLocation] = useState(false);
  const [useGeoLocation, setUseGeoLocation] = useState(false);

  if (useGeoLocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // Calculate the coordinates of the bounding box
      const radius = 25; // miles
      const latRadius = radius / 69; // miles to degrees
      const lonRadius = radius / 54.6; // miles to degrees

      setGeoLocation({
        top: lat + latRadius,
        left: lon - lonRadius,
        bottom: lat - latRadius,
        right: lon + lonRadius,
      })
    });
  }

  const handleZipCodesChange = (zipCodes: number[]) => {
    if (zipCodes.includes(zipCode)) {
      setZipCodes(zipCodes.filter((code) => code !== zipCode));
    } else {
      setZipCodes([...zipCodes, zipCode]);
    }
  };

  const handleUseGeoLocationChange = (useGeoLocation: boolean) => {
    setUseGeoLocation(useGeoLocation);
  };

  return (
    <LocationContext.Provider value={{
      zipCodes,
      locations,
      setLocations,
      useGeoLocation,
      handleUseGeoLocationChange,
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export { LocationProvider, LocationContext };
