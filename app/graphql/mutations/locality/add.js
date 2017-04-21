import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInputObjectType
} from 'graphql';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import LocalityType from '../../types/locality';
import LocalityService from '../../../database/helpers/locality';
import { LocalityEdge } from '../../connections/locality';
import { edgeFromNode } from '../../../lib/connection';

const AddLocalityMutation = mutationWithClientMutationId({
  name: 'AddLocality',

  inputFields: {
    tripId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    googlePlaceId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    description: {
      type: GraphQLString
    },
    location: {
      type: new GraphQLInputObjectType({
        name: 'locationInput',
        fields: {
          lat: {
            type: GraphQLString
          },
          long: {
            type: GraphQLString
          }
        }
      })
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
    locality: {
      type: LocalityType,
      resolve: ({ item }) => item
    },
    edge: {
      type: LocalityEdge,
      resolve: ({ item }) => edgeFromNode(item)
    }
  },

  mutateAndGetPayload: async ({ tripId, googlePlaceId, name, description, location }, { user }) => {
    let errors = [];

    if (!user) {
      errors = [
        'Please login to add new locality.'
      ];
      return {
        success: false,
        errors
      };
    }

    const res = await LocalityService.add(user, tripId, { googlePlaceId, name, description, location });
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

export default AddLocalityMutation;
