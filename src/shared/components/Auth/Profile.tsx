import React, { useCallback, useState, useEffect } from 'react';
import {
  Edit,
  SimpleForm,
  useNotify,
  useGetIdentity,
  ResourceComponentInjectedProps,
  Record,
  required,
  useRedirect,
} from 'react-admin';
import { formatAddress } from 'shared/utils';
import debounce from 'lodash/debounce';
import { useForm, useFormState } from 'react-final-form';
import useProfileOptions from 'shared/hooks/useProfileOptions';
import Grid from '@material-ui/core/Grid';
import { Tabs, Tab, Box, Divider, InputAdornment, IconButton, Card } from '@material-ui/core';
import PlacesAutocomplete from 'shared/components/PlacesAutocomplete';
import { TextInput } from 'react-admin';
import PageLoader from '../PageLoader';
import UrlInput from '../UrlInput';
import Typography from '@material-ui/core/Typography';
import { profileStyles, styleRight, simpleFormContainer } from 'shared/hooks/useEditFormStyle';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import OrganizationPage from './Organization';
import UserAccount from './UserAccount';
import UserNotification from './UserNotification';
import UserIntegrationPage from './UserIntegration';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import useTeamOptions from 'shared/hooks/useTeamOptions';

function ProfilePage(props: ResourceComponentInjectedProps) {
  const redirect = useRedirect();
  const identityState = useGetIdentity();
  const [value, setValue] = React.useState(0);
  const classes = simpleFormContainer();
  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  useEffect(() => {
    const input = props as any;
    const path = input?.location?.hash.slice(1);
    const index: any = { account: 0, subscription: 1, notification: 2, integration: 3 };
    setValue(path ? index[path] : 0);
    if (!path) {
      redirect(`/account/my-profile#account`);
    }
  }, [props, redirect]);

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  if (identityState.loading) {
    return <PageLoader />;
  }

  const getIndex = (tab: string) => {
    switch (tab) {
      case 'account':
        return 0;
      case 'subscription':
        return isOwner() ? 1 : -1;
      case 'notification':
        return isOwner() ? 2 : 1;
      case 'integration':
        return isOwner() ? 3 : 2;
      default:
        return 0;
    }
  };

  const isOwner = () => {
    return identityState?.identity?.role === 'appraisal_firm_account_owner';
  };

  const onTabClick = (path: string) => {
    redirect(`/account/my-profile#${path}`);
  };

  return (
    <Box className={classes.formContainer}>
      <Box pl={2} pt={1} pb={1}>
        <Tabs
          textColor="primary"
          indicatorColor="primary"
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="ACCOUNT" {...a11yProps(getIndex('account'))} onClick={() => onTabClick('account')} />
          {isOwner() && (
            <Tab
              label="SUBSCRIPTION"
              {...a11yProps(getIndex('subscription'))}
              onClick={() => onTabClick('subscription')}
            />
          )}
          <Tab
            label="NOTIFICATIONS"
            {...a11yProps(getIndex('notification'))}
            onClick={() => onTabClick('notification')}
          />
          <Tab label="INTEGRATIONS" {...a11yProps(getIndex('integration'))} onClick={() => onTabClick('integration')} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={getIndex('account')}>
        <ProfileTab></ProfileTab>
      </TabPanel>
      {isOwner() && (
        <TabPanel value={value} index={getIndex('subscription')}>
          <SubscriptionTab></SubscriptionTab>
        </TabPanel>
      )}
      <TabPanel value={value} index={getIndex('notification')}>
        <UserNotification />
      </TabPanel>
      <TabPanel value={value} index={getIndex('integration')}>
        <UserIntegrationPage />
      </TabPanel>
    </Box>
  );
}

export default ProfilePage;

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box pt={0}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function ProfileTab(props: any) {
  return (
    <Box p={0}>
      <OrganizationPage></OrganizationPage>
      <UserProfile></UserProfile>
    </Box>
  );
}

