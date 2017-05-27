import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql';
import { nodeInterface } from '../utils/nodeDefinitions';
import FeedService from '../../database/helpers/feed';
import { commentConnection } from '../connections/comment';
import FeedTargetType from './subject';
import { getNodeFromId } from '../../database/helpers/node';

const CommentType = new GraphQLObjectType({
  name: 'Comment',

  fields: () => ({

    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    from: {
      type: FeedTargetType,
      resolve: parentValue => getNodeFromId(parentValue.fromId)
    },
    text: {
      type: GraphQLString
    },
    parentId: {
      type: GraphQLID
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
    createdAt: {
      type: GraphQLInt,
      resolve: parentValue => parentValue.createdAt.getTime() / 1000
    },
    comments: commentConnection,
    likeCount: {
      type: GraphQLInt,
      resolve: parentValue => FeedService.getLikeCount(parentValue.id)
    }
  }),

  interfaces: [nodeInterface]
});

export default CommentType;
