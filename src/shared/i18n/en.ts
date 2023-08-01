import englishMessages from 'ra-language-english';

englishMessages.ra.action.create = 'Add';
englishMessages.ra.action.add_filter = 'Filter';
englishMessages.ra.navigation.no_results = '';
englishMessages.ra.message.delete_content = 'Are you sure you want to delete this %{name}?';
englishMessages.ra.page.empty = 'No %{name} found, please refine your search';

export default {
  ...englishMessages,
  common: {
    yes: 'Yes',
    no: 'No',
  },
  lease_comp: {
    updated: 'Lease Comp successfully updated',
    deleted: 'Lease Comp successfully deleted',
  },
  sales_comp: {
    updated: 'Sales Comp successfully updated',
    deleted: 'Sales Comp successfully deleted',
  },
  property: {
    created: 'Property successfully created',
    updated: 'Property successfully updated',
    deleted: 'Sales Comp successfully deleted',
  },
  contact: {
    created: 'Contact successfully created',
    updated: 'Contact successfully updated',
    deleted: 'Contact successfully deleted',
  },
  appraisal: {
    created: 'Appraisal successfully created',
    updated: 'Appraisal successfully updated',
    deleted: 'Appraisal successfully deleted',
  },
  team: {
    created: 'Team Member successfully created',
    updated: 'Team Member successfully updated',
    deleted: 'Team Member successfully deleted',
  },
  user_account: {
    created: 'Team Member successfully created',
    updated: 'Team Member successfully updated',
    deleted: 'Team Member successfully deleted',
  },
  client: {
    created: 'Client successfully created',
    updated: 'Client successfully updated',
    deleted: 'Client successfully deleted',
    list: {
      filter: {
        search: 'Search by Name!',
      },
    },
  },
  resources: {
    team: {
      empty: 'No Team Member yet.',
    },
  },
  file: {
    created: 'File successfully created',
    updated: 'File successfully updated',
    deleted: 'File successfully deleted',
  },
  appraisal_fee: {
    created: 'Fee successfully created',
    updated: 'Fee successfully updated',
    deleted: 'Fee successfully deleted',
  },
  fee: {
    created: 'Fee successfully created',
    updated: 'Fee successfully updated',
    deleted: 'Fee successfully deleted',
  },
  appraisal_expense: {
    created: 'Expense successfully created',
    updated: 'Expense successfully updated',
    deleted: 'Expense successfully deleted',
  },
  expense: {
    created: 'Expense successfully created',
    updated: 'Expense successfully updated',
    deleted: 'Expense successfully deleted',
  },
};
