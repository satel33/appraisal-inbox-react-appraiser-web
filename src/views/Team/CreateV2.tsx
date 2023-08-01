import React from 'react';
import {
  useNotify,
  Create,
  ResourceContextProvider,
  useRedirect,
  useGetIdentity,
  CreateProps,
  Record,
  SimpleForm,
} from 'react-admin';
import EditAction from 'shared/components/Resource/EditAction';
import { Card, Box } from '@material-ui/core';
import CustomToolbar from './components/Toolbar';
import getTeamPermission from './permissions';
import TeamForm from './TeamFormV2';
import omit from 'lodash/omit';
import gql from 'graphql-tag';
import { User_Account } from 'shared/generated/types';
import { useMutation } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';

const INSERT_USER = gql`
  mutation insert_user_account($object: user_account_insert_input!) {
    userAccount: insert_user_account_one(object: $object) {
      id
    }
  }
`;

const CreateTeam = (props: CreateProps) => {
  const styles = makeStyles({
    cardRoot: {
      paddingRight: '10px',
      paddingLeft: '10px',
      marginBottom: '30px',
      paddingTop: '0px !important',
    },
  });
  const classes = styles();
  const { identity } = useGetIdentity();
  const notify = useNotify();
  const redirect = useRedirect();
  const [create] = useMutation<{ userAccount: User_Account }>(INSERT_USER);
  if (!identity) {
    return <span />;
  }

  return (
    <Box>
      <EditAction />
      <Card variant="outlined" classes={{ root: classes.cardRoot }}>
        <ResourceContextProvider value="user_profile">
          <Create basePath="/team" {...props} onSuccess={onSuccess} transform={transform} resource="user_profile">
            <SimpleForm toolbar={<CustomToolbar getPermission={getTeamPermission} />}>
              <TeamForm identity={identity} />
            </SimpleForm>
          </Create>
        </ResourceContextProvider>
      </Card>
    </Box>
  );

  function onSuccess({ data }: { data: Record }) {
    notify('team.created');
    redirect(`/team/${data.id}`);
  }

  async function transform(data: Record) {
    const name = data.first_name.split(' ');
    data.first_name = name[0];
    data.last_name = name.slice(1).join(' ');
    const response = await create({
      variables: {
        object: omit(data.user_account, 'enabled'),
      },
    });
    return omit(
      {
        ...data,
        user_account_id: response?.data?.userAccount?.id,
      },
      'user_account',
    );
  }
};

export default CreateTeam;
