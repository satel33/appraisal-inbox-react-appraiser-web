import { createSelector } from '@reduxjs/toolkit';
import { AppState } from 'shared/types';

export const menuCountSelector = createSelector(
  (state: AppState) => state.appraisal,
  (appraisal) => appraisal.menuCounts,
);

export const orgCountSelector = createSelector(
  (state: AppState) => state.appraisal,
  (appraisal) => appraisal.orgContacts,
);
