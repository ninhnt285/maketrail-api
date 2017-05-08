import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} from 'graphql';

import { nodeInterface } from '../../utils/nodeDefinitions';
import UserType from '../user';
import UserService from '../../../database/helpers/user';
import FeedService from '../../../database/helpers/feed';
import FeedTargetType from './target';
import ItemType from './item';
import { getNodeFromId } from '../../../database/helpers/node';

const FeedType = new GraphQLObjectType({
  name: 'Feed',

  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    user: {
      type: UserType,
      resolve: parentValue => UserService.findById(parentValue.userId)
    },

    type: {
      type: new GraphQLEnumType({
        name: 'feedType',
        values: {
          POST: { value: 0 },
          LIKE: { value: 1 },
          SHARE: { value: 2 },
          COMMENT: { value: 3 }
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

    object: {
      type: FeedTargetType,
      resolve: parentValue => getNodeFromId(parentValue.objectId)
    },

    content: {
      type: new GraphQLObjectType({
        name: 'feedContent',
        fields: {
          text: {
            type: GraphQLString
          },
          items: {
            type: new GraphQLList(ItemType),
            resolve: parentValue => parentValue.items.map(id => ({
              id,
              caption: 'hehe',
              sourceUrl: 'abc'
            }))
          }
        }
      })
    },

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
  },

  interfaces: [nodeInterface]
});

export default FeedType;
