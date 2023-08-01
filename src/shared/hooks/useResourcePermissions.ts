import { useGetIdentity, UserIdentity } from 'ra-core';
import { useMemo } from 'react';
import { useFormState } from 'react-final-form';

export type FormPermissions = {
  create?: boolean;
  edit: boolean;
  delete?: boolean;
  list?: boolean;
};

export type GetPermission<T = any> = (formData: T, identity: UserIdentity | undefined) => FormPermissions;
export default function useFormPermissions<T>(props: { getPermission: GetPermission<T> }) {
  const formData = useFormState<T>();
  const { identity } = useGetIdentity();
  const { getPermission } = props;
  const permissions = useMemo(() => getPermission(formData.values, identity), [formData, identity]);
  return [{ formData: formData.values, permissions, identity }] as const;
}
