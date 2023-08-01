import * as React from 'react';
import { Route } from 'react-router-dom';
import Client from 'views/Client';
import Appraisal from 'views/Appraisal';
import Expense from 'views/Expense';
import Property from 'views/Property';
import Contact from 'views/Contact';
import Team from 'views/Team';
import appraisalReducer from 'views/Appraisal/reducer';
import appraisalSaga from 'views/Appraisal/saga';
import LoginPage from 'shared/components/Auth/Login';
import ProfilePage from 'shared/components/Auth/Profile';
import Schedule from 'views/Calendar/List';
import Insight from 'views/Insight/List';
import Lease from 'views/Transactions/Lease';
import Sales from 'views/Transactions/Sales';
import RequestResetPassword from 'shared/components/Auth/RequestResetPassword';
import ConfirmAccount from 'shared/components/Auth/ConfirmAccount';
import ResetPassword from 'shared/components/Auth/ResetPassword';

const resources = [
  Appraisal,
  Expense,
  Property,
  Lease,
  Sales,
  {
    name: 'appraisal',
  },
  {
    name: 'property',
  },
  {
    name: 'assessment',
  },
  {
    name: 'client',
  },
  {
    name: 'organization',
  },
  {
    name: 'user_preference_notification',
  },
  {
    name: 'appraisal_statuses',
  },
  {
    name: 'appraisal_priorities',
  },
  {
    name: 'appraisal_purposes',
  },
  {
    name: 'appraisal_types',
  },
  {
    name: 'property_interests',
  },
  {
    name: 'commercial_property_type',
  },
  {
    name: 'commercial_property_subtype',
  },
  {
    name: 'report_types',
  },
  {
    name: 'residential_form_types',
  },
  {
    name: 'loan_types',
  },
  {
    name: 'user_account',
  },
  {
    name: 'user_accounts',
  },
  {
    name: 'user_profile',
  },
  {
    name: 'user_profiles',
  },
  {
    name: 'us_states',
  },
  {
    name: 'residential_ownership_types',
  },
  {
    name: 'residential_styles',
  },
  {
    name: 'client_types',
  },
  {
    name: 'transaction_type',
  },
  {
    name: 'commercial_lease_types',
  },
  {
    name: 'residential_lease_types',
  },
  {
    name: 'sales_transactions',
  },
  {
    name: 'lease_transactions',
  },
  {
    name: 'contact_types',
  },
  {
    name: 'contact',
  },
  {
    name: 'transaction',
  },
  {
    name: 'property_types',
  },
  Client,
  Contact,
  Team,
];

export default resources;
//.map((props) => React.createElement(Resource, { ...props, key: props.name }));

export const customReducers = {
  appraisal: appraisalReducer,
};
export const customSagas = [appraisalSaga];
export const customRoutes: JSX.Element[] = [
  // {
  //   key: 'signup',
  //   path: '/account/signup',
  //   component: SignupPage,
  // },
  {
    key: 'reset',
    path: '/account/reset',
    component: RequestResetPassword,
  },
  {
    key: 'reset_password',
    path: '/account/reset_password',
    component: ResetPassword,
  },
  {
    key: 'set_password',
    path: '/account/set_password',
    component: ResetPassword,
  },
  {
    key: 'reset',
    path: '/account/confirm',
    component: ConfirmAccount,
  },
  {
    key: 'login',
    path: '/account/login',
    component: LoginPage,
  },
  {
    key: 'profile',
    path: '/account/my-profile',
    component: ProfilePage,
    noLayout: false,
  },
  {
    key: 'appraisals',
    path:
      '/appraisals/:id(all|in-progress|unassigned|due-soon|upcoming-inspections|past-due|unpaid|starred|unscheduled|rush)?',
    component: Appraisal.list,
    noLayout: false,
  },
  // Comment out properties routing: https://trello.com/c/anjuABik/670-property-remove
  // {
  //   key: 'properties',
  //   path: '/properties/:id(all)?',
  //   component: withAuthRoute('properties')(Property.list),
  //   noLayout: false,
  // },
  // {
  //   key: 'properties-lease',
  //   path: '/properties/lease-comps',
  //   component: withAuthRoute('lease_comps')(Lease.list),
  //   noLayout: false,
  // },
  // {
  //   key: 'properties-lease-edit',
  //   path: '/properties/lease-comps/:id',
  //   component: withAuthRoute('lease_comps')(Lease.edit),
  //   noLayout: false,
  // },
  // {
  //   key: 'properties-sales',
  //   path: '/properties/sales-comps',
  //   component: withAuthRoute('sales_comps')(Sales.list),
  //   noLayout: false,
  // },
  // {
  //   key: 'properties-lease-edit',
  //   path: '/properties/sales-comps/:id',
  //   component: withAuthRoute('sales_comps')(Sales.edit),
  //   noLayout: false,
  // },
  {
    key: 'schedule',
    path: '/schedule',
    component: Schedule,
    noLayout: false,
  },
  {
    key: 'insights',
    path: '/insights',
    component: Insight,
    noLayout: false,
  },
].map((e) => <Route noLayout exact {...e} />);
