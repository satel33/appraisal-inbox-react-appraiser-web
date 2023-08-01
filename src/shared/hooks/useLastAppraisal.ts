import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

const query = gql`
  query LastAppraisal {
    appraisal(order_by: { appraisal_file_number: desc }, limit: 1) {
      appraisal_file_number
      property_type_id
    }
  }
`;

type LastAppraisalResponse = {
  appraisal: { appraisal_file_number: string; property_type_id: number }[];
};
export default function useLastAppraisal() {
  return useQuery<LastAppraisalResponse>(query, { fetchPolicy: 'network-only' });
}
