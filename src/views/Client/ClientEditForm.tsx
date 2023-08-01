import { Box, Card, Divider, Grid, IconButton, InputAdornment, Typography, useMediaQuery } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import debounce from 'lodash/debounce';
import React, { useCallback, useState } from 'react';
import { ReferenceInput, required, SimpleForm, TextInput } from 'react-admin';
import { useForm, useFormState } from 'react-final-form';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import PlacesAutocomplete from 'shared/components/PlacesAutocomplete';
import EditAction from 'shared/components/Resource/EditAction';
import ResourceCount from 'shared/components/ResourceButton';
import UrlInput from 'shared/components/UrlInput';
import { simpleFormContainer, styleRight } from 'shared/hooks/useEditFormStyle';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import { copyToClipboard, formatAddress } from 'shared/utils';
import { ClientTabs } from './ClientTabs';
import getClientPermission from './permissions';

type ClientFormProps = {
  isCreate?: boolean;
  save?: any;
  record?: any;
  setLoading?: any;
};
function ClientForm(props: ClientFormProps = { isCreate: false }) {
  props.record.location_address = formatAddress(props?.record?.location_address ?? '');

  return (
    <SimpleForm {...props} toolbar={<span></span>}>
      <ClientFormContainer {...props}></ClientFormContainer>
    </SimpleForm>
  );
}

function ClientFormContainer(props: ClientFormProps = { isCreate: false }) {
  const classes = simpleFormContainer();
  const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const [{ permissions }] = useFormPermissions({ getPermission: getClientPermission });
  const formData = useFormState();

  return (
    <Box className={classes.formContainer}>
      <EditAction
        basePath="/clients"
        resource="client"
        record={{ id: formData.values.id, name: formData.values.name }}
        resourceCount={formData.values.appraisals_count}
        permissions={permissions}
      />
      <Grid container direction={isSmallScreen ? 'column-reverse' : 'row'} alignItems="flex-start" spacing={4}>
        <Grid container item lg={8} md={7} xs={12} sm={12}>
          <ClientFieldsLeft></ClientFieldsLeft>
        </Grid>
        <Grid container item lg={4} md={5} xs={12} sm={12}>
          <ClientFieldsRight></ClientFieldsRight>
        </Grid>
      </Grid>
    </Box>
  );
}

function ClientFieldsLeft() {
  return <ClientTabs />;
}

