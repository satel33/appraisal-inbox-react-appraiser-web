import {
  Contact as GeneratedContact,
  Contacts as GeneratedContacts,
  Contact_Types as GeneratedContactTypes,
  Contact_Activities as GeneratedContactActivities,
} from 'shared/generated/types';
import { Record } from 'react-admin';

export type Contact = GeneratedContact & Record;

export type Contacts = GeneratedContacts & Record;

export type ContactTypes = GeneratedContactTypes & Record;

export type ContactActivities = GeneratedContactActivities & Record;
