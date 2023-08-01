import React, { useMemo, useEffect, useState } from 'react';
import Map from 'shared/components/Map';
import { Viewport } from 'react-leaflet';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import introspectionResult from 'shared/dataProvider/instrospection';
import pick from 'lodash/pick';
import { getCoordinates } from 'shared/components/PlacesAutocomplete';
// @ts-ignore
import { buildVariables } from 'ra-data-hasura';
import { getCentroid } from 'shared/utils';
import MapPopup from './MapPopup';
import { getBackgroundColorMapping } from 'shared/hooks/useRowStyle';
import { AppraisalWithCoordinates, Appraisals } from 'views/Appraisal/types';
import useLocationQuery from 'shared/hooks/useLocationQuery';

type AppraisalMapResponse = {
  mapData?: Appraisals[];
};

const APPRAISAL_MAP_QUERY = gql`
  query AppraisalMap($where: appraisals_bool_exp) {
    mapData: appraisals(where: $where) {
      id
      location_geography
      appraisal_file_number
      property_type_id
      appraisal_status_id
      appraisal_status
      client_name
      location_address
      assignee_user_account_names
      due_date_in
      inspection_date_in
      completed_date
      due_date
      inspection_date
    }
  }
`;
const appraisalResource = introspectionResult.resources.find((e) => e.type.name === 'appraisals');
function AppraisalMap() {
  const [query] = useLocationQuery();
  const variables = buildVariables(null)(appraisalResource, 'GET_LIST', {
    filter: JSON.parse(query.filter || '{}'),
  });
  const response = useQuery<AppraisalMapResponse>(APPRAISAL_MAP_QUERY, {
    variables: pick(variables, 'where'),
    fetchPolicy: 'cache-and-network',
  });
  const [viewPort, setViewPort] = React.useState<Viewport>({ center: [33.749, -84.388], zoom: 10 });
  const [selected, setSelected] = useState<AppraisalWithCoordinates | null>(null);
  const markers: AppraisalWithCoordinates[] = useMemo(() => {
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
      getMarkerColor={getMarkerColor}
      markerPopup={selected && <MapPopup selected={selected} />}
      hasClustering
    />
  );

  function onClickMarker(marker: AppraisalWithCoordinates) {
    setSelected(marker);
  }

  function getMarkerColor(marker: AppraisalWithCoordinates) {
    return getBackgroundColorMapping(marker.appraisal_status);
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

export default AppraisalMap;
