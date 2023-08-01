import React, { useState } from 'react';
import { useGetIdentity, ResourceComponentInjectedProps, SimpleForm, Button } from 'react-admin';
import Pizzly from 'pizzly-js';
import { useMutation } from '@apollo/client';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Modal } from '@material-ui/core';
import { ErrorOutline, CheckCircle } from '@material-ui/icons';
import PageLoader from '../PageLoader';
import useIntegrationResponse, {
  ADD_INTEGRATION_AUTHENTICATION,
  DELETE_INTEGRATION_AUTHENTICATION,
} from 'shared/hooks/useIntegrationsQuery';
import useProfileOptions from 'shared/hooks/useProfileOptions';
import styles from 'views/Client/components/hooks/useContactListStyles';

import { simpleFormContainer } from 'shared/hooks/useEditFormStyle';

function UserIntegrationPage(props: ResourceComponentInjectedProps) {
  // Initialize Pizzly
  const PIZZLY_HOSTNAME = process.env.REACT_APP_PIZZLY_HOSTNAME;
  const PIZZLY_PUBLISHABLE_KEY = process.env.REACT_APP_PIZZLY_PUBLISHABLE_KEY;
  const PIZZLY_SETUP_ID_GOOGLE_CALENDAR = process.env.REACT_APP_PIZZLY_SETUP_ID_GOOGLE_CALENDAR;

  const pizzly = new Pizzly({
    host: PIZZLY_HOSTNAME,
    publishableKey: PIZZLY_PUBLISHABLE_KEY,
  });

  const googleCalendar = pizzly.integration('google-calendar', {
    setupId: PIZZLY_SETUP_ID_GOOGLE_CALENDAR,
  });

  const identityState = useGetIdentity();
  const tableClasses = styles();
  const classes = simpleFormContainer();

  const [isOpen, setOpen] = useState(false);
  const [rowItem, setRowItem] = useState({ id: '', name: '' });

  const [{ loading }] = useProfileOptions({ user_account_id: identityState?.identity?.id + '' });
  const [integrationResponse] = useIntegrationResponse();

  const [addIntegration] = useMutation(ADD_INTEGRATION_AUTHENTICATION, {
    onCompleted: () => {
      integrationResponse.refetch();
    },
  });
  const [deleteIntegration] = useMutation(DELETE_INTEGRATION_AUTHENTICATION, {
    onCompleted: () => {
      integrationResponse.refetch();
      setOpen(false);
    },
  });

  const checkConnection = (integrationId: any) => {
    if (integrationResponse.data?.integration_authentication.length === 0) return false;

    return integrationResponse.data?.integration_authentication.filter((item) => item?.integration_id === integrationId)
      ? true
      : false;
  };

  const onConnect = (integration: any) => {
    googleCalendar
      .connect()
      .then(({ authId }) => {
        addIntegration({
          variables: {
            integrationId: integration.id,
            integrationType: integration.integration_type,
            authId: authId,
          },
        });
      })
      .catch(console.error);
  };
  const onDelete = (integrationId: any) => {
    deleteIntegration({
      variables: {
        integrationId: integrationId,
      },
    });
  };

  if (identityState.loading || loading || integrationResponse.loading) {
    return <PageLoader />;
  }

  return (
    <SimpleForm {...props} toolbar={<span />} margin="none">
      <Box p={0} className={classes.formContainerOrganization}>
        <Table>
          <TableHead classes={{ root: tableClasses.tableHead }}>
            <TableRow>
              <TableCell classes={{ root: tableClasses.headCell }}>INTEGRATION</TableCell>
              <TableCell classes={{ root: tableClasses.headCell }}>DESCRIPTION</TableCell>
              <TableCell classes={{ root: tableClasses.headCell }}>ACTIVE</TableCell>
              <TableCell classes={{ root: tableClasses.headCell }}>CONNECTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {integrationResponse?.data?.integrations.map((row: any, idx: number) => (
              <TableRow key={idx}>
                <TableCell component="th" scope="row" classes={{ root: tableClasses.cell }}>
                  {row.name}
                </TableCell>
                <TableCell classes={{ root: tableClasses.cell }}>{row.description}</TableCell>
                <TableCell classes={{ root: tableClasses.cell }}>{checkConnection(row.id) ? 'Yes' : 'No'}</TableCell>
                <TableCell classes={{ root: tableClasses.cell }}>
                  {checkConnection(row.id) ? (
                    <Button
                      onClick={() => {
                        setOpen(true);
                        setRowItem({ id: row.id, name: row.name });
                      }}
                      variant="outlined"
                      style={{ lineHeight: 'normal' }}
                      label="Disconnect from Google Calendar"
                    ></Button>
                  ) : (
                    <Button
                      onClick={() => onConnect(row)}
                      label="Connect to Google Calendar"
                      style={{ lineHeight: 'normal', color: '#434445' }}
                    >
                      <img src="/icons/btn_google.svg" alt="Connect to Google Calendar" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Modal open={isOpen} onClose={() => setOpen(false)}>
          <Box className={classes.modal}>
            <Typography classes={{ root: classes.modalHeading }}>Disconnect Integration: {rowItem.name}</Typography>
            <Typography classes={{ root: classes.modalBody }}>
              Are you sure you want to disconnect this integration?
            </Typography>
            <Box className={classes.modalActions}>
              <Button
                onClick={() => setOpen(false)}
                label="Cancel"
                size="large"
                color="default"
                startIcon={<ErrorOutline />}
              ></Button>
              <Button
                onClick={() => onDelete(rowItem.id)}
                label="Confirm"
                color="primary"
                size="large"
                startIcon={<CheckCircle />}
              ></Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </SimpleForm>
  );
}

export default UserIntegrationPage;
