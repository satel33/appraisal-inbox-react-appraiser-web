import { stringify } from 'query-string';
import add from 'date-fns/add';
import startOfDay from 'date-fns/startOfDay';
import { RoleAccessMapping } from './roles';

export const currentDate = startOfDay(new Date()).toISOString();
export const dueLimit = add(new Date(), { days: 7 }).toISOString();
export const inProgressLink = {
  pathname: '/appraisals/in-progress',
  search: stringify({
    page: 1,
    perPage: 25,
    sort: 'inspection_date',
    order: 'ASC',
    filter: JSON.stringify({
      appraisal_status_id: 1,
    }),
  }),
};
export const rushLink = {
  pathname: '/appraisals/rush',
  search: stringify({
    page: 1,
    perPage: 25,
    sort: 'due_date',
    order: 'ASC',
    filter: JSON.stringify({
      appraisal_status_id: 1,
      appraisal_priority: 'Rush',
    }),
  }),
};
export const dueSoonLink = {
  pathname: '/appraisals/due-soon',
  search: stringify({
    page: 1,
    perPage: 25,
    sort: 'due_date',
    order: 'ASC',
    filter: JSON.stringify({
      appraisal_status_id: 1,
      due_date: {
        format: 'raw-query',
        value: {
          _gte: currentDate,
          _lte: dueLimit,
        },
      },
    }),
  }),
};
export const inspectionLink = {
  pathname: '/appraisals/upcoming-inspections',
  search: stringify({
    page: 1,
    perPage: 25,
    sort: 'inspection_date',
    order: 'ASC',
    filter: JSON.stringify({
      appraisal_status_id: 1,
      inspection_date: {
        format: 'raw-query',
        value: {
          _gte: currentDate,
          _lte: dueLimit,
        },
      },
    }),
  }),
};
export const pastDueLink = {
  pathname: '/appraisals/past-due',
  search: stringify({
    page: 1,
    perPage: 25,
    sort: 'due_date',
    order: 'ASC',
    filter: JSON.stringify({
      appraisal_status_id: 1,
      due_date: {
        format: 'raw-query',
        value: {
          _lt: currentDate,
        },
      },
    }),
  }),
};
export const unpaidLink = {
  pathname: '/appraisals/unpaid',
  search: stringify({
    page: 1,
    perPage: 25,
    sort: 'completed_date',
    order: 'ASC',
    filter: JSON.stringify({
      appraisal_status_id: 5,
      paid_date: {
        format: 'raw-query',
        value: {
          _is_null: true,
        },
      },
    }),
  }),
};

export const starredLink = {
  pathname: '/appraisals/starred',
  search: stringify({
    page: 1,
    perPage: 25,
    sort: 'due_date',
    order: 'ASC',
    filter: JSON.stringify({
      starred: true,
    }),
  }),
};

export const leaseCompsLink = {
  pathname: '/properties/lease-comps',
  search: stringify({
    page: 1,
    perPage: 25,
    sort: 'parcel_number',
    order: 'ASC',
  }),
};

export const salesCompsLink = {
  pathname: '/properties/sales-comps',
  search: stringify({
    page: 1,
    perPage: 25,
    sort: 'parcel_number',
    order: 'ASC',
  }),
};

export const propertiesLink = {
  pathname: '/properties/all',
  search: stringify({
    page: 1,
    perPage: 25,
    sort: 'parcel_number',
    order: 'ASC',
  }),
};

export const unscheduledLink = {
  pathname: '/appraisals/unscheduled',
  search: stringify({
    page: 1,
    perPage: 25,
    sort: 'due_date',
    order: 'ASC',
    filter: JSON.stringify({
      appraisal_status_id: 1,
      inspection_date: {
        format: 'raw-query',
        value: {
          _is_null: true,
        },
      },
    }),
  }),
};

export const unassignedLink = {
  pathname: '/appraisals/unassigned',
  search: stringify({
    page: 1,
    perPage: 25,
    sort: 'inspection_date',
    order: 'ASC',
    filter: JSON.stringify({
      appraisal_status_id: 1,
      assignee_user_account_ids: {
        format: 'raw-query',
        value: {
          _eq: [],
        },
      },
    }),
  }),
};

export const appraisalsLink = {
  pathname: '/appraisals/all',
  search: stringify({
    page: 1,
    perPage: 25,
    sort: 'appraisal_file_number',
    order: 'DESC',
    filter: '{}',
  }),
};

export const expensesLink = {
  pathname: '/expenses',
};

export const restrictedMenus: RoleAccessMapping = {
  appraisal_firm_restricted_access: {
    team: false,
    contacts: false,
    clients: false,
    properties: false,
    lease_comps: false,
    sales_comps: false,
  },
  appraisal_firm_limited_access: {
    team: false,
  },
};
