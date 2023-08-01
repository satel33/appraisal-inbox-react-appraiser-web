import { Box, Card, Divider, Grid, IconButton, InputAdornment, Typography, useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useState } from 'react';
import {
  BooleanInput,
  email,
  required,
  SimpleForm,
  TextInput,
  useMutation,
  useNotify,
  UserIdentity,
} from 'react-admin';
import { useForm, useFormState } from 'react-final-form';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import PlacesAutocomplete from 'shared/components/PlacesAutocomplete';
import EditAction from 'shared/components/Resource/EditAction';
import ResourceCount from 'shared/components/ResourceButton';
import UrlInput from 'shared/components/UrlInput';
import { elavatedRoles, rolesMapping } from 'shared/constants/roles';
import { profileStyles, simpleFormContainer, styleRight } from 'shared/hooks/useEditFormStyle';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import useTeamOptions, { useProfileOptions } from 'shared/hooks/useTeamOptions';
import { copyToClipboard, formatAddress } from 'shared/utils';
import DateInColumn from './components/DateInColumn';
import getTeamPermission from './permissions';
import { TeamTabs } from './TeamTabs';
import { UserProfile } from './types';

type TeamFormProps = {
  identity: UserIdentity;
  record?: any;
};

function TeamForm(props: TeamFormProps) {
  props.record.name = `${props.record.first_name} ${props.record.last_name}`;
  props.record.location_address = formatAddress(props?.record?.location_address ?? '');

  return (
    <SimpleForm {...props} toolbar={<span></span>}>
      <TeamFormContainer {...props}></TeamFormContainer>
    </SimpleForm>
  );
}

function TeamFormContainer(props: TeamFormProps) {
  const [onDelete] = useMutation({ type: 'delete', resource: 'user_account', payload: {} });

  const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('xs'));
  const classes = simpleFormContainer();
  const formState = useFormState();
  const [{ permissions }] = useFormPermissions({ getPermission: getTeamPermission });
  const [profileOptions] = useProfileOptions({ id: formState.values.id });

  function onDeleteSuccess(data: UserProfile) {
    onDelete({
      payload: {
        id: data.user_account_id,
      },
    });
  }

  return (
    <Box className={classes.formContainer}>
      <EditAction
        onDeleteSuccess={onDeleteSuccess}
        basePath="/team"
        resource="team"
        record={{ id: formState.values.id, name: formState.values.name }}
        permissions={permissions}
        resourceCount={profileOptions?.data?.profile[0] ? profileOptions?.data?.profile[0].appraisals_count : 0}
      />
      <Grid container direction={isSmallScreen ? 'column-reverse' : 'row'} alignItems="flex-start" spacing={4}>
        <Grid container item lg={8} md={7} xs={12} sm={12}>
          <TeamFieldsLeft {...props}></TeamFieldsLeft>
        </Grid>
        <Grid container item lg={4} md={5} xs={12} sm={12}>
          <TeamFieldsRight {...props}></TeamFieldsRight>
        </Grid>
      </Grid>
    </Box>
  );
}

function TeamFieldsLeft(props: TeamFormProps) {
  return <TeamTabs />;
}

