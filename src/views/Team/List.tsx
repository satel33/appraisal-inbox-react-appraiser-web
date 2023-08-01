import * as React from 'react';
import { List, ListProps, useGetIdentity } from 'react-admin';
import { useListStyles } from 'shared/components/Resource/styles';
import ListActions from 'shared/components/Resource/ListActions';
import Filter from './Filter';
import Grid from './Grid';
import { elavatedRoles } from 'shared/constants/roles';
import { INDEX_LIST_PER_PAGE } from 'shared/constants/config';
import { createExporter } from 'shared/utils';
import { exportFields } from './fields';

const TeamList = (props: ListProps): JSX.Element => {
  const classes = useListStyles();
  const { identity } = useGetIdentity();
  const exporter = React.useMemo(() => createExporter(exportFields, 'team'), []);
  return (
    <List
      {...props}
      exporter={exporter}
      perPage={INDEX_LIST_PER_PAGE}
      classes={classes}
      bulkActionButtons={false}
      filters={<Filter />}
      actions={<ListActions hasCreate={elavatedRoles.includes(identity?.role)} />}
      syncWithLocation
      filterDefaultValues={{ enabled: true }}
      sort={{ field: 'full_name', order: 'ASC' }}
      resource="user_profiles"
      hasCreate={false}
    >
      <Grid />
    </List>
  );
};
export default TeamList;
