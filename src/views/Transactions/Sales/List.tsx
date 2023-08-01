import React from 'react';
import { List, Button, ListProps } from 'react-admin';
import omit from 'lodash/omit';
import { useListStyles } from 'shared/components/Resource/styles';
import SalesGrid from './SalesGrid';
import ListActions from 'shared/components/Resource/ListActions';
import ListFilter from './ListFilter';
import MapIcon from '@material-ui/icons/Map';
import ListIcon from '@material-ui/icons/List';
import PropertyMap from 'views/Property/components/PropertyMap';
import useLocationQuery from 'shared/hooks/useLocationQuery';
import usePersistentQueryString from 'shared/hooks/usePersistentQueryString';
import { INDEX_LIST_PER_PAGE } from 'shared/constants/config';
import { createExporter } from 'shared/utils';
import { exportFields } from './fields';

function SalesList(props: ListProps) {
  const classes = useListStyles();
  const [queryParams, onChangeQuery] = useLocationQuery();
  const [isMapView, setIsMapView] = React.useState(Boolean(queryParams.view === 'map'));
  usePersistentQueryString({});
  const exporter = React.useMemo(() => createExporter(exportFields, 'sales_comps'), []);
  return (
    <List
      {...omit(props, 'staticContext', 'total')}
      exporter={exporter}
      classes={classes}
      hasShow={false}
      hasCreate={false}
      hasEdit={false}
      hasList={true}
      resource="sales_comps"
      basePath="/properties/sales-comps"
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
        <PropertyMap resource="sales_comps" {...props} />
      ) : (
        <SalesGrid optimized rowClick="edit" isMainMenu />
      )}
    </List>
  );
}

export default SalesList;
