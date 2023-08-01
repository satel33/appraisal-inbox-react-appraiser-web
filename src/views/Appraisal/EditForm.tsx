import React, { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Card, Divider, Grid, IconButton, InputAdornment, Typography, useMediaQuery } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DirectionsIcon from '@material-ui/icons/Directions';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import debounce from 'lodash/debounce';
import { SimpleForm, TextInput, useGetIdentity, useRedirect } from 'react-admin';
import { useForm, useFormState } from 'react-final-form';
import { AddToCalendar } from 'shared/components/AddToCalendar/AddToCalendar';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import CurrencyInput from 'shared/components/CurrencyInput';
import MenuButtonInput from 'shared/components/MenuButtonInputV2';
import { DateInput, DateTimeInput } from 'shared/components/Pickers';
import PlacesAutocomplete from 'shared/components/PlacesAutocomplete';
import EditAction from 'shared/components/Resource/EditAction';
import { User_Profiles } from 'shared/generated/types';
import useAppraisalOptions, { useAssigneesOptions, useOrgnaizationOptions } from 'shared/hooks/useAppraisalOptions';
import { simpleFormContainer, styleLeft, styleRight } from 'shared/hooks/useEditFormStyle';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import { copyToClipboard, displayFormattedDate, formatAddress } from 'shared/utils';
import { Appraisal } from 'views/Appraisal/types';
import AutocompleteArrayInput from '../../shared/components/AutocompleteArrayInput';
import ClientReferenceInput from '../Client/ClientReferenceInputV2';
import { AppraisalTabs } from './AppraisalTabs';
import AppraisalPdf from './components/AppraisalPdf';
import ExportButton from './components/ExportButton';
import getAppraisalPermission from './permission';

type Props = {
  record?: any;
  setLoading?: any;
};

function AppraisalEditForm(props: Props) {
  if (props.record && props.record.property && props.record.property.location_address) {
    props.record.property.location_address = formatAddress(props?.record?.property?.location_address ?? '');
  }

  return (
    <SimpleForm {...props} toolbar={<span></span>}>
      <AppraisalEditFormContainer {...props}></AppraisalEditFormContainer>
    </SimpleForm>
  );
}

function AppraisalEditFormContainer(props: Props) {
  const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const classes = simpleFormContainer();
  const formData = useFormState();
  const [{ permissions }] = useFormPermissions({ getPermission: getAppraisalPermission });
  function getAppraisalTitle(record: Appraisal) {
    return [record.appraisal_file_number, record.property.location_address].filter(Boolean).join(' - ');
  }
  return (
    <Box className={classes.formContainer}>
      <EditAction
        basePath="/appraisals"
        resource="appraisal"
        record={{
          id: formData.values.id,
          name: `${formData.values.appraisal_file_number}-${formData.values.property.location_address}`,
        }}
        permissions={permissions}
        resourceCount={0}
        export={
          <ExportButton
            record={formData.values as any}
            pdfTitleGetter={(record: Appraisal) =>
              `${getAppraisalTitle(record)}-${displayFormattedDate(new Date().toISOString(), 'MM-dd-yyyy')}`
                .replace(/\W+/g, '-')
                .toLowerCase() + '.pdf'
            }
            pdfRenderer={(props) => <AppraisalPdf {...props} />}
            getPermission={getAppraisalPermission}
          ></ExportButton>
        }
      />
      <Grid container direction={isSmallScreen ? 'column-reverse' : 'row'} alignItems="flex-start" spacing={4}>
        <Grid container item lg={8} md={7} xs={12} sm={12}>
          <AppraisalFieldsLeft></AppraisalFieldsLeft>
        </Grid>
        <Grid container item lg={4} md={5} xs={12} sm={12}>
          <AppraisalFieldsRight></AppraisalFieldsRight>
        </Grid>
      </Grid>
    </Box>
  );
}

