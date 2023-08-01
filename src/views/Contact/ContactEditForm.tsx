import { QueryResult } from '@apollo/client';
import { Box, Card, Divider, Grid, IconButton, InputAdornment, Typography, useMediaQuery } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import debounce from 'lodash/debounce';
import React, { useCallback, useState } from 'react';
import { BooleanInput, email, ReferenceInput, required, SimpleForm, TextInput } from 'react-admin';
import { useForm, useFormState } from 'react-final-form';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import PlacesAutocomplete from 'shared/components/PlacesAutocomplete';
import EditAction from 'shared/components/Resource/EditAction';
import ResourceCount from 'shared/components/ResourceButton';
import UrlInput from 'shared/components/UrlInput';
import { ContactOptionsResponse } from 'shared/hooks/useContactOptions';
import { profileStyles, simpleFormContainer, styleRight } from 'shared/hooks/useEditFormStyle';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import { copyToClipboard, formatAddress } from 'shared/utils';
import { ContactTabs } from './ContactTabs';
import getContactPermission from './permission';

type Props = {
  options: QueryResult<ContactOptionsResponse, Record<string, any>>;
  record?: any;
  setLoading?: any;
};

function ContactForm(props: Props) {
  props.record.name = `${props.record.first_name} ${props.record.last_name}`;
  props.record.location_address = formatAddress(props?.record?.location_address ?? '');

  return (
    <SimpleForm {...props} toolbar={<span></span>}>
      <ContactFormContainer {...props}></ContactFormContainer>
    </SimpleForm>
  );
}

function ContactFormContainer(props: Props) {
  const [{ permissions }] = useFormPermissions({ getPermission: getContactPermission });
  const formData = useFormState();
  const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('xs'));
  const classes = simpleFormContainer();

  return (
    <Box className={classes.formContainer}>
      <EditAction
        basePath="/contacts"
        resource="contact"
        record={{ id: formData.values.id, name: formData.values.name }}
        permissions={permissions}
        resourceCount={formData.values.appraisals_count}
      />
      <Grid container direction={isSmallScreen ? 'column-reverse' : 'row'} alignItems="flex-start" spacing={4}>
        <Grid container item lg={8} md={7} xs={12} sm={12}>
          <ContactFieldsLeft options={props.options}></ContactFieldsLeft>
        </Grid>
        <Grid container item lg={4} md={5} xs={12} sm={12}>
          <ContactFieldsRight options={props.options}></ContactFieldsRight>
        </Grid>
      </Grid>
    </Box>
  );
}

function ContactFieldsLeft(props: Props) {
  return <ContactTabs />;
}

