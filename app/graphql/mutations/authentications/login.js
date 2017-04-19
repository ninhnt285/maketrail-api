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

    type: {
      type: GraphQLString
    },

    socialInfo: {
      type: new GraphQLInputObjectType({
        name: 'social',
        fields: {
          id: {
            type: GraphQLString
          },
          token: {
            type: GraphQLString
          },
          email: {
            type: GraphQLString
          },
          name: {
            type: GraphQLString
          }
        }
      })
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

  mutateAndGetPayload: async ({ usernameOrEmail, password, type, socialInfo }) => {
    let res = null;
    if (!type || type === 'normal') {
      if (usernameOrEmail.indexOf('@') >= 0) {
        res = await UserService.loginViaEmail(usernameOrEmail, password);
      } else {
        res = await UserService.loginViaUsername(usernameOrEmail, password);
      }
    } else {
      res = await UserService.loginViaSocialNetwork(type, socialInfo);
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
