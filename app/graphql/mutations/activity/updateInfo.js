import {
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
  GraphQLString,
  GraphQLID
} from 'graphql';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import UserType from '../../types/user';
import UserService from '../../../database/helpers/user';
import { UserEdge } from '../../connections/user';
import { edgeFromNode } from '../../../lib/connection';

const UpdateUserMutation = mutationWithClientMutationId({
  name: 'UpdateUser',

  inputFields: {
    fullName: {
      type: GraphQLString
    },
    profilePicUrl: {
      type: GraphQLID
    }
  },

  outputFields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ success }) => success
    },
    errors: {
      type: new GraphQLList(GraphQLString),
      resolve: ({ errors }) => errors
    },
    user: {
      type: UserType,
      resolve: ({ item }) => item
    },
    edge: {
      type: UserEdge,
      resolve: ({ item }) => edgeFromNode(item)
    }
  },

  mutateAndGetPayload: async ({ ...args }, { user }) => {
    let errors = [];

    if (!user) {
      errors = [
        'Please login to update info.'
      ];
      return {
        success: false,
        errors
      };
    }
    const newArgs = Object.assign({}, args);
    delete newArgs.clientMutationId;
    const res = await UserService.update(user, newArgs);
    if (res.errors) {
      return {
        success: false,
        errors: res.errors
      };
    }
    return {
      success: true,
      item: res.item
    };
  }
});

export default UpdateUserMutation;
