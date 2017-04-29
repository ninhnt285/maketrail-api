import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} from 'graphql';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import LocalityVenueType from '../../types/localityVenue';
import VenueService from '../../../database/helpers/venue';
import { LocalityVenueEdge } from '../../connections/localityVenue';
import { edgeFromNode } from '../../../lib/connection';

const AddLocalityVenueMutation = mutationWithClientMutationId({
  name: 'AddLocalityVenue',

  inputFields: {
    tripLocalityId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    venueId: {
      type: new GraphQLNonNull(GraphQLString)
    },
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
    localityVenue: {
      type: LocalityVenueType,
      resolve: ({ item }) => item
    },
    edge: {
      type: LocalityVenueEdge,
      resolve: ({ item }) => edgeFromNode(item)
    }
  },

  mutateAndGetPayload: async ({ tripLocalityId, venueId }, { user }) => {
    let errors = [];

    if (!user) {
      errors = [
        'Please login to add new localityVenue.'
      ];
      return {
        success: false,
        errors
      };
    }

    const res = await VenueService.add(user, tripLocalityId, venueId);
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

export default AddLocalityVenueMutation;
