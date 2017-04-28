import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} from 'graphql';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import VenueType from '../../types/venue';
import VenueService from '../../../database/helpers/venue';
import { VenueEdge } from '../../connections/venue';
import { edgeFromNode } from '../../../lib/connection';

const RemoveLocalityVenueMutation = mutationWithClientMutationId({
  name: 'RemoveLocalityVenue',

  inputFields: {
    venueId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    tripLocalityId: {
      type: new GraphQLNonNull(GraphQLString)
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
    tripLocality: {
      type: VenueType,
      resolve: ({ item }) => item
    },
    edge: {
      type: VenueEdge,
      resolve: ({ item }) => edgeFromNode(item)
    }
  },

  mutateAndGetPayload: async ({ tripLocalityId, venueId }, { user }) => {
    let errors = [];

    if (!user) {
      errors = [
        'Please login to remove venue.'
      ];
      return {
        success: false,
        errors
      };
    }

    const res = await VenueService.remove(user, tripLocalityId, venueId);
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

export default RemoveLocalityVenueMutation;
