import { Property as GeneratedProperty } from 'shared/generated/types';
import { Record } from 'react-admin';

export type Property = GeneratedProperty & Record;

export interface PropertyWithCoordinates extends Property {
  coordinates: [number, number];
}
