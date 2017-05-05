import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLObjectType
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
    localities: localityConnection,
    members: memberConnection
  },

  interfaces: [nodeInterface]
});

export default TripType;
