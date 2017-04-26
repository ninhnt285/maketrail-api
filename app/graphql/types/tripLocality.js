import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType,
} from 'graphql';

import { nodeInterface } from '../utils/nodeDefinitions';
import LocalityType from './locality';

const TripLocalityType = new GraphQLObjectType({
  name: 'TripLocality',

  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    originLocality:{
      type: LocalityType
    }
  },

  interfaces: [nodeInterface]
});

export default TripLocalityType;
