import React, { useMemo } from 'react';
import { required, TextInput, useGetIdentity } from 'react-admin';
import { DateInput, DateTimeInput } from 'shared/components/Pickers';

import CurrencyInput from 'shared/components/CurrencyInput';
import Grid from '@material-ui/core/Grid';
import ClientReferenceInput from 'views/Client/ClientReferenceInput';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import MenuButtonInput from 'shared/components/MenuButtonInput';
import AutocompleteArrayInput from 'shared/components/AutocompleteArrayInput';
import { QueryResult } from '@apollo/client';
import { User_Profiles } from 'shared/generated/types';
import useAppraisalOptions, { AppraisalOptionsResponse } from 'shared/hooks/useAppraisalOptions';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import getAppraisalPermission from '../permission';
import LinearProgress from '@material-ui/core/LinearProgress';
import { displayDateIn } from 'shared/utils';
import CustomSelectInput from 'shared/components/CustomSelectInput';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

type FixedDisplayFormProps = {
  isExistingProperty?: boolean;
  isCreate?: boolean;
  appraisalOptions: QueryResult<AppraisalOptionsResponse>;
};

export default function FixedDisplayForm(props: FixedDisplayFormProps) {
  const { isCreate, isExistingProperty } = props;
  const [{ formData, permissions }] = useFormPermissions({ getPermission: getAppraisalPermission });
  const [appraisalOptions] = useAppraisalOptions();
  const { identity } = useGetIdentity();
  const assignees = useMemo(() => {
    let options = appraisalOptions.data?.assignees ?? [];
    if (identity?.role === 'appraisal_firm_limited_access') {
      options = options.filter((e) => e.id === identity?.id);
    }
    return options;
  }, [identity?.role, appraisalOptions.data?.assignees]);
  const defaultAssignee = useMemo(() => (isCreate ? [identity?.id] : []), [identity?.id]);
  const { loading } = appraisalOptions;
  if (!identity) return null;
  return (
    <Grid container spacing={2}>
      <Grid item md={6} xs={12}>
        {loading ? (
          <LinearProgress />
        ) : (
          <MenuButtonInput
            isRequired
            label="Status"
            variant="standard"
            source="appraisal_status_id"
            optionText="status"
            disabled={isCreate ? !permissions.create : !permissions.edit}
            choices={appraisalOptions.data?.appraisalStatuses ?? []}
          />
        )}
      </Grid>
      <Grid item md={6} xs={12}>
        {loading ? (
          <LinearProgress />
        ) : (
          <AutocompleteInput
            label="Priority"
            source="appraisal_priority_id"
            fullWidth
            optionText="priority"
            variant="standard"
            choices={appraisalOptions.data?.appraisalPriorities ?? []}
            disabled={isCreate ? !permissions.create : !permissions.edit}
          />
        )}
      </Grid>
      {props.isCreate && (
        <>
          <Grid item md={12}>
            <TextInput
              disabled={isCreate ? !permissions.create : !permissions.edit}
              source="appraisal_file_number"
              required
              fullWidth
              variant="standard"
            />
          </Grid>
          <Grid item md={12}>
            <CustomSelectInput
              label="Property Type"
              fullWidth
              variant="standard"
              validate={[required()]}
              choices={appraisalOptions.data?.propertyTypes ?? []}
              source="property_type_id"
              optionText="type"
              disabled={isExistingProperty}
            />
          </Grid>
        </>
      )}
      {!isCreate && (
        <>
          {formData.property_type_id === 1 && (
            <>
              <Grid item sm={12} md={12}>
                <AutocompleteInput
                  label="Ownership"
                  variant="standard"
                  fullWidth
                  source="property.residential_ownership_type_id"
                  optionText="type"
                  choices={appraisalOptions.data?.residentialOwnershipTypes ?? []}
                  disabled={!permissions.edit}
                />
              </Grid>
              <Grid item sm={12} md={12}>
                <AutocompleteInput
                  label="Style"
                  fullWidth
                  variant="standard"
                  source="property.residential_style_id"
                  optionText="style"
                  choices={appraisalOptions.data?.residentialStyles ?? []}
                  disabled={!permissions.edit}
                />
              </Grid>
            </>
          )}
          {formData.property_type_id === 2 && (
            <>
              <Grid item sm={12} md={12}>
                <AutocompleteInput
                  choices={appraisalOptions.data?.commercialPropertyTypes ?? []}
                  label="Commercial Property Type"
                  variant="standard"
                  fullWidth
                  source="property.commercial_property_type_id"
                  optionText="type"
                  disabled={!permissions.edit}
                />
              </Grid>
              <Grid item md={12}>
                <AutocompleteInput
                  label="Property Subtype"
                  fullWidth
                  source="property.commercial_property_subtype_id"
                  optionText="subtype"
                  variant="standard"
                  disabled={!permissions.edit}
                  choices={
                    appraisalOptions.data?.commercialPropertySubTypes.filter(
                      (e: any) =>
                        e.commercial_property_type_id === formData.property?.commercial_property_type_id ||
                        e.commercial_property_type_id === formData.commercial_property_type_id,
                    ) ?? []
                  }
                />
              </Grid>
            </>
          )}
        </>
      )}
      <Grid item md={12}>
        <Grid item md={12}>
          <Grid container spacing={1} alignItems="center">
            <Grid item sm={12} md={8}>
              <DateTimeInput
                disabled={isCreate ? !permissions.create : !permissions.edit}
                source="inspection_date"
                variant="standard"
                fullWidth
              />
            </Grid>
            {formData.inspection_date_in && (
              <Grid item md={4}>
                <Typography>{displayDateIn(formData.inspection_date_in)}</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={1} alignItems="center">
          <Grid item sm={12} md={8}>
            <DateTimeInput
              disabled={isCreate ? !permissions.create : !permissions.edit}
              source="due_date"
              variant="standard"
              fullWidth
            />
          </Grid>
          {formData.due_date_in && (
            <Grid item md={4}>
              <Typography>{displayDateIn(formData.due_date_in)}</Typography>
            </Grid>
          )}
          {formData.due_date === null && (
            <Grid item md={3}>
              <Typography>
                <Box fontStyle="italic">Unscheduled</Box>
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
      {!props.isCreate && (
        <Grid item md={12}>
          <Grid md={8}>
            <DateInput disabled={!permissions.edit} source="completed_date" variant="standard" fullWidth />
          </Grid>
          <Grid item sm={12} md={6}>
            <CurrencyInput disabled={!permissions.edit} label="Quote Fee" variant="standard" fullWidth source="quote_fee" />
          </Grid>
          <Grid item sm={12} md={6}>
            <CurrencyInput
              disabled={!permissions.edit}
              variant="standard"
              label="Report Fee"
              fullWidth
              source="report_fee"
            />
          </Grid>
        </Grid>
      )}
      <Grid item sm={12} md={12}>
        <ClientReferenceInput
          source="client_id"
          reference="client"
          fullWidth
          validate={required()}
          disabled={isCreate ? !permissions.create : !permissions.edit}
          variant="standard"
          sort={{ field: 'name', order: 'ASC' }}
          filterToQuery={(searchText: string) => ({ name: searchText })}
          perPage={Infinity}
          children={<span />}
        />
      </Grid>
      <Grid item sm={12} md={12}>
        {loading ? (
          <LinearProgress />
        ) : (
          <AutocompleteArrayInput
            fullWidth
            variant="standard"
            label="Assignees"
            source="assignee_user_account_ids"
            choices={assignees}
            defaultValue={defaultAssignee}
            disabled={isCreate ? !permissions.create : !permissions.edit}
            optionText={(record: User_Profiles) => record?.full_name}
            disableRemoveValues={
              !isCreate && ['appraisal_firm_limited_access'].includes(identity?.role) ? [identity?.id] : []
            }
          />
        )}
      </Grid>
    </Grid>
  );
}
