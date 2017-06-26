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

import AttachmentType from '../../types/attachment';
import AttachmentService from '../../../database/helpers/attachment';
import { AttachmentEdge } from '../../connections/attachment';
import { edgeFromNode } from '../../../lib/connection';

const UploadMutation = mutationWithClientMutationId({
  name: 'AddAttachment',

  inputFields: {
    caption: {
      type: GraphQLString
    },
    parentId: {
      type: GraphQLID
    },
    placeId: {
      type: GraphQLID
    },
    placeName: {
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

  mutateAndGetPayload: async ({ caption, parentId, placeId, placeName }, { file, user }) => {
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

    const res = await AttachmentService.upload(user, file, caption, parentId, placeId, placeName);
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
