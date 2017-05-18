import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt
} from 'graphql';

import { nodeInterface } from '../utils/nodeDefinitions';
import { localityConnection } from '../connections/tripLocality';
import { memberConnection } from '../connections/user';

const TripType = new GraphQLObjectType({
  name: 'Trip',

  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: GraphQLString
    },
    exportedVideo: {
      type: GraphQLBoolean
    },
    createdAt: {
      type: GraphQLInt,
      resolve: parentValue => parentValue.createdAt.getTime() / 1000
    },
    localities: localityConnection,
    members: memberConnection
  },

  interfaces: [nodeInterface]
});

export default TripType;
