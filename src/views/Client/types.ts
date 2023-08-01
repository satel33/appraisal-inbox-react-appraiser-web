import { Client as GeneratedClient, Client_Activities as GeneratedClientActivities } from 'shared/generated/types';
import { Record } from 'react-admin';

export type Client = GeneratedClient & Record;

interface Client_Activities extends GeneratedClientActivities {
  contact_id: string | null;
}

export type ClientActivities = Client_Activities & Record;
