import * as React from 'react';
import { List, ListProps, useGetIdentity } from 'react-admin';
import { useListStyles } from 'shared/components/Resource/styles';
import ListActions from 'shared/components/Resource/ListActions';
import Filter from './Filter';
import usePersistentQueryString from 'shared/hooks/usePersistentQueryString';
import { standardMutationRoles } from 'shared/constants/roles';
import Grid from './Grid';
import { INDEX_LIST_PER_PAGE } from 'shared/constants/config';
import { createExporter } from 'shared/utils';
import { exportFields } from './fields';

const ContactList = (props: ListProps): JSX.Element => {
  const classes = useListStyles();
  usePersistentQueryString({});
  const { identity } = useGetIdentity();
  const exporter = React.useMemo(() => createExporter(exportFields, 'contacts'), []);
  if (!identity) return <span />;
  const { role } = identity;
  return (
    <List
      {...props}
      exporter={exporter}
      classes={classes}
      perPage={INDEX_LIST_PER_PAGE}
      bulkActionButtons={false}
      filters={<Filter />}
      actions={<ListActions hasCreate={standardMutationRoles.includes(identity?.role ?? '')} />}
      resource="contacts"
      syncWithLocation
      hasCreate={false}
      sort={{ field: 'full_name', order: 'ASC' }}
    >
      <Grid role={role} />
    </List>
  );
};
export default ContactList;