function UserProfile(props: any) {
  const identityState = useGetIdentity();
  const notify = useNotify();
  const onSuccess = () => {
    notify('Profile updated');
  };
  async function transform(data: Record) {
    const name = data.name.split(' ');
    data.first_name = name[0];
    data.last_name = name.slice(1).join(' ');
    return data;
  }
  const [{ data, loading }] = useProfileOptions({
    user_account_id: identityState?.identity?.id + '',
  });
  const profile = data?.profile[0];

  if (identityState.loading || loading) {
    return <PageLoader />;
  }

  return (
    <Edit
      {...props}
      undoable={false}
      onSuccess={onSuccess}
      transform={transform}
      resource="user_profile"
      title=" "
      id={profile?.id + ''}
      basePath="/account/my-profile"
      mutationMode="pessimistic"
    >
      <SimpleForm {...props} toolbar={<span />}>
        <UserProfileForm {...props}></UserProfileForm>
      </SimpleForm>
    </Edit>
  );
}

function UserProfileForm(props: any) {
  const [options] = useTeamOptions();
  const classes = styleRight();
  const formData = useFormState();
  const profileClasses = profileStyles();
  const form = useForm();
  const [edit, setEdit] = useState(false);
  const [addressDirty, setAddressDirty] = useState(false);
  const getDefaultFields = (initialValue: boolean) => ({
    name: initialValue,
    organization: initialValue,
    email: initialValue,
    phone_number: initialValue,
    location_address: initialValue,
    client_type_id: initialValue,
    url: initialValue,
  });
  if (props.record) {
    props.record.name = `${props?.record?.first_name} ${props?.record?.last_name}`;
    props.record.location_address = formatAddress(props?.record?.location_address ?? '');
  }
  const [fields, setFields] = useState<any>(getDefaultFields(false));
  const setAllFields = (val: boolean) => {
    setFields(getDefaultFields(val));
    setEdit(val);
  };
  const save = useCallback(debounce(form.submit, 0), []);
  return (
    <Card variant="outlined" classes={{ root: `${classes.card} ${profileClasses.userAccountCard}` }}>
      <Box className={`${classes.flexBox} ${profileClasses.userAccountBox}`}>
        <Typography classes={{ root: `${profileClasses.userAccountHeading} ${classes.heading500}` }}>
          USER ACCOUNT
        </Typography>
        {!edit && (
          <IconButton
            className={classes.topEditBtnProfile}
            edge="end"
            disabled={edit}
            onClick={() => setAllFields(true)}
          >
            <EditIcon classes={{ root: classes.icon }} />
          </IconButton>
        )}
        {edit && (
          <IconButton
            classes={{ root: classes.topEditBtnProfile }}
            disabled={!edit}
            edge="end"
            onClick={() => {
              setEdit(false);
              setAllFields(false);
            }}
          >
            <CloseIcon classes={{ root: classes.icon }} />
          </IconButton>
        )}
      </Box>{' '}
      <Divider className={profileClasses.orgMB}></Divider>
      <Grid container direction="row" alignItems="center">
        <Grid item md={4} sm={1} xs={1}></Grid>
        <Grid item md={4} sm={3} xs={3}>
          <Typography classes={{ root: `${classes.heading400}` }}>Name</Typography>
        </Grid>
        <Grid item md={4} sm={6} xs={8}>
          <Box pr={2}>
            <TextInput
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
              disabled={!fields.name}
              validate={required()}
              fullWidth
              label=""
              source="name"
            />
          </Box>
        </Grid>
      </Grid>
      <UserAccount edit={edit}></UserAccount>
      <Grid container direction="row" alignItems="center">
        <Grid item md={4} sm={1} xs={1}></Grid>
        <Grid item md={4} sm={3} xs={3}>
          <Typography classes={{ root: `${classes.heading400}` }}>Phone</Typography>
        </Grid>
        <Grid item md={4} sm={6} xs={8}>
          <Box pr={2}>
            <TextInput
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
              disabled={!fields.phone_number}
              variant="outlined"
              label=""
              fullWidth
              source="phone_number"
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container direction="row" alignItems="center">
        <Grid item md={4} sm={1} xs={1}></Grid>
        <Grid item md={4} sm={3} xs={3}>
          <Typography classes={{ root: `${classes.heading400}` }}>URL</Typography>
        </Grid>
        <Grid item md={4} sm={6} xs={8}>
          <Box pr={2}>
            <UrlInput
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
              disabled={!fields.url}
              variant="outlined"
              label=""
              fullWidth
              source="url"
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container direction="row" alignItems="center">
        <Grid item md={4} sm={1} xs={1}></Grid>
        <Grid item md={4} sm={3} xs={3}>
          <Typography classes={{ root: `${classes.heading400}` }}>Address</Typography>
        </Grid>
        <Grid item md={4} sm={6} xs={8}>
          <Box pr={2}>
            <PlacesAutocomplete
              defaultValue="Click pencil to edit"
              onInputValChange={() => setAddressDirty(true)}
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
                      disabled={fields.location_address && !addressDirty}
                    >
                      {fields.location_address && addressDirty && (
                        <SaveIcon
                          fontSize="small"
                          classes={{ root: classes.icon }}
                          onClick={() => {
                            save();
                            setAddressDirty(false);
                          }}
                        />
                      )}
                      &nbsp;
                      {fields.location_address && addressDirty && (
                        <CloseIcon
                          fontSize="small"
                          classes={{ root: classes.icon }}
                          onClick={() => {
                            form.change('location_address', formData.initialValues.location_address);
                            setAddressDirty(false);
                          }}
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
              disabled={!fields.location_address}
              isRequired={false}
              source="location_address"
              isMapVisible={false}
              multiline
              rows={10}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container direction="row" alignItems="flex-start">
        <Grid item md={4} sm={1} xs={1}></Grid>
        <Grid item md={4} sm={3} xs={3}>
          <Typography classes={{ root: `${classes.heading400} ${profileClasses.accessLabel}` }}>Access</Typography>
        </Grid>
        <Grid item md={4} sm={6} xs={8}>
          <Box pr={2}>
            <AutocompleteInput
              label=""
              source="user_account.user_role_id"
              fullWidth
              optionText="display"
              variant="outlined"
              disabled={true}
              defaultValue={3}
              choices={options.data?.roles ?? []}
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
                        disabled={fields.user_role_id && !formData.dirtyFields['user_account.user_role_id']}
                      >
                        {fields.user_role_id && formData.dirtyFields['user_account.user_role_id'] && (
                          <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                        )}
                        &nbsp;
                        {fields.user_role_id && formData.dirtyFields['user_account.user_role_id'] && (
                          <CloseIcon
                            fontSize="small"
                            classes={{ root: classes.icon }}
                            onClick={() =>
                              form.change(
                                'user_account.user_role_id',
                                formData.initialValues?.user_account?.user_role_id,
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
          <Box ml={1} mr={2} mb={1}>
            <Typography color="textSecondary" className={classes.roleInfo} variant="caption">
              {
                options.data?.roles.find((role) => role.id === formData?.values?.user_account?.user_role_id)
                  ?.description
              }
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Box className={profileClasses.orgMB}></Box>
    </Card>
  );
}

function SubscriptionTab(props: any) {
  const profileClasses = profileStyles();
  const classes = styleRight();
  const identityState = useGetIdentity();
  if (identityState.loading) {
    return <PageLoader />;
  }
  return (
    <Edit
      {...props}
      undoable={false}
      resource="organization"
      title="Settings: Subscription"
      id={identityState?.identity?.organization_id}
      basePath="/account/my-profile"
    >
      <Box className={profileClasses.subscriptionContainer}>
        <Card variant="outlined" classes={{ root: classes.card }}>
          <Box className={`${classes.flexBox} ${profileClasses.userAccountBox}`}>
            <Typography classes={{ root: `${profileClasses.userAccountHeading} ${classes.heading500}` }}>
              SUBSCRIPTION
            </Typography>
          </Box>
          <Divider classes={{ root: classes.dividerMB }}></Divider>
          <Typography className={profileClasses.paymentLink}>
            For questions about your Subscription, please contact support: <u>support@appraisalinbox.com</u>
          </Typography>
        </Card>
      </Box>
    </Edit>
  );
}
