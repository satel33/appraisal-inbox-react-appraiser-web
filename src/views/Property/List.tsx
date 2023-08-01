import * as React from 'react';
import { List, Button, ListProps } from 'react-admin';
import ListFilter from './ListFilter';
import { useListStyles } from 'shared/components/Resource/styles';
import ListActions from 'shared/components/Resource/ListActions';
import useLocationQuery from 'shared/hooks/useLocationQuery';
import MapIcon from '@material-ui/icons/Map';
import ListIcon from '@material-ui/icons/List';
import PropertyMap from './components/PropertyMap';
// import { standardMutationRoles } from 'shared/constants/roles';
import Grid from './Grid';
import { INDEX_LIST_PER_PAGE } from 'shared/constants/config';
import { createExporter } from 'shared/utils';
import { exportFields } from './fields';

const PropertyList = (props: ListProps): JSX.Element => {
  const classes = useListStyles();
  const [queryParams, onChangeQuery] = useLocationQuery();
  const [isMapView, setIsMapView] = React.useState(Boolean(queryParams.view === 'map'));
  // const { identity } = useGetIdentity();
  const exporter = React.useMemo(() => createExporter(exportFields, 'properties'), []);
  return (
    <List
      {...props}
      exporter={exporter}
      classes={classes}
      hasShow={false}
      hasEdit
      hasList
      resource="properties"
      basePath="/properties"
      bulkActionButtons={false}
      perPage={INDEX_LIST_PER_PAGE}
      filters={<ListFilter />}
      pagination={isMapView ? false : undefined}
      hasCreate={false}
      actions={
        <ListActions
          hasCreate={false}
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
      syncWithLocation
    >
      {isMapView ? <PropertyMap resource="properties" {...props} /> : <Grid />}
    </List>
  );
};
export default PropertyList;
