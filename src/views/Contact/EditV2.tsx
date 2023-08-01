import React from 'react';
import { useNotify, Edit, EditProps, TitleProps } from 'react-admin';
import useContactOptions from 'shared/hooks/useContactOptions';
import ContactForm from './ContactEditForm';

const EditTitle = ({ record }: TitleProps) => (
  <span>Contact: {record ? `${[record.first_name, record.last_name].filter(Boolean).join(' ')}` : ''}</span>
);

const EditContact = (props: EditProps): JSX.Element => {
  const notify = useNotify();
  const onSuccess = () => {
    notify('contact.updated');
  };
  const transform = (data: any) => {
    const name = data.name.split(' ');
    data.first_name = name[0];
    data.last_name = name.slice(1).join(' ');
    return data;
  };
  const [options] = useContactOptions();
  return (
    <Edit
      {...props}
      mutationMode="pessimistic"
      transform={transform}
      title={<EditTitle />}
      undoable={false}
      onSuccess={onSuccess}
      resource="contact"
    >
      <ContactForm options={options} />
    </Edit>
  );
};

export default EditContact;
