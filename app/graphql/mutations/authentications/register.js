import {
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList
} from 'graphql';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import UserService from '../../../database/helpers/user';

const RegisterMutation = mutationWithClientMutationId({
  name: 'Register',

  inputFields: {
    fullName: {
      type: new GraphQLNonNull(GraphQLString)
    },
    username: {
      type: new GraphQLNonNull(GraphQLString)
    },
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
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

  mutateAndGetPayload: async ({ fullName, username, email, password }) => {
    const res = await UserService.register(username, email, password, fullName);
    if (res.accessToken) {
      return {
        success: true,
        accessToken: res.accessToken
      };
    }
    return {
      success: false,
      errors: res.errors
    };
  }
});

export default RegisterMutation;
