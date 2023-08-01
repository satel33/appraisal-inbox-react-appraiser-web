import React from 'react';
import Grid from '@material-ui/core/Grid';
import { ReferenceManyField } from 'react-admin';
import CreateTransactionButton from './CreateTransactionButton';
import Typography from '@material-ui/core/Typography';
import SalesGrid from '../Sales/SalesGrid';
import LeaseGrid from '../Lease/LeaseGrid';
import { InjectedFieldProps, PublicFieldProps } from 'ra-ui-materialui/lib/field/types';
// import { Transaction } from '../types';
import { Property } from 'views/Property/types';
import { TAB_LIST_PER_PAGE } from 'shared/constants/config';
import Pagination from 'shared/components/Resource/Pagination';

type TransactionsListProps = PublicFieldProps &
  InjectedFieldProps<Property> & {
    readOnly: boolean;
  };

function TransactionsList(props: TransactionsListProps) {
  const { readOnly, ...restProps } = props;
  const [listKey, onReset] = React.useState(1);
  return (
    <>
      <Grid style={{ paddingBottom: '15px' }} container spacing={2}>
        <Grid item md={6}>
          <Typography style={{ fontSize: '1.1rem' }} variant="h6">
            Sales
          </Typography>
        </Grid>
        {!readOnly && (
          <Grid container item md={6} justify="flex-end">
            <CreateTransactionButton
              initialValues={{ transaction_type_id: 1, property_interest_id: 3 }}
              title="Add Sales Transaction"
              record={props.record}
              onSuccess={() => onReset((prev) => prev + 1)}
            />
          </Grid>
        )}
        <Grid item md={12}>
          <ReferenceManyField
            key={listKey}
            reference="sales_transactions"
            target="property_id"
            fullWidth
            addLabel={true}
            pagination={<Pagination />}
            perPage={TAB_LIST_PER_PAGE}
            {...restProps}
          >
            <SalesGrid readOnly={readOnly} onSuccess={() => onReset((prev) => prev + 1)} />
          </ReferenceManyField>
        </Grid>
      </Grid>

      <Grid style={{ paddingBottom: '15px' }} container spacing={2}>
        <Grid item md={6}>
          <Typography style={{ fontSize: '1.1rem' }} variant="h6">
            Leases
          </Typography>
        </Grid>
        {!readOnly && (
          <Grid container item md={6} justify="flex-end">
            <CreateTransactionButton
              initialValues={{ transaction_type_id: 2, property_interest_id: 6 }}
              title="Add Lease Transaction"
              onSuccess={() => onReset((prev) => prev + 1)}
              record={props.record}
            />
          </Grid>
        )}
        <Grid item md={12}>
          <ReferenceManyField
            key={listKey + 1}
            reference="lease_transactions"
            target="property_id"
            fullWidth
            addLabel={true}
            pagination={<Pagination />}
            perPage={TAB_LIST_PER_PAGE}
            {...restProps}
          >
            <LeaseGrid readOnly={readOnly} onSuccess={() => onReset((prev) => prev + 1)} />
          </ReferenceManyField>
        </Grid>
      </Grid>
    </>
  );
}

export default TransactionsList;
