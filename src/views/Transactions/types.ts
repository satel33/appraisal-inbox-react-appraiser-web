import {
  Transaction as GeneratedTransaction,
  Transactions as GeneratedTransactions,
  Lease_Comps as GeneratedLeaseComps,
  Sales_Comps as GeneratedSalesComps,
} from 'shared/generated/types';
import { Record } from 'react-admin';

export type Transaction = GeneratedTransaction & Record;

export type Transactions = GeneratedTransactions & Record;

export type LeaseComps = GeneratedLeaseComps & Record;
export type SalesComps = GeneratedSalesComps & Record;
