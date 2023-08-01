import { Card, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import debounce from 'lodash/debounce';
import RichTextInput from 'ra-input-rich-text';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-final-form';
import InlineRichText from 'shared/components/InlineEdit/inlineRichTextInput';
import { styleLeft, styleRight } from 'shared/hooks/useEditFormStyle';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import getAppraisalPermission from 'views/Appraisal/permission';

export interface NotesProps {
  formData: any;
}
export const Notes = ({ formData }: NotesProps) => {
  const classes = styleLeft();
  const formClasses = styleRight();

  const [{ permissions }] = useFormPermissions({ getPermission: getAppraisalPermission });
  const [edit, setEdit] = useState(false);
  const form = useForm();
  const save = useCallback(debounce(form.submit, 0), []);

  return (
    <Card
      variant="outlined"
      classes={{ root: `${formClasses.card} ${classes.relative}` }}
      style={{ marginTop: '30px' }}
    >
      {permissions.edit && !edit && (
        <IconButton
          classes={{ root: classes.notesEditButton }}
          edge="end"
          disabled={edit}
          onClick={() => setEdit(true)}
        >
          <EditIcon classes={{ root: formClasses.icon }} />
        </IconButton>
      )}
      {edit && (
        <IconButton classes={{ root: classes.notesEditButtonSave }} edge="end" onClick={() => setEdit(false)}>
          {edit && formData.dirtyFields.notes && (
            <SaveIcon classes={{ root: formClasses.icon }} onClick={() => save()} />
          )}
          &nbsp;
        </IconButton>
      )}
      {edit && (
        <IconButton classes={{ root: classes.notesEditButtonClose }} edge="end" onClick={() => setEdit(false)}>
          <CloseIcon
            classes={{ root: formClasses.icon }}
            onClick={() => {
              form.change('notes', formData.initialValues.notes);
            }}
          />
        </IconButton>
      )}
      <InlineRichText
        edit={edit && permissions.edit}
        hideBorder
        input={
          <RichTextInput
            options={{
              readOnly: false,
              placeholder: 'Additional Appraisal information',
            }}
            fullWidth
            source="notes"
            multiline
            variant="outlined"
            label=""
            key={`text-${!permissions.edit}`}
            FormHelperTextProps={{ style: { display: 'none' } }}
          />
        }
      />
    </Card>
  );
};
