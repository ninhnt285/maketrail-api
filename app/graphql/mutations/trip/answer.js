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

import TripService from '../../../database/helpers/trip';

const AnswerInviteMutation = mutationWithClientMutationId({
  name: 'AnswerInvite',

  inputFields: {
    notificationId: {
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

  mutateAndGetPayload: async ({ notificationId, choice }, { user }) => {
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

    const res = await TripService.answerInvite(user, notificationId, choice);
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

export default AnswerInviteMutation;
