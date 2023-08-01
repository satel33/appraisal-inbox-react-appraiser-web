import { AppraisalState } from 'views/Appraisal/reducer';
import { ReduxState } from 'ra-core';
import { UserIdentity, Record } from 'react-admin';
import { Appraisal_Statuses_Aggregate, User_Profile_Activities } from './generated/types';
export type Maybe<T> = T | null;

export type ReactAdminPageProps = { theme: any; noLayout?: boolean };

export type AppraisalTimeFilterResponse = {
  allAppraisals: Appraisal_Statuses_Aggregate;
  inProgress: Appraisal_Statuses_Aggregate;
  unassigned: Appraisal_Statuses_Aggregate;
  dueSoon: Appraisal_Statuses_Aggregate;
  upcomingInspections: Appraisal_Statuses_Aggregate;
  pastDue: Appraisal_Statuses_Aggregate;
  unpaid: Appraisal_Statuses_Aggregate;
  starred: Appraisal_Statuses_Aggregate;
  unscheduled: Appraisal_Statuses_Aggregate;
  rush: Appraisal_Statuses_Aggregate;
  allProperties: Appraisal_Statuses_Aggregate;
  salesComps: Appraisal_Statuses_Aggregate;
  leaseComps: Appraisal_Statuses_Aggregate;
};

export type UserSession = UserIdentity & {
  organization_id: string;
  id: string;
  role: string;
};

export interface AppState extends ReduxState {
  appraisal: AppraisalState;
}
export type TeamMemberActivities = User_Profile_Activities & Record;
