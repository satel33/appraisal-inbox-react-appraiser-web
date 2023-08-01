import { put, takeEvery } from 'redux-saga/effects';
import { gqlClient } from 'shared/ApolloClient';
import startOfDay from 'date-fns/startOfDay';
import add from 'date-fns/add';
import { APPRAISAL_TIME_FILTER_QUERY, ORGANIZATION_CONTACTS_QUERY } from 'shared/components/Base/queries';
import {
  setAppraisalMenuCount,
  FetchMenuCount as FetchMenuCountAction,
  FetchOrganizationContactsAction,
  setOrganizationContactCount,
} from './reducer';
import { PayloadAction } from '@reduxjs/toolkit';

function* FetchMenuCount() {
  const currentDate = startOfDay(new Date()).toISOString();
  const dueLimit = add(new Date(), { days: 7 }).toISOString();
  const response = yield gqlClient.query({
    query: APPRAISAL_TIME_FILTER_QUERY,
    variables: {
      date: currentDate,
      dueLimit,
    },
    fetchPolicy: 'network-only',
  });
  yield put(setAppraisalMenuCount(response.data));
}

function* FetchOrganizationContacts(action: PayloadAction<{ organization_id: string }>) {
  const { organization_id } = action.payload;
  // test
  const response = yield gqlClient.query({
    query: ORGANIZATION_CONTACTS_QUERY,
    variables: {
      organization_id,
    },
    fetchPolicy: 'network-only',
  });
  yield put(setOrganizationContactCount(response?.data?.contacts_aggregate));
}

export default function* appraisalSaga() {
  yield takeEvery(FetchMenuCountAction.type, FetchMenuCount);
  yield takeEvery(FetchOrganizationContactsAction.type, FetchOrganizationContacts);
}
