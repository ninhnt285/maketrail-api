import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLFloat
} from 'graphql';

import { nodeInterface } from '../utils/nodeDefinitions';

const prefix = process.env.NODE_ENV === 'production' ? 'http://api.maketrail.com/resources' : 'http://localhost:4001/resources';
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
      type: GraphQLString,
      resolve(obj) {
        return prefix + obj.previewPhotoUrl;
      }
    }
  },

  interfaces: [nodeInterface]
});

export default LocalityType;
