import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { Appraisal_Fee, Appraisal_Expense, Appraisal_Commission, Expenses } from 'shared/generated/types';

const FEE_QUERY = gql`
  query AppraisalFees($appraisalId: uuid) {
    appraisal_fee(where: { appraisal_id: { _eq: $appraisalId } }) {
      id
      appraisal_id
      quantity
      rate
      rate_type_id
      total_amount
      description
      appraisal {
        report_fee
        total_fees
        id
      }
    }
  }
`;
const EXPENSE_QUERY = gql`
  query AppraisalExpenses($appraisalId: uuid) {
    appraisal_expense(where: { appraisal_id: { _eq: $appraisalId } }) {
      id
      appraisal_id
      description
      quantity
      rate
      rate_type_id
      total_amount
      appraisal {
        report_fee
        total_expenses
        id
      }
    }
  }
`;
const COMMISSION_QUERY = gql`
  query AppraisalCommissions($appraisalId: uuid) {
    appraisal_commissions(where: { appraisal_id: { _eq: $appraisalId } }) {
      id
      appraisal_id
      net_expenses
      quantity
      rate
      assignee_full_name
      assignee_role
      paid_date
      rate_type_id
      total_amount
    }
  }
`;

const EXPENSES_QUERY = gql`
  query AppraisalCommissions {
    expenses {
      appraisal_file_number
      description
      quantity
      rate
      rate_type_id
      total_amount
      expense_date
      expense_type
      appraisal_id
      user_account_id
    }
  }
`;

export function useExpenses() {
  const options = useQuery<Expenses>(EXPENSES_QUERY, {
    fetchPolicy: 'cache-first',
  });
  return [options] as const;
}

export default function useAppraisalFee(props: { appraisalId: string }) {
  const variables = { ...props };
  return useQuery<Appraisal_Fee>(FEE_QUERY, { nextFetchPolicy: 'cache-first', variables });
}

export function useAppraisalExpense(props: { appraisalId: string }) {
  const options = useQuery<Appraisal_Expense>(EXPENSE_QUERY, {
    fetchPolicy: 'cache-first',
    variables: props,
  });
  return [options] as const;
}

export function useAppraisalCommission(props: { appraisalId: string }) {
  const options = useQuery<Appraisal_Commission>(COMMISSION_QUERY, {
    fetchPolicy: 'cache-first',
    variables: props,
  });
  return [options] as const;
}
