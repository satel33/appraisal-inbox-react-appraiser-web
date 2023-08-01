import React, { useState, useCallback } from 'react';
import { ReferenceInput } from 'react-admin';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import { makeStyles } from '@material-ui/core/styles';
import ClientQuickCreateButton from './ClientQuickCreateButtonV2';
import { ReferenceInputProps } from 'ra-ui-materialui/lib/input/ReferenceInput';
import { Grid } from '@material-ui/core';
import { useMediaQuery } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  create: (props: any) => props?.customCSS?.create,
});

const ClientRefercenInput = (props: ReferenceInputProps) => {
  const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('xs'));
  const classes = useStyles(props);
  const [version, setVersion] = useState(0);
  const handleChange = useCallback(
    (id: string) => {
      setVersion(version + 1);
      if (props.onChange) {
        props.onChange(id);
      }
    },
    [version],
  );
  if (props.layout && props.layout === 'grid') {
    return (
      <Grid container direction="row" alignItems="center">
        <Grid container item md={4} sm={12} xs={12}></Grid>
        <Grid container item md={4} sm={8} xs={10}>
          <ReferenceInput
            {...props}
            emptyText={props.emptyText}
            key={version}
            allowEmpty={props.emptyText ? true : false}
          >
            <AutocompleteInput source="" optionText="name" />
          </ReferenceInput>
        </Grid>
        <Grid container item md={4} sm={4} xs={2} justify={isSmallScreen ? 'flex-end' : 'flex-start'}>
          {!props.disabled && (
            <ClientQuickCreateButton
              showContacts={props.showContacts}
              classes={classes.create}
              onChange={handleChange}
            />
          )}
        </Grid>
      </Grid>
    );
  }

  return (
    <div className={classes.root}>
      <ReferenceInput {...props} emptyText={props.emptyText} key={version} allowEmpty={props.emptyText ? true : false}>
        <AutocompleteInput
          reference={props.reference}
          clientEdit={props.clientEdit}
          clientId={props.clientId}
          source=""
          optionText="name"
          options={{ InputProps: props.InputProps }}
        />
      </ReferenceInput>
      {!props.disabled && (
        <ClientQuickCreateButton
          onlyIconLabel={props.onlyIconLabel}
          showContacts={props.showContacts}
          classes={classes.create}
          onChange={handleChange}
        />
      )}
    </div>
  );
};

export default ClientRefercenInput;
