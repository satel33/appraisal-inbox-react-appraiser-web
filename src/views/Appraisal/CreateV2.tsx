import React, { useEffect, useMemo, useState } from 'react';
import {
  SimpleForm,
  required,
  useNotify,
  Create,
  ResourceContextProvider,
  useRedirect,
  useGetIdentity,
  CreateProps,
  Record,
  useInput,
  TextInput,
  FormDataConsumer,
} from 'react-admin';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import PlacesAutocomplete from 'shared/components/PlacesAutocomplete';
import Toolbar from 'shared/components/Resource/ToolbarV2';
import useAppraisalOptions, { AppraisalOptionsResponse } from 'shared/hooks/useAppraisalOptions';
import { useDispatch } from 'react-redux';
import { FetchMenuCount } from './reducer';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import omit from 'lodash/omit';
import EditAction from 'shared/components/Resource/EditAction';
import useLocationQuery from 'shared/hooks/useLocationQuery';
import { Appraisal } from 'views/Appraisal/types';
import { Property, User_Profiles } from 'shared/generated/types';
import { QueryResult } from '@apollo/client';
import getAppraisalPermission from './permission';
import { incrementFileNumber } from 'shared/utils';
import useLastAppraisal from 'shared/hooks/useLastAppraisal';
import { Card, Divider, Typography, Box } from '@material-ui/core';
import MenuButtonInput from '../../shared/components/MenuButtonInput';
import CustomSelectInput from '../../shared/components/CustomSelectInput';
import ClientReferenceInput from '../Client/ClientReferenceInputV2';
import { DateTimeInput } from '../../shared/components/Pickers';
import AutocompleteArrayInput from '../../shared/components/AutocompleteArrayInput';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import { DateInput } from 'shared/components/Pickers';
import CurrencyInput from 'shared/components/CurrencyInput';
import CircularProgress from '@material-ui/core/CircularProgress';

const INSERT_PROPERTY = gql`
  mutation insert_property($object: property_insert_input!) {
    property: insert_property_one(object: $object) {
      id
    }
  }
`;

const CreateAppraisal = (props: CreateProps) => {
  const { identity } = useGetIdentity();
  const dispatch = useDispatch();
  const notify = useNotify();
  const redirect = useRedirect();
  const [mutation] = useMutation<{ property: Property }>(INSERT_PROPERTY);
  if (!identity) {
    return <span />;
  }

  return (
    <ResourceContextProvider value="appraisal">
      <Create
        {...props}
        actions={<EditAction />}
        basePath="/appraisals"
        onSuccess={onSuccess}
        transform={transform}
        resource="appraisal"
      >
        <CreateAppraisalFields />
      </Create>
    </ResourceContextProvider>
  );

  function onSuccess({ data }: { data: Appraisal }) {
    dispatch(FetchMenuCount());
    notify('appraisal.created');
    redirect(`/appraisals/${data.id}`);
  }

  async function transform(data: Record) {
    let newAppraisal: Appraisal = {
      ...(data as Appraisal),
    };
    if (data.assignee_user_account_ids && typeof data.assignee_user_account_ids === 'string') {
      newAppraisal.assignee_user_account_ids = [data.assignee_user_account_ids];
    }
    const contactIds = localStorage.getItem('contactIds');
    if (contactIds) {
      const ids = JSON.parse(contactIds);
      newAppraisal.contact_ids = ids;
      localStorage.removeItem('contactIds');
    }
    if (!newAppraisal.property_id) {
      let residentialOwnershipType = null;
      if (newAppraisal.property_type_id === 1) {
        residentialOwnershipType = 1;
      }
      const response = await mutation({
        variables: {
          object: {
            ...newAppraisal.property,
            property_type_id: newAppraisal.property_type_id,
            residential_ownership_type_id: residentialOwnershipType,
          },
        },
      });
      newAppraisal = {
        ...omit(newAppraisal, 'property'),
        property_id: response?.data?.property?.id,
      } as Appraisal;
    } else {
      newAppraisal = {
        ...omit(newAppraisal, 'property'),
      } as Appraisal;
    }
    return newAppraisal;
  }
};

type PropertyFieldProps = {
  label: string;
  setIsExistingProperty(arg: boolean): void;
  appraisalOptions: QueryResult<AppraisalOptionsResponse>;
  variant?: 'standard' | 'filled' | 'outlined' | undefined;
};

