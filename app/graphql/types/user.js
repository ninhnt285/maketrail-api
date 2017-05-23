import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLBoolean
} from 'graphql';

import UserService from '../../database/helpers/user';
import { nodeInterface } from '../utils/nodeDefinitions';
import { PREFIX } from '../../config';

const DEFAULT_IMAGE = '/noImage/noImage%s.png';
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },

    username: {
      type: GraphQLString,
    },

    email: {
      type: GraphQLString,
    },

    fullName: {
      type: GraphQLString,
    },

    isFriend: {
      type: GraphQLBoolean,
      resolve: (parentValue, params, { user }) => {
        if (user) {
          return UserService.isFriend(user.id, parentValue.id);
        }
        return false;
      }
    },

    profilePicUrl: {
      type: GraphQLString,
      resolve(obj) {
        return obj.profilePicUrl ? PREFIX + obj.profilePicUrl : PREFIX + DEFAULT_IMAGE;
      }
    }

  },
  interfaces: [nodeInterface]
});

export default UserType;
