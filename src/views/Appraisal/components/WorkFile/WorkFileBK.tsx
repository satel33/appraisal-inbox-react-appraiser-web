import { Box, Card, makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import { DropzoneArea } from 'material-ui-dropzone';
import moment from 'moment';
import { Button } from 'ra-ui-materialui';
import React, { useEffect, useMemo, useState } from 'react';
import { styleRight } from 'shared/hooks/useEditFormStyle';
import { v4 as uuidv4 } from 'uuid';
import {
  downloadFunction,
  FileType,
  useFilePresignDownloadUrl,
  useFilePresignUploadUrl,
  useGetFiles,
  useUploadFile,
  useUploadFileMutation,
} from 'views/Appraisal/hooks/workfileHooks';
import { LoadingSkeleton } from './LoadingSkeleton';

interface Props {
  formData: any;
}

const WorkFile = (props: Props) => {
  const formClasses = styleRight();
  const classes = useStyles();

  const [files, setFiles] = useState<File[]>();
  const [selectedFile, setSelectedFile] = useState<FileType>();

  const variables = useMemo(() => {
    return {
      key: uuidv4(),
      parent: 'appraisal',
      parent_id: props.formData.values.id,
    };
  }, [props.formData.values.id]);

  const { data: allFiles, refetch: refetchFiles, loading: filesLoading } = useGetFiles({
    parent: variables.parent,
    parent_id: variables.parent_id,
  });

  const [getPresignedUploadUrl, { data: presignedUrlResponse }] = useFilePresignUploadUrl();
  const [getPresignedDownloadUrl, { data: presignedDownloadUrlResponse }] = useFilePresignDownloadUrl();

  const { uploadFile } = useUploadFile();

  const [uploadFileMutation, { data: uploadFileMutationData }] = useUploadFileMutation();

  useEffect(() => {
    uploadFileMutationData && refetchFiles();
  }, [uploadFileMutationData]);

  useEffect(() => {
    if (presignedDownloadUrlResponse && selectedFile) {
      downloadFunction(presignedDownloadUrlResponse.file_presign_download_url.signed_url, selectedFile?.filename);
      setSelectedFile(undefined);
    }
  }, [presignedDownloadUrlResponse, selectedFile]);

  const { signed_url } = useMemo(() => {
    return { ...presignedUrlResponse?.file_presign_upload_url };
  }, [presignedUrlResponse]);

  const handleChange = (files: File[]) => {
    if (files.length > 0) {
      setFiles(files);
      getPresignedUploadUrl({ variables });
    } else {
      setFiles(undefined);
    }
  };

  const handleSubmit = async () => {
    const uploadSuccess = await uploadFile(signed_url, files);
    console.log({ uploadSuccess, variables });

    if (files && uploadSuccess) {
      const { name, type, size } = files[0];
      uploadFileMutation({
        variables: {
          ...variables,
          filename: name,
          filetype: type,
          filesize: size,
        },
      });
    }
  };

  const handleDownloadClick = (file: FileType) => {
    getPresignedDownloadUrl({ variables: { ...variables, key: file.key } });
    setSelectedFile(file);
  };

  return (
    <Card variant="outlined" classes={{ root: formClasses.card }} style={{ marginTop: '30px' }}>
      {filesLoading ? (
        <LoadingSkeleton />
      ) : (
        <Table>
          <TableHead classes={{ root: classes.tableHead }}>
            <TableCell classes={{ root: classes.headCell }}>Filename</TableCell>
            <TableCell classes={{ root: classes.headCell }}>Type</TableCell>
            <TableCell classes={{ root: classes.headCell }}>Uploaded By</TableCell>
            <TableCell classes={{ root: classes.headCell }}>Uploaded</TableCell>
            <TableCell classes={{ root: classes.headCell }}>{''}</TableCell>
          </TableHead>
          <TableBody>
            {allFiles?.file.map((file, key) => {
              return (
                <TableRow>
                  <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
                    {file.filename}
                  </TableCell>
                  <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
                    {file.filetype}
                  </TableCell>
                  <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
                    {file.user_account.user_profile.first_name} {file.user_account.user_profile.last_name}
                  </TableCell>
                  <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
                    {moment(file.created_at).format('MMMM d, YYYY @ h:mm a')}
                  </TableCell>
                  <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
                    <span className={classes.iconPadding}>
                      <Icon
                        classes={{ root: classes.activeCursor }}
                        fontSize="small"
                        onClick={() => handleDownloadClick(file)}
                      >
                        download
                      </Icon>
                    </span>
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
        />
        <Box display={'flex'} justifyContent={'end'} pt={3}>
          <Button label="Upload" onClick={handleSubmit} disabled={!signed_url} />
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
  activeCursor: {
    cursor: 'pointer',
  },
  iconPadding: {
    paddingRight: '12px',
    '@media (max-width: 600px)': {
      paddingRight: '4px',
    },
  },
});
