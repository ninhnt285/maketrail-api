import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList
} from 'graphql';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import UserService from '../../../database/helpers/user';

const ResetPasswordMutation = mutationWithClientMutationId({
  name: 'ResetPassword',

  inputFields: {

    hash: {
      type: GraphQLString
    },

    passwordNew: {
      type: GraphQLString
    },

  },

  outputFields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ success }) => success
    },
    accessToken: {
      type: GraphQLString,
      resolve: ({ accessToken }) => accessToken
    },
    errors: {
      type: new GraphQLList(GraphQLString),
      resolve: ({ errors }) => errors
    }
  },

  mutateAndGetPayload: async ({ hash, passwordNew }, { user }) => {
    const res = await UserService.changePasswordNoUser(hash, passwordNew);
    if (res && !res.accessToken) {
      return {
        success: false,
        errors: res.errors
      };
    }

    return {
      success: true,
      accessToken: res.accessToken
    };
  }
});

export default ResetPasswordMutation;
