import React, { useState, useCallback } from 'react';
import { ReferenceInput } from 'react-admin';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import { makeStyles } from '@material-ui/core/styles';
import ClientQuickCreateButton from './ClientQuickCreateButton';
import { ReferenceInputProps } from 'ra-ui-materialui/lib/input/ReferenceInput';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  create: (props: any) => props?.classes?.create,
});

const ClientRefercenInput = (props: ReferenceInputProps) => {
  const classes = useStyles(props);
  const [version, setVersion] = useState(0);
  const handleChange = useCallback(() => setVersion(version + 1), [version]);

  return (
    <div className={classes.root}>
      <ReferenceInput {...props} key={version}>
        <AutocompleteInput source="" optionText="name" />
      </ReferenceInput>
      {!props.disabled && <ClientQuickCreateButton classes={classes.create} onChange={handleChange} />}
    </div>
  );
};

export default ClientRefercenInput;
