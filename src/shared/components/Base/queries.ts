import gql from 'graphql-tag';

export const ORGANIZATION_CONTACTS_QUERY = gql`
  query OrganizationContacts($organization_id: uuid!) {
    contacts_aggregate(where: { organization_id: { _eq: $organization_id } }) {
      aggregate {
        count
      }
    }
  }
`;
export const APPRAISAL_TIME_FILTER_QUERY = gql`
  query AppraisalTimeFilter($date: timestamptz!, $dueLimit: timestamptz!) {
    allAppraisals: appraisals_aggregate {
      aggregate {
        count(distinct: true)
      }
    }
    inProgress: appraisals_aggregate(where: { appraisal_status_id: { _eq: 1 } }) {
      aggregate {
        count(distinct: true)
      }
    }
    unassigned: appraisals_aggregate(where: { assignee_user_account_ids: { _eq: [] } }) {
      aggregate {
        count(distinct: true)
      }
    }
    dueSoon: appraisal_aggregate(
      where: { due_date: { _gte: $date, _lte: $dueLimit }, appraisal_status_id: { _eq: 1 } }
    ) {
      aggregate {
        count(distinct: true)
      }
    }
    upcomingInspections: appraisal_aggregate(
      where: { inspection_date: { _lte: $dueLimit, _gte: $date }, appraisal_status_id: { _eq: 1 } }
    ) {
      aggregate {
        count(distinct: true)
      }
    }
    pastDue: appraisal_aggregate(where: { due_date: { _lt: $date }, appraisal_status_id: { _eq: 1 } }) {
      aggregate {
        count(distinct: true)
      }
    }
    unpaid: appraisal_aggregate(where: { appraisal_status_id: { _eq: 5 }, paid_date: { _is_null: true } }) {
      aggregate {
        count(distinct: true)
      }
    }
    starred: appraisal_aggregate(where: { starred: { _eq: true } }) {
      aggregate {
        count(distinct: true)
      }
    }
    unscheduled: appraisal_aggregate(where: { appraisal_status_id: { _eq: 1 }, inspection_date: { _is_null: true } }) {
      aggregate {
        count(distinct: true)
      }
    }
    rush: appraisal_aggregate(where: { appraisal_priority_id: { _eq: 2 }, appraisal_status_id: { _eq: 1 } }) {
      aggregate {
        count(distinct: true)
      }
    }
    allProperties: properties_aggregate {
      aggregate {
        count(distinct: true)
      }
    }
    salesComps: sales_comps_aggregate {
      aggregate {
        count(distinct: true)
      }
    }
    leaseComps: lease_comps_aggregate {
      aggregate {
        count(distinct: true)
      }
    }
  }
`;
