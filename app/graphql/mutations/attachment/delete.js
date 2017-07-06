import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList
} from 'graphql';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import AttachmentService from '../../../database/helpers/attachment';
import AttachmentType from '../../types/auxiliaryTypes/attachment';
import { AttachmentEdge } from '../../connections/attachment';
import { edgeFromNode } from '../../../lib/connection';
import viewer from '../../queries/viewer';

const DeleteAttachmentMutation = mutationWithClientMutationId({
  name: 'DeleteAttachment',

  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
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
    attachment: {
      type: AttachmentType,
      resolve: ({ item }) => item
    },
    edge: {
      type: AttachmentEdge,
      resolve: ({ item }) => edgeFromNode(item)
    },
    deletedId: {
      type: GraphQLID,
      resolve: ({ deletedId }) => deletedId
    },
    viewer
  },

  mutateAndGetPayload: async ({ id }, { user }) => {
    const res = await AttachmentService.delete(user, id);
    if (res.errors) {
      return {
        success: false,
        errors: res.errors
      };
    }
    return {
      success: true,
      item: res.item,
      deletedId: id
    };
  }
});

export default DeleteAttachmentMutation;
