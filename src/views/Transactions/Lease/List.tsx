import React from 'react';
import { List, Button, ListProps } from 'react-admin';
import omit from 'lodash/omit';
import { useListStyles } from 'shared/components/Resource/styles';
import LeaseGrid from './LeaseGrid';
import ListActions from 'shared/components/Resource/ListActions';
import ListFilter from './ListFilter';
import MapIcon from '@material-ui/icons/Map';
import ListIcon from '@material-ui/icons/List';
import useLocationQuery from 'shared/hooks/useLocationQuery';
import PropertyMap from 'views/Property/components/PropertyMap';
import usePersistentQueryString from 'shared/hooks/usePersistentQueryString';
import { INDEX_LIST_PER_PAGE } from 'shared/constants/config';
import { createExporter } from 'shared/utils';
import { exportFields } from './fields';

function LeaseList(props: ListProps) {
  const classes = useListStyles();
  const [queryParams, onChangeQuery] = useLocationQuery();
  const [isMapView, setIsMapView] = React.useState(Boolean(queryParams.view === 'map'));
  usePersistentQueryString({});
  const exporter = React.useMemo(() => createExporter(exportFields, 'lease_comps'), []);
  return (
    <List
      {...omit(props, 'staticContext', 'total')}
      exporter={exporter}
      classes={classes}
      hasShow={false}
      hasCreate={false}
      hasEdit={false}
      hasList={true}
      resource="lease_comps"
      basePath="/properties/lease-comps"
      bulkActionButtons={false}
      perPage={INDEX_LIST_PER_PAGE}
      sort={{ field: 'created_at', order: 'DESC' }}
      actions={
        <ListActions
          customAction={
            <Button
              label={isMapView ? 'List' : 'Map'}
              onClick={() => {
                setIsMapView((prev) => !prev);
                onChangeQuery({ view: isMapView ? 'list' : 'map' });
              }}
            >
              {isMapView ? <ListIcon /> : <MapIcon />}
            </Button>
          }
        />
      }
      filters={<ListFilter />}
      syncWithLocation
    >
      {isMapView ? (
        <PropertyMap resource="lease_comps" {...props} />
      ) : (
        <LeaseGrid isMainMenu optimized rowClick="edit" />
      )}
    </List>
  );
}

export default LeaseList;
