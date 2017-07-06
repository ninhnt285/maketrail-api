import {
  GraphQLNonNull
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay';

import AttachmentType from '../types/auxiliaryTypes/attachment';
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
    const tmps = [];
    for (let i = 0; i < attachments.length; i++){
      const tmp = await AttachmentService.findById(attachments[i]);
      if (tmp) tmps.push(tmp);
    }
    return connectionFromArray(tmps, args);
  }
};

export {
  AttachmentEdge,
  attachmentConnection
};
