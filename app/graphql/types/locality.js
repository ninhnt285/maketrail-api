import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLFloat
} from 'graphql';

import { nodeInterface } from '../utils/nodeDefinitions';

const LocalityType = new GraphQLObjectType({
  name: 'Locality',

  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: GraphQLString
    },
    googlePlaceId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    description: {
      type: GraphQLString
    },
    location: {
      type: new GraphQLObjectType({
        name: 'location',
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
    previewPhotoUrl: {
      type: GraphQLString
    }
  },

  interfaces: [nodeInterface]
});

export default LocalityType;
