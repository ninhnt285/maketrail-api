import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLInputObjectType
} from 'graphql';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import UserService from '../../../database/helpers/user';

const LoginMutation = mutationWithClientMutationId({
  name: 'Login',

  inputFields: {
    usernameOrEmail: {
      type: GraphQLString
    },

    password: {
      type: GraphQLString
    },

    provider: {
      type: GraphQLString
    },

    socialToken: {
      type: GraphQLString
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

  mutateAndGetPayload: async ({ usernameOrEmail, password, provider, socialToken }) => {
    let res = null;
    if (!provider || provider === 'local') {
      if (usernameOrEmail.indexOf('@') >= 0) {
        res = await UserService.loginViaEmail(usernameOrEmail, password);
      } else {
        res = await UserService.loginViaUsername(usernameOrEmail, password);
      }
    } else {
      res = await UserService.loginViaSocialNetwork(provider, socialToken);
    }
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

export default LoginMutation;
