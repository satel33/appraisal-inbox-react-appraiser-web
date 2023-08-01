import * as React from 'react';
import {
  useNotify,
  Edit,
  ResourceContextProvider,
  useGetIdentity,
  TitleProps,
  EditProps,
  TabbedForm,
  FormTab,
  useMutation,
  Record,
} from 'react-admin';
import EditAction from 'shared/components/Resource/EditAction';
import CustomToolbar from 'shared/components/Resource/Toolbar';
import AppraisalList from './components/AppraisalList';
import getTeamPermission from './permissions';
import TeamForm from './TeamForm';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import { UserProfile } from './types';

const EditTitle = ({ record }: TitleProps) => (
  <span>Team Member: {record ? `${[record.first_name, record.last_name].filter(Boolean).join(' ')}` : ''}</span>
);

const EditClient = (props: EditProps): JSX.Element => {
  const { identity } = useGetIdentity();
  const notify = useNotify();
  const onSuccess = () => {
    notify('team.updated');
  };
  const [update] = useMutation({ type: 'update', resource: 'user_account', payload: {} });
  const [onDelete] = useMutation({ type: 'delete', resource: 'user_account', payload: {} });
  if (!identity) {
    return <span />;
  }
  return (
    <ResourceContextProvider value="user_profile">
      <Edit
        {...props}
        title={<EditTitle />}
        onSuccess={onSuccess}
        transform={transform}
        actions={<EditAction />}
        resource="user_profile"
        mutationMode="optimistic"
      >
        <TabbedForm
          redirect={false}
          toolbar={<CustomToolbar getPermission={getTeamPermission} onDeleteSuccess={onDeleteSuccess} />}
        >
          <FormTab label="Overview">
            <TeamForm identity={identity} />
          </FormTab>
          <FormTab label="Appraisals">
            <AppraisalList fullWidth />
          </FormTab>
        </TabbedForm>
      </Edit>
    </ResourceContextProvider>
  );

  async function transform(data: Record) {
    await update({
      payload: {
        id: data.user_account_id,
        data: pick(data.user_account, 'email', 'user_role_id', 'enabled'),
      },
    });
    return omit(data, 'user_account') as Record;
  }

  function onDeleteSuccess(data: UserProfile) {
    onDelete({
      payload: {
        id: data.user_account_id,
      },
    });
  }
};

export default EditClient;
