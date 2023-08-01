import { Team as GeneratedTeam, User_Profiles as GeneratedUserProfile } from 'shared/generated/types';
import { Record } from 'react-admin';

export type Team = GeneratedTeam & Record;
export type UserProfile = GeneratedUserProfile & Record;
