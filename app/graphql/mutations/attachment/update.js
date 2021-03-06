import {
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
  GraphQLString,
  GraphQLID
} from 'graphql';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import AttachmentType from '../../types/auxiliaryTypes/attachment';
import AttachmentService from '../../../database/helpers/attachment';
import { AttachmentEdge } from '../../connections/attachment';
import { edgeFromNode } from '../../../lib/connection';

const UpdateAttachmentMutation = mutationWithClientMutationId({
  name: 'UpdateAttachment',

  inputFields: {
    attachmentId: {
      type: new GraphQLNonNull(GraphQLID)
    },
    placeId: {
      type: GraphQLID
    },
    placeName: {
      type: GraphQLString
    },
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
    attachment: {
      type: AttachmentType,
      resolve: ({ item }) => item
    },
    edge: {
      type: AttachmentEdge,
      resolve: ({ item }) => edgeFromNode(item)
    }
  },

  mutateAndGetPayload: async ({ attachmentId, ...args }, { user }) => {
    const newArgs = Object.assign({}, args);
    delete newArgs.clientMutationId;
    const res = await AttachmentService.update(user, attachmentId, newArgs);
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

export default UpdateAttachmentMutation;
