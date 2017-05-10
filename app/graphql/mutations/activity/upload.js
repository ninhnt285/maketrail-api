import {
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
  GraphQLString
} from 'graphql';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import ItemType from '../../types/item';
import ItemService from '../../../database/helpers/item';
import { ItemEdge } from '../../connections/item';
import { edgeFromNode } from '../../../lib/connection';

const UploadMutation = mutationWithClientMutationId({
  name: 'Upload',

  inputFields: {
    caption: {
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
    item: {
      type: ItemType,
      resolve: ({ item }) => item
    },
    edge: {
      type: ItemEdge,
      resolve: ({ item }) => edgeFromNode(item)
    }
  },

  mutateAndGetPayload: async ({ caption }, { file, user }) => {
    let errors = [];

    if (!user) {
      errors = [
        'Please login to add new feed.'
      ];
      return {
        success: false,
        errors
      };
    }

    const res = await ItemService.upload(user, file, caption);
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

export default UploadMutation;
