import React from 'react';
import { useGetIdentity } from 'ra-core';
import { Error } from 'react-admin';
import { checkCanAccessMenu } from 'shared/utils';

const withAuthRoute = (resource: string) => (Component: React.FC<any>) => {
  function ProtectedRoute(props: any) {
    const { identity } = useGetIdentity();
    const canAccess = checkCanAccessMenu(identity?.role, resource);
    if (canAccess) return <Component {...props} />;
    return <Error error={'Forbidden'} />;
  }
  return ProtectedRoute;
};

export default withAuthRoute;
