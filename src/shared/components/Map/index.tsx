import React, { useRef, useState, useEffect, ReactNode } from 'react';
import { Map as LeafletMap, TileLayer, LatLng, Marker, Popup, MapProps as LeafletMapProps } from 'react-leaflet';
import Control from 'react-leaflet-control';
import EditLocation from '@material-ui/icons/EditLocation';
import LocationOff from '@material-ui/icons/LocationOff';
import IconButton from '@material-ui/core/IconButton';
import L from 'leaflet';
import { makeStyles } from '@material-ui/core/styles';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-markercluster/dist/styles.min.css';

const useMapStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    height: (props: { height: string }) => props.height,
    '& .pin-enabled': {
      cursor: 'crosshair',
    },
    '& .leaflet-container': {
      width: '100%',
    },
    '& .leaflet-popup-content-wrapper': {
      padding: 0,
      borderRadius: 0,
    },
    '& .leaflet-popup-content': {
      margin: 0,
      '& p': {
        margin: 0,
      },
    },
  },
});
const useIconStyle = makeStyles({
  fontSizeLarge: {
    fontSize: '3.5rem',
  },
});
type RecordWithCoordinates = {
  id?: any;
  coordinates: [number, number];
};
type MapProps<T extends RecordWithCoordinates = RecordWithCoordinates> = {
  allowPin?: boolean;
  markerPopup?: ReactNode;
  onPin?(arg: LatLng): void;
  markers: T[];
  selected?: T | null;
  onCloseMarker?(): void;
  onClickMarker?(arg: T): void;
  getMarkerColor?(data: T): string;
  height?: string;
  hasClustering?: boolean;
} & Pick<LeafletMapProps, 'onViewportChanged' | 'viewport'>;
function Map(props: MapProps) {
  const mapRef = useRef<any>(null);
  const iconClasses = useIconStyle();
  const [pinEnabled, setPinEnabled] = useState(false);
  const classes = useMapStyles({ height: props.height ?? '' });
  const { markers, selected, hasClustering } = props;
  useEffect(() => {
    // const ref = mapRef;
    // if (pinEnabled) {
    //   L.DomUtil.addClass(ref?.current?.container as HTMLElement, 'pin-enabled');
    // } else {
    //   L.DomUtil.removeClass(ref?.current?.container as HTMLElement, 'pin-enabled');
    // }
  }, [pinEnabled]);
  return (
    <div className={classes.root}>
      <LeafletMap
        scrollWheelZoom={false}
        onViewportChanged={props.onViewportChanged}
        viewport={props.viewport}
        onClick={onClick}
        ref={mapRef}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selected && (
          <Popup
            maxHeight={300}
            minWidth={450}
            onClose={props.onCloseMarker}
            key={selected.id}
            position={selected.coordinates}
          >
            {props.markerPopup}
          </Popup>
        )}
        {hasClustering ? (
          <MarkerClusterGroup chunkedLoading>
            {markers.map((e: any) => (
              <Marker
                key={e.id || '1'}
                icon={
                  new L.DivIcon({
                    className: 'my-custom-pin',
                    iconAnchor: [0, 24],
                    popupAnchor: [0, -36],
                    html: customMarker(props.getMarkerColor?.(e) ?? ''),
                  })
                }
                position={e.coordinates}
                onClick={() => props.onClickMarker?.(e)}
              />
            ))}
          </MarkerClusterGroup>
        ) : (
          <>
            {markers.map((e: any) => (
              <Marker
                key={e.id || '1'}
                icon={
                  new L.DivIcon({
                    className: 'my-custom-pin',
                    iconAnchor: [0, 24],
                    popupAnchor: [0, -36],
                    html: customMarker(props.getMarkerColor?.(e) ?? ''),
                  })
                }
                position={e.coordinates}
                onClick={() => props.onClickMarker?.(e)}
              />
            ))}
          </>
        )}
        {props.allowPin && (
          <Control position="bottomright">
            <IconButton onClick={togglePin} aria-label="delete" size="medium">
              {pinEnabled ? (
                <LocationOff classes={iconClasses} color="primary" fontSize="large" />
              ) : (
                <EditLocation classes={iconClasses} color="primary" fontSize="large" />
              )}
            </IconButton>
          </Control>
        )}
      </LeafletMap>
    </div>
  );

  function togglePin() {
    setPinEnabled((prev) => !prev);
  }

  function onClick({ latlng }: { latlng: LatLng }) {
    if (pinEnabled) {
      props.onPin?.(latlng);
    }
  }
}

function customMarker(color: string) {
  return `<span style="background-color: ${color};
    width: 1.5rem;
    height: 1.5rem;
    display: block;
    left: -0.75rem;
    top: -0.75rem;
    position: relative;
    border-radius: 1.5rem 1.5rem 0;
    transform: rotate(45deg);
    border: 1px solid #FFFFFF" />
  `;
}

Map.defaultProps = {
  allowPin: true,
  height: '400px',
  getMarkerColor: () => '#2196f3',
};

export default Map;
