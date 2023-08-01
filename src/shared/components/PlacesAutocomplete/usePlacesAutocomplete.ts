import { loadScript } from 'shared/utils';
import { useState, useEffect, useRef, useMemo } from 'react';
import throttle from 'lodash/throttle';

export const geocodeByAddress = (address: string) => {
  const geocoder = new window.google.maps.Geocoder();
  const OK = window.google.maps.GeocoderStatus.OK;

  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status !== OK) {
        reject(status);
      }
      resolve(results);
    });
  });
};

export const geocodeByLatLng = (latlng: LatLng): Promise<google.maps.GeocoderResult[]> => {
  const geocoder = new window.google.maps.Geocoder();
  const OK = window.google.maps.GeocoderStatus.OK;
  return new Promise((resolve, reject) => {
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status !== OK) {
        reject(status);
      }
      resolve(results);
    });
  });
};

export const placeDescriptionByLatLng = (latlng: LatLng): Promise<PlaceType[]> => {
  const autoCompleteService = new (window as any).google.maps.places.AutocompleteService();
  return new Promise((resolve, reject) => {
    autoCompleteService.getPlacePredictions(
      { input: '', location: [latlng.lat, latlng.lng].join(',') },
      (results: PlaceType[]) => {
        resolve(results);
      },
    );
  });
};

export const getLatLng = (result: google.maps.GeocoderResult): Promise<LatLng> => {
  return new Promise((resolve, reject) => {
    try {
      const latLng = {
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng(),
      };
      resolve(latLng);
    } catch (e) {
      reject(e);
    }
  });
};

export const geocodeByPlaceId = (placeId: string): Promise<google.maps.GeocoderResult[]> => {
  const geocoder = new window.google.maps.Geocoder();
  const OK = window.google.maps.GeocoderStatus.OK;

  return new Promise((resolve, reject) => {
    geocoder.geocode({ placeId }, (results, status) => {
      if (status !== OK) {
        reject(status);
      }
      resolve(results);
    });
  });
};

export type LatLng = {
  lat: number;
  lng: number;
};

export interface PlaceType {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings: [
      {
        offset: number;
        length: number;
      },
    ];
  };
}
const autocompleteService = { current: null };

type UsePlacesProps = {
  onGeocodeSuccess(data: google.maps.GeocoderResult[], place: PlaceType): void;
  initialValue: PlaceType | null;
};

function usePlacesAutocomplete(props: UsePlacesProps) {
  const [value, setValue] = useState<PlaceType | null>(props.initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<PlaceType[]>([]);
  const loaded = useRef(false);

  const fetch = useMemo(memoisedFetch, []);
  useEffect(onMount, []);
  useEffect(onChangeOptions, [value, inputValue, fetch]);

  return [
    {
      value,
      options,
      isLoading,
      inputValue,
    },
    {
      setValue,
      onChange,
      setOptions,
      setInputValue,
    },
  ] as const;

  function onChange(value: PlaceType | null) {
    setOptions(value ? [value, ...options] : options);
    setValue(value);
    if (value?.place_id) {
      geocodeByPlaceId(value?.place_id).then((response) => props.onGeocodeSuccess(response, value));
    }
  }

  function onMount() {
    if (typeof window !== 'undefined' && !loaded.current) {
      if (!document.querySelector('#google-maps')) {
        loadScript(
          `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
          document.querySelector('head'),
          'google-maps',
        );
      }

      loaded.current = true;
    }
  }

  function memoisedFetch() {
    return throttle((request: { input: string }, callback: (results?: PlaceType[]) => void) => {
      (autocompleteService.current as any).getPlacePredictions(request, callback);
    }, 200);
  }

  function onChangeOptions() {
    let active = true;

    if (!autocompleteService.current && (window as any).google) {
      autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }
    setIsLoading(true);
    fetch({ input: inputValue }, (results?: PlaceType[]) => {
      setIsLoading(false);
      if (active) {
        let newOptions = [] as PlaceType[];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }
}

export default usePlacesAutocomplete;
