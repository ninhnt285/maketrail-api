import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt
} from 'graphql';
import { nodeInterface } from '../utils/nodeDefinitions';
import FeedService from '../../database/helpers/feed';
import { commentConnection } from '../connections/comment';
import FeedTargetType from './feed/target';
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
