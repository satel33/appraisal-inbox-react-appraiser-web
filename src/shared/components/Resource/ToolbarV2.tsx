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
  useRefresh,
  Button,
  Record,
  DeleteWithConfirmButtonProps,
} from 'react-admin';
import { useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box } from '@material-ui/core';
import { FormPermissions, GetPermission } from 'shared/hooks/useResourcePermissions';
import PdfIcon from '@material-ui/icons/PictureAsPdf';
import { BlobProvider } from '@react-pdf/renderer';
import { useHistory } from 'react-router-dom';
import IconCancel from '@material-ui/icons/Cancel';

const useToolbarStyles = makeStyles({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: '0px',
    margin: '0px',
    '@media (max-width: 600px)': {
      position: 'fixed',
      backgroundColor: '#F5F5F5',
      zIndex: 1000,
    },
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: '22px',
    marginRight: '5px',
    '@media (max-width: 600px)': {
      marginBottom: '18px',
      marginRight: '23px',
    },
  },
  deleteButton: {
    '@media (max-width: 600px)': {
      display: 'none',
    },
  },
  btnMarginRight: {
    marginRight: '14px',
  },
  cancel: {
    marginLeft: '25px',
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
  const history = useHistory();
  const { disabled, getPermission, pdfRenderer, pdfTitleGetter = defaultGetter, onDeleteSuccess, ...restProps } = props;
  const classes = useToolbarStyles();
  const { identity } = useGetIdentity();
  const redirect = useRedirect();
  const refresh = useRefresh();
  const notify = useNotify();
  const permission = getPermission
    ? getPermission(props.record as any, identity)
    : { create: true, edit: true, delete: true };
  const isCreate = Boolean(!props.record?.id);
  const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('xs'));
  const permitted = isCreate ? permission.create : permission.edit;
  return (
    <Toolbar {...restProps} classes={{ toolbar: classes.toolbar }}>
      <Grid container direction="row">
        <Grid md={6} sm={3} xs={12}>
          <Button className={classes.cancel} label="ra.action.cancel" onClick={() => history.goBack()}>
            <IconCancel />
          </Button>
        </Grid>
        <Grid md={6} sm={9} xs={12}>
          <Box className={classes.buttonContainer}>
            <CustomDelete
              className={classes.deleteButton}
              disabled={disabled}
              permission={permission}
              pdfTitleGetter={pdfTitleGetter}
              pdfRenderer={pdfRenderer}
              onDeleteSuccess={onDeleteSuccess}
            />
            <SaveButton
              size={isSmallScreen ? 'small' : 'medium'}
              className={classes.btnMarginRight}
              onSuccess={() => {
                notify('appraisal.created');
                redirect(`/appraisals/create`);
                refresh();
                window.scrollTo(0, document.body.scrollHeight);
              }}
              handleSubmitWithRedirect={props.handleSubmitWithRedirect}
              disabled={props.invalid || props.disabled || !permitted}
              label="SAVE AND ADD ANOTHER"
            />
            <SaveButton
              size={isSmallScreen ? 'small' : 'medium'}
              handleSubmitWithRedirect={props.handleSubmitWithRedirect}
              disabled={props.invalid || props.disabled || !permitted}
              label="SAVE AND VIEW"
              redirect="edit"
            />
          </Box>
        </Grid>
      </Grid>
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
