import React, { ComponentType } from 'react';
import { Confirm, ConfirmProps, FieldProps } from 'ra-ui-materialui';
import { Button, Record } from 'react-admin';
import RemoveIcon from '@material-ui/icons/Remove';

type ButtonWithConfirmProps = Pick<ConfirmProps, 'title' | 'content' | 'confirm' | 'cancel'> &
  FieldProps & {
    btnClassname?: string;
    btnIcon?: ComponentType;
    onConfirm(record: Record | undefined): void;
  } & typeof ButtonWithConfirm.defaultProps;
function ButtonWithConfirm(props: ButtonWithConfirmProps) {
  const { title, content, btnClassname, onConfirm, btnIcon: Icon, record, confirm, cancel } = props;
  const [visible, setVisible] = React.useState(false);
  return (
    <>
      <Confirm
        confirm={confirm}
        cancel={cancel}
        isOpen={visible}
        loading={false}
        title={title}
        content={content}
        onConfirm={() => {
          onConfirm(record);
          setVisible(false);
        }}
        onClose={() => setVisible(false)}
      />
      <Button className={btnClassname} size="small" onClick={() => setVisible(true)}>
        <Icon />
      </Button>
    </>
  );
}

ButtonWithConfirm.defaultProps = {
  btnIcon: RemoveIcon,
};

export default ButtonWithConfirm;