function TeamFieldsRight(props: TeamFormProps) {
  const notify = useNotify();
  const profileClasses = profileStyles();
  const classes = styleRight();
  const styles = makeStyles({
    zeroMargin: {
      marginTop: '0px !important',
    },
  });
  const customClasses = styles();
  const formState = useFormState();
  const form = useForm();
  const { identity } = props;
  const { role } = identity;
  const [options] = useTeamOptions();
  const [profileOptions] = useProfileOptions({ id: formState.values.id });
  const [{ permissions, formData }] = useFormPermissions({ getPermission: getTeamPermission });
  const notCurrentUser = identity?.id !== formData?.user_account_id;
  const editRoleEnabled = canEditRole();
  const [edit, setEdit] = useState(false);
  const getDefaultFields = (initialValue: boolean) => ({
    name: initialValue,
    email: initialValue,
    phone_number: initialValue,
    url: initialValue,
    location_address: initialValue,
    user_role_id: initialValue,
  });
  const [fields, setFields] = useState<any>(getDefaultFields(false));
  const setAllFields = (val: boolean) => {
    setFields(getDefaultFields(val));
    setEdit(val);
  };

  const save = useCallback(debounce(form.submit, 0), []);
  const [saveMutation] = useMutation({
    type: 'update',
    resource: 'user_account',
    payload: { id: formState.values?.user_account?.id, data: {} },
  });

  function isSuperiorRole() {
    if (!elavatedRoles.includes(role)) return false;
    return (
      elavatedRoles.indexOf(role) >=
      elavatedRoles.indexOf(rolesMapping?.[formData?.user_account?.user_role_id ?? 0] ?? '')
    );
  }

  function canEditRole() {
    if (!formData?.id) {
      return true;
    }
    return elavatedRoles.includes(role) && isSuperiorRole();
  }

  function canEditStatus() {
    return notCurrentUser && isSuperiorRole();
  }

  useEffect(() => {
    if (formState.values?.user_account?.id) {
      saveMutation({
        payload: {
          id: formState.values.user_account.id,
          data: formState.values.user_account,
        },
      });
    }
  }, [formState.values?.user_account?.enabled]);

  const onToggleChange = () => {
    notify('team.updated');
  };

  // useEffect(() => {
  //   // Hide admin and owner roles but they will stay in dropdown memory to display existing value
  //   // Do not remove these roles from option by filter or disable logic. It will not work as it will also hide existing value
  //   // Using observer pattern to only hide it from dropdown but keep them in autocomplete memory
  //   const observer = new MutationObserver(function (mutations_list) {
  //     mutations_list.forEach(function (mutation) {
  //       mutation.addedNodes.forEach((added_node: any) => {
  //         if (added_node.classList.contains('MuiAutocomplete-popper')) {
  //           added_node.childNodes[0].childNodes[0].childNodes[0].style.display = 'none'; // Admin
  //           added_node.childNodes[0].childNodes[0].childNodes[1].style.display = 'none'; // Owner
  //         }
  //       });
  //     });
  //   });
  //   const body = document.querySelector('body');
  //   if (body) {
  //     observer.observe(body, { subtree: false, childList: true });
  //   }
  //   return () => {
  //     // Cleanup function and remove the observer
  //     observer.disconnect();
  //   };
  // }, []);

  const isFormDirty = (): boolean => !!Object.keys(formState.dirtyFields).length;

  return (
    <Box className={classes.formContainer}>
      <Card variant="outlined" classes={{ root: classes.card }}>
        <Box className={classes.flexBox}>
          <Typography classes={{ root: `${classes.heading} ${classes.heading500} ${classes.fontLarge}` }}>
            Team Member
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
                Object.keys(formState.dirtyFields).forEach((field: string) => {
                  const [a, b] = field.split('.');
                  if (a && b) {
                    form.change(field, formState.initialValues[a][b]);
                  } else {
                    form.change(field, formState.initialValues[a]);
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
              onClick={(e: any) => copyToClipboard(formState.values.name, e, edit)}
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
                      disabled={fields.name && !formState.dirtyFields.name}
                    >
                      {fields.name && formState.dirtyFields.name && (
                        <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                      )}
                      &nbsp;
                      {fields.name && formState.dirtyFields.name && (
                        <CloseIcon
                          fontSize="small"
                          classes={{ root: classes.icon }}
                          onClick={() => form.change('name', formState.initialValues.name)}
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
            />
          </Box>
        </Box>
        <Box className={classes.flexBox}>
          <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Email</Typography>
          <Box pr={2} className={classes.inputContainer}>
            <TextInput
              onClick={(e: any) => copyToClipboard(formState.values.user_account.email, e, edit)}
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
                      disabled={fields.email && !formState.dirtyFields['user_account.email']}
                    >
                      {fields.email && formState?.dirtyFields['user_account.email'] && (
                        <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                      )}
                      &nbsp;
                      {fields.email && formState.dirtyFields['user_account.email'] && (
                        <CloseIcon
                          fontSize="small"
                          classes={{ root: classes.icon }}
                          onClick={() =>
                            form.change('user_account.email', formState.initialValues?.user_account?.email)
                          }
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
              source="user_account.email"
              validate={[email()]}
            />
          </Box>
        </Box>
        {(edit || formState.values.phone_number) && (
          <Box className={classes.flexBox}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Phone</Typography>
            <Box pr={2} className={classes.inputContainer}>
              <TextInput
                onClick={(e: any) => copyToClipboard(formState.values.phone_number, e, edit)}
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
                        disabled={fields.phone_number && !formState.dirtyFields.phone_number}
                      >
                        {fields.phone_number && formState.dirtyFields.phone_number && (
                          <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                        )}
                        &nbsp;
                        {fields.phone_number && formState.dirtyFields.phone_number && (
                          <CloseIcon
                            fontSize="small"
                            classes={{ root: classes.icon }}
                            onClick={() => form.change('phone_number', formState.initialValues.phone_number)}
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
        {(edit || formState.values.url) && (
          <Box className={classes.flexBox}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Website</Typography>
            <Box pr={2} className={classes.inputContainer}>
              <UrlInput
                onClick={(e: any) => copyToClipboard(formState.values.url, e, edit)}
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
                  endAdornment: formState.dirtyFields.url ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        className={classes.fieldEditBtn}
                        edge="end"
                        disabled={fields.url && !formState.dirtyFields.url}
                      >
                        {fields.url && formState.dirtyFields.url && (
                          <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                        )}
                        &nbsp;
                        {fields.url && formState.dirtyFields.url && (
                          <CloseIcon
                            fontSize="small"
                            classes={{ root: classes.icon }}
                            onClick={() => form.change('url', formState.initialValues.url)}
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
        {(edit || formState.values.location_address) && (
          <Box className={classes.flexBoxAuto}>
            <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Address</Typography>
            <Box
              pr={2}
              className={classes.inputContainer}
              onClick={(e: any) => copyToClipboard(formState.values.location_address, e, edit)}
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
                        disabled={fields.location_address && !formState.dirtyFields.location_address}
                      >
                        {fields.location_address && formState.dirtyFields.location_address && (
                          <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                        )}
                        &nbsp;
                        {fields.location_address && formState.dirtyFields.location_address && (
                          <CloseIcon
                            fontSize="small"
                            classes={{ root: classes.icon }}
                            onClick={() => form.change('location_address', formState.initialValues.location_address)}
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
        {editRoleEnabled && <Divider classes={{ root: classes.dividerEnd }}></Divider>}
        {editRoleEnabled && (
          <Grid alignItems="center" container item md={12}>
            <Box className={classes.flexBox} style={{ marginBottom: '10px' }}>
              <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Access</Typography>
              <Box pr={2} className={classes.inputContainer}>
                <AutocompleteInput
                  label=""
                  source="user_account.user_role_id"
                  fullWidth
                  optionText="display"
                  variant="outlined"
                  disabled={!permissions.edit || !fields.user_role_id || !notCurrentUser}
                  defaultValue={3}
                  choices={options.data?.roles ?? []}
                  getOptionDisabled={(e: any) => e.id === 1 || e.id === 2}
                  setFilter={(e: any) => console.log(e)}
                  css={{ popupIndicator: classes.popupIndicator, popupIndicatorOpen: classes.popupIndicatorOpen }}
                  options={{
                    InputProps: {
                      placeholder: 'Click pencil to edit',
                      classes: {
                        root: `${classes.cssOutlinedInput} ${classes.inputFontSize} ${
                          fields.user_role_id ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
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
                            disabled={fields.user_role_id && !formState.dirtyFields['user_account.user_role_id']}
                          >
                            {fields.user_role_id && formState.dirtyFields['user_account.user_role_id'] && (
                              <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                            )}
                            &nbsp;
                            {fields.user_role_id && formState.dirtyFields['user_account.user_role_id'] && (
                              <CloseIcon
                                fontSize="small"
                                classes={{ root: classes.icon }}
                                onClick={() =>
                                  form.change(
                                    'user_account.user_role_id',
                                    formState.initialValues?.user_account?.user_role_id,
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
            <Grid item md={12} xs={11}>
              <Box ml={2} mr={2} mb={1}>
                <Typography
                  color="textSecondary"
                  style={{
                    color: '#000000',
                    fontSize: '0.8rem',
                    fontStyle: 'italic',
                    position: 'relative',
                    top: '0px',
                  }}
                  variant="caption"
                >
                  {options.data?.roles.find((role) => role.id === formData?.user_account?.user_role_id)?.description}
                </Typography>
              </Box>
            </Grid>
            <Grid item md={12} xs={12}>
              <Divider style={{ marginTop: '7px', marginBottom: '8px' }}></Divider>
            </Grid>
            <Grid item md={12} xs={12}>
              {canEditStatus() && (
                <Box className={classes.flexBox} style={{ marginBottom: '10px' }}>
                  <Typography classes={{ root: `${classes.heading} ${classes.heading400}` }}>Active</Typography>
                  <Box pr={1} className={`${classes.inputContainerRole} ${classes.heading500}`}>
                    <BooleanInput
                      className={profileClasses.toggleDisabled}
                      disabled={!edit}
                      onChange={onToggleChange}
                      label={formData?.user_account?.enabled ? 'Yes' : 'No'}
                      source="user_account.enabled"
                    />
                  </Box>
                </Box>
              )}
            </Grid>
            <Box
              className={classes.flexBox}
              style={{ marginBottom: '0px', marginTop: canEditStatus() ? '1px' : '10px' }}
            >
              <Typography classes={{ root: `${classes.heading} ${classes.heading400} ${customClasses.zeroMargin}` }}>
                Last&nbsp;Active
              </Typography>
              <Box pr={2} className={`${classes.inputContainer} ${classes.heading500}`}>
                <DateInColumn
                  align="left"
                  mt="3px"
                  ml="8px"
                  fontStyle="italic"
                  record={{ id: formState.values.id, last_active_at: profileOptions?.data?.profile[0]?.last_active_at }}
                  label="Last Active"
                  source="last_active_at"
                />
              </Box>
            </Box>
          </Grid>
        )}
        <Box className={classes.resourceSection}>
          <Box className={classes.countBtn}>
            <ResourceCount
              record={{
                id: formState.values.id,
                ...formState.values,
                appraisals_count: profileOptions?.data?.profile[0]
                  ? profileOptions?.data?.profile[0].appraisals_count
                  : 0,
              }}
              label="Appraisal"
              filter={(record: any) => ({
                assignee_user_account_ids: [record.user_account_id],
              })}
              basePath="/appraisals"
              countKey="appraisals_count"
              source="appraisals_count"
              startIcon="assignment"
            />
          </Box>
          <Box className={classes.countBtn}>
            <ResourceCount
              record={{
                id: formState.values.id,
                ...formState.values,
              }}
              label="Schedule"
              filter={(record: any) => ({
                assignee_user_account_ids: [record.user_account_id],
              })}
              hideCount={true}
              basePath="/schedule"
              countKey=""
              source=""
              startIcon="today"
            />
          </Box>
          <Box className={classes.countBtn}>
            <ResourceCount
              record={{
                id: formState.values.id,
                ...formState.values,
              }}
              label="Insights"
              filter={(record: any) => ({
                assignee_user_account_ids: [record.user_account_id],
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

export default TeamForm;
