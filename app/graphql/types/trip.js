import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLObjectType
} from 'graphql';

import { nodeInterface } from '../utils/nodeDefinitions';

const TripType = new GraphQLObjectType({
  name: 'Trip',

  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: GraphQLString
    },
  },

  interfaces: [nodeInterface]
});

export default TripType;