function ClientFieldsRight(props: ClientFormProps) {
  const classes = styleRight();
  const [{ permissions }] = useFormPermissions({ getPermission: getClientPermission });
  const formData = useFormState();
  const form = useForm();
  const [edit, setEdit] = useState(false);
  const getDefaultFields = (initialValue: boolean) => ({
    name: initialValue,
    location_address: initialValue,
    client_type_id: initialValue,
    url: initialValue,
  });
  const [fields, setFields] = useState<any>(getDefaultFields(false));
  const save = useCallback(debounce(form.submit, 0), []);
  const setAllFields = (val: boolean) => {
    setFields(getDefaultFields(val));
    setEdit(val);
  };

  const isFormDirty = (): boolean => !!Object.keys(formData.dirtyFields).length;

  return (
    <Box className={classes.formContainer}>
      <Card variant="outlined" classes={{ root: classes.card }}>
        <Box className={classes.flexBox}>
          <Typography classes={{ root: `${classes.heading} ${classes.heading500} ${classes.fontLarge}` }}>
            Client
          </Typography>
          {isFormDirty() && edit && (
            <IconButton
              className={classes.saveActionButton}
              edge="end"
              onClick={() => {
                save();
                setEdit(false);
                setAllFields(false);
              }}
            >
              <SaveIcon classes={{ root: classes.icon }} />
            </IconButton>
          )}
          {permissions.edit && !edit && (
            <IconButton className={classes.topEditBtn} edge="end" disabled={edit} onClick={() => setAllFields(true)}>
              <EditIcon classes={{ root: classes.icon }} />
            </IconButton>
          )}
          {edit && (
            <IconButton
              classes={{ root: classes.topEditBtn }}
              disabled={!edit}
              edge="end"
              onClick={() => {
                setEdit(false);
                setAllFields(false);
                Object.keys(formData.dirtyFields).forEach((field: string) => {
                  const [a, b] = field.split('.');
                  if (a && b) {
                    form.change(field, formData.initialValues[a][b]);
                  } else {
                    form.change(field, formData.initialValues[a]);
                  }
                });
              }}
            >
              <CloseIcon classes={{ root: classes.icon }} />
            </IconButton>
          )}
        </Box>
        <Divider classes={{ root: classes.dividerSubSelect }}></Divider>
        <Box className={classes.flexBox}>
          <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Name</Typography>
          <Box pr={2} className={classes.inputContainer}>
            <TextInput
              onClick={(e: any) => copyToClipboard(formData.values.name, e, edit)}
              defaultValue="Click pencil to set"
              size="small"
              color="secondary"
              InputProps={{
                placeholder: 'Click pencil to edit',
                classes: {
                  root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                    fields.name ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
                  }`,
                  focused: classes.cssFocused,
                  notchedOutline: classes.notchedOutline,
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      className={classes.fieldEditBtn}
                      edge="end"
                      disabled={fields.name && !formData.dirtyFields.name}
                    >
                      {fields.name && formData.dirtyFields.name && (
                        <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                      )}
                      &nbsp;
                      {fields.name && formData.dirtyFields.name && (
                        <CloseIcon
                          fontSize="small"
                          classes={{ root: classes.icon }}
                          onClick={() => form.change('name', formData.initialValues.name)}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              FormHelperTextProps={{ style: { display: 'none' } }}
              variant="outlined"
              disabled={!permissions.edit || !fields.name}
              validate={required()}
              fullWidth
              label=""
              source="name"
            />
          </Box>
        </Box>
        {(edit || formData.values.url) && (
          <Box className={classes.flexBox}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Website</Typography>
            <Box pr={2} className={classes.inputContainer}>
              <UrlInput
                onClick={(e: any) => copyToClipboard(formData.values.url, e, edit)}
                size="small"
                btnUrl={classes.btnUrl}
                color="secondary"
                InputProps={{
                  placeholder: 'Click pencil to edit',
                  classes: {
                    root: `${classes.cssOutlinedInput} ${classes.inputFontSize} ${
                      fields.url ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
                    }`,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline,
                  },
                  endAdornment: formData.dirtyFields.url ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        className={classes.fieldEditBtn}
                        edge="end"
                        disabled={fields.url && !formData.dirtyFields.url}
                      >
                        {fields.url && formData.dirtyFields.url && (
                          <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                        )}
                        &nbsp;
                        {fields.url && formData.dirtyFields.url && (
                          <CloseIcon
                            fontSize="small"
                            classes={{ root: classes.icon }}
                            onClick={() => form.change('url', formData.initialValues.url)}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
                FormHelperTextProps={{ style: { display: 'none' } }}
                disabled={!permissions.edit || !fields.url}
                variant="outlined"
                label=""
                fullWidth
                source="url"
              />
            </Box>
          </Box>
        )}
        {(edit || formData.values.location_address) && (
          <Box className={classes.flexBoxAuto}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Address</Typography>
            <Box
              pr={2}
              className={classes.inputContainer}
              onClick={(e: any) => copyToClipboard(formData.values.location_address, e, edit)}
            >
              <PlacesAutocomplete
                defaultValue="Click pencil to edit"
                fullWidth
                size="small"
                shrink={true}
                color="secondary"
                variant="outlined"
                InputProps={{
                  placeholder: 'Click pencil to edit',
                  classes: {
                    root: `${classes.cssOutlinedInput} ${classes.inputFontSize} ${classes.addressInput} ${
                      fields.location_address ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
                    }`,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline,
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        className={classes.fieldEditBtn}
                        edge="end"
                        disabled={fields.location_address && !formData.dirtyFields.location_address}
                      >
                        {fields.location_address && formData.dirtyFields.location_address && (
                          <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                        )}
                        &nbsp;
                        {fields.location_address && formData.dirtyFields.location_address && (
                          <CloseIcon
                            fontSize="small"
                            classes={{ root: classes.icon }}
                            onClick={() => form.change('location_address', formData.initialValues.location_address)}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  classes: {
                    root: `${classes.inputLabelNone}`,
                  },
                }}
                FormHelperTextProps={{ style: { display: 'none' } }}
                autoFocus={false}
                label=" "
                isRequiredOverride={true}
                disabled={!permissions.edit || !fields.location_address}
                isRequired={false}
                source="location_address"
                isMapVisible={false}
                multiline
                rows={10}
              />
            </Box>
          </Box>
        )}
        <Divider classes={{ root: classes.dividerEnd }}></Divider>
        <Box className={classes.flexBoxAuto}>
          <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Type</Typography>
          <Box pr={2} className={classes.inputContainer}>
            <ReferenceInput
              label=""
              size="small"
              source="client_type_id"
              reference="client_types"
              fullWidth
              perPage={100}
              variant="outlined"
              disabled={!permissions.edit || !fields.client_type_id}
              sort={{ field: 'order', order: 'ASC' }}
              filterToQuery={(searchText: string) => ({ type: searchText })}
            >
              <AutocompleteInput
                css={{ popupIndicator: classes.popupIndicator, popupIndicatorOpen: classes.popupIndicatorOpen }}
                options={{
                  InputProps: {
                    placeholder: 'Click pencil to edit',
                    classes: {
                      root: `${classes.cssOutlinedInput} ${classes.inputFontSize} ${
                        fields.client_type_id ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
                      }`,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          className={classes.fieldEditBtn}
                          edge="end"
                          disabled={fields.client_type_id && !formData.dirtyFields.client_type_id}
                        >
                          {fields.client_type_id && formData.dirtyFields.client_type_id && (
                            <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                          )}
                          &nbsp;
                          {fields.client_type_id && formData.dirtyFields.client_type_id && (
                            <CloseIcon
                              fontSize="small"
                              classes={{ root: classes.icon }}
                              onClick={() => form.change('client_type_id', formData.initialValues.client_type_id)}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                  InputLabelProps: {
                    classes: {
                      root: `${classes.inputFontSize}`,
                    },
                  },
                }}
                FormHelperTextProps={{ style: { display: 'none' } }}
                source="client_type_id"
                optionText="type"
                disabled={!permissions.edit || !fields.client_type_id}
              />
            </ReferenceInput>
          </Box>
        </Box>
        <Box className={classes.resourceSection}>
          <Box className={classes.countBtn}>
            <ResourceCount
              record={{ id: formData.values.id, ...formData.values }}
              source="appraisals_count"
              label="Appraisal"
              basePath="/appraisals"
              filterKey="client_id"
              countKey="appraisals_count"
              startIcon="assignment"
            />
          </Box>
          <Box className={classes.countBtn}>
            <ResourceCount
              record={{
                id: formData.values.id,
                ...formData.values,
              }}
              label="Schedule"
              filterKey="client_id"
              hideCount={true}
              basePath="/schedule"
              countKey=""
              source=""
              startIcon="today"
            />
          </Box>
          <Box className={classes.countBtn}>
            <ResourceCount
              record={{ id: formData.values.id, ...formData.values }}
              label="Insights"
              filterKey="client_id"
              hideCount={true}
              basePath="/insights"
              countKey=""
              source=""
              startIcon="equalizer"
            />
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

export default ClientForm;
