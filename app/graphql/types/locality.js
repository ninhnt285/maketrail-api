import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLFloat
} from 'graphql';

import { nodeInterface } from '../utils/nodeDefinitions';

const DEFAULT_IMAGE = '/noImage/noImage%s.png';
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
        return obj.previewPhotoUrl ? prefix + obj.previewPhotoUrl : prefix + DEFAULT_IMAGE;
      }
    }
  },

  interfaces: [nodeInterface]
});

export default LocalityType;