function AppraisalFieldsLeft(props: Props) {
  const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('xs'));
  const classes = styleLeft();
  const classesRight = styleRight();
  const formClasses = styleRight();
  const [{ permissions }] = useFormPermissions({ getPermission: getAppraisalPermission });
  const form = useForm();
  const [appraisalOptions] = useAppraisalOptions();
  const formData = useFormState();
  const [edit, setEdit] = useState(false);
  const [propertyEdit, setPropertyEdit] = useState(false);
  const save = useCallback(debounce(form.submit, 0), []);
  const getDefaultFields = (initialValue: boolean) => ({
    location_address: initialValue,
    'property.residential_ownership_type_id': initialValue,
    'property.residential_style_id': initialValue,
    'property.commercial_property_type_id': initialValue,
    'property.commercial_property_subtype_id': initialValue,
    'property.parcel_number': initialValue,
    'property.zoning': initialValue,
    'property.total_acres': initialValue,
    'property.subdivision': initialValue,
  });
  const [fields, setFields] = useState<any>(getDefaultFields(false));
  const setAllFields = (val: boolean) => {
    setFields(getDefaultFields(val));
    setPropertyEdit(val);
  };

  const getMapHeight = () => {
    const el = document.getElementById('address-container');
    if (el) {
      const h = el.clientHeight;
      return `${280 - h}px`;
    }
    return '230px';
  };

  const isFormDirty = (): boolean => !!Object.keys(formData.dirtyFields).length;

  return (
    <Box className={classes.formContainer}>
      <Card variant="outlined" classes={{ root: `${formClasses.card} ${classes.relative}` }}>
        <Typography classes={{ root: `${formClasses.heading} ${formClasses.heading500} ${formClasses.fontLarge}` }}>
          Property
        </Typography>
        {isFormDirty() && propertyEdit && (
          <IconButton
            classes={{ root: classes.saveActionButton }}
            edge="end"
            onClick={() => {
              save();
              setEdit(false);
              setAllFields(false);
            }}
          >
            <SaveIcon classes={{ root: formClasses.icon }} />
          </IconButton>
        )}
        {permissions.edit && !propertyEdit && (
          <IconButton
            classes={{ root: classes.notesEditButton }}
            edge="end"
            disabled={edit}
            onClick={() => setAllFields(true)}
          >
            <EditIcon classes={{ root: formClasses.icon }} />
          </IconButton>
        )}
        {propertyEdit && (
          <IconButton classes={{ root: classes.notesEditButtonClose }} edge="end" onClick={() => setAllFields(false)}>
            <CloseIcon
              classes={{ root: formClasses.icon }}
              onClick={() => {
                Object.keys(formData.dirtyFields).forEach((field: string) => {
                  const [a, b] = field.split('.');
                  if (a && b) {
                    form.change(field, formData.initialValues[a][b]);
                  } else {
                    form.change(field, formData.initialValues[a]);
                  }
                });
              }}
            />
          </IconButton>
        )}
        <Divider classes={{ root: classesRight.dividerLast }}></Divider>
        <Box className={classes.formContainer}>
          <Grid container direction={isSmallScreen ? 'column-reverse' : 'row'} alignItems="flex-start">
            <Grid container item lg={6} md={6} xs={12} sm={12}>
              <Box
                p={1}
                style={{ width: '100%', borderRight: 'solid 1px rgba(0, 0, 0, 0.12)' }}
                onClick={(e: any) => copyToClipboard(formData.values?.property?.location_address, e, propertyEdit)}
              >
                <PlacesAutocomplete
                  defaultValue="Click pencil to edit"
                  fullWidth
                  height={getMapHeight()}
                  showLabel={true}
                  size="small"
                  shrink={true}
                  color="secondary"
                  variant="outlined"
                  prefix="property"
                  InputProps={{
                    placeholder: 'Click pencil to edit',
                    classes: {
                      root: `${classesRight.cssOutlinedInput} ${classesRight.inputFontSize} ${
                        classesRight.addressInput
                      } ${fields.location_address ? classesRight.cssOutlinedActive : classesRight.cssOutlinedDisabled}`,
                      focused: classesRight.cssFocused,
                      notchedOutline: classesRight.notchedOutline,
                    },
                    endAdornment: (
                      <InputAdornment position="end" style={{ position: 'absolute', right: '-5px', top: '23px' }}>
                        <IconButton
                          size="small"
                          className={classesRight.fieldEditBtn}
                          edge="end"
                          disabled={fields.location_address && !formData.dirtyFields['property.location_address']}
                        >
                          {fields.location_address && formData.dirtyFields['property.location_address'] && (
                            <SaveIcon fontSize="small" classes={{ root: classesRight.icon }} onClick={() => save()} />
                          )}
                          &nbsp;
                          {fields.location_address && formData.dirtyFields['property.location_address'] && (
                            <CloseIcon
                              fontSize="small"
                              classes={{ root: classesRight.icon }}
                              onClick={() =>
                                form.change(
                                  'property.location_address',
                                  formData.initialValues?.property?.location_address,
                                )
                              }
                            />
                          )}
                          &nbsp;
                          {!fields.location_address && (
                            <DirectionsIcon
                              fontSize="small"
                              classes={{ root: classesRight.icon }}
                              onClick={() => {
                                const newWindow = window.open(
                                  `https://google.com/maps/place/${formData.values?.property?.location_address}`,
                                  '_blank',
                                  'noopener,noreferrer',
                                );
                                if (newWindow) newWindow.opener = null;
                              }}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    classes: {
                      root: `${classesRight.inputLabelNone}`,
                    },
                  }}
                  FormHelperTextProps={{ style: { display: 'none' } }}
                  autoFocus={false}
                  label=" "
                  isRequiredOverride={true}
                  disabled={!permissions.edit || !fields.location_address}
                  isRequired={false}
                  isMapVisible={true}
                  multiline
                  rows={10}
                />
              </Box>
            </Grid>
            <Grid container item lg={6} md={6} xs={12} sm={12}>
              <Box style={{ lineHeight: '5px' }}>&nbsp;</Box>
              {formData.values.property_type_id === 1 && (
                <>
                  <Box className={classesRight.flexBox}>
                    <Typography classes={{ root: `${classesRight.heading} ${classesRight.heading400}` }}>
                      Ownership
                    </Typography>
                    <Box pr={2} className={classesRight.inputContainer}>
                      <AutocompleteInput
                        label=""
                        variant="outlined"
                        fullWidth
                        disabled={!permissions.edit || !fields['property.residential_ownership_type_id']}
                        source="property.residential_ownership_type_id"
                        optionText="type"
                        choices={appraisalOptions.data?.residentialOwnershipTypes ?? []}
                        css={{
                          popupIndicator: classesRight.popupIndicator,
                          popupIndicatorOpen: classesRight.popupIndicatorOpen,
                        }}
                        options={{
                          InputProps: {
                            placeholder: 'Click pencil to edit',
                            classes: {
                              root: `${classesRight.cssOutlinedInput} ${classesRight.inputFontSize} ${
                                fields['property.residential_ownership_type_id']
                                  ? classesRight.cssOutlinedActive
                                  : classesRight.cssOutlinedDisabled
                              }`,
                              focused: classesRight.cssFocused,
                              notchedOutline: classesRight.notchedOutline,
                            },
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  className={classesRight.fieldEditBtn}
                                  edge="end"
                                  disabled={
                                    fields['property.residential_ownership_type_id'] &&
                                    !formData.dirtyFields['property.residential_ownership_type_id']
                                  }
                                >
                                  {fields['property.residential_ownership_type_id'] &&
                                    formData.dirtyFields['property.residential_ownership_type_id'] && (
                                      <SaveIcon
                                        fontSize="small"
                                        classes={{ root: classesRight.icon }}
                                        onClick={() => save()}
                                      />
                                    )}
                                  &nbsp;
                                  {fields['property.residential_ownership_type_id'] &&
                                    formData.dirtyFields['property.residential_ownership_type_id'] && (
                                      <CloseIcon
                                        fontSize="small"
                                        classes={{ root: classesRight.icon }}
                                        onClick={() =>
                                          form.change(
                                            'property.residential_ownership_type_id',
                                            formData.initialValues?.property?.residential_ownership_type_id,
                                          )
                                        }
                                      />
                                    )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                          InputLabelProps: {
                            classes: {
                              root: `${classesRight.inputFontSize}`,
                            },
                          },
                        }}
                        FormHelperTextProps={{ style: { display: 'none' } }}
                      />
                    </Box>
                  </Box>
                  <Box className={classesRight.flexBox}>
                    <Typography classes={{ root: `${classesRight.heading} ${classesRight.heading400}` }}>
                      Style
                    </Typography>
                    <Box pr={2} className={classesRight.inputContainer}>
                      <AutocompleteInput
                        label=""
                        fullWidth
                        variant="outlined"
                        source="property.residential_style_id"
                        disabled={!permissions.edit || !fields['property.residential_style_id']}
                        optionText="style"
                        choices={appraisalOptions.data?.residentialStyles ?? []}
                        css={{
                          popupIndicator: classesRight.popupIndicator,
                          popupIndicatorOpen: classesRight.popupIndicatorOpen,
                        }}
                        options={{
                          InputProps: {
                            placeholder: 'Click pencil to edit',
                            classes: {
                              root: `${classesRight.cssOutlinedInput} ${classesRight.inputFontSize} ${
                                fields['property.residential_style_id']
                                  ? classesRight.cssOutlinedActive
                                  : classesRight.cssOutlinedDisabled
                              }`,
                              focused: classesRight.cssFocused,
                              notchedOutline: classesRight.notchedOutline,
                            },
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  className={classesRight.fieldEditBtn}
                                  edge="end"
                                  disabled={
                                    fields['property.residential_style_id'] &&
                                    !formData.dirtyFields['property.residential_style_id']
                                  }
                                >
                                  {fields['property.residential_style_id'] &&
                                    formData.dirtyFields['property.residential_style_id'] && (
                                      <SaveIcon
                                        fontSize="small"
                                        classes={{ root: classesRight.icon }}
                                        onClick={() => save()}
                                      />
                                    )}
                                  &nbsp;
                                  {fields['property.residential_style_id'] &&
                                    formData.dirtyFields['property.residential_style_id'] && (
                                      <CloseIcon
                                        fontSize="small"
                                        classes={{ root: classesRight.icon }}
                                        onClick={() =>
                                          form.change(
                                            'property.residential_style_id',
                                            formData.initialValues?.property?.residential_style_id,
                                          )
                                        }
                                      />
                                    )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                          InputLabelProps: {
                            classes: {
                              root: `${classesRight.inputFontSize}`,
                            },
                          },
                        }}
                        FormHelperTextProps={{ style: { display: 'none' } }}
                      />
                    </Box>
                  </Box>
                </>
              )}
              {formData.values.property_type_id === 2 && (
                <>
                  <Box className={classesRight.flexBox}>
                    <Typography classes={{ root: `${classesRight.heading} ${classesRight.heading400}` }}>
                      Type
                    </Typography>
                    <Box pr={2} className={classesRight.inputContainer}>
                      <AutocompleteInput
                        choices={appraisalOptions.data?.commercialPropertyTypes ?? []}
                        label=""
                        variant="outlined"
                        fullWidth
                        disabled={!permissions.edit || !fields['property.commercial_property_type_id']}
                        source="property.commercial_property_type_id"
                        optionText="type"
                        FormHelperTextProps={{ style: { display: 'none' } }}
                        css={{
                          popupIndicator: classesRight.popupIndicator,
                          popupIndicatorOpen: classesRight.popupIndicatorOpen,
                        }}
                        options={{
                          InputProps: {
                            placeholder: 'Click pencil to edit',
                            classes: {
                              root: `${classesRight.cssOutlinedInput} ${classesRight.inputFontSize} ${
                                fields['property.commercial_property_type_id']
                                  ? classesRight.cssOutlinedActive
                                  : classesRight.cssOutlinedDisabled
                              }`,
                              focused: classesRight.cssFocused,
                              notchedOutline: classesRight.notchedOutline,
                            },
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  className={classesRight.fieldEditBtn}
                                  edge="end"
                                  disabled={
                                    fields['property.commercial_property_type_id'] &&
                                    !formData.dirtyFields['property.commercial_property_type_id']
                                  }
                                >
                                  {fields['property.commercial_property_type_id'] &&
                                    formData.dirtyFields['property.commercial_property_type_id'] && (
                                      <SaveIcon
                                        fontSize="small"
                                        classes={{ root: classesRight.icon }}
                                        onClick={() => save()}
                                      />
                                    )}
                                  &nbsp;
                                  {fields['property.commercial_property_type_id'] &&
                                    formData.dirtyFields['property.commercial_property_type_id'] && (
                                      <CloseIcon
                                        fontSize="small"
                                        classes={{ root: classesRight.icon }}
                                        onClick={() =>
                                          form.change(
                                            'property.commercial_property_type_id',
                                            formData.initialValues?.property?.commercial_property_type_id,
                                          )
                                        }
                                      />
                                    )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                          InputLabelProps: {
                            classes: {
                              root: `${classesRight.inputFontSize}`,
                            },
                          },
                        }}
                      />
                    </Box>
                  </Box>
                  <Box className={classesRight.flexBox}>
                    <Typography classes={{ root: `${classesRight.heading} ${classesRight.heading400}` }}>
                      Subtype
                    </Typography>
                    <Box pr={2} className={classesRight.inputContainer}>
                      <AutocompleteInput
                        label=""
                        fullWidth
                        disabled={!permissions.edit || !fields['property.commercial_property_subtype_id']}
                        source="property.commercial_property_subtype_id"
                        optionText="subtype"
                        variant="outlined"
                        FormHelperTextProps={{ style: { display: 'none' } }}
                        choices={
                          appraisalOptions.data?.commercialPropertySubTypes.filter(
                            (e: any) =>
                              e.commercial_property_type_id ===
                                formData.values?.property?.commercial_property_type_id ||
                              e.commercial_property_type_id === formData.values.commercial_property_type_id,
                          ) ?? []
                        }
                        css={{
                          popupIndicator: classesRight.popupIndicator,
                          popupIndicatorOpen: classesRight.popupIndicatorOpen,
                        }}
                        options={{
                          InputProps: {
                            placeholder: 'Click pencil to edit',
                            classes: {
                              root: `${classesRight.cssOutlinedInput} ${classesRight.inputFontSize} ${
                                fields['property.commercial_property_subtype_id']
                                  ? classesRight.cssOutlinedActive
                                  : classesRight.cssOutlinedDisabled
                              }`,
                              focused: classesRight.cssFocused,
                              notchedOutline: classesRight.notchedOutline,
                            },
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  className={classesRight.fieldEditBtn}
                                  edge="end"
                                  disabled={
                                    fields['property.commercial_property_subtype_id'] &&
                                    !formData.dirtyFields['property.commercial_property_subtype_id']
                                  }
                                >
                                  {fields['property.commercial_property_subtype_id'] &&
                                    formData.dirtyFields['property.commercial_property_subtype_id'] && (
                                      <SaveIcon
                                        fontSize="small"
                                        classes={{ root: classesRight.icon }}
                                        onClick={() => save()}
                                      />
                                    )}
                                  &nbsp;
                                  {fields['property.commercial_property_subtype_id'] &&
                                    formData.dirtyFields['property.commercial_property_subtype_id'] && (
                                      <CloseIcon
                                        fontSize="small"
                                        classes={{ root: classesRight.icon }}
                                        onClick={() =>
                                          form.change(
                                            'property.commercial_property_subtype_id',
                                            formData.initialValues?.property?.commercial_property_subtype_id,
                                          )
                                        }
                                      />
                                    )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                          InputLabelProps: {
                            classes: {
                              root: `${classesRight.inputFontSize}`,
                            },
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </>
              )}
              <Divider classes={{ root: classesRight.dividerEnd }} style={{ width: '100%' }}></Divider>
              <Box className={classesRight.flexBox}>
                <Typography classes={{ root: `${classesRight.heading} ${classesRight.heading400}` }}>
                  Parcel #
                </Typography>
                <Box pr={2} className={classesRight.inputContainer}>
                  <TextInput
                    size="small"
                    color="secondary"
                    InputProps={{
                      placeholder: 'Click pencil to edit',
                      classes: {
                        root: `${classesRight.cssOutlinedInput} ${classesRight.inputFontWeight} ${
                          fields['property.parcel_number']
                            ? classesRight.cssOutlinedActive
                            : classesRight.cssOutlinedDisabled
                        }`,
                        focused: classesRight.cssFocused,
                        notchedOutline: classesRight.notchedOutline,
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            className={classesRight.fieldEditBtn}
                            edge="end"
                            disabled={
                              fields['property.parcel_number'] && !formData.dirtyFields['property.parcel_number']
                            }
                          >
                            {fields['property.parcel_number'] && formData.dirtyFields['property.parcel_number'] && (
                              <SaveIcon fontSize="small" classes={{ root: classesRight.icon }} onClick={() => save()} />
                            )}
                            &nbsp;
                            {fields['property.parcel_number'] && formData.dirtyFields['property.parcel_number'] && (
                              <CloseIcon
                                fontSize="small"
                                classes={{ root: classesRight.icon }}
                                onClick={() =>
                                  form.change('property.parcel_number', formData.initialValues?.property?.parcel_number)
                                }
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    FormHelperTextProps={{ style: { display: 'none' } }}
                    variant="outlined"
                    disabled={!permissions.edit || !fields['property.parcel_number']}
                    fullWidth
                    label=""
                    source="property.parcel_number"
                  />
                </Box>
              </Box>
              <Box className={classesRight.flexBox}>
                <Typography classes={{ root: `${classesRight.heading} ${classesRight.heading400}` }}>Zoning</Typography>
                <Box pr={2} className={classesRight.inputContainer}>
                  <TextInput
                    size="small"
                    color="secondary"
                    InputProps={{
                      placeholder: 'Click pencil to edit',
                      classes: {
                        root: `${classesRight.cssOutlinedInput} ${classesRight.inputFontWeight} ${
                          fields['property.zoning'] ? classesRight.cssOutlinedActive : classesRight.cssOutlinedDisabled
                        }`,
                        focused: classesRight.cssFocused,
                        notchedOutline: classesRight.notchedOutline,
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            className={classesRight.fieldEditBtn}
                            edge="end"
                            disabled={fields['property.zoning'] && !formData.dirtyFields['property.zoning']}
                          >
                            {fields['property.zoning'] && formData.dirtyFields['property.zoning'] && (
                              <SaveIcon fontSize="small" classes={{ root: classesRight.icon }} onClick={() => save()} />
                            )}
                            &nbsp;
                            {fields['property.zoning'] && formData.dirtyFields['property.zoning'] && (
                              <CloseIcon
                                fontSize="small"
                                classes={{ root: classesRight.icon }}
                                onClick={() => form.change('property.zoning', formData.initialValues?.property?.zoning)}
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    FormHelperTextProps={{ style: { display: 'none' } }}
                    variant="outlined"
                    disabled={!permissions.edit || !fields['property.zoning']}
                    fullWidth
                    label=""
                    source="property.zoning"
                  />
                </Box>
              </Box>
              <Box className={classesRight.flexBox}>
                <Typography classes={{ root: `${classesRight.heading} ${classesRight.heading400}` }}>Acres</Typography>
                <Box pr={2} className={classesRight.inputContainer}>
                  <TextInput
                    size="small"
                    color="secondary"
                    InputProps={{
                      placeholder: 'Click pencil to edit',
                      classes: {
                        root: `${classesRight.cssOutlinedInput} ${classesRight.inputFontWeight} ${
                          fields['property.total_acres']
                            ? classesRight.cssOutlinedActive
                            : classesRight.cssOutlinedDisabled
                        }`,
                        focused: classesRight.cssFocused,
                        notchedOutline: classesRight.notchedOutline,
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            className={classesRight.fieldEditBtn}
                            edge="end"
                            disabled={fields['property.total_acres'] && !formData.dirtyFields['property.total_acres']}
                          >
                            {fields['property.total_acres'] && formData.dirtyFields['property.total_acres'] && (
                              <SaveIcon fontSize="small" classes={{ root: classesRight.icon }} onClick={() => save()} />
                            )}
                            &nbsp;
                            {fields['property.total_acres'] && formData.dirtyFields['property.total_acres'] && (
                              <CloseIcon
                                fontSize="small"
                                classes={{ root: classesRight.icon }}
                                onClick={() =>
                                  form.change('property.total_acres', formData.initialValues?.property?.total_acres)
                                }
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    FormHelperTextProps={{ style: { display: 'none' } }}
                    variant="outlined"
                    disabled={!permissions.edit || !fields['property.total_acres']}
                    fullWidth
                    label=""
                    source="property.total_acres"
                  />
                </Box>
              </Box>
              <Box className={classesRight.flexBox}>
                <Typography classes={{ root: `${classesRight.heading} ${classesRight.heading400}` }}>
                  Subdivision,
                  <Typography>Lot, Legal</Typography>
                </Typography>
                <Box pr={2} className={classesRight.inputContainer}>
                  <TextInput
                    size="small"
                    color="secondary"
                    InputProps={{
                      placeholder: 'Click pencil to edit',
                      classes: {
                        root: `${classesRight.cssOutlinedInput} ${classesRight.inputFontWeight} ${
                          fields['property.subdivision']
                            ? classesRight.cssOutlinedActive
                            : classesRight.cssOutlinedDisabled
                        }`,
                        focused: classesRight.cssFocused,
                        notchedOutline: classesRight.notchedOutline,
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            className={classesRight.fieldEditBtn}
                            edge="end"
                            disabled={fields['property.subdivision'] && !formData.dirtyFields['property.subdivision']}
                          >
                            {fields['property.subdivision'] && formData.dirtyFields['property.subdivision'] && (
                              <SaveIcon fontSize="small" classes={{ root: classesRight.icon }} onClick={() => save()} />
                            )}
                            &nbsp;
                            {fields['property.subdivision'] && formData.dirtyFields['property.subdivision'] && (
                              <CloseIcon
                                fontSize="small"
                                classes={{ root: classesRight.icon }}
                                onClick={() =>
                                  form.change('property.subdivision', formData.initialValues?.property?.subdivision)
                                }
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    FormHelperTextProps={{ style: { display: 'none' } }}
                    variant="outlined"
                    disabled={!permissions.edit || !fields['property.subdivision']}
                    fullWidth
                    label=""
                    source="property.subdivision"
                    multiline
                    rows={2}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>

      <AppraisalTabs />
    </Box>
  );
}

function AppraisalFieldsRight(props: Props) {
  const redirect = useRedirect();
  const location = useLocation();

  const classes = styleRight();
  const { identity } = useGetIdentity();
  const [appraisalOptions] = useAppraisalOptions();
  const [assigneeOptions] = useAssigneesOptions();
  const assignees = useMemo(() => {
    let options = assigneeOptions.data?.assignees ?? [];
    if (identity?.role === 'appraisal_firm_limited_access') {
      options = options.filter((e) => e.id === identity?.id);
    }
    return options;
  }, [identity, assigneeOptions]);

  const [{ permissions }] = useFormPermissions({ getPermission: getAppraisalPermission });
  const formData = useFormState();
  const isCreate = false;
  const defaultAssignee = useMemo(() => (isCreate ? [identity?.id] : []), [identity, isCreate]);
  const form = useForm();
  const [organizationOptions] = useOrgnaizationOptions({ id: identity?.organization_id });

  const [workflowEdit, setWorkflowEdit] = useState(false);
  const [datesEdit, setDatesEdit] = useState(false);
  const [engagementEdit, setEngagementEdit] = useState(false);
  const [fees, setFeeEdit] = useState(false);

  const getWorkflowFields = (initialValue: boolean) => ({
    appraisal_file_number: initialValue,
    appraisal_status_id: initialValue,
    appraisal_priority_id: initialValue,
    assignee_user_account_ids: initialValue,
  });
  const getDatesFields = (initialValue: boolean) => ({
    engagement_date: initialValue,
    due_date: initialValue,
    inspection_date: initialValue,
    quote_made_date: initialValue,
    quote_accepted_date: initialValue,
    quote_declined_date: initialValue,
    reviewed_date: initialValue,
    submitted_date: initialValue,
    revision_request_date: initialValue,
    paid_date: initialValue,
    on_hold_date: initialValue,
    canceled_date: initialValue,
    completed_date: initialValue,
  });
  const getEngagementFields = (initialValue: boolean) => ({
    client_file_number: initialValue,
    client_id: initialValue,
    client_loan_number: initialValue,
    loan_type_id: initialValue,
    fha_case_number: initialValue,
    usda_case_number: initialValue,
    va_case_number: initialValue,
    appraisal_purpose_id: initialValue,
    report_type_id: initialValue,
    residential_form_type_ids: initialValue,
  });
  const getFeeFields = (initialValue: boolean) => ({
    quote_fee: initialValue,
    report_fee: initialValue,
    total_fees: initialValue,
    total_expenses: initialValue,
  });

  const [workflowFields, setWorkflowFields] = useState<any>(getWorkflowFields(false));
  const [datesFields, setDatesFields] = useState<any>(getDatesFields(false));
  const [engagementFields, setEngagementFields] = useState<any>(getEngagementFields(false));
  const [feeFields, setFeeFields] = useState<any>(getFeeFields(false));

  const setWorkflows = (val: boolean) => {
    setWorkflowFields(getWorkflowFields(val));
    setWorkflowEdit(val);
  };
  const setDates = (val: boolean) => {
    setDatesFields(getDatesFields(val));
    setDatesEdit(val);
  };
  const setEngagements = (val: boolean) => {
    setEngagementFields(getEngagementFields(val));
    setEngagementEdit(val);
  };
  const setFees = (val: boolean) => {
    setFeeFields(getFeeFields(val));
    setFeeEdit(val);
  };

  const save = useCallback(debounce(form.submit, 0), []);
  const isFormDirty = (): boolean => !!Object.keys(formData.dirtyFields).length;

  return (
    <Box className={classes.formContainer}>
      {/* here */}
      <Card variant="outlined" classes={{ root: `${classes.card} ${classes.overflow}` }}>
        <Box className={classes.flexBox}>
          <Typography classes={{ root: `${classes.heading} ${classes.heading500} ${classes.fontLarge}` }}>
            Workflow
          </Typography>
          {isFormDirty() && workflowEdit && (
            <IconButton
              className={classes.saveActionButton}
              edge="end"
              onClick={() => {
                save();
                setWorkflowEdit(false);
                setWorkflows(false);
              }}
            >
              <SaveIcon classes={{ root: classes.icon }} />
            </IconButton>
          )}
          {permissions.edit && !workflowEdit && (
            <IconButton
              className={classes.topEditBtn}
              edge="end"
              disabled={workflowEdit}
              onClick={() => setWorkflows(true)}
            >
              <EditIcon classes={{ root: classes.icon }} />
            </IconButton>
          )}
          {workflowEdit && (
            <IconButton
              classes={{ root: classes.topEditBtn }}
              disabled={!workflowEdit}
              edge="end"
              onClick={() => {
                setWorkflowEdit(false);
                setWorkflows(false);
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
          <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>File #</Typography>
          <Box pr={2} className={classes.inputContainer}>
            <TextInput
              onClick={(e: any) => copyToClipboard(formData.values.appraisal_file_number, e, workflowEdit)}
              size="small"
              color="secondary"
              InputProps={{
                placeholder: 'Click pencil to edit',
                classes: {
                  root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                    workflowFields.appraisal_file_number ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
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
                      disabled={workflowFields.appraisal_file_number && !formData.dirtyFields.appraisal_file_number}
                    >
                      {workflowFields.appraisal_file_number && formData.dirtyFields.appraisal_file_number && (
                        <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                      )}
                      &nbsp;
                      {workflowFields.appraisal_file_number && formData.dirtyFields.appraisal_file_number && (
                        <CloseIcon
                          fontSize="small"
                          classes={{ root: classes.icon }}
                          onClick={() =>
                            form.change('appraisal_file_number', formData.initialValues.appraisal_file_number)
                          }
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              FormHelperTextProps={{ style: { display: 'none' } }}
              variant="outlined"
              disabled={!permissions.edit || !workflowFields.appraisal_file_number}
              fullWidth
              label=""
              source="appraisal_file_number"
            />
          </Box>
        </Box>
        <Box className={classes.flexBox}>
          <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Status</Typography>
          <Box pr={2} className={classes.inputContainer}>
            <MenuButtonInput
              label=""
              variant="outlined"
              source="appraisal_status_id"
              optionText="status"
              disabled={!permissions.edit || !workflowFields.appraisal_status_id}
              choices={appraisalOptions.data?.appraisalStatuses ?? []}
            />
            <IconButton
              size="small"
              className={`${classes.fieldEditBtn} ${classes.fieldEditStatusBtn}`}
              edge="end"
              disabled={workflowFields.appraisal_status_id && !formData.dirtyFields.appraisal_status_id}
            >
              {workflowFields.appraisal_status_id && formData.dirtyFields.appraisal_status_id && (
                <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
              )}
              &nbsp;
              {workflowFields.appraisal_status_id && formData.dirtyFields.appraisal_status_id && (
                <CloseIcon
                  fontSize="small"
                  classes={{ root: classes.icon }}
                  onClick={() => form.change('appraisal_status_id', formData.initialValues.appraisal_status_id)}
                />
              )}
            </IconButton>
          </Box>
        </Box>
        <Box className={classes.flexBox} style={{ marginTop: '4px' }}>
          <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Priority</Typography>
          <Box pr={2} className={classes.inputContainer}>
            <AutocompleteInput
              disabled={!permissions.edit || !workflowFields.appraisal_priority_id}
              label=""
              source="appraisal_priority_id"
              fullWidth
              optionText="priority"
              variant="outlined"
              allowEmpty={true}
              choices={appraisalOptions.data?.appraisalPriorities ?? []}
              css={{ popupIndicator: classes.popupIndicator, popupIndicatorOpen: classes.popupIndicatorOpen }}
              options={{
                InputProps: {
                  placeholder: 'Click pencil to edit',
                  classes: {
                    root: `${classes.cssOutlinedInput} ${classes.inputFontSize} ${
                      workflowFields.appraisal_priority_id ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
                    } ${formData.values.appraisal_priority_id === 2 ? classes.priorityRush : classes.priorityNormal}`,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline,
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        className={classes.fieldEditBtn}
                        edge="end"
                        disabled={workflowFields.appraisal_priority_id && !formData.dirtyFields.appraisal_priority_id}
                      >
                        {workflowFields.appraisal_priority_id && formData.dirtyFields.appraisal_priority_id && (
                          <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                        )}
                        &nbsp;
                        {workflowFields.appraisal_priority_id && formData.dirtyFields.appraisal_priority_id && (
                          <CloseIcon
                            fontSize="small"
                            classes={{ root: classes.icon }}
                            onClick={() =>
                              form.change('appraisal_priority_id', formData.initialValues.appraisal_priority_id)
                            }
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
            />
          </Box>
        </Box>

        {organizationOptions.data?.organization[0].user_accounts_active_count !== 1 ? (
          <Divider classes={{ root: classes.dividerEnd }}></Divider>
        ) : (
          <div style={{ marginTop: '5px' }}></div>
        )}
        {organizationOptions.data?.organization[0].user_accounts_active_count !== 1 && (
          <Box className={classes.flexBoxAuto}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Assignees</Typography>
            <Box pr={2} className={classes.inputContainer}>
              <AutocompleteArrayInput
                fullWidth
                variant="outlined"
                label=""
                disabled={!permissions.edit || !workflowFields.assignee_user_account_ids}
                source="assignee_user_account_ids"
                choices={assignees}
                defaultValue={defaultAssignee}
                optionText={(record: User_Profiles) => record?.full_name}
                FormHelperTextProps={{ style: { display: 'none' } }}
                options={{
                  InputProps: {
                    placeholder: `${
                      formData.values.assignee_user_account_ids?.length === 0 ? 'Click pencil to edit' : ''
                    }`,
                    classes: {
                      root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                        workflowFields.assignee_user_account_ids
                          ? classes.cssOutlinedActive
                          : classes.cssOutlinedDisabled
                      }`,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          className={classes.fieldEditBtnMultiSelect}
                          edge="end"
                          disabled={
                            workflowFields.assignee_user_account_ids && !formData.dirtyFields.assignee_user_account_ids
                          }
                        >
                          {workflowFields.assignee_user_account_ids &&
                            formData.dirtyFields.assignee_user_account_ids && (
                              <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                            )}
                          &nbsp;
                          {workflowFields.assignee_user_account_ids &&
                            formData.dirtyFields.assignee_user_account_ids && (
                              <CloseIcon
                                fontSize="small"
                                classes={{ root: classes.icon }}
                                onClick={() =>
                                  form.change(
                                    'assignee_user_account_ids',
                                    formData.initialValues.assignee_user_account_ids,
                                  )
                                }
                              />
                            )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
          </Box>
        )}
      </Card>

      <Card
        variant="outlined"
        classes={{ root: `${classes.card} ${classes.overflow} ${classes.gap}` }}
        style={{ paddingBottom: '10px' }}
      >
        <Box className={classes.flexBox}>
          <Typography classes={{ root: `${classes.heading} ${classes.heading500} ${classes.fontLarge}` }}>
            Dates
          </Typography>
          {isFormDirty() && datesEdit && (
            <IconButton
              className={classes.saveActionButton}
              edge="end"
              onClick={() => {
                save();
                setDatesEdit(false);
                setDates(false);
              }}
            >
              <SaveIcon classes={{ root: classes.icon }} />
            </IconButton>
          )}
          {permissions.edit && !datesEdit && (
            <IconButton className={classes.topEditBtn} edge="end" disabled={datesEdit} onClick={() => setDates(true)}>
              <EditIcon classes={{ root: classes.icon }} />
            </IconButton>
          )}
          {datesEdit && (
            <IconButton
              classes={{ root: classes.topEditBtn }}
              disabled={!datesEdit}
              edge="end"
              onClick={() => {
                setDatesEdit(false);
                setDates(false);
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
        {(datesEdit || formData.values.quote_made_date) && (
          <Box className={classes.flexBox}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400} ${classes.labelWidth}` }}>
              Quote Made
            </Typography>
            <Box pr={2} className={classes.inputContainer}>
              <DateInput
                onClick={(e: any) => copyToClipboard(formData.values.quote_made_date, e, datesEdit)}
                size="small"
                color="secondary"
                InputProps={{
                  placeholder: 'Click pencil to edit',
                  classes: {
                    root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                      datesFields.quote_made_date ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
                    }`,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline,
                  },
                }}
                FormHelperTextProps={{ style: { display: 'none' } }}
                variant="outlined"
                disabled={!permissions.edit || !datesFields.quote_made_date}
                fullWidth
                label=""
                source="quote_made_date"
              />
              <IconButton
                size="small"
                className={`${classes.fieldEditBtn} ${classes.fieldEditDateBtn}`}
                edge="end"
                disabled={datesFields.quote_made_date && !formData.dirtyFields.quote_made_date}
              >
                {datesFields.quote_made_date && formData.dirtyFields.quote_made_date && (
                  <SaveIcon
                    fontSize="small"
                    classes={{ root: classes.icon }}
                    onClick={() => {
                      save();
                    }}
                  />
                )}
                &nbsp;
                {datesFields.quote_made_date && formData.dirtyFields.quote_made_date && (
                  <CloseIcon
                    fontSize="small"
                    classes={{ root: classes.icon }}
                    onClick={() => form.change('quote_made_date', formData.initialValues.quote_made_date)}
                  />
                )}
              </IconButton>
            </Box>
          </Box>
        )}
        {(datesEdit || formData.values.quote_accepted_date) && (
          <Box className={classes.flexBox}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400} ${classes.labelWidth}` }}>
              Quote Accepted
            </Typography>
            <Box pr={2} className={classes.inputContainer}>
              <DateInput
                onClick={(e: any) => copyToClipboard(formData.values.quote_accepted_date, e, datesEdit)}
                size="small"
                color="secondary"
                InputProps={{
                  placeholder: 'Click pencil to edit',
                  classes: {
                    root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                      datesFields.quote_accepted_date ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
                    }`,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline,
                  },
                }}
                FormHelperTextProps={{ style: { display: 'none' } }}
                variant="outlined"
                disabled={!permissions.edit || !datesFields.quote_accepted_date}
                fullWidth
                label=""
                source="quote_accepted_date"
              />
              <IconButton
                size="small"
                className={`${classes.fieldEditBtn} ${classes.fieldEditDateBtn}`}
                edge="end"
                disabled={datesFields.quote_accepted_date && !formData.dirtyFields.quote_accepted_date}
              >
                {datesFields.quote_accepted_date && formData.dirtyFields.quote_accepted_date && (
                  <SaveIcon
                    fontSize="small"
                    classes={{ root: classes.icon }}
                    onClick={() => {
                      save();
                    }}
                  />
                )}
                &nbsp;
                {datesFields.quote_accepted_date && formData.dirtyFields.quote_accepted_date && (
                  <CloseIcon
                    fontSize="small"
                    classes={{ root: classes.icon }}
                    onClick={() => form.change('quote_accepted_date', formData.initialValues.quote_accepted_date)}
                  />
                )}
              </IconButton>
            </Box>
          </Box>
        )}
        {(datesEdit || formData.values.quote_declined_date) && (
          <Box className={classes.flexBox}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400} ${classes.labelWidth}` }}>
              Quote Declined
            </Typography>
            <Box pr={2} className={classes.inputContainer}>
              <DateInput
                onClick={(e: any) => copyToClipboard(formData.values.quote_declined_date, e, datesEdit)}
                size="small"
                color="secondary"
                InputProps={{
                  placeholder: 'Click pencil to edit',
                  classes: {
                    root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                      datesFields.quote_declined_date ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
                    }`,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline,
                  },
                }}
                FormHelperTextProps={{ style: { display: 'none' } }}
                variant="outlined"
                disabled={!permissions.edit || !datesFields.quote_declined_date}
                fullWidth
                label=""
                source="quote_declined_date"
              />
              <IconButton
                size="small"
                className={`${classes.fieldEditBtn} ${classes.fieldEditDateBtn}`}
                edge="end"
                disabled={datesFields.quote_declined_date && !formData.dirtyFields.quote_declined_date}
              >
                {datesFields.quote_declined_date && formData.dirtyFields.quote_declined_date && (
                  <SaveIcon
                    fontSize="small"
                    classes={{ root: classes.icon }}
                    onClick={() => {
                      save();
                    }}
                  />
                )}
                &nbsp;
                {datesFields.quote_declined_date && formData.dirtyFields.quote_declined_date && (
                  <CloseIcon
                    fontSize="small"
                    classes={{ root: classes.icon }}
                    onClick={() => form.change('quote_declined_date', formData.initialValues.quote_declined_date)}
                  />
                )}
              </IconButton>
            </Box>
          </Box>
        )}
        {(datesEdit || formData.values.engagement_date) && (
          <Box className={classes.flexBox} style={{ position: 'relative' }}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400} ${classes.labelWidth}` }}>
              Engagement
            </Typography>
            <Box pr={2} className={classes.inputContainer}>
              <DateInput
                onClick={(e: any) => copyToClipboard(formData.values.engagement_date, e, datesEdit)}
                size="small"
                color="secondary"
                InputProps={{
                  placeholder: 'Click pencil to edit',
                  classes: {
                    root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                      datesFields.engagement_date ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
                    }`,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline,
                  },
                }}
                FormHelperTextProps={{ style: { display: 'none' } }}
                variant="outlined"
                disabled={!permissions.edit || !datesFields.engagement_date}
                fullWidth
                label=""
                source="engagement_date"
              />
              <IconButton
                size="small"
                className={`${classes.fieldEditBtn} ${classes.fieldEditDateBtn}`}
                edge="end"
                disabled={datesFields.engagement_date && !formData.dirtyFields.engagement_date}
              >
                {datesFields.engagement_date && formData.dirtyFields.engagement_date && (
                  <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                )}
                &nbsp;
                {datesFields.engagement_date && formData.dirtyFields.engagement_date && (
                  <CloseIcon
                    fontSize="small"
                    classes={{ root: classes.icon }}
                    onClick={() => form.change('engagement_date', formData.initialValues.engagement_date)}
                  />
                )}
              </IconButton>
            </Box>
          </Box>
        )}
        <Box className={classes.flexBox}>
          <Typography classes={{ root: `${classes.heading} ${classes.heading400} ${classes.labelWidth}` }}>
            Inspection
          </Typography>
          <Box pr={2} className={classes.inputContainer}>
            <DateTimeInput
              onClick={(e: any) => copyToClipboard(formData.values.inspection_date, e, datesEdit)}
              size="small"
              color="secondary"
              InputProps={{
                placeholder: 'Click pencil to edit',
                classes: {
                  root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                    datesFields.inspection_date ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
                  }`,
                  focused: classes.cssFocused,
                  notchedOutline: classes.notchedOutline,
                },
              }}
              FormHelperTextProps={{ style: { display: 'none' } }}
              variant="outlined"
              disabled={!permissions.edit || !datesFields.inspection_date}
              fullWidth
              label=""
              source="inspection_date"
            />

            {!datesEdit && formData.values.inspection_date && (
              <Box className={`${classes.addToCalendarBtn}`}>
                <AddToCalendar
                  date={formData.values.inspection_date}
                  title={`Appraisal Inspection: ${formData.values.appraisal_file_number}`}
                  location={formData.values.property.location_address}
                />
              </Box>
            )}

            <IconButton
              size="small"
              className={`${classes.fieldEditBtn} ${classes.fieldEditDateBtn}`}
              edge="end"
              disabled={datesFields.inspection_date && !formData.dirtyFields.inspection_date}
            >
              {datesFields.inspection_date && formData.dirtyFields.inspection_date && (
                <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
              )}
              {datesFields.inspection_date && formData.dirtyFields.inspection_date && (
                <CloseIcon
                  fontSize="small"
                  classes={{ root: classes.icon }}
                  onClick={() => form.change('inspection_date', formData.initialValues.inspection_date)}
                />
              )}
            </IconButton>
          </Box>
        </Box>
        <Box className={classes.flexBox}>
          <Typography classes={{ root: `${classes.heading} ${classes.heading400} ${classes.labelWidth}` }}>
            Due
          </Typography>
          <Box pr={2} className={classes.inputContainer}>
            <DateTimeInput
              onClick={(e: any) => copyToClipboard(formData.values.due_date, e, datesEdit)}
              size="small"
              color="secondary"
              InputProps={{
                placeholder: 'Click pencil to edit',
                classes: {
                  root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                    datesFields.due_date ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
                  }`,
                  focused: classes.cssFocused,
                  notchedOutline: classes.notchedOutline,
                },
              }}
              FormHelperTextProps={{ style: { display: 'none' } }}
              variant="outlined"
              disabled={!permissions.edit || !datesFields.due_date}
              fullWidth
              label=""
              source="due_date"
            />

            {!datesEdit && formData.values.due_date && (
              <Box className={`${classes.addToCalendarBtn}`}>
                <AddToCalendar
                  date={formData.values.due_date}
                  title={`Appraisal Due: ${formData.values.appraisal_file_number}`}
                  location={formData.values.property.location_address}
                />
              </Box>
            )}

            <IconButton
              size="small"
              className={`${classes.fieldEditBtn} ${classes.fieldEditDateBtn}`}
              edge="end"
              disabled={datesFields.due_date && !formData.dirtyFields.due_date}
            >
              {datesFields.due_date && formData.dirtyFields.due_date && (
                <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
              )}
              {datesFields.due_date && formData.dirtyFields.due_date && (
                <CloseIcon
                  fontSize="small"
                  classes={{ root: classes.icon }}
                  onClick={() => form.change('due_date', formData.initialValues.due_date)}
                />
              )}
            </IconButton>
          </Box>
        </Box>

        {(datesEdit || formData.values.reviewed_date) && (
          <Box className={classes.flexBox}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400} ${classes.labelWidth}` }}>
              In Review
            </Typography>
            <Box pr={2} className={classes.inputContainer}>
              <DateInput
                onClick={(e: any) => copyToClipboard(formData.values.reviewed_date, e, datesEdit)}
                size="small"
                color="secondary"
                InputProps={{
                  placeholder: 'Click pencil to edit',
                  classes: {
                    root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                      datesFields.reviewed_date ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
                    }`,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline,
                  },
                }}
                FormHelperTextProps={{ style: { display: 'none' } }}
                variant="outlined"
                disabled={!permissions.edit || !datesFields.reviewed_date}
                fullWidth
                label=""
                source="reviewed_date"
              />
              <IconButton
                size="small"
                className={`${classes.fieldEditBtn} ${classes.fieldEditDateBtn}`}
                edge="end"
                disabled={datesFields.reviewed_date && !formData.dirtyFields.reviewed_date}
              >
                {datesFields.reviewed_date && formData.dirtyFields.reviewed_date && (
                  <SaveIcon
                    fontSize="small"
                    classes={{ root: classes.icon }}
                    onClick={() => {
                      save();
                    }}
                  />
                )}
                &nbsp;
                {datesFields.reviewed_date && formData.dirtyFields.reviewed_date && (
                  <CloseIcon
                    fontSize="small"
                    classes={{ root: classes.icon }}
                    onClick={() => form.change('submitted_date', formData.initialValues.submitted_date)}
                  />
                )}
              </IconButton>
            </Box>
          </Box>
        )}
        {(datesEdit || formData.values.revision_request_date) && (
          <Box className={classes.flexBox}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400} ${classes.labelWidth}` }}>
              In Revision
            </Typography>
            <Box pr={2} className={classes.inputContainer}>
              <DateInput
                onClick={(e: any) => copyToClipboard(formData.values.revision_request_date, e, datesEdit)}
                size="small"
                color="secondary"
                InputProps={{
                  placeholder: 'Click pencil to edit',
                  classes: {
                    root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                      datesFields.revision_request_date ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
                    }`,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline,
                  },
                }}
                FormHelperTextProps={{ style: { display: 'none' } }}
                variant="outlined"
                disabled={!permissions.edit || !datesFields.revision_request_date}
                fullWidth
                label=""
                source="revision_request_date"
              />
              <IconButton
                size="small"
                className={`${classes.fieldEditBtn} ${classes.fieldEditDateBtn}`}
                edge="end"
                disabled={datesFields.revision_request_date && !formData.dirtyFields.revision_request_date}
              >
                {datesFields.revision_request_date && formData.dirtyFields.revision_request_date && (
                  <SaveIcon
                    fontSize="small"
                    classes={{ root: classes.icon }}
                    onClick={() => {
                      save();
                    }}
                  />
                )}
                &nbsp;
                {datesFields.revision_request_date && formData.dirtyFields.revision_request_date && (
                  <CloseIcon
                    fontSize="small"
                    classes={{ root: classes.icon }}
                    onClick={() => form.change('revision_request_date', formData.initialValues.revision_request_date)}
                  />
                )}
              </IconButton>
            </Box>
          </Box>
        )}
        {(datesEdit || formData.values.paid_date) && (
          <Box className={classes.flexBox}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400} ${classes.labelWidth}` }}>
              Paid
            </Typography>
            <Box pr={2} className={classes.inputContainer}>
              <DateInput
                onClick={(e: any) => copyToClipboard(formData.values.paid_date, e, datesEdit)}
                size="small"
                color="secondary"
                InputProps={{
                  placeholder: 'Click pencil to edit',
                  classes: {
                    root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                      datesFields.paid_date ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
                    }`,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline,
                  },
                }}
                FormHelperTextProps={{ style: { display: 'none' } }}
                variant="outlined"
                disabled={!permissions.edit || !datesFields.paid_date}
                fullWidth
                label=""
                source="paid_date"
              />
              <IconButton
                size="small"
                className={`${classes.fieldEditBtn} ${classes.fieldEditDateBtn}`}
                edge="end"
                disabled={datesFields.paid_date && !formData.dirtyFields.paid_date}
              >
                {datesFields.paid_date && formData.dirtyFields.paid_date && (
                  <SaveIcon
                    fontSize="small"
                    classes={{ root: classes.icon }}
                    onClick={() => {
                      save();
                    }}
                  />
                )}
                &nbsp;
                {datesFields.paid_date && formData.dirtyFields.paid_date && (
                  <CloseIcon
                    fontSize="small"
                    classes={{ root: classes.icon }}
                    onClick={() => form.change('paid_date', formData.initialValues.paid_date)}
                  />
                )}
              </IconButton>
            </Box>
          </Box>
        )}
        {(datesEdit || formData.values.on_hold_date) && (
          <Box className={classes.flexBox}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400} ${classes.labelWidth}` }}>
              On Hold
            </Typography>
            <Box pr={2} className={classes.inputContainer}>
              <DateInput
                onClick={(e: any) => copyToClipboard(formData.values.on_hold_date, e, datesEdit)}
                size="small"
                color="secondary"
                InputProps={{
                  placeholder: 'Click pencil to edit',
                  classes: {
                    root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                      datesFields.on_hold_date ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
                    }`,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline,
                  },
                }}
                FormHelperTextProps={{ style: { display: 'none' } }}
                variant="outlined"
                disabled={!permissions.edit || !datesFields.on_hold_date}
                fullWidth
                label=""
                source="on_hold_date"
              />
              <IconButton
                size="small"
                className={`${classes.fieldEditBtn} ${classes.fieldEditDateBtn}`}
                edge="end"
                disabled={datesFields.on_hold_date && !formData.dirtyFields.paid_date}
              >
                {datesFields.on_hold_date && formData.dirtyFields.on_hold_date && (
                  <SaveIcon
                    fontSize="small"
                    classes={{ root: classes.icon }}
                    onClick={() => {
                      save();
                    }}
                  />
                )}
                &nbsp;
                {datesFields.on_hold_date && formData.dirtyFields.on_hold_date && (
                  <CloseIcon
                    fontSize="small"
                    classes={{ root: classes.icon }}
                    onClick={() => form.change('on_hold_date', formData.initialValues.on_hold_date)}
                  />
                )}
              </IconButton>
            </Box>
          </Box>
        )}
        {(datesEdit || formData.values.canceled_date) && (
          <Box className={classes.flexBox}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400} ${classes.labelWidth}` }}>
              Canceled
            </Typography>
            <Box pr={2} className={classes.inputContainer}>
              <DateInput
                onClick={(e: any) => copyToClipboard(formData.values.canceled_date, e, datesEdit)}
                size="small"
                color="secondary"
                InputProps={{
                  placeholder: 'Click pencil to edit',
                  classes: {
                    root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                      datesFields.canceled_date ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
                    }`,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline,
                  },
                }}
                FormHelperTextProps={{ style: { display: 'none' } }}
                variant="outlined"
                disabled={!permissions.edit || !datesFields.canceled_date}
                fullWidth
                label=""
                source="canceled_date"
              />
              <IconButton
                size="small"
                className={`${classes.fieldEditBtn} ${classes.fieldEditDateBtn}`}
                edge="end"
                disabled={datesFields.canceled_date && !formData.dirtyFields.canceled_date}
              >
                {datesFields.canceled_date && formData.dirtyFields.canceled_date && (
                  <SaveIcon
                    fontSize="small"
                    classes={{ root: classes.icon }}
                    onClick={() => {
                      save();
                    }}
                  />
                )}
                &nbsp;
                {datesFields.canceled_date && formData.dirtyFields.canceled_date && (
                  <CloseIcon
                    fontSize="small"
                    classes={{ root: classes.icon }}
                    onClick={() => form.change('canceled_date', formData.initialValues.canceled_date)}
                  />
                )}
              </IconButton>
            </Box>
          </Box>
        )}
        {(datesEdit || formData.values.completed_date) && (
          <Box className={classes.flexBox}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400} ${classes.labelWidth}` }}>
              Completed
            </Typography>
            <Box pr={2} className={classes.inputContainer}>
              <DateInput
                onClick={(e: any) => copyToClipboard(formData.values.completed_date, e, datesEdit)}
                size="small"
                color="secondary"
                InputProps={{
                  placeholder: 'Click pencil to edit',
                  classes: {
                    root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                      datesFields.completed_date ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
                    }`,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline,
                  },
                }}
                FormHelperTextProps={{ style: { display: 'none' } }}
                variant="outlined"
                disabled={!permissions.edit || !datesFields.completed_date}
                fullWidth
                label=""
                source="completed_date"
              />
              <IconButton
                size="small"
                className={`${classes.fieldEditBtn} ${classes.fieldEditDateBtn}`}
                edge="end"
                disabled={datesFields.completed_date && !formData.dirtyFields.completed_date}
              >
                {datesFields.completed_date && formData.dirtyFields.completed_date && (
                  <SaveIcon
                    fontSize="small"
                    classes={{ root: classes.icon }}
                    onClick={() => {
                      save();
                    }}
                  />
                )}
                &nbsp;
                {datesFields.completed_date && formData.dirtyFields.completed_date && (
                  <CloseIcon
                    fontSize="small"
                    classes={{ root: classes.icon }}
                    onClick={() => form.change('completed_date', formData.initialValues.completed_date)}
                  />
                )}
              </IconButton>
            </Box>
          </Box>
        )}
      </Card>

      <Card
        variant="outlined"
        classes={{ root: `${classes.card} ${classes.overflow} ${classes.gap}` }}
        style={{ paddingBottom: '5px' }}
      >
        <Box className={classes.flexBox}>
          <Typography classes={{ root: `${classes.heading} ${classes.heading500} ${classes.fontLarge}` }}>
            Engagement
          </Typography>
          {isFormDirty() && engagementEdit && (
            <IconButton
              className={classes.saveActionButton}
              edge="end"
              onClick={() => {
                save();
                setEngagementEdit(false);
                setEngagements(false);
              }}
            >
              <SaveIcon classes={{ root: classes.icon }} />
            </IconButton>
          )}
          {permissions.edit && !engagementEdit && (
            <IconButton
              className={classes.topEditBtn}
              edge="end"
              disabled={engagementEdit}
              onClick={() => setEngagements(true)}
            >
              <EditIcon classes={{ root: classes.icon }} />
            </IconButton>
          )}
          {engagementEdit && (
            <IconButton
              classes={{ root: classes.topEditBtn }}
              disabled={!engagementEdit}
              edge="end"
              onClick={() => {
                setEngagementEdit(false);
                setEngagements(false);
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
        {(engagementEdit || formData.values.client_file_number) && (
          <Box className={classes.flexBox}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Client File #</Typography>
            <Box pr={2} className={classes.inputContainer}>
              <TextInput
                onClick={(e: any) => copyToClipboard(formData.values.client_file_number, e, engagementEdit)}
                size="small"
                color="secondary"
                InputProps={{
                  placeholder: 'Click pencil to edit',
                  classes: {
                    root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                      engagementFields.client_file_number ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
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
                        disabled={engagementFields.client_file_number && !formData.dirtyFields.client_file_number}
                      >
                        {engagementFields.client_file_number && formData.dirtyFields.client_file_number && (
                          <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                        )}
                        &nbsp;
                        {engagementFields.client_file_number && formData.dirtyFields.client_file_number && (
                          <CloseIcon
                            fontSize="small"
                            classes={{ root: classes.icon }}
                            onClick={() => form.change('client_file_number', formData.initialValues.client_file_number)}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                FormHelperTextProps={{ style: { display: 'none' } }}
                variant="outlined"
                disabled={!permissions.edit || !engagementFields.client_file_number}
                fullWidth
                label=""
                source="client_file_number"
              />
            </Box>
          </Box>
        )}
        <Box className={classes.flexBox}>
          <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Client</Typography>
          <Box pr={2} className={classes.inputContainer}>
            <ClientReferenceInput
              size="small"
              color="secondary"
              onlyIconLabel={true}
              InputProps={{
                placeholder: 'Click pencil to edit',
                classes: {
                  root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                    engagementFields.client_id ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
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
                      disabled={engagementFields.client_id && !formData.dirtyFields.client_id}
                    >
                      {engagementFields.client_id && formData.dirtyFields.client_id && (
                        <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                      )}
                      &nbsp;
                      {engagementFields.client_id && formData.dirtyFields.client_id && (
                        <CloseIcon
                          fontSize="small"
                          classes={{ root: classes.icon }}
                          onClick={() => form.change('client_id', formData.initialValues.client_id)}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              FormHelperTextProps={{ style: { display: 'none' } }}
              variant="outlined"
              disabled={!permissions.edit || !engagementFields.client_id}
              label=""
              source="client_id"
              reference="client"
              fullWidth
              sort={{ field: 'name', order: 'ASC' }}
              filterToQuery={(searchText: string) => ({ name: searchText })}
              perPage={Infinity}
              children={<span />}
              showContacts={true}
              customCSS={{
                root: {
                  display: 'flex',
                  alignItems: 'self-start',
                  flex: 1,
                },
                create: {
                  marginBottom: '0px',
                  display: 'none',
                },
              }}
              clientEdit={engagementEdit}
              clientId={formData.values.client_id}
            />
          </Box>
        </Box>
        {(engagementEdit || formData.values.client_loan_number) && (
          <Box className={classes.flexBox}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Loan #</Typography>
            <Box pr={2} className={classes.inputContainer}>
              <TextInput
                onClick={(e: any) => copyToClipboard(formData.values.client_loan_number, e, engagementEdit)}
                size="small"
                color="secondary"
                InputProps={{
                  placeholder: 'Click pencil to edit',
                  classes: {
                    root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                      engagementFields.client_loan_number ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
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
                        disabled={engagementFields.client_loan_number && !formData.dirtyFields.client_loan_number}
                      >
                        {engagementFields.client_loan_number && formData.dirtyFields.client_loan_number && (
                          <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                        )}
                        &nbsp;
                        {engagementFields.client_loan_number && formData.dirtyFields.client_loan_number && (
                          <CloseIcon
                            fontSize="small"
                            classes={{ root: classes.icon }}
                            onClick={() => form.change('client_loan_number', formData.initialValues.client_loan_number)}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                FormHelperTextProps={{ style: { display: 'none' } }}
                variant="outlined"
                disabled={!permissions.edit || !engagementFields.client_loan_number}
                fullWidth
                label=""
                source="client_loan_number"
              />
            </Box>
          </Box>
        )}
        {(engagementEdit || formData.values.loan_type_id) && (
          <Box className={classes.flexBox}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Loan Type</Typography>
            <Box pr={2} className={classes.inputContainer}>
              <AutocompleteInput
                disabled={!permissions.edit || !engagementFields.loan_type_id}
                label=""
                source="loan_type_id"
                fullWidth
                optionText="type"
                variant="outlined"
                allowEmpty={true}
                choices={appraisalOptions.data?.loanTypes ?? []}
                css={{ popupIndicator: classes.popupIndicator, popupIndicatorOpen: classes.popupIndicatorOpen }}
                options={{
                  InputProps: {
                    placeholder: 'Click pencil to edit',
                    classes: {
                      root: `${classes.cssOutlinedInput} ${classes.inputFontSize} ${
                        engagementFields.loan_type_id ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
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
                          disabled={engagementFields.loan_type_id && !formData.dirtyFields.loan_type_id}
                        >
                          {engagementFields.loan_type_id && formData.dirtyFields.loan_type_id && (
                            <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                          )}
                          &nbsp;
                          {engagementFields.loan_type_id && formData.dirtyFields.loan_type_id && (
                            <CloseIcon
                              fontSize="small"
                              classes={{ root: classes.icon }}
                              onClick={() => form.change('loan_type_id', formData.initialValues.loan_type_id)}
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
              />
            </Box>
          </Box>
        )}
        {[4, 5, 6].includes(formData.values.loan_type_id || NaN) && (
          <>
            {formData.values.loan_type_id === 4 && (
              <Box className={classes.flexBox}>
                <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>FHA Case #</Typography>
                <Box pr={2} className={classes.inputContainer}>
                  <TextInput
                    onClick={(e: any) => copyToClipboard(formData.values.fha_case_number, e, engagementEdit)}
                    size="small"
                    color="secondary"
                    InputProps={{
                      placeholder: 'Click pencil to edit',
                      classes: {
                        root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                          engagementFields.fha_case_number ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
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
                            disabled={engagementFields.fha_case_number && !formData.dirtyFields.fha_case_number}
                          >
                            {engagementFields.fha_case_number && formData.dirtyFields.fha_case_number && (
                              <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                            )}
                            &nbsp;
                            {engagementFields.fha_case_number && formData.dirtyFields.fha_case_number && (
                              <CloseIcon
                                fontSize="small"
                                classes={{ root: classes.icon }}
                                onClick={() => form.change('fha_case_number', formData.initialValues.fha_case_number)}
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    FormHelperTextProps={{ style: { display: 'none' } }}
                    variant="outlined"
                    disabled={!permissions.edit || !engagementFields.fha_case_number}
                    fullWidth
                    label=""
                    source="fha_case_number"
                  />
                </Box>
              </Box>
            )}
            {formData.values.loan_type_id === 5 && (
              <Box className={classes.flexBox}>
                <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>USDA Case #</Typography>
                <Box pr={2} className={classes.inputContainer}>
                  <TextInput
                    onClick={(e: any) => copyToClipboard(formData.values.usda_case_number, e, engagementEdit)}
                    size="small"
                    color="secondary"
                    InputProps={{
                      placeholder: 'Click pencil to edit',
                      classes: {
                        root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                          engagementFields.usda_case_number ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
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
                            disabled={engagementFields.usda_case_number && !formData.dirtyFields.usda_case_number}
                          >
                            {engagementFields.usda_case_number && formData.dirtyFields.usda_case_number && (
                              <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                            )}
                            &nbsp;
                            {engagementFields.usda_case_number && formData.dirtyFields.usda_case_number && (
                              <CloseIcon
                                fontSize="small"
                                classes={{ root: classes.icon }}
                                onClick={() => form.change('usda_case_number', formData.initialValues.usda_case_number)}
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    FormHelperTextProps={{ style: { display: 'none' } }}
                    variant="outlined"
                    disabled={!permissions.edit || !engagementFields.usda_case_number}
                    fullWidth
                    label=""
                    source="usda_case_number"
                  />
                </Box>
              </Box>
            )}
            {formData.values.loan_type_id === 6 && (
              <Box className={classes.flexBox}>
                <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>VA Case #</Typography>
                <Box pr={2} className={classes.inputContainer}>
                  <TextInput
                    onClick={(e: any) => copyToClipboard(formData.values.va_case_number, e, engagementEdit)}
                    size="small"
                    color="secondary"
                    InputProps={{
                      placeholder: 'Click pencil to edit',
                      classes: {
                        root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                          engagementFields.va_case_number ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
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
                            disabled={engagementFields.va_case_number && !formData.dirtyFields.va_case_number}
                          >
                            {engagementFields.va_case_number && formData.dirtyFields.va_case_number && (
                              <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                            )}
                            &nbsp;
                            {engagementFields.va_case_number && formData.dirtyFields.va_case_number && (
                              <CloseIcon
                                fontSize="small"
                                classes={{ root: classes.icon }}
                                onClick={() => form.change('va_case_number', formData.initialValues.va_case_number)}
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    FormHelperTextProps={{ style: { display: 'none' } }}
                    variant="outlined"
                    disabled={!permissions.edit || !engagementFields.va_case_number}
                    fullWidth
                    label=""
                    source="va_case_number"
                  />
                </Box>
              </Box>
            )}
          </>
        )}
        {(engagementEdit || formData.values.appraisal_purpose_id) && (
          <Box className={classes.flexBox}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Purpose</Typography>
            <Box pr={2} className={classes.inputContainer}>
              <AutocompleteInput
                disabled={!permissions.edit || !engagementFields.appraisal_purpose_id}
                label=""
                source="appraisal_purpose_id"
                fullWidth
                optionText="purpose"
                variant="outlined"
                allowEmpty={true}
                choices={appraisalOptions.data?.appraisalPurposes ?? []}
                css={{ popupIndicator: classes.popupIndicator, popupIndicatorOpen: classes.popupIndicatorOpen }}
                options={{
                  InputProps: {
                    placeholder: 'Click pencil to edit',
                    classes: {
                      root: `${classes.cssOutlinedInput} ${classes.inputFontSize} ${
                        engagementFields.appraisal_purpose_id ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
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
                          disabled={engagementFields.appraisal_purpose_id && !formData.dirtyFields.appraisal_purpose_id}
                        >
                          {engagementFields.appraisal_purpose_id && formData.dirtyFields.appraisal_purpose_id && (
                            <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                          )}
                          &nbsp;
                          {engagementFields.appraisal_purpose_id && formData.dirtyFields.appraisal_purpose_id && (
                            <CloseIcon
                              fontSize="small"
                              classes={{ root: classes.icon }}
                              onClick={() =>
                                form.change('appraisal_purpose_id', formData.initialValues.appraisal_purpose_id)
                              }
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
              />
            </Box>
          </Box>
        )}
        {(engagementEdit || formData.values.report_type_id) && (
          <Box className={classes.flexBox}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Report Type</Typography>
            <Box pr={2} className={classes.inputContainer}>
              <AutocompleteInput
                disabled={!permissions.edit || !engagementFields.report_type_id}
                label=""
                source="report_type_id"
                fullWidth
                optionText="type"
                variant="outlined"
                allowEmpty={true}
                choices={appraisalOptions.data?.reportTypes ?? []}
                css={{ popupIndicator: classes.popupIndicator, popupIndicatorOpen: classes.popupIndicatorOpen }}
                options={{
                  InputProps: {
                    placeholder: 'Click pencil to edit',
                    classes: {
                      root: `${classes.cssOutlinedInput} ${classes.inputFontSize} ${
                        engagementFields.report_type_id ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
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
                          disabled={engagementFields.report_type_id && !formData.dirtyFields.report_type_id}
                        >
                          {engagementFields.report_type_id && formData.dirtyFields.report_type_id && (
                            <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                          )}
                          &nbsp;
                          {engagementFields.report_type_id && formData.dirtyFields.report_type_id && (
                            <CloseIcon
                              fontSize="small"
                              classes={{ root: classes.icon }}
                              onClick={() => form.change('report_type_id', formData.initialValues.report_type_id)}
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
              />
            </Box>
          </Box>
        )}
        {formData.values.property_type_id === 1 && (
          <Box className={classes.flexBoxAuto}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Form Types</Typography>
            <Box pr={2} className={classes.inputContainer}>
              <AutocompleteArrayInput
                disabled={!permissions.edit || !engagementFields.residential_form_type_ids}
                label=""
                source="residential_form_type_ids"
                fullWidth
                optionText="type"
                variant="outlined"
                choices={appraisalOptions.data?.residentialFormTypes ?? []}
                css={{ popupIndicator: classes.popupIndicator, popupIndicatorOpen: classes.popupIndicatorOpen }}
                options={{
                  InputProps: {
                    placeholder: `${
                      formData.values.residential_form_type_ids?.length === 0 ? 'Click pencil to edit' : ''
                    }`,
                    classes: {
                      root: `${classes.cssOutlinedInput} ${classes.inputFontSize} ${
                        engagementFields.residential_form_type_ids
                          ? classes.cssOutlinedActive
                          : classes.cssOutlinedDisabled
                      }`,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          className={classes.fieldEditBtnMultiSelect}
                          edge="end"
                          disabled={
                            engagementFields.residential_form_type_ids &&
                            !formData.dirtyFields.residential_form_type_ids
                          }
                        >
                          {engagementFields.residential_form_type_ids &&
                            formData.dirtyFields.residential_form_type_ids && (
                              <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                            )}
                          &nbsp;
                          {engagementFields.residential_form_type_ids &&
                            formData.dirtyFields.residential_form_type_ids && (
                              <CloseIcon
                                fontSize="small"
                                classes={{ root: classes.icon }}
                                onClick={() =>
                                  form.change(
                                    'residential_form_type_ids',
                                    formData.initialValues.residential_form_type_ids,
                                  )
                                }
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
              />
            </Box>
          </Box>
        )}
      </Card>

      <Card variant="outlined" classes={{ root: `${classes.card} ${classes.overflow}` }}>
        <Box className={classes.flexBox}>
          <Typography classes={{ root: `${classes.heading} ${classes.heading500} ${classes.fontLarge}` }}>
            Fees
          </Typography>
          {isFormDirty() && fees && (
            <IconButton
              className={classes.saveActionButton}
              edge="end"
              onClick={() => {
                save();
                setFeeEdit(false);
                setFees(false);
              }}
            >
              <SaveIcon classes={{ root: classes.icon }} />
            </IconButton>
          )}
          {permissions.edit && !fees && (
            <IconButton className={classes.topEditBtn} edge="end" disabled={fees} onClick={() => setFees(true)}>
              <EditIcon classes={{ root: classes.icon }} />
            </IconButton>
          )}
          {fees && (
            <IconButton
              classes={{ root: classes.topEditBtn }}
              disabled={!fees}
              edge="end"
              onClick={() => {
                setFeeEdit(false);
                setFees(false);
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
        {(fees || formData.values.quote_fee > 0) && (
          <Box className={classes.flexBox}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }} style={{ width: '120px' }}>
              Quote Fee
            </Typography>
            <Box pr={2} className={classes.inputContainer}>
              <CurrencyInput
                onClick={(e: any) => copyToClipboard(formData.values.quote_fee, e, fees)}
                size="small"
                color="secondary"
                InputProps={{
                  placeholder: 'Click pencil to edit',
                  classes: {
                    root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                      feeFields.quote_fee ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
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
                        disabled={feeFields.quote_fee && !formData.dirtyFields.quote_fee}
                      >
                        {feeFields.quote_fee && formData.dirtyFields.quote_fee && (
                          <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                        )}
                        &nbsp;
                        {feeFields.quote_fee && formData.dirtyFields.quote_fee && (
                          <CloseIcon
                            fontSize="small"
                            classes={{ root: classes.icon }}
                            onClick={() => form.change('quote_fee', formData.initialValues.quote_fee)}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                FormHelperTextProps={{ style: { display: 'none' } }}
                variant="outlined"
                disabled={!permissions.edit || !feeFields.quote_fee}
                fullWidth
                label=""
                source="quote_fee"
              />
            </Box>
          </Box>
        )}
        <Box className={classes.flexBox}>
          <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }} style={{ width: '120px' }}>
            Report Fee
          </Typography>
          <Box pr={2} className={classes.inputContainer}>
            <CurrencyInput
              onClick={(e: any) => copyToClipboard(formData.values.report_fee, e, fees)}
              size="small"
              color="secondary"
              InputProps={{
                placeholder: 'Click pencil to edit',
                classes: {
                  root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                    feeFields.report_fee ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
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
                      disabled={feeFields.report_fee && !formData.dirtyFields.report_fee}
                    >
                      {feeFields.report_fee && formData.dirtyFields.report_fee && (
                        <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                      )}
                      &nbsp;
                      {feeFields.report_fee && formData.dirtyFields.report_fee && (
                        <CloseIcon
                          fontSize="small"
                          classes={{ root: classes.icon }}
                          onClick={() => form.change('report_fee', formData.initialValues.report_fee)}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              FormHelperTextProps={{ style: { display: 'none' } }}
              variant="outlined"
              disabled={!permissions.edit || !feeFields.report_fee}
              fullWidth
              label=""
              source="report_fee"
            />
          </Box>
        </Box>
        <Box className={classes.flexBox}>
          <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }} style={{ width: '120px' }}>
            Total Fees
          </Typography>
          <Box pr={2} className={classes.inputContainer} onClick={() => redirect(`${location.pathname}#fees`)}>
            <CurrencyInput
              onClick={(e: any) => copyToClipboard(formData.values.total_fees, e, fees)}
              size="small"
              color="secondary"
              InputProps={{
                placeholder: 'Click pencil to edit',
                classes: {
                  root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${classes.cssOutlinedDisabled}`,
                  notchedOutline: classes.notchedOutline,
                },
              }}
              FormHelperTextProps={{ style: { display: 'none' } }}
              variant="outlined"
              disabled={true}
              fullWidth
              label=""
              source="total_fees"
            />
          </Box>
        </Box>
        <Box className={classes.flexBox} style={{ paddingBottom: '5px' }}>
          <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }} style={{ width: '120px' }}>
            Total Expenses
          </Typography>
          <Box pr={2} className={classes.inputContainer} onClick={() => redirect(`${location.pathname}#fees`)}>
            <CurrencyInput
              onClick={(e: any) => copyToClipboard(formData.values.total_expenses, e, fees)}
              size="small"
              color="secondary"
              InputProps={{
                placeholder: 'Click pencil to edit',
                classes: {
                  root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${classes.cssOutlinedDisabled}`,
                  notchedOutline: classes.notchedOutline,
                },
              }}
              FormHelperTextProps={{ style: { display: 'none' } }}
              variant="outlined"
              disabled={true}
              fullWidth
              label=""
              source="total_expenses"
            />
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

export default AppraisalEditForm;
