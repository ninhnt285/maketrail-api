import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLObjectType,
} from 'graphql';

import { nodeInterface } from '../utils/nodeDefinitions';
import VenueType from './venue';

const LocalityVenueType = new GraphQLObjectType({
  name: 'LocalityVenue',

  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    originVenue: {
      type: VenueType
    }
  },

  interfaces: [nodeInterface]
});

export default LocalityVenueType;
