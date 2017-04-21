import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLObjectType
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
            type: GraphQLString
          },
          lng: {
            type: GraphQLString
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
