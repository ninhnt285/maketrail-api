import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLID
} from 'graphql';

import { categoryConnection } from '../connections/category';

const VenueType = new GraphQLObjectType({
  name: 'Venue',

  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    foursquareId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      type: GraphQLString
    },
    address: {
      type: GraphQLString
    },
    location: {
      type: new GraphQLObjectType({
        name: 'locationVenue',
        fields: {
          lat: {
            type: GraphQLFloat
          },
          lng: {
            type: GraphQLFloat
          }
        }
      })
    },
    phone: {
      type: GraphQLString
    },
    categories: categoryConnection
  },

});

export default VenueType;
