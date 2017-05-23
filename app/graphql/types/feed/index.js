import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql';

import { nodeInterface } from '../../utils/nodeDefinitions';
import FeedService from '../../../database/helpers/feed';
import FeedTargetType from './target';
import { getNodeFromId } from '../../../database/helpers/node';
import { attachmentConnection } from '../../connections/attachment';
import { commentConnection } from '../../connections/comment';

const FeedType = new GraphQLObjectType({
  name: 'Feed',

  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    from: {
      type: FeedTargetType,
      resolve: parentValue => getNodeFromId(parentValue.fromId)
    },

    type: {
      type: new GraphQLEnumType({
        name: 'feedType',
        values: {
          POST: { value: 0 },
          SHARE: { value: 1 },
          PHOTO: { value: 2 },
          VIDEO: { value: 3 },
        }
      })
    },
    privacy: {
      type: new GraphQLEnumType({
        name: 'feedPrivacy',
        values: {
          PUBLIC: { value: 0 },
          FRIEND: { value: 1 },
          FRIEND_OF_FRIEND: { value: 2 },
          ONLY_ME: { value: 3 }
        }
      })
    },

    to: {
      type: FeedTargetType,
      resolve: parentValue => getNodeFromId(parentValue.toId)
    },

    parent: {
      type: FeedType,
      resolve: parentValue => getNodeFromId(parentValue.parentId)
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

    text: {
      type: GraphQLString
    },

    createdAt: {
      type: GraphQLInt,
      resolve: parentValue => parentValue.createdAt.getTime() / 1000
    },
    comments: commentConnection,
    attachments: attachmentConnection,

    statistics: {
      type: new GraphQLObjectType({
        name: 'feedStatistic',
        fields: {
          likeCount: {
            type: GraphQLInt
          },
          shareCount: {
            type: GraphQLInt
          },
          commentCount: {
            type: GraphQLInt
          }
        }
      }),
      resolve: parentValue => FeedService.getStatistics(parentValue.id)
    }
  }),

  interfaces: [nodeInterface]
});

export default FeedType;
