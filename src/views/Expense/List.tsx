import * as React from 'react';
import { List, ListProps, useGetIdentity } from 'react-admin';
import ListFilter from './Filter';
import { useListStyles } from 'shared/components/Resource/styles';
import ListActions from 'shared/components/Resource/ListActions';
import { standardMutationRoles } from 'shared/constants/roles';
import Grid from './Grid';
import { INDEX_LIST_PER_PAGE } from 'shared/constants/config';
import { createExporter } from 'shared/utils';
import { exportFields } from './fields';

const ExpenseList = (props: ListProps): JSX.Element => {
  const classes = useListStyles();
  const { identity } = useGetIdentity();
  const exporter = React.useMemo(() => createExporter(exportFields, 'expenses'), []);
  if (!identity) return <span />;
  const { role } = identity;

  return (
    <List
      {...props}
      exporter={exporter}
      basePath="/accounting"
      perPage={INDEX_LIST_PER_PAGE}
      classes={classes}
      sort={{ field: 'expense_date', order: 'ASC' }}
      filters={<ListFilter />}
      bulkActionButtons={false}
      actions={<ListActions hasCreate={standardMutationRoles.includes(role ?? '')} />}
      resource="expenses"
      syncWithLocation
      hasShow={false}
      hasCreate={false}
      hasEdit={true}
      hasList={true}
    >
      <Grid />
    </List>
  );
};

export default ExpenseList;
