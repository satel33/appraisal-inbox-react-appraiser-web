import React, { useState, useCallback } from 'react';
import { Button, useCreate, useNotify, ReferenceInput, Record } from 'react-admin';
import { useForm } from 'react-final-form';
import IconContentAdd from '@material-ui/icons/Add';
import ContactDialog from './ContactDialog';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import { makeStyles } from '@material-ui/core/styles';
import { ReferenceInputProps } from 'ra-ui-materialui/lib/input/ReferenceInput';
import { Contact } from '../types';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
});

function SearchCreateContactField(props: ReferenceInputProps) {
  const classes = useStyles(props);
  const { title, mutationParams = {} } = props;
  const [showDialog, setShowDialog] = useState(false);
  const [create, { loading }] = useCreate('contact');
  const [version, setVersion] = useState(0);
  const handleChange = useCallback(() => setVersion(version + 1), [version]);
  const form = useForm();
  const notify = useNotify();

  const handleClick = () => {
    setShowDialog(true);
  };

  const handleCloseClick = () => {
    setShowDialog(false);
  };

  const handleSubmit = async (values: Partial<Contact>) => {
    create(
      {
        payload: {
          data: {
            ...mutationParams,
            ...values,
          },
        },
      },
      {
        onSuccess: ({ data }: { data: Record }) => {
          form.change(props.source || '', data.id);
          handleChange();
          setShowDialog(false);
        },
        onFailure: ({ error }) => {
          notify(error.message, 'error');
        },
      },
    );
  };

  return (
    <div className={classes.root}>
      <ReferenceInput {...props} key={version}>
        <AutocompleteInput
          source=""
          optionText={(record: Contact) => [record.full_name, record.client_name].filter(Boolean).join(' - ')}
        />
      </ReferenceInput>
      {!props.disabled && (
        <Button onClick={handleClick} label="ra.action.create">
          <IconContentAdd />
        </Button>
      )}
      <ContactDialog
        isVisible={showDialog}
        onClose={handleCloseClick}
        title={title}
        onSubmit={handleSubmit}
        loading={loading}
        typeVisible={false}
      />
    </div>
  );
}

export default SearchCreateContactField;
