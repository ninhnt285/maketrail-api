import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLID
} from 'graphql';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import FriendshipService from '../../../database/helpers/friendship';

const AnswerAddFriendMutation = mutationWithClientMutationId({
  name: 'AnswerAddFriend',

  inputFields: {
    userId: {
      type: new GraphQLNonNull(GraphQLID)
    },
    choice: {
      type: GraphQLBoolean
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
  },

  mutateAndGetPayload: async ({ userId, choice }, { user }) => {
    let errors = [];

    if (!user) {
      errors = [
        'Please login to answer invite.'
      ];
      return {
        success: false,
        errors
      };
    }

    const res = await FriendshipService.answerAddFriend(user, userId, choice);
    if (res.errors) {
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

export default AnswerAddFriendMutation;
