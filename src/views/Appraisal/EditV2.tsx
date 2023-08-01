import React from 'react';
import {
  useNotify,
  useMutation,
  Edit,
  ResourceContextProvider,
  useGetIdentity,
  EditProps,
  Record,
  TitleProps,
} from 'react-admin';
import omit from 'lodash/omit';
import { useDispatch } from 'react-redux';
import { FetchMenuCount } from './reducer';
import { Appraisal } from 'views/Appraisal/types';
import { standardMutationRoles } from 'shared/constants/roles';
// import PdfTab from './components/PdfTab';
import EditForm from './EditForm';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

const EditTitle = ({ record }: TitleProps) => (
  <span>Appraisal: {record ? getAppraisalTitle(record as Appraisal) : ''}</span>
);

const EditAppraisal = (props: EditProps) => {
  const dispatch = useDispatch();
  const { identity } = useGetIdentity();
  const notify = useNotify();
  const onSuccess = () => {
    dispatch(FetchMenuCount());
    notify('appraisal.updated');
  };
  const [update] = useMutation({ type: 'update', resource: 'property', payload: {} });

  if (!identity) {
    return (
      <Grid container direction="column" alignItems="center" style={{ marginTop: '20px' }}>
        <CircularProgress />
      </Grid>
    );
  }
  return (
    <ResourceContextProvider value="appraisal">
      <Edit
        {...props}
        onSuccess={onSuccess}
        transform={transform}
        title={<EditTitle />}
        resource="appraisal"
        mutationMode="optimistic"
      >
        <EditForm></EditForm>
      </Edit>
    </ResourceContextProvider>
  );

  async function transform(data: Record) {
    const appraisal: Appraisal = {
      ...(data as Appraisal),
    };
    if (standardMutationRoles.includes(identity?.role ?? '')) {
      await update({
        payload: {
          id: appraisal.property.id,
          data: {
            ...omit(appraisal.property, 'id', 'organization_id', 'user_account_id', 'updated_by_user_account_id'),
            property_type_id: appraisal.property_type_id,
          },
        },
      });
    }
    return omit(appraisal, 'property', 'assignee_user_account_names') as Record;
  }
};

function getAppraisalTitle(record: Appraisal) {
  return [record.appraisal_file_number, record.property.location_address].filter(Boolean).join(' - ');
}
export default EditAppraisal;
