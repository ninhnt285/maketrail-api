import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLBoolean
} from 'graphql';

import FeedService from '../../database/helpers/feed';
import { nodeInterface } from '../utils/nodeDefinitions';
import { PREFIX } from '../../config';

const DEFAULT_IMAGE = '/noImage/noImage%s.png';
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
    isLiked: {
      type: GraphQLBoolean,
      resolve: (parentValue, params, { user }) => {
        if (user) {
          return FeedService.isLiked(user.id, parentValue.id);
        }
        return false;
      }
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
        return obj.previewPhotoUrl ? PREFIX + obj.previewPhotoUrl : PREFIX + DEFAULT_IMAGE;
      }
    }
  },

  interfaces: [nodeInterface]
});

export default LocalityType;
