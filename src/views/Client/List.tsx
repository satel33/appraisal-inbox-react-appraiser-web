import * as React from 'react';
import { List, ListProps, useGetIdentity } from 'react-admin';
import ListFilter from './ListFilter';
import { useListStyles } from 'shared/components/Resource/styles';
import ListActions from 'shared/components/Resource/ListActions';
import usePersistentQueryString from 'shared/hooks/usePersistentQueryString';
import { standardMutationRoles } from 'shared/constants/roles';
import Grid from './Grid';
import { INDEX_LIST_PER_PAGE } from 'shared/constants/config';
import { createExporter } from 'shared/utils';
import { exportFields } from './fields';

const ClientList = (props: ListProps): JSX.Element => {
  const classes = useListStyles();
  usePersistentQueryString({});
  const { identity } = useGetIdentity();
  const exporter = React.useMemo(() => createExporter(exportFields, 'clients'), []);
  if (!identity) return <span />;
  const { role } = identity;
  return (
    <List
      {...props}
      exporter={exporter}
      perPage={INDEX_LIST_PER_PAGE}
      classes={classes}
      sort={{ field: 'name', order: 'ASC' }}
      filters={<ListFilter />}
      bulkActionButtons={false}
      actions={<ListActions hasCreate={standardMutationRoles.includes(role ?? '')} />}
      resource="clients"
      syncWithLocation
      hasCreate={false}
    >
      <Grid role={role} />
    </List>
  );
};

export default ClientList;
