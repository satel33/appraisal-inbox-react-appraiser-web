import {
  Appraisals as GeneratedAppraisals,
  Appraisal as GeneratedAppraisal,
  Appraisal_Activities,
} from 'shared/generated/types';
import { Record } from 'react-admin';
import { AppraisalStatus } from 'shared/hooks/useRowStyle';

type WithAppraisalStatus = {
  appraisal_status?: AppraisalStatus;
};
export type Appraisals = Omit<GeneratedAppraisals, 'appraisal_status'> & Record & WithAppraisalStatus;
export type Appraisal = Omit<GeneratedAppraisal, 'appraisal_status'> & Record & WithAppraisalStatus;
export type AppraisalEvent = Appraisals & {
  start: Date;
  end: Date;
  allDay: boolean;
  title: string;
  type: AppraisalEventType;
};

export enum AppraisalEventType {
  Inspection = 'inspection_date',
  Due = 'due_date',
}

export interface AppraisalWithCoordinates extends Appraisals {
  coordinates: [number, number];
}

export type AppraisalActivities = Appraisal_Activities & Record;
