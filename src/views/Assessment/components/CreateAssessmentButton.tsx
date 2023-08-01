import React, { useState } from 'react';
import { Button, useCreate, useNotify, FieldProps } from 'react-admin';
import IconContentAdd from '@material-ui/icons/Add';
import AssessmentDialog from './AssessmentDialog';
import { Assessment } from '../types';

type CreateAssessmentButtonProps = FieldProps<Assessment> & {
  onSuccess?(): void;
  propertyId: string;
};

function CreateAssessmentButton(props: CreateAssessmentButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [create, { loading }] = useCreate('assessment');
  const notify = useNotify();
  const handleClick = () => {
    setShowDialog(true);
  };

  const handleCloseClick = () => {
    setShowDialog(false);
  };

  const handleSubmit = async (values: Partial<Assessment>) => {
    create(
      {
        payload: {
          data: {
            ...values,
            property_id: props.propertyId,
          },
        },
      },
      {
        onSuccess: async () => {
          setShowDialog(false);
          notify('Assessment successfully created');
          props.onSuccess?.();
        },
        onFailure: ({ error }) => {
          notify(error.message, 'error');
        },
      },
    );
  };

  return (
    <>
      <Button onClick={handleClick} label="ra.action.create">
        <IconContentAdd />
      </Button>
      <AssessmentDialog
        isVisible={showDialog}
        onClose={handleCloseClick}
        title="Add Assessment"
        onSubmit={handleSubmit}
        loading={loading}
      />
    </>
  );
}

export default CreateAssessmentButton;
