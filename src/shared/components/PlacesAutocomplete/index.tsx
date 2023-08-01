import React, { useCallback, useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { Box } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid, { GridSize } from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import parse from 'autosuggest-highlight/parse';
import Map from 'shared/components/Map';
import { useInput } from 'react-admin';
import usePlacesAutocomplete, { PlaceType, getLatLng, LatLng, geocodeByLatLng } from './usePlacesAutocomplete';
import { Viewport } from 'react-leaflet';
import { InputHelperText } from 'react-admin';
import { FieldTitle } from 'ra-core';
import intersection from 'lodash/intersection';
import L from 'leaflet';
import debounce from 'lodash/debounce';
import { TextInputProps } from 'ra-ui-materialui/lib/input/TextInput';

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  container: {
    flexGrow: 1,
    position: 'relative',
    // paddingTop: '5px',
  },
}));

function addPrefix(prefix: string, key: string): string {
  return [prefix, key].filter(Boolean).join('.');
}

type PlacesAutocompleteProps = Omit<TextInputProps, 'source'> & {
  source?: string;
  xlCols?: GridSize;
  isMapVisible?: boolean;
  aside?: React.ReactNode;
  lgCols?: GridSize;
  prefix?: string;
  variant?: string | undefined;
};
export default function PlacesAutocomplete(props: PlacesAutocompleteProps) {
  const classes = useStyles(props);
  const {
    prefix = '',
    isMapVisible = true,
    isRequired: isRequiredOverride,
    helperText,
    validate,
    source = addPrefix(prefix, 'location_address'),
    height,
    showLabel = false,
    autoFocus = true,
    aside,
    label,
    xlCols = 12,
    lgCols,
    disabled,
    variant,
  } = props;
  const {
    input: locationAddress,
    isRequired,
    meta: { touched, error },
  } = useInput({ source, validate });
  const { input: locationComponents } = useInput({ source: addPrefix(prefix, 'location_components') });
  const { input: locationGeography } = useInput({ source: addPrefix(prefix, 'location_geography') });
  const { input: locationPostalCode } = useInput({ source: addPrefix(prefix, 'location_postal_code') });
  const { input: locationCity } = useInput({ source: addPrefix(prefix, 'location_city') });
  const { input: locationCounty } = useInput({ source: addPrefix(prefix, 'location_county') });
  const { input: locationState } = useInput({ source: addPrefix(prefix, 'location_state') });
  const [viewPort, setViewPort] = React.useState<Viewport>(initializeViewPort);
  const [markers, setMarkers] = React.useState<{ coordinates: [number, number] }[]>(initializeMarkers);
  const debounceLocationAddressChange = useCallback(debounce(onLocationAddressChange, 3000), []);
  const [autoCompleteState, autoCompleteHandlers] = usePlacesAutocomplete({
    onGeocodeSuccess,
    initialValue: convertToPlaceType(locationAddress.value),
  });
  const { options, value, isLoading } = autoCompleteState;
  const { onChange, setInputValue } = autoCompleteHandlers;
  const defaultChange = () => {
    // intential default empty function
    console.log(); // Empty console log to bypass lint error about empty function body
  };
  const onInputValChangeCB = props.onInputValChange || defaultChange;
  const onInputValChange = useCallback(debounce(onInputValChangeCB, 2000), []);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  const getLabel = () => {
    if (label === ' ') {
      return '';
    } else if (label) {
      return label;
    } else {
      return 'Address';
    }
  };

  return (
    <div className={classes.container}>
      <Grid container spacing={2}>
        <Grid
          style={{ paddingTop: showLabel ? '0px' : 'auto' }}
          spacing={0}
          alignItems="center"
          container
          item
          xl={aside !== null ? xlCols : 12}
          lg={lgCols || 12}
        >
          {showLabel && (
            <Box style={{ width: '30%' }}>
              <Typography style={{ position: 'absolute', top: '16px' }}>Address</Typography>
            </Box>
          )}
          <Box style={{ width: showLabel ? '70%' : '100%' }} id="address-container">
            <Autocomplete
              disabled={disabled}
              id="google-map"
              loading={isLoading}
              getOptionLabel={(option) => option?.description ?? ''}
              filterOptions={(x) => x}
              options={options}
              autoComplete
              includeInputInList
              filterSelectedOptions
              freeSolo
              fullWidth
              value={value}
              onChange={(event, newValue: PlaceType | null | string) => {
                if (!newValue) onReset();
                if (typeof newValue === 'object') onChange(newValue);
              }}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
                debounceLocationAddressChange(newInputValue);
                if (onInputValChange && loading === false) {
                  onInputValChange(newInputValue);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputLabelProps={{ shrink: props.shrink }}
                  InputProps={{ ...params.InputProps, ...(props.InputProps ? props.InputProps : {}) }}
                  FormHelperTextProps={props.FormHelperTextProps}
                  variant={variant && variant === 'outlined' ? 'outlined' : 'standard'}
                  error={!!(touched && error)}
                  fullWidth
                  rowsMax={props.rows}
                  multiline={props.multiline}
                  autoFocus={autoFocus}
                  margin="dense"
                  label={
                    <FieldTitle
                      label={getLabel()}
                      isRequired={typeof isRequiredOverride !== 'undefined' ? isRequiredOverride : isRequired}
                    />
                  }
                  helperText={<InputHelperText touched={Boolean(touched)} error={error} helperText={helperText} />}
                />
              )}
              renderOption={(option) => {
                const matches = option.structured_formatting.main_text_matched_substrings ?? [];
                const parts = parse(
                  option.structured_formatting.main_text,
                  matches.map((match: any) => [match.offset, match.offset + match.length]),
                );

                return (
                  <Grid container alignItems="center">
                    <Grid item>
                      <LocationOnIcon className={classes.icon} />
                    </Grid>
                    <Grid item xs>
                      {parts.map((part, index) => (
                        <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                          {part.text}
                        </span>
                      ))}
                      <Typography variant="body2" color="textSecondary">
                        {option.structured_formatting.secondary_text}
                      </Typography>
                    </Grid>
                  </Grid>
                );
              }}
            />
          </Box>
        </Grid>
        {aside && aside}
      </Grid>

      {isMapVisible && (
        <Map
          viewport={viewPort}
          onPin={onPin}
          markers={markers}
          onViewportChanged={(viewport: Viewport) => setViewPort(viewport)}
          height={height}
          allowPin={!disabled}
        />
      )}
    </div>
  );

  async function onPin(result: LatLng) {
    setLocation(result);
    const [geocoded] = await Promise.all([geocodeByLatLng(result)]);
    const selected = geocoded[1];
    onChange({
      place_id: selected.place_id,
      description: selected.formatted_address,
      structured_formatting: {
        main_text: selected.address_components[0].short_name,
        secondary_text: selected.address_components[0].long_name,
        main_text_matched_substrings: [
          {
            length: 4,
            offset: 0,
          },
        ],
      },
    });
  }

  function onLocationAddressChange(value: string) {
    locationAddress.onChange(value);
  }

  function initializeViewPort() {
    const initialPosition = getCoordinates(locationGeography.value);
    return { center: initialPosition, zoom: 16 };
  }

  function initializeMarkers() {
    if (!locationGeography.value) {
      return [] as any;
    }
    const initialPosition = getCoordinates(locationGeography.value);
    return [
      {
        coordinates: initialPosition,
      },
    ];
  }

  function setLocation(result: LatLng) {
    const position: [number, number] = [result.lat, result.lng];
    setViewPort({
      center: position,
      zoom: Math.max(16, viewPort.zoom as number),
    });
    setMarkers([{ coordinates: position }]);
  }

  async function onGeocodeSuccess(results: google.maps.GeocoderResult[], placeType: PlaceType) {
    const latlng = await getLatLng(results[0]);
    setValues(results[0], latlng, placeType);
    setLocation(latlng);
  }

  function setValues(result: google.maps.GeocoderResult, latlng: LatLng, placeType?: PlaceType) {
    const { address_components: addressComponents } = result;
    locationPostalCode.onChange(addressComponents.find((e) => e.types.includes('postal_code'))?.long_name ?? '');
    locationState.onChange(
      addressComponents.find((e) => intersection(e.types, ['administrative_area_level_1']).length > 0)?.long_name ?? '',
    );
    locationCounty.onChange(
      addressComponents.find((e) => intersection(e.types, ['administrative_area_level_2']).length > 0)?.long_name ?? '',
    );
    locationCity.onChange(
      addressComponents.find((e) => intersection(e.types, ['locality']).length > 0)?.long_name ?? '',
    );
    if (placeType?.description) {
      locationAddress.onChange(placeType.description);
    } else {
      locationAddress.onChange(result.formatted_address);
    }
    const point = L.CRS.EPSG4326.project(latlng);
    locationGeography.onChange(
      JSON.stringify({
        type: 'Point',
        coordinates: [point.x, point.y],
      }),
    );
    locationComponents.onChange(result);
  }

  function onReset() {
    locationPostalCode.onChange('');
    locationState.onChange('');
    locationCounty.onChange('');
    locationCity.onChange('');
    locationAddress.onChange('');
    locationGeography.onChange(null);
    locationComponents.onChange(null);
  }
}

export function getCoordinates(data: { coordinates: [number, number] } | null): [number, number] {
  if (!data || !data.coordinates) {
    return [41.850033, -87.6500523];
  }
  const latlng = L.CRS.EPSG4326.unproject(new L.Point(data.coordinates[0], data.coordinates[1]));
  return [latlng.lat, latlng.lng];
}

function convertToPlaceType(formattedAddress: string): PlaceType | null {
  if (!formattedAddress) {
    return null;
  }
  return {
    place_id: '',
    description: formattedAddress,
    structured_formatting: {
      main_text: '',
      secondary_text: '',
      main_text_matched_substrings: [
        {
          length: 4,
          offset: 0,
        },
      ],
    },
  };
}