function CreateAppraisalFields(props: any) {
  const styles = makeStyles({
    divider: {
      marginBottom: '20px',
      width: '100%',
    },
    dividerBottom: {
      marginBottom: '5px',
      marginTop: '30px',
      width: '100%',
    },
    formContainer: {
      display: 'flow-root',
      width: '100%',
      alignItems: 'flex-start',
      flexDirection: 'column',
      paddingLeft: '10px',
      paddingRight: '10px',
    },
    sectionHeading: {
      marginTop: '30px',
    },
    heading: {
      marginTop: '14px',
    },
    mapBottomText: {
      fontStyle: 'italic',
      marginTop: '5px',
      marginBottom: '15px',
      fontSize: '16px',
      color: '#444444',
    },
    formBottom: {
      marginBottom: '35px',
    },
    pillsMargin: {
      marginBottom: '23px',
    },
  });
  const classes = styles();
  const [appraisalOptions] = useAppraisalOptions();
  const [query] = useLocationQuery();
  const [isExistingProperty, setIsExistingProperty] = useState(Boolean(query.property_id));
  const { identity } = useGetIdentity();
  const assignees = useMemo(() => {
    let options = appraisalOptions.data?.assignees ?? [];
    if (identity?.role === 'appraisal_firm_limited_access') {
      options = options.filter((e) => e.id === identity?.id);
    }
    return options;
  }, [identity?.role, appraisalOptions.data?.assignees]);
  const isCreate = true;
  const defaultAssignee = useMemo(() => (isCreate ? [identity?.id] : []), [identity?.id]);
  const [appraisalStatus, setAppraisalStatus] = useState(1);
  const [quoteMadeDate, setQuoteMadeDate] = useState<any>(null);
  const [propertyType, setPropertyType] = useState<any>(null);
  const [reportType, setReportType] = useState<any>(2);

  useEffect(() => {
    if (appraisalStatus === 8) {
      setQuoteMadeDate(new Date());
    } else {
      setQuoteMadeDate(null);
    }
  }, [appraisalStatus]);

  useEffect(() => {
    if (propertyType === 1) {
      // Residential
      setReportType(1);
    } else {
      // Commercial
      setReportType(2);
    }
  }, [propertyType]);

  const { loading } = appraisalOptions;
  if (!identity) return null;

  if (loading)
    return (
      <Grid container direction="column" alignItems="center">
        <CircularProgress />
      </Grid>
    );

  return (
    <Card variant="outlined" className={classes.formBottom}>
      <Box pr={2}>
        <SimpleForm
          {...props}
          initialValues={{
            appraisal_status_id: 1,
            property_type_id: 2,
            appraisal_priority_id: 1,
            report_type_id: reportType,
            engagement_date: new Date(),
            quote_made_date: quoteMadeDate,
            property: { residential_ownership_type_id: 1 },
          }}
          toolbar={<Toolbar getPermission={getAppraisalPermission} />}
        >
          <FormDataConsumer>
            {({ formData, ...rest }) => (
              <Box className={classes.formContainer}>
                <Typography classes={{ root: classes.heading }}>ORDER</Typography>
                <Divider classes={{ root: classes.divider }}></Divider>
                <Grid container direction="column" alignItems="center">
                  <Grid container item md={4}>
                    <TextInput label="Appraisal File #" source="appraisal_file_number" fullWidth variant="outlined" />
                  </Grid>
                  <Divider></Divider>
                  <Grid container item md={4}>
                    <MenuButtonInput
                      isRequired
                      fullWidth
                      label="Status"
                      variant="outlined"
                      onChange={(val: number) => setAppraisalStatus(val)}
                      source="appraisal_status_id"
                      optionText="status"
                      choices={appraisalOptions.data?.appraisalStatuses ?? []}
                    />
                    <Box m={1}>&nbsp;</Box>
                  </Grid>
                  <Divider></Divider>
                  <Grid container item md={4}>
                    <AutocompleteInput
                      label="Priority"
                      source="appraisal_priority_id"
                      fullWidth
                      optionText="priority"
                      variant="outlined"
                      choices={appraisalOptions.data?.appraisalPriorities ?? []}
                    />
                  </Grid>
                </Grid>
                <Typography classes={{ root: classes.sectionHeading }}>LOCATION</Typography>
                <Divider classes={{ root: classes.divider }}></Divider>
                <Grid container direction="row" alignItems="center">
                  <Grid item md={4} sm={12} xs={12}></Grid>
                  <Grid item md={8} sm={12} xs={12}>
                    <PropertyField
                      label="Subject Address"
                      variant="outlined"
                      setIsExistingProperty={setIsExistingProperty}
                      appraisalOptions={appraisalOptions}
                    />
                    <Typography classes={{ root: classes.mapBottomText }}>
                      Can't find property by address? Manually select by clicking pen icon then selecting parcel
                    </Typography>
                    <TextInput
                      variant="outlined"
                      fullWidth
                      source="property.subdivision"
                      label="Subdivision, lot, legal description"
                    />
                  </Grid>
                </Grid>
                <Typography classes={{ root: classes.sectionHeading }}>PROPERTY TYPE</Typography>
                <Divider classes={{ root: classes.divider }}></Divider>
                <Grid container direction="row" alignItems="center">
                  <Grid item md={4} sm={12} xs={12}></Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <CustomSelectInput
                      className={classes.pillsMargin}
                      label=""
                      fullWidth
                      customCSS={{
                        chips: {
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                        },
                      }}
                      variant="outlined"
                      choices={appraisalOptions.data?.propertyTypes ?? []}
                      source="property_type_id"
                      onChange={(val: number) => setPropertyType(val)}
                      optionText="type"
                      disabled={isExistingProperty}
                    />
                  </Grid>
                </Grid>
                <Grid container direction="column" alignContent="center">
                  {formData.property_type_id === 1 && (
                    <>
                      <Grid container item md={4}>
                        <AutocompleteInput
                          label="Ownership"
                          variant="outlined"
                          fullWidth
                          source="property.residential_ownership_type_id"
                          optionText="type"
                          choices={appraisalOptions.data?.residentialOwnershipTypes ?? []}
                        />
                      </Grid>
                      <Grid container item md={4}>
                        <AutocompleteInput
                          label="Style"
                          fullWidth
                          variant="outlined"
                          source="property.residential_style_id"
                          optionText="style"
                          choices={appraisalOptions.data?.residentialStyles ?? []}
                        />
                      </Grid>
                    </>
                  )}
                  {formData.property_type_id === 2 && (
                    <>
                      <Grid container item md={4}>
                        <AutocompleteInput
                          choices={appraisalOptions.data?.commercialPropertyTypes ?? []}
                          label="Property Type"
                          variant="outlined"
                          fullWidth
                          source="property.commercial_property_type_id"
                          optionText="type"
                        />
                      </Grid>
                      <Grid container item md={4}>
                        <AutocompleteInput
                          label="Property Subtype"
                          fullWidth
                          source="property.commercial_property_subtype_id"
                          optionText="subtype"
                          variant="outlined"
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
                </Grid>
                <Typography classes={{ root: classes.sectionHeading }}>CLIENT</Typography>
                <Divider classes={{ root: classes.divider }}></Divider>
                <Grid container direction="row" alignItems="center">
                  <Grid container item md={4} sm={12} xs={12}></Grid>
                  <Grid container item md={4} sm={12} xs={12}>
                    <TextInput label="Client File #" source="client_file_number" fullWidth variant="outlined" />
                  </Grid>
                  <ClientReferenceInput
                    source="client_id"
                    reference="client"
                    fullWidth
                    validate={required()}
                    variant="outlined"
                    sort={{ field: 'name', order: 'ASC' }}
                    filterToQuery={(searchText: string) => ({ name: searchText })}
                    perPage={Infinity}
                    children={<span />}
                    showContacts={true}
                    layout="grid"
                    customCSS={{
                      root: {
                        display: 'flex',
                        alignItems: 'self-start',
                        flex: 1,
                      },
                      create: {
                        marginBottom: '20px',
                      },
                    }}
                  />
                </Grid>
                <Typography classes={{ root: classes.sectionHeading }}>LOAN</Typography>
                <Divider classes={{ root: classes.divider }}></Divider>
                <Grid container direction="column" alignItems="center">
                  <Grid container item md={4}>
                    <TextInput label="Loan #" source="client_loan_number" fullWidth variant="outlined" />
                  </Grid>
                  <Grid container item md={4}>
                    <AutocompleteInput
                      label="Loan Type"
                      choices={appraisalOptions.data?.loanTypes ?? []}
                      source="loan_type_id"
                      optionText="type"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  {[4, 5, 6].includes(formData.loan_type_id || NaN) && (
                    <>
                      {formData.loan_type_id === 4 && (
                        <Grid container item md={4}>
                          <TextInput variant="outlined" fullWidth source="fha_case_number" label="FHA Case Number" />
                        </Grid>
                      )}
                      {formData.loan_type_id === 5 && (
                        <Grid container item md={4}>
                          <TextInput variant="outlined" fullWidth source="usda_case_number" label="USDA Case Number" />
                        </Grid>
                      )}
                      {formData.loan_type_id === 6 && (
                        <Grid container item md={4}>
                          <TextInput variant="outlined" fullWidth source="va_case_number" label="VA Case Number" />
                        </Grid>
                      )}
                    </>
                  )}
                </Grid>

                <Typography classes={{ root: classes.sectionHeading }}>APPRAISAL</Typography>
                <Divider classes={{ root: classes.divider }}></Divider>
                <Grid container direction="column" alignItems="center">
                  <Grid container item md={4}>
                    <AutocompleteInput
                      label="Appraisal Purpose"
                      fullWidth
                      source="appraisal_purpose_id"
                      optionText="purpose"
                      variant="outlined"
                      choices={appraisalOptions.data?.appraisalPurposes ?? []}
                    />
                  </Grid>
                  <Grid container item md={4}>
                    <AutocompleteInput
                      label="Report Type"
                      fullWidth
                      variant="outlined"
                      source="report_type_id"
                      optionText="type"
                      choices={appraisalOptions.data?.reportTypes ?? []}
                    />
                  </Grid>
                  {formData.property_type_id === 1 && formData.report_type_id === 1 && (
                    <Grid container item md={4}>
                      <AutocompleteArrayInput
                        label="Form Types"
                        fullWidth
                        variant="outlined"
                        source="residential_form_type_ids"
                        optionText="type"
                        choices={appraisalOptions.data?.residentialFormTypes ?? []}
                      />
                    </Grid>
                  )}
                </Grid>
                <Typography classes={{ root: classes.sectionHeading }}>FEES</Typography>
                <Divider classes={{ root: classes.divider }}></Divider>
                <Grid container direction="column" alignItems="center">
                  <Grid container item md={4}>
                    <CurrencyInput label="Quote Fee" variant="outlined" fullWidth source="quote_fee" />
                  </Grid>
                  <Grid container item md={4}>
                    <CurrencyInput variant="outlined" label="Report Fee" fullWidth source="report_fee" />
                  </Grid>
                </Grid>
                <Typography classes={{ root: classes.sectionHeading }}>DATES</Typography>
                <Divider classes={{ root: classes.divider }}></Divider>
                <Grid container direction="column" alignItems="center">
                  <Grid container item md={4}>
                    <DateInput source="quote_made_date" variant="outlined" fullWidth />
                  </Grid>
                  <Grid container item md={4}>
                    <DateInput source="engagement_date" variant="outlined" fullWidth />
                  </Grid>
                  <Grid container item md={4}>
                    <DateTimeInput source="due_date" variant="outlined" fullWidth />
                  </Grid>
                  <Grid container item md={4}>
                    <DateTimeInput source="inspection_date" variant="outlined" fullWidth />
                  </Grid>
                </Grid>
                <Typography classes={{ root: classes.sectionHeading }}>ASSIGNEES</Typography>
                <Divider classes={{ root: classes.divider }}></Divider>
                {assignees.length > 4 ? (
                  <Grid container direction="column" alignItems="center">
                    <Grid container item md={4}>
                      <AutocompleteArrayInput
                        fullWidth
                        variant="outlined"
                        label="Assignees"
                        source="assignee_user_account_ids"
                        choices={assignees}
                        defaultValue={defaultAssignee}
                        optionText={(record: User_Profiles) => record?.full_name}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container direction="row" alignItems="center">
                    <Grid container item md={4}></Grid>
                    <Grid container item md={8}>
                      <CustomSelectInput
                        label="Assignees"
                        fullWidth
                        variant="outlined"
                        validate={[required()]}
                        choices={assignees}
                        defaultValue={defaultAssignee.toString()}
                        source="assignee_user_account_ids"
                        optionText={(record: User_Profiles) => record?.full_name}
                      />
                    </Grid>
                  </Grid>
                )}
                <Grid container direction="row">
                  <Grid container item md={12}>
                    <Divider classes={{ root: classes.dividerBottom }}></Divider>
                  </Grid>
                </Grid>
              </Box>
            )}
          </FormDataConsumer>
        </SimpleForm>
      </Box>
    </Card>
  );
}

function PropertyField(props: PropertyFieldProps) {
  const fileNumberField = useInput({ source: 'appraisal_file_number' });
  const lastAppraisalQuery = useLastAppraisal();
  useEffect(() => {
    if (lastAppraisalQuery.data?.appraisal?.length) {
      const appraisalFileNumber = lastAppraisalQuery.data?.appraisal[0].appraisal_file_number;
      fileNumberField.input.onChange(incrementFileNumber(appraisalFileNumber === null ? '' : appraisalFileNumber));
    }
  }, [lastAppraisalQuery.data]);

  return (
    <Grid item md={12}>
      <PlacesAutocomplete
        label={props.label}
        key={1}
        height="calc(100vh - 345px)"
        prefix="property"
        isRequired
        validate={required()}
        xlCols={12}
        variant={props.variant}
      />
    </Grid>
  );
}

export default CreateAppraisal;
