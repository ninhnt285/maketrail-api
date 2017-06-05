import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLBoolean
} from 'graphql';

import UserService from '../../database/helpers/user';
import { tripConnection } from '../connections/trip';
import { nodeInterface } from '../utils/nodeDefinitions';
import { PREFIX } from '../../config';

const DEFAULT_IMAGE = '/noImage/noImage%s.png';
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
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

    visitedNumber: {
      type: GraphQLString,
      resolve: async (parentValue) => {
        const visitedNumber = await UserService.getVisitedNumber(parentValue.id, undefined);
        return `${visitedNumber}/256`;
      }
    },

    favouriteCountry: {
      type: GraphQLString,
      resolve: (parentValue) => {
        return UserService.getFavouriteCountry(parentValue.id);
      }
    },

    isFollowed: {
      type: GraphQLBoolean,
      resolve: (parentValue, params, { user }) => {
        if (user) {
          return UserService.isFollowed(user.id, parentValue.id);
        }
        return false;
      }
    },

    profilePicUrl: {
      type: GraphQLString,
      resolve(obj) {
        return obj.profilePicUrl ? PREFIX + obj.profilePicUrl : PREFIX + DEFAULT_IMAGE;
      }
    },

    trips: tripConnection

  }),
  interfaces: [nodeInterface]
});

export default UserType;
