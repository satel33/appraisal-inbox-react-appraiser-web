import Tracker from '@openreplay/tracker';
import { Config } from 'shared/constants/config';
import trackerGraphQL from '@openreplay/tracker-graphql';

const openReplay = new Tracker({
  projectKey: Config.openReplayId,
});

export const recordGraphQL = openReplay.use(trackerGraphQL());

export default openReplay;
