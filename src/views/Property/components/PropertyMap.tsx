import React, { useMemo, useEffect, useState } from 'react';
import Map from 'shared/components/Map';
import { Viewport } from 'react-leaflet';
import gql from 'graphql-tag';
import { parse } from 'query-string';
import { useQuery } from '@apollo/client';
import introspectionResult from 'shared/dataProvider/instrospection';
import pick from 'lodash/pick';
import { getCoordinates } from 'shared/components/PlacesAutocomplete';
// @ts-ignore
import { buildVariables } from 'ra-data-hasura';
import { getCentroid } from 'shared/utils';
import MapPopup from './MapPopup';

type PropertyMapResponse = {
  mapData?: {
    id: string;
    location_geography: {
      coordinates: [number, number];
      type: 'Point';
    };
  }[];
};
function PropertyMap(props: any) {
  const qs = parse(props.location.search);
  const resource = useMemo(() => introspectionResult.resources.find((e: any) => e.type.name === props.resource), [
    props.resource,
  ]);
  const query = useMemo(
    () => gql`
  query PropertyMap($where: ${props.resource}_bool_exp) {
    mapData: ${props.resource}(where: $where) {
      id
      location_geography
      location_address
      parcel_number
      residential_ownership_type_id
    }
  }
`,
    [],
  );
  const variables = buildVariables(null)(resource, 'GET_LIST', {
    filter: JSON.parse(qs.filter || '{}'),
  });
  const response = useQuery<PropertyMapResponse>(query, {
    variables: pick(variables, 'where'),
    fetchPolicy: 'cache-and-network',
  });
  const [viewPort, setViewPort] = React.useState<Viewport>({ center: [33.749, -84.388], zoom: 10 });
  const [selected, setSelected] = useState<any>(null);
  const markers = useMemo(() => {
    const data = response.data?.mapData ?? [];
    return data
      .filter((e) => e.location_geography)
      .map((e) => ({
        ...e,
        coordinates: getCoordinates(e.location_geography),
      }));
  }, [response.data?.mapData]);
  useEffect(changeCenter, [markers]);
  return (
    <Map
      height="calc(100vh - 204px)"
      viewport={viewPort}
      allowPin={false}
      markers={markers}
      selected={selected}
      onViewportChanged={(viewport: Viewport) => setViewPort(viewport)}
      onClickMarker={onClickMarker}
      onCloseMarker={() => setSelected(null)}
      markerPopup={selected && <MapPopup selected={selected} />}
      hasClustering
    />
  );

  function onClickMarker(marker: any) {
    setSelected(marker);
  }

  function changeCenter() {
    if (markers.length > 0) {
      const center = getCentroid(markers.map((e) => e.coordinates));
      setViewPort({
        ...viewPort,
        center,
      });
    }
  }
}

export default PropertyMap;
