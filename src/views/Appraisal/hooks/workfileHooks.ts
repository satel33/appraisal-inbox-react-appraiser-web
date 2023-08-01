import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { gqlClient } from 'shared/ApolloClient';

const FILE_PRESIGN_UPLOAD_URL_QUERY = gql`
  query FilePresignUploadUrl($key: String!, $parent: String!, $parent_id: String!) {
    file_presign_upload_url(args: { key: $key, parent: $parent, parent_id: $parent_id }) {
      signed_url
    }
  }
`;

interface FilePresignUploadUrlResponse {
  file_presign_upload_url: { signed_url: string };
}

export const useFilePresignUploadUrl = () => {
  return useLazyQuery<FilePresignUploadUrlResponse>(FILE_PRESIGN_UPLOAD_URL_QUERY);
};

export const getFilePresignUploadUrl = async (queryString: string) => {
  const query = gql`
    ${queryString}
  `;

  try {
    const { data } = await gqlClient.query({ query });

    return data;
  } catch (e) {
    return e;
  }
};

export const UPLOAD_FILE_MUTATION = gql`
  mutation UploadFile(
    $key: uuid
    $parent: parent_type
    $parent_id: uuid
    $filename: String
    $filesize: numeric
    $filetype: String
  ) {
    insert_file(
      objects: {
        filename: $filename
        filesize: $filesize
        filetype: $filetype
        key: $key
        parent: $parent
        parent_id: $parent_id
      }
    ) {
      returning {
        id
        filename
      }
    }
  }
`;

export const useUploadFileMutation = () => {
  return useMutation(UPLOAD_FILE_MUTATION);
};

export const DOWNLOAD_FILE_QUERY = gql`
  query DownloadFileQuery($key: String!, $parent: String!, $parent_id: String!) {
    file_presign_download_url(args: { key: $key, parent: $parent, parent_id: $parent_id }) {
      signed_url
    }
  }
`;

interface FilePresignDownloadUrlResponse {
  file_presign_download_url: { signed_url: string };
}

export const useFilePresignDownloadUrl = () => {
  return useLazyQuery<FilePresignDownloadUrlResponse>(DOWNLOAD_FILE_QUERY);
};

export const GET_FILES = gql`
  query getFiles($parent: parent_type, $parent_id: uuid) {
    file_aggregate(where: { _and: { parent: { _eq: $parent }, parent_id: { _eq: $parent_id } } }) {
      aggregate {
        count
      }
    }
    file(
      where: { _and: { parent: { _eq: $parent }, parent_id: { _eq: $parent_id } } }
      order_by: { updated_at: desc }
    ) {
      id
      filename
      filetype
      filesize
      parent
      parent_id
      created_at
      key
      organization_id
      updated_at
      updated_by_user_account_id
      user_account_id
      user_account {
        email
        user_profile {
          first_name
          last_name
        }
      }
    }
  }
`;

interface GetFileProps {
  parent: string;
  parent_id: string;
}

export interface GetFileResponse {
  file_aggregate: FileAggregate;
  file: FileType[];
}

export interface FileType {
  id: string;
  filename: string;
  filetype: string;
  filesize: number;
  parent: string;
  parent_id: string;
  created_at: string;
  key: string;
  organization_id: string;
  updated_at: string;
  updated_by_user_account_id?: any;
  user_account_id: string;
  user_account: {
    email: string;
    user_profile: {
      first_name: string;
      last_name: string;
    };
  };
}

interface FileAggregate {
  aggregate: {
    count: number;
  };
}

export const useGetFiles = (variables: GetFileProps) => {
  return useQuery<GetFileResponse>(GET_FILES, { variables });
};

export const useUploadFile = () => {
  const uploadFile = async (url?: string, files?: File[]) => {
    if (!files || !url) {
      return null;
    }

    return fetch(url, { method: 'PUT', body: files[0] })
      .then(() => true)
      .catch((e) => {
        return false;
      });
  };
  return { uploadFile };
};

export const downloadFunction = async (url: string, filename: string) => {
  try {
    const res = await fetch(url);

    const blob = await res.blob();
    const newBlob = new Blob([blob]);

    const blobUrl = window.URL.createObjectURL(newBlob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', filename || 'filename');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);

    // clean up Url
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.log({ err });
  }
};

const FILE_MUTATION_QUERY = gql`
  mutation FileMutation($id: uuid!, $deleted_at: timestamptz, $filename: String) {
    update_file_by_pk(pk_columns: { id: $id }, _set: { deleted_at: $deleted_at, filename: $filename }) {
      id
    }
  }
`;

export const useFileMutation = () => {
  return useMutation(FILE_MUTATION_QUERY);
};
