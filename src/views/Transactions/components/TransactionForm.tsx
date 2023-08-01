import React from 'react';
import { TextInput, required, ReferenceInput } from 'react-admin';
import RichTextInput from 'ra-input-rich-text';
import Grid from '@material-ui/core/Grid';
import AutocompleteInput from 'shared/components/AutocompleteInput';

import { DateInput } from 'shared/components/Pickers';
import CurrencyInput from 'shared/components/CurrencyInput';
import SearchCreateContactField from 'views/Contact/components/SearchCreateContactField';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import Typography from '@material-ui/core/Typography';
import getTransactionPermission from '../permission';

type TransactionFormProps = {
  propertyTypeId?: number | null;
};

function TransactionForm(props: TransactionFormProps) {
  const [{ formData, permissions }] = useFormPermissions({ getPermission: getTransactionPermission });
  const { propertyTypeId } = props;
  const isResidential = propertyTypeId === 1 || formData.property_type_id === 1;
  const isCommercial = !isResidential;
  const isSale = formData.transaction_type_id === 1;
  const isLease = !isSale;
  const isCreate = Boolean(!formData.id);
  const disabled = isCreate ? !permissions.create : !permissions.edit;
  return (
    <Grid container spacing={2}>
      <Grid item container md={12} spacing={2}>
        <Grid item md={4}>
          <ReferenceInput
            label="Property Interest"
            source="property_interest_id"
            reference="property_interests"
            fullWidth
            perPage={100}
            variant="standard"
            validate={required()}
            sort={{ field: 'interest', order: 'ASC' }}
            filterToQuery={(searchText: string) => ({ interest: searchText })}
          >
            <AutocompleteInput disabled={disabled} source="property_interest_id" optionText="interest" />
          </ReferenceInput>
        </Grid>
      </Grid>
      {isSale && (
        <>
          <Grid item md={12}>
            <Typography style={{ fontSize: '1rem' }} variant="h6">
              Sale
            </Typography>
          </Grid>
          <Grid item container md={12} spacing={2}>
            <Grid item md={6}>
              <DateInput
                disabled={disabled}
                validate={required()}
                variant="standard"
                fullWidth
                label="Sale Date"
                source="sale_date"
              />
            </Grid>
            <Grid item md={6}>
              <CurrencyInput
                disabled={disabled}
                validate={required()}
                variant="standard"
                fullWidth
                source="sale_price"
                type="number"
              />
            </Grid>
          </Grid>
        </>
      )}
      {isLease && (
        <>
          <Grid item md={12}>
            <Typography style={{ fontSize: '1rem' }} variant="h6">
              Lease
            </Typography>
          </Grid>
          <Grid item md={6}>
            <DateInput
              variant="standard"
              validate={required()}
              fullWidth
              label="Lease Date Start"
              source="lease_date_start"
              disabled={disabled}
            />
          </Grid>
          <Grid item md={6}>
            <DateInput
              variant="standard"
              validate={required()}
              fullWidth
              label="Lease Date End"
              source="lease_date_end"
              disabled={disabled}
            />
          </Grid>
          {isCommercial && (
            <>
              <Grid item md={6}>
                <ReferenceInput
                  label="Lease Type"
                  source="commercial_lease_type_id"
                  reference="commercial_lease_types"
                  fullWidth
                  perPage={100}
                  variant="standard"
                  validate={required()}
                  sort={{ field: 'type', order: 'ASC' }}
                  filterToQuery={(searchText: string) => ({ type: searchText })}
                >
                  <AutocompleteInput disabled={disabled} source="commercial_lease_type_id" optionText="type" />
                </ReferenceInput>
              </Grid>
            </>
          )}
          {isResidential && (
            <>
              <Grid item md={6}>
                <ReferenceInput
                  label="Lease Type"
                  source="residential_lease_type_id"
                  reference="residential_lease_types"
                  fullWidth
                  perPage={100}
                  variant="standard"
                  validate={required()}
                  sort={{ field: 'type', order: 'ASC' }}
                  filterToQuery={(searchText: string) => ({ type: searchText })}
                >
                  <AutocompleteInput disabled={disabled} source="residential_lease_type_id" optionText="type" />
                </ReferenceInput>
              </Grid>
            </>
          )}
          <Grid item md={6}>
            <SearchCreateContactField
              title="Add Tenant"
              label="Tenant"
              source="tenant_id"
              reference="contacts"
              fullWidth
              perPage={Infinity}
              variant="standard"
              validate={required()}
              sort={{ field: 'full_name', order: 'ASC' }}
              filter={{ type: 'Tenant' }}
              mutationParams={{ contact_type_id: 12 }}
              filterToQuery={(searchText: string) => ({ full_name: searchText })}
              children={<span />}
              disabled={disabled}
            />
          </Grid>
        </>
      )}
      <Grid item md={12}>
        <Typography style={{ fontSize: '1rem' }} variant="h6">
          Financials
        </Typography>
      </Grid>
      {isResidential && (
        <>
          <Grid item container spacing={2} md={12}>
            <Grid item md={6}>
              <CurrencyInput
                label="Monthly Rent"
                disabled={disabled}
                variant="standard"
                fullWidth
                source="residential_monthly_rent"
              />
            </Grid>
          </Grid>
        </>
      )}
      {isCommercial && (
        <>
          <Grid item container spacing={2} md={12}>
            <Grid item md={6}>
              <TextInput
                variant="standard"
                min="0"
                max="100"
                type="number"
                fullWidth
                source="commercial_occupancy_rate"
                disabled={disabled}
                label="Occupancy rate"
              />
            </Grid>
            <Grid item md={6}>
              <CurrencyInput
                label="Rent per square foot"
                disabled={disabled}
                variant="standard"
                fullWidth
                source="commercial_rent_square_foot"
              />
            </Grid>
          </Grid>
          <Grid item container spacing={2} md={12}>
            <Grid item md={6}>
              <TextInput
                variant="standard"
                min="0"
                max="100"
                fullWidth
                source="commercial_cap_rate"
                type="number"
                disabled={disabled}
                label="Cap rate"
              />
            </Grid>
            <Grid item md={6}>
              <CurrencyInput
                disabled={disabled}
                variant="standard"
                fullWidth
                source="net_operating_income"
                label="Net Operating Income (NOI)"
              />
            </Grid>
          </Grid>
        </>
      )}
      <Grid item md={12}>
        <Typography style={{ fontSize: '1rem' }} variant="h6">
          Verification
        </Typography>
      </Grid>
      <Grid container item md={12} spacing={2}>
        <Grid item md={6}>
          <TextInput disabled={disabled} variant="standard" fullWidth source="instrument" />
        </Grid>
        <Grid item md={6}>
          <TextInput disabled={disabled} variant="standard" fullWidth source="deed_book" label="Deed Book & Page" />
        </Grid>
      </Grid>
      <Grid container item md={12} spacing={2}>
        <Grid item md={6}>
          <TextInput
            disabled={disabled}
            variant="standard"
            fullWidth
            source="verification_sources"
            label="Verification Sources"
          />
        </Grid>
        <Grid item md={6}>
          <TextInput disabled={disabled} variant="standard" fullWidth source="concessions" />
        </Grid>
      </Grid>
      {isSale && (
        <>
          <Grid item md={12}>
            <Typography style={{ fontSize: '1rem' }} variant="h6">
              Seller / Buyer
            </Typography>
          </Grid>
          <Grid item container md={12} spacing={2}>
            <Grid item md={6}>
              <SearchCreateContactField
                title="Add Grantor"
                label="Grantor"
                source="grantor_id"
                reference="contacts"
                fullWidth
                perPage={Infinity}
                variant="standard"
                filter={{ type: 'Seller' }}
                mutationParams={{ contact_type_id: 11 }}
                sort={{ field: 'full_name', order: 'ASC' }}
                filterToQuery={(searchText: string) => ({ full_name: searchText })}
                disabled={disabled}
                children={<span />}
              />
            </Grid>
            <Grid item md={6}>
              <SearchCreateContactField
                title="Add Grantee"
                label="Grantee"
                source="grantee_id"
                reference="contacts"
                fullWidth
                perPage={Infinity}
                variant="standard"
                filter={{ type: 'Buyer' }}
                mutationParams={{ contact_type_id: 3 }}
                sort={{ field: 'full_name', order: 'ASC' }}
                filterToQuery={(searchText: string) => ({ full_name: searchText })}
                children={<span />}
                disabled={disabled}
              />
            </Grid>
          </Grid>
        </>
      )}
      <Grid item md={12}>
        <Typography style={{ fontSize: '1rem' }} variant="h6">
          Notes
        </Typography>
      </Grid>
      <Grid item md={12}>
        <RichTextInput
          fullWidth
          key={`text-${disabled}`}
          source="notes"
          options={{ readOnly: disabled }}
          multiline
          variant="standard"
          label=""
        />
      </Grid>
    </Grid>
  );
}

export default TransactionForm;