function ContactFieldsRight(props: Props) {
  const classes = styleRight();
  const profileClasses = profileStyles();
  const [{ permissions }] = useFormPermissions({ getPermission: getContactPermission });
  const formData = useFormState();
  const form = useForm();
  const [edit, setEdit] = useState(false);
  const getDefaultFields = (initialValue: boolean) => ({
    name: initialValue,
    email: initialValue,
    phone_number: initialValue,
    location_address: initialValue,
    client_id: initialValue,
    contact_type_id: initialValue,
    url: initialValue,
  });
  const [fields, setFields] = useState<any>(getDefaultFields(false));
  const setAllFields = (val: boolean) => {
    setFields(getDefaultFields(val));
    setEdit(val);
  };
  const save = useCallback(debounce(form.submit, 0), []);

  const isFormDirty = (): boolean => !!Object.keys(formData.dirtyFields).length;

  return (
    <Box className={classes.formContainer}>
      <Card variant="outlined" classes={{ root: classes.card }}>
        <Box className={classes.flexBox}>
          <Typography classes={{ root: `${classes.heading} ${classes.heading500} ${classes.fontLarge}` }}>
            Contact
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
              validate={required()}
              disabled={!permissions.edit || !fields.name}
              fullWidth
              label=""
              source="name"
              format={(v: string) => {
                return v;
              }}
            />
          </Box>
        </Box>
        {(edit || formData.values.email) && (
          <Box className={classes.flexBox}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Email</Typography>
            <Box pr={2} className={classes.inputContainer}>
              <TextInput
                onClick={(e: any) => copyToClipboard(formData.values.email, e, edit)}
                size="small"
                InputProps={{
                  placeholder: 'Click pencil to edit',
                  classes: {
                    root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                      fields.email ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
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
                        disabled={fields.email && !formData.dirtyFields.email}
                      >
                        {fields.email && formData.dirtyFields.email && (
                          <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                        )}
                        &nbsp;
                        {fields.email && formData.dirtyFields.email && (
                          <CloseIcon
                            fontSize="small"
                            classes={{ root: classes.icon }}
                            onClick={() => form.change('email', formData.initialValues.email)}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                FormHelperTextProps={{ style: { display: 'none' } }}
                disabled={!permissions.edit || !fields.email}
                variant="outlined"
                label=""
                fullWidth
                source="email"
                validate={[email()]}
              />
            </Box>
          </Box>
        )}
        {(edit || formData.values.phone_number) && (
          <Box className={classes.flexBox}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Phone</Typography>
            <Box pr={2} className={classes.inputContainer}>
              <TextInput
                onClick={(e: any) => copyToClipboard(formData.values.phone_number, e, edit)}
                size="small"
                InputProps={{
                  placeholder: 'Click pencil to edit',
                  classes: {
                    root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                      fields.phone_number ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
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
                        disabled={fields.phone_number && !formData.dirtyFields.phone_number}
                      >
                        {fields.phone_number && formData.dirtyFields.phone_number && (
                          <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                        )}
                        &nbsp;
                        {fields.phone_number && formData.dirtyFields.phone_number && (
                          <CloseIcon
                            fontSize="small"
                            classes={{ root: classes.icon }}
                            onClick={() => form.change('phone_number', formData.initialValues.phone_number)}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                FormHelperTextProps={{ style: { display: 'none' } }}
                disabled={!permissions.edit || !fields.phone_number}
                variant="outlined"
                label=""
                fullWidth
                source="phone_number"
              />
            </Box>
          </Box>
        )}
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
        <Box className={classes.flexBox}>
          <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Client</Typography>
          <Box pr={2} className={classes.inputContainer}>
            <AutocompleteInput
              disabled={!permissions.edit || !fields.client_id}
              label=""
              source="client_id"
              fullWidth
              optionText="name"
              variant="outlined"
              allowEmpty={true}
              emptyText="Not Associated with Client"
              emptyValue="1"
              choices={(props.options.data?.clients ?? []).concat([
                {
                  id: '1',
                  name: 'Not Associated with Client',
                },
              ])}
              css={{ popupIndicator: classes.popupIndicator, popupIndicatorOpen: classes.popupIndicatorOpen }}
              options={{
                InputProps: {
                  placeholder: 'Click pencil to edit',
                  classes: {
                    root: `${classes.cssOutlinedInput} ${classes.inputFontSize} ${
                      fields.client_id ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
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
                        disabled={fields.client_id && !formData.dirtyFields.client_id}
                      >
                        {fields.client_id && formData.dirtyFields.client_id && (
                          <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                        )}
                        &nbsp;
                        {fields.client_id && formData.dirtyFields.client_id && (
                          <CloseIcon
                            fontSize="small"
                            classes={{ root: classes.icon }}
                            onClick={() => form.change('client_id', formData.initialValues.client_id)}
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
              clientEdit={edit}
              clientId={formData.values.client_id}
              reference="client"
            />
          </Box>
        </Box>
        <Divider classes={{ root: classes.dividerEnd }}></Divider>
        <Box className={classes.flexBoxAuto}>
          <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Type</Typography>
          <Box pr={2} className={classes.inputContainer}>
            <ReferenceInput
              label=""
              source="contact_type_id"
              reference="contact_types"
              allowEmpty={false}
              fullWidth
              perPage={100}
              variant="outlined"
              sort={{ field: 'order', order: 'ASC' }}
              filterToQuery={(searchText: string) => ({ type: searchText })}
              disabled={!permissions.edit || !fields.contact_type_id}
            >
              <AutocompleteInput
                css={{ popupIndicator: classes.popupIndicator, popupIndicatorOpen: classes.popupIndicatorOpen }}
                options={{
                  InputProps: {
                    placeholder: 'Click pencil to edit',
                    classes: {
                      root: `${classes.cssOutlinedInput} ${classes.inputFontSize} ${
                        fields.contact_type_id ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
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
                          disabled={fields.contact_type_id && !formData.dirtyFields.contact_type_id}
                        >
                          {fields.contact_type_id && formData.dirtyFields.contact_type_id && (
                            <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                          )}
                          &nbsp;
                          {fields.contact_type_id && formData.dirtyFields.contact_type_id && (
                            <CloseIcon
                              fontSize="small"
                              classes={{ root: classes.icon }}
                              onClick={() => form.change('contact_type_id', formData.initialValues.contact_type_id)}
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
                disabled={!permissions.edit || !fields.contact_type_id}
                source="contact_type_id"
                optionText="type"
              />
            </ReferenceInput>
          </Box>
        </Box>
        {formData.values.client_id && (
          <Box className={classes.flexBox} style={{ marginBottom: '8px' }}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Primary</Typography>
            <Box pr={1} className={`${classes.inputContainerRole} ${classes.heading500}`}>
              <BooleanInput
                onChange={() => save()}
                className={profileClasses.toggleDisabled}
                disabled={!permissions.edit || !edit}
                label={formData.values?.primary ? 'Yes' : 'No'}
                source="primary"
              />
            </Box>
          </Box>
        )}
        <Box className={classes.resourceSection}>
          <Box className={classes.countBtn}>
            <ResourceCount
              record={{ id: formData.values.id, ...formData.values }}
              label="Appraisal"
              filter={(record: { id: string }) => ({
                contact_ids: [record.id],
              })}
              basePath="/appraisals"
              countKey="appraisals_count"
              source="appraisals_count"
              startIcon="assignment"
            />
          </Box>
          <Box className={classes.countBtn}>
            <ResourceCount
              record={{ id: formData.values.id, ...formData.values }}
              label="Insights"
              filter={(record: { id: string }) => ({
                contact_ids: [record.id],
              })}
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

export default ContactForm;
