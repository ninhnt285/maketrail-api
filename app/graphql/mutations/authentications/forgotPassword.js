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

const ForgotPasswordMutation = mutationWithClientMutationId({
  name: 'ForgotPassword',

  inputFields: {

    email: {
      type: GraphQLString
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
    }
  },

  mutateAndGetPayload: async ({ email }, { user }) => {
    const res = await UserService.forgotPassword(email);
    if (res && res.errors) {
      return {
        success: false,
        errors: res.errors
      };
    }

    return {
      success: true
    };
  }
});

export default ForgotPasswordMutation;
