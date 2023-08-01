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
import CustomToolbar from 'shared/components/Resource/Toolbar';
import getTeamPermission from './permissions';
import TeamForm from './TeamForm';
import omit from 'lodash/omit';
import gql from 'graphql-tag';
import { User_Account } from 'shared/generated/types';
import { useMutation } from '@apollo/client';

const INSERT_USER = gql`
  mutation insert_user_account($object: user_account_insert_input!) {
    userAccount: insert_user_account_one(object: $object) {
      id
    }
  }
`;

const CreateTeam = (props: CreateProps) => {
  const { identity } = useGetIdentity();
  const notify = useNotify();
  const redirect = useRedirect();
  const [create] = useMutation<{ userAccount: User_Account }>(INSERT_USER);
  if (!identity) {
    return <span />;
  }
  return (
    <ResourceContextProvider value="user_profile">
      <Create {...props} actions={<EditAction />} onSuccess={onSuccess} transform={transform} resource="user_profile">
        <SimpleForm toolbar={<CustomToolbar getPermission={getTeamPermission} />}>
          <TeamForm identity={identity} />
        </SimpleForm>
      </Create>
    </ResourceContextProvider>
  );

  function onSuccess({ data }: { data: Record }) {
    notify('team.created');
    redirect(`/team/${data.id}`);
  }

  async function transform(data: Record) {
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
