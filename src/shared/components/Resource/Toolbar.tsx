import React, { useRef } from 'react';
import {
  SaveButton,
  Toolbar,
  DeleteWithConfirmButton,
  ToolbarProps,
  useGetIdentity,
  useResourceContext,
  useNotify,
  useRedirect,
  Button,
  Record,
  DeleteWithConfirmButtonProps,
} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import { FormPermissions, GetPermission } from 'shared/hooks/useResourcePermissions';
import PdfIcon from '@material-ui/icons/PictureAsPdf';
import { BlobProvider } from '@react-pdf/renderer';

const useToolbarStyles = makeStyles({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

type CustomToolbarProps = ToolbarProps & {
  disabled?: boolean;
  deleteVisible?: boolean;
  width?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  getPermission?: GetPermission;
  pdfRenderer?: React.FC<{ record: any }>;
  pdfTitleGetter?(record: any): string;
  onDeleteSuccess?(record: any): void;
};

function defaultGetter(record: Record | undefined) {
  return `${record?.id ?? 'untitled'}.pdf`;
}

function CustomToolbar(props: CustomToolbarProps) {
  const { disabled, getPermission, pdfRenderer, pdfTitleGetter = defaultGetter, onDeleteSuccess, ...restProps } = props;
  const classes = useToolbarStyles();
  const { identity } = useGetIdentity();
  const permission = getPermission
    ? getPermission(props.record as any, identity)
    : { create: true, edit: true, delete: true };
  const isCreate = Boolean(!props.record?.id);
  const permitted = isCreate ? permission.create : permission.edit;
  return (
    <Toolbar {...restProps} classes={classes}>
      <SaveButton
        disabled={props.invalid || props.disabled || !permitted}
        label="ra.action.save"
        redirect="edit"
        submitOnEnter={true}
      />
      <CustomDelete
        disabled={disabled}
        permission={permission}
        pdfTitleGetter={pdfTitleGetter}
        pdfRenderer={pdfRenderer}
        onDeleteSuccess={onDeleteSuccess}
      />
    </Toolbar>
  );
}

type CustomDeleteProps = DeleteWithConfirmButtonProps &
  Pick<CustomToolbarProps, 'pdfTitleGetter' | 'pdfRenderer' | 'onDeleteSuccess'> & {
    permission: FormPermissions;
  };
function CustomDelete(props: CustomDeleteProps) {
  const {
    disabled,
    pdfRenderer: PdfView,
    pdfTitleGetter = defaultGetter,
    permission,
    onDeleteSuccess,
    ...restProps
  } = props;
  const resource = useResourceContext();
  const notify = useNotify();
  const redirect = useRedirect();
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  return (
    <div>
      {PdfView && props.record && (
        <BlobProvider document={<PdfView record={props.record} />}>
          {({ url }) => {
            if (!url) return null;
            return (
              <>
                <a
                  style={{ display: 'none' }}
                  aria-hidden
                  href={url}
                  ref={linkRef}
                  download={pdfTitleGetter(props.record)}
                >
                  Download
                </a>
                <Button
                  style={{ marginLeft: 10 }}
                  label="Export to PDF"
                  icon={<PdfIcon />}
                  onClick={() => {
                    linkRef?.current?.click();
                  }}
                >
                  <PdfIcon />
                </Button>
              </>
            );
          }}
        </BlobProvider>
      )}
      {restProps?.record?.id && permission.delete && (
        <DeleteWithConfirmButton {...restProps} onSuccess={onSuccessDelete} />
      )}
    </div>
  );

  async function onSuccessDelete() {
    await props?.onDeleteSuccess?.(props.record);
    notify(`${resource}.deleted`);
    props.basePath && redirect(props.basePath);
  }
}

export default CustomToolbar;
