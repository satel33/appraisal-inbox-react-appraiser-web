import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppraisalTimeFilterResponse } from 'shared/types';

export interface AppraisalState {
  timeFilter: number;
  menuCounts: AppraisalTimeFilterResponse | null;
  orgContacts: number;
}

const initialState: AppraisalState = {
  timeFilter: 0,
  menuCounts: null,
  orgContacts: 0,
};

const appraisal = createSlice({
  name: 'appraisal',
  initialState,
  reducers: {
    setTimeFilter(state: AppraisalState, { payload }: PayloadAction<number>) {
      state.timeFilter = payload;
    },
    setAppraisalMenuCount(state: AppraisalState, { payload }: PayloadAction<AppraisalTimeFilterResponse>) {
      state.menuCounts = payload;
    },
    setOrganizationContactCount(state: AppraisalState, { payload }: PayloadAction<{ aggregate: { count: number } }>) {
      state.orgContacts = payload.aggregate.count;
    },
  },
});

export const { setTimeFilter, setAppraisalMenuCount, setOrganizationContactCount } = appraisal.actions;
export default appraisal.reducer;

export const FetchMenuCount = createAction('appraisal/FetchMenuCount');
export const FetchOrganizationContactsAction = createAction<{ organization_id: string }>(
  'appraisal/FetchOrganizationContacts',
);
