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

import TripType from '../../types/trip';
import TripService from '../../../database/helpers/trip';
import { TripEdge } from '../../connections/trip';
import { edgeFromNode } from '../../../lib/connection';

const InviteMemberMutation = mutationWithClientMutationId({
  name: 'InviteMember',

  inputFields: {
    tripId: {
      type: new GraphQLNonNull(GraphQLID)
    },
    memberId: {
      type: GraphQLID
    },
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
    },
    trip: {
      type: TripType,
      resolve: ({ item }) => item
    },
    edge: {
      type: TripEdge,
      resolve: ({ item }) => edgeFromNode(item)
    },
    tripHash: {
      type: GraphQLString,
      resolve: ({ tripHash }) => tripHash
    }
  },

  mutateAndGetPayload: async ({ tripId, memberId, email }, { user }) => {
    let errors = [];

    if (!user) {
      errors = [
        'Please login to invite member.'
      ];
      return {
        success: false,
        errors
      };
    }

    const res = await TripService.inviteMember(user, tripId, memberId, email);
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

export default InviteMemberMutation;
