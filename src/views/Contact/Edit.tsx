import * as React from 'react';
import { useNotify, Edit, EditProps, TitleProps } from 'react-admin';
import EditAction from 'shared/components/Resource/EditAction';
import useContactOptions from 'shared/hooks/useContactOptions';
import ContactForm from './ContactForm';

const EditTitle = ({ record }: TitleProps) => (
  <span>Contact: {record ? `${[record.first_name, record.last_name].filter(Boolean).join(' ')}` : ''}</span>
);

const EditContact = (props: EditProps): JSX.Element => {
  const notify = useNotify();
  const onSuccess = () => {
    notify('contact.updated');
  };
  const [options] = useContactOptions();
  return (
    <Edit
      {...props}
      title={<EditTitle />}
      undoable={false}
      onSuccess={onSuccess}
      actions={<EditAction />}
      resource="contact"
    >
      <ContactForm options={options} />
    </Edit>
  );
};

export default EditContact;
