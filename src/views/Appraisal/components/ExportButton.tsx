import React, { useRef } from 'react';
import { ToolbarProps, useGetIdentity, Button, Record, DeleteWithConfirmButtonProps } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import { FormPermissions, GetPermission } from 'shared/hooks/useResourcePermissions';
import PdfIcon from '@material-ui/icons/PictureAsPdf';
import { BlobProvider } from '@react-pdf/renderer';

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

function CustomExportButton(props: CustomToolbarProps) {
  const { disabled, getPermission, pdfRenderer, pdfTitleGetter = defaultGetter, onDeleteSuccess } = props;
  const { identity } = useGetIdentity();
  const permission = getPermission
    ? getPermission(props.record as any, identity)
    : { create: true, edit: true, delete: true };
  return (
    <CustomDelete
      record={props.record as any}
      disabled={disabled}
      permission={permission}
      pdfTitleGetter={pdfTitleGetter}
      pdfRenderer={pdfRenderer}
      onDeleteSuccess={onDeleteSuccess}
    />
  );
}

type CustomDeleteProps = DeleteWithConfirmButtonProps &
  Pick<CustomToolbarProps, 'pdfTitleGetter' | 'pdfRenderer' | 'onDeleteSuccess'> & {
    permission: FormPermissions;
  };

const styles = {
  box: {
    justifyContent: 'flex-start',
    background: '#e8e8e8',
    paddingLeft: '10px',
    paddingBottom: '10px',
  },
  exportBtn: {
    color: '#2196f3 !important',
    fontWeight: 500,
    fontSize: '0.8125rem',
    '&:hover': {
      backgroundColor: '#e8e8e8 !important',
    },
  },
};
const useStyles = makeStyles(styles);

function CustomDelete(props: CustomDeleteProps) {
  const classes = useStyles();
  const { pdfRenderer: PdfView, pdfTitleGetter = defaultGetter } = props;
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
                  className={classes.exportBtn}
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
    </div>
  );
}

export default CustomExportButton;
