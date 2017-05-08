import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

import { nodeInterface } from '../../utils/nodeDefinitions';
import UserType from '../user';
import UserService from '../../../database/helpers/user';
import { getType } from '../../../lib/idUtils';


const FeedPreviewType = new GraphQLObjectType({
  name: 'FeedPreview',

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
        name: 'feedPreviewType',
        values: {
          POST: { value: 0 },
          LIKE: { value: 1 },
          SHARE: { value: 2 },
          COMMENT: { value: 3 }
        }
      })
    },

    objectId: {
      type: GraphQLID
    },
    objectType: {
      type: GraphQLString,
      resolve: parentValue => getType(parentValue.targetId)
    }
  },

  interfaces: [nodeInterface]
});

export default FeedPreviewType;
