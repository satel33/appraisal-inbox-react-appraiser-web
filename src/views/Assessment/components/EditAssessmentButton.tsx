import React from 'react';
import ContentCreate from '@material-ui/icons/Create';
import ViewIcon from '@material-ui/icons/Visibility';
import { Button, useUpdate, useNotify, FieldProps } from 'react-admin';
import omit from 'lodash/omit';
import AssessmentDialog from './AssessmentDialog';
import { Assessment } from '../types';

type EditAssessmentButtonProps = FieldProps<Assessment> & {
  onSuccess?(): void;
  readOnly?: boolean;
};

function EditAssessmentButton(props: EditAssessmentButtonProps) {
  const [showDialog, setShowDialog] = React.useState(false);
  const [update, { loading }] = useUpdate('assessment', props?.record?.id);
  const notify = useNotify();
  const handleClick = () => {
    setShowDialog(true);
  };

  const handleCloseClick = () => {
    setShowDialog(false);
  };

  const handleSubmit = async (values: Partial<Assessment>) => {
    update(
      {
        payload: {
          data: omit(values, 'organization_id', 'id', 'created_at', 'updated_at', 'property_id'),
        },
      },
      {
        onSuccess: async () => {
          setShowDialog(false);
          notify('Assessment successfully updated');
          props?.onSuccess?.();
        },
        onFailure: ({ error }) => {
          notify(error.message, 'error');
        },
      },
    );
  };
  const { readOnly } = props;
  const title = `${readOnly ? 'View' : 'Edit'} Assessment`;
  return (
    <>
      <Button onClick={handleClick}>{readOnly ? <ViewIcon /> : <ContentCreate />}</Button>
      <AssessmentDialog
        readOnly={readOnly}
        isVisible={showDialog}
        onClose={handleCloseClick}
        title={title}
        onSubmit={handleSubmit}
        loading={loading}
        initialValues={props.record}
      />
    </>
  );
}

export default EditAssessmentButton;
