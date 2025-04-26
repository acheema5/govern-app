import { useState, useEffect } from 'react';

interface LocationState {
  state: string | null;
  error: string | null;
  loading: boolean;
}

export const useStateLocation = () => {
  const [locationState, setLocationState] = useState<LocationState>({
    state: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    const getState = async (latitude: number, longitude: number) => {
      try {
        // Using the Census Bureau's Geocoder API
        const response = await fetch(
          `https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${longitude}&y=${latitude}&benchmark=Public_AR_Current&vintage=Current_Current&layers=States&format=json`
        );
        const data = await response.json();
        
        if (data.result?.geographies?.States?.[0]) {
          setLocationState({
            state: data.result.geographies.States[0].NAME,
            error: null,
            loading: false,
          });
        } else {
          setLocationState({
            state: null,
            error: 'Location not found in any US state',
            loading: false,
          });
          throw new Error('Could not determine state from coordinates');
        }
      } catch (error) {
        setLocationState({
          state: null,
          error: 'Failed to determine state from coordinates',
          loading: false,
        });
      }
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getState(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setLocationState({
            state: null,
            error: 'Unable to get your location. Please enable location services.',
            loading: false,
          });
        }
      );
    } else {
      setLocationState({
        state: null,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      });
    }
  }, []);

  return locationState;
};
