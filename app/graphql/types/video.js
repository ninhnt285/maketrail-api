import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLFloat,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql';

import FeedService from '../../database/helpers/feed';
import StatisticType from './auxiliaryTypes/Statistic';
import UserType from './user';
import { getType } from '../../lib/idUtils';
import { nodeInterface } from '../utils/nodeDefinitions';
import { PREFIX } from '../../config';

const DEFAULT_IMAGE = '/noImage/noImage_150_square.png';

const VideoType = new GraphQLObjectType({
  name: 'Video',

  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },

    name: {
      type: GraphQLString
    },

    from: {
      type: UserType
    },

    toId: {
      type: GraphQLString,
      resolve: parentValue => parentValue.parentId
    },

    toType: {
      type: GraphQLString,
      resolve: parentValue => getType(parentValue.parentId)
    },

    caption: {
      type: GraphQLString
    },
    previewUrl: {
      type: GraphQLString,
      resolve(obj) {
        return obj.previewUrl ? PREFIX + obj.previewUrl : PREFIX + DEFAULT_IMAGE;
      }
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
    filePathUrl: {
      type: GraphQLString,
      resolve(obj) {
        return PREFIX + obj.url;
      }
    },
    length: {
      type: GraphQLFloat
    },
    placeId: {
      type: GraphQLString
    },

    placeName: {
      type: GraphQLString
    },
    createdAt: {
      type: GraphQLInt,
      resolve: parentValue => parentValue.createdAt.getTime() / 1000
    },
    statistics: {
      type: StatisticType,
      resolve: parentValue => FeedService.getStatistics(parentValue.id)
    }
  }),

  interfaces: [nodeInterface]
});

export default VideoType;
