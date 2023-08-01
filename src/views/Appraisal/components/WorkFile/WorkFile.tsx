import { OperationVariables, QueryResult } from '@apollo/client';
import {
  Box,
  Button,
  Card,
  Icon,
  makeStyles,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import { ErrorOutline } from '@material-ui/icons';
import IconCheck from '@material-ui/icons/Check';
import { DropzoneArea } from 'material-ui-dropzone';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useGetIdentity, useNotify } from 'react-admin';
import { styleRight } from 'shared/hooks/useEditFormStyle';
import { sentaneCase } from 'shared/utils';
import { v4 as uuidv4 } from 'uuid';

import {
  downloadFunction,
  FileType,
  getFilePresignUploadUrl,
  GetFileResponse,
  useFileMutation,
  useFilePresignDownloadUrl,
  useUploadFileMutation,
} from 'views/Appraisal/hooks/workfileHooks';
import { LoadingSkeleton, TableRowSkeleton } from './LoadingSkeleton';

interface Props {
  formData: any;
  getFilesParams: QueryResult<GetFileResponse, OperationVariables>;
}
interface KeyData {
  key: string;
  signedUrl: string;
  urlId: string;
  file: File;
}

const WorkFile = ({ formData, getFilesParams }: Props) => {
  const identityState = useGetIdentity();
  const notify = useNotify();

  const formClasses = styleRight();
  const classes = useStyles();
  const [files, setFiles] = useState<File[]>();

  const [selectedFile, setSelectedFile] = useState<FileType>();
  const [keyData, setKeyData] = useState<KeyData[]>([]);

  const [isUploading, setIsUploading] = useState(false);

  const [editFile, setEditFile] = useState<FileType>();
  const [deleteFile, setDeleteFile] = useState<FileType>();

  const handleClose = () => {
    setEditFile(undefined);
  };

  const variables = useMemo(() => {
    return {
      parent: 'appraisal',
      parent_id: formData.values.id,
    };
  }, [formData.values.id]);

  const { data: allFiles, refetch: refetchFiles, loading: filesLoading } = getFilesParams;

  const [uploadFileMutation] = useUploadFileMutation();

  const [getPresignedDownloadUrl, { data: presignedDownloadUrlResponse }] = useFilePresignDownloadUrl();

  const [fileMutation, { data: fileMutationData }] = useFileMutation();

  useEffect(() => {
    if (presignedDownloadUrlResponse && selectedFile) {
      downloadFunction(presignedDownloadUrlResponse.file_presign_download_url.signed_url, selectedFile?.filename);
      setSelectedFile(undefined);
    }
  }, [presignedDownloadUrlResponse, selectedFile]);

  useEffect(() => {
    if (fileMutationData) {
      refetchFiles();

      if (editFile) {
        setEditFile(undefined);
        notify('file.updated');
      }
      if (deleteFile) {
        setDeleteFile(undefined);
        notify('file.deleted');
      }
    }
  }, [fileMutationData]);

  const handleChange = async (files: File[]) => {
    if (files.length > 0) {
      setFiles(files);

      let queryString = '{';

      const tempKeyData: KeyData[] = [];

      files.map((file, index) => {
        const key = uuidv4();
        const urlId = `url${index}`;

        tempKeyData[index] = { key, urlId, file, signedUrl: '' };
        queryString += `${urlId} : file_presign_upload_url (
          args: {
            key: "${key}"
            parent: "${variables.parent}"
            parent_id: "${variables.parent_id}"
          }
        ) {
          signed_url
        }
      `;
        if (index === files.length - 1) {
          queryString += '}';
        }
        return null;
      });
      if (queryString.length > 1) {
        const signedUrls = await getFilePresignUploadUrl(queryString);

        if (signedUrls) {
          const sanitizedKeyData = tempKeyData.map((keyData) => {
            const temp: KeyData = { ...keyData, signedUrl: signedUrls[keyData.urlId].signed_url };
            return temp;
          });
          setKeyData(sanitizedKeyData);
        }
      }
    } else {
      setFiles(undefined);
    }
  };

  const handleSubmit = () => {
    setIsUploading(true);
    Promise.all(
      keyData.map(async (item) => {
        return await fetch(item.signedUrl, { method: 'PUT', body: item.file })
          .then((data) => {
            if (data.status === 200) {
              const { name, type, size } = item.file;
              uploadFileMutation({
                variables: {
                  ...variables,
                  key: item.key,
                  filename: name,
                  filetype: type,
                  filesize: size,
                },
              });
            }
          })
          .catch((error) => console.log('Upload to bucket failed', { error }));
      }),
    )
      .then(() => {
        setTimeout(() => {
          refetchFiles();
          setFiles(undefined);
          setKeyData([]);
          setIsUploading(false);
        }, 1000);
      })
      .catch((error) => console.log({ error }));
  };

  const handleClear = () => {
    setFiles(undefined);
  };

  const handleEditClick = () => {
    fileMutation({
      variables: {
        id: editFile?.id,
        filename: editFile?.filename,
        deleted_at: null,
      },
    });
  };

  const handleDownloadClick = (file: FileType) => {
    getPresignedDownloadUrl({ variables: { ...variables, key: file.key } });
    setSelectedFile(file);
  };

  const handleDeleteClick = () => {
    fileMutation({
      variables: {
        id: deleteFile?.id,
        filename: deleteFile?.filename,
        deleted_at: new Date(),
      },
    });
  };

  const { extension } = useMemo(() => {
    const splitName = editFile?.filename.split('.') || '';
    const extension = '.' + splitName[splitName.length - 1];
    return { extension };
  }, [editFile?.filename]);

  return (
    <Card variant="outlined" classes={{ root: formClasses.card }} style={{ marginTop: '30px' }}>
      <Modal
        open={!!editFile}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={classes.paper}>
          <Typography classes={{ root: classes.heading }}>Edit Filename</Typography>
          <Box py={3}>
            <TextField
              fullWidth
              size="small"
              label="File name"
              variant="outlined"
              value={editFile?.filename.replace(extension, '')}
              onChange={(e) =>
                setEditFile((prev) => {
                  if (prev) {
                    return { ...prev, filename: e.target.value + extension };
                  }
                })
              }
            />
          </Box>

          <Box className={classes.confirmBtnBox}>
            <Button onClick={() => setEditFile(undefined)} color="secondary" startIcon={<ErrorOutline />}>
              Cancel
            </Button>
            <Button onClick={handleEditClick} color="primary" startIcon={<IconCheck />}>
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={!!deleteFile}
        onClose={() => setDeleteFile(undefined)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box className={classes.paper}>
          <Typography classes={{ root: classes.heading }}>
            Delete File: {sentaneCase(deleteFile?.filename || '')}
          </Typography>
          <p>Are you sure you want to Delete this file?</p>
          <Box className={classes.confirmBtnBox}>
            <Button onClick={() => setDeleteFile(undefined)} color="secondary" startIcon={<ErrorOutline />}>
              Cancel
            </Button>
            <Button onClick={handleDeleteClick} color="primary" startIcon={<IconCheck />}>
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>

      {allFiles?.file.length === 0 && (filesLoading || isUploading) ? (
        <LoadingSkeleton />
      ) : (
        <Table>
          <TableHead classes={{ root: classes.tableHead }}>
            <TableCell classes={{ root: classes.headCell }}>FILENAME</TableCell>
            <TableCell classes={{ root: classes.headCell }}>UPLOADED BY</TableCell>
            <TableCell classes={{ root: classes.headCell }}>UPLOADED ON</TableCell>
            <TableCell classes={{ root: classes.cellEdit }}></TableCell>
          </TableHead>
          <TableBody>
            {allFiles?.file.map((file) => {
              if (isUploading) {
                return <TableRowSkeleton />;
              }
              let uploadedBy = `${file.user_account.user_profile.first_name} ${file.user_account.user_profile.last_name}`;
              if (file.user_account_id === identityState.identity?.id) {
                uploadedBy = 'You';
              }
              return (
                <TableRow key={file.id}>
                  <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
                    {file.filename}
                  </TableCell>
                  <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
                    {uploadedBy}
                  </TableCell>
                  <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
                    {moment(file.created_at).format('M/D/YYYY')}
                  </TableCell>
                  <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
                    <Box className={classes.savedCell}>
                      <span className={classes.iconPadding}>
                        <Icon
                          classes={{ root: classes.activeCursor }}
                          fontSize="small"
                          onClick={() => {
                            setEditFile(file);
                          }}
                        >
                          edit
                        </Icon>
                      </span>
                      <span className={classes.iconPadding}>
                        <Icon
                          classes={{ root: classes.activeCursor }}
                          fontSize="small"
                          onClick={() => handleDownloadClick(file)}
                        >
                          download
                        </Icon>
                      </span>
                      <span className={classes.iconPadding}>
                        <Icon
                          classes={{ root: classes.activeCursor }}
                          fontSize="small"
                          onClick={() => {
                            setDeleteFile(file);
                          }}
                        >
                          close
                        </Icon>
                      </span>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <Box p={1}>
        <DropzoneArea
          onChange={(e) => handleChange(e)}
          showAlerts={false}
          showFileNames
          clearOnUnmount
          initialFiles={files}
          key={files?.length}
          filesLimit={10}
          dropzoneText={'Drag and drop files here \n - or - \n Click and select files to upload'}
          dropzoneClass={classes.dropzoneClass}
        />
        <Box display={'flex'} justifyContent={'end'} pt={3}>
          <Button onClick={handleClear} disabled={!files?.length}>
            Clear
          </Button>
          <Button onClick={handleSubmit} disabled={!keyData.length}>
            <Icon classes={{ root: classes.activeCursor }} fontSize="small">
              upload
            </Icon>
            Upload
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default WorkFile;

export const useStyles = makeStyles({
  tableHead: {
    backgroundColor: '#e8e8e8',
  },
  headCell: {
    fontWeight: 400,
    padding: '12px 12px',
    '@media (max-width: 600px)': {
      padding: '6px 6px',
    },
  },
  cell: {
    fontWeight: 500,
    padding: '12px 12px',
    '@media (max-width: 600px)': {
      padding: '12px 6px',
    },
  },

  cellEdit: {
    width: '60px',
    padding: '12px 12px',
    '@media (max-width: 600px)': {
      padding: '12px 4px 0px 0px',
      width: '20px',
    },
  },

  savedCell: {
    paddingBottom: '0px',
    minWidth: '96px',
  },

  activeCursor: {
    cursor: 'pointer',
  },
  iconPadding: {
    paddingRight: '12px',
    '@media (max-width: 600px)': {
      paddingRight: '4px',
    },
  },
  dropzoneClass: {
    whiteSpace: 'pre-line',
    color: 'rgba(0, 0, 0, 0.54)',
  },

  modalBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: '#fff',
    padding: '1rem',
  },
  confirmBtnBox: {
    textAlign: 'right',
  },

  paper: {
    position: 'absolute',
    width: 520,
    backgroundColor: 'white',
    padding: '20px',
    top: `${47}%`,
    left: `${47}%`,
    transform: `translate(-${47}%, -${47}%)`,
    outline: 'none',
  },
  heading: {
    fontWeight: 500,
    fontSize: '1.2rem',
  },
});
