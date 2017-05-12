import {
  GraphQLNonNull
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay';

import AttachmentType from '../types/attachment';
import AttachmentService from '../../database/helpers/attachment';
import { connectionFromArray } from '../../lib/connection';

const {
  connectionType: AttachmentConnection,
  edgeType: AttachmentEdge,
} = connectionDefinitions({
  name: 'Attachment',
  nodeType: AttachmentType,
});

const attachmentConnection = {
  type: new GraphQLNonNull(AttachmentConnection),

  args: {
    ...connectionArgs,
  },

  resolve: async ({ attachments }, { ...args }, { user }) => {
    if (!user) {
      return connectionFromArray([], args);
    }
    const tmps = await Promise.all(attachments.map(attachment => AttachmentService.findById(attachment)));
    return connectionFromArray(tmps, args);
  }
};

export {
  AttachmentEdge,
  attachmentConnection
};
