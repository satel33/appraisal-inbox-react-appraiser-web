import React, { useState } from 'react';
import { ReferenceInput } from 'react-admin';
import { Grid, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import { PublicFieldProps } from 'ra-ui-materialui/lib/field/types';
import { Contacts } from 'views/Contact/types';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
const filter = createFilterOptions<any>();
const styles = makeStyles({
  msg: {
    color: 'rgba(0, 0, 0, 0.54)',
    marginTop: '-10px',
  },
});
type AddContactFieldProps = PublicFieldProps & {
  source: string;
  filter?: {
    [key in string]?: any;
  };
  onAssign?(id: string): Promise<void>;
};
function AddContactField(props: AddContactFieldProps) {
  const [msg, setMsg] = useState('');
  const classes = styles();

  return (
    <Grid container alignItems="center">
      <Grid item md={12}>
        <ReferenceInput
          label="Add Contact"
          source="selected_contact_id"
          onChange={(val: any) => {
            if (val && val.split('.').length === 2) {
              setMsg(`A new contact will be created and linked to this appraisal`);
            } else {
              setMsg(`The existing contact will be linked to this appraisal`);
            }
          }}
          reference="contacts"
          fullWidth
          perPage={Infinity}
          variant="standard"
          sort={{ field: 'full_name', order: 'ASC' }}
          filter={props.filter}
          filterToQuery={(searchText: string) => ({ full_name: searchText })}
        >
          <AutocompleteInput
            renderOption={(props: any) => (
              <Box component="li" {...props}>
                {props.id.split('.').length === 2 ? (
                  <b style={{ color: '#2196f3' }}> {props.full_name} </b>
                ) : (
                  props.full_name
                )}
              </Box>
            )}
            freeSolo={true}
            filterOptions={(options: any, params: any) => {
              const filtered = filter(options, params);

              if (params.inputValue !== '') {
                filtered.push({
                  id: `${params.inputValue}.new`,
                  full_name: `Add "${params.inputValue}" as new contact`,
                });
              }

              return filtered;
            }}
            source=""
            optionText={(record: Contacts) => [record.full_name, record.client_name].filter(Boolean).join(' - ')}
          />
        </ReferenceInput>
        <Typography className={classes.msg}>{msg}</Typography>
      </Grid>
    </Grid>
  );
}

export default AddContactField;
