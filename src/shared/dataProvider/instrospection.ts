import GRAPHQL_SCHEMA from 'shared/generated/schema.json';
import { GET_LIST, GET_ONE } from 'ra-core';
import { ALL_TYPES } from 'ra-data-graphql';

const schema = GRAPHQL_SCHEMA.__schema;
export const filterTypesByIncludeExclude = ({ include, exclude }: any) => {
  if (Array.isArray(include)) {
    return (type: any) => include.includes(type.name);
  }

  if (typeof include === 'function') {
    return (type: any) => include(type);
  }

  if (Array.isArray(exclude)) {
    return (type: any) => !exclude.includes(type.name);
  }

  if (typeof exclude === 'function') {
    return (type: any) => !exclude(type);
  }

  return () => true;
};

/**
 * @param {ApolloClient} client The Apollo client
 * @param {Object} options The introspection options
 */
function getInstrospectionResult(options: any) {
  const queries = schema.types.reduce((acc: any, type: any) => {
    if (
      type.name !== (schema.queryType && schema.queryType.name) &&
      type.name !== (schema.mutationType && schema.mutationType.name)
    )
      return acc;

    return [...acc, ...type.fields];
  }, []);

  const types = schema.types.filter(
    (type) =>
      type.name !== (schema.queryType && schema.queryType.name) &&
      type.name !== (schema.mutationType && schema.mutationType.name),
  );

  const isResource = (type: any) =>
    queries.some((query: any) => query.name === options.operationNames[GET_LIST](type)) &&
    queries.some((query: any) => query.name === options.operationNames[GET_ONE](type));

  const buildResource = (type: any) =>
    ALL_TYPES.reduce(
      (acc: any, aorFetchType: any) => ({
        ...acc,
        [aorFetchType]: queries.find(
          (query: any) =>
            options.operationNames[aorFetchType] && query.name === options.operationNames[aorFetchType](type),
        ),
      }),
      { type },
    );

  const potentialResources = types.filter(isResource);
  const filteredResources = potentialResources.filter(filterTypesByIncludeExclude(options));
  const resources = filteredResources.map(buildResource);

  return {
    types,
    queries,
    resources,
    schema,
  };
}
const instrospectionResult = getInstrospectionResult({
  schema,
  operationNames: {
    [GET_LIST]: (resource: any) => `${resource.name}`,
    [GET_ONE]: (resource: any) => `${resource.name}`,
  },
});
export default instrospectionResult;
