import React from 'react';
import { TitleProps } from 'react-admin';

export default ({ record }: TitleProps): JSX.Element =>
  record && record.name ? <span>Client: {record.name}</span> : <span>Create client</span>;
