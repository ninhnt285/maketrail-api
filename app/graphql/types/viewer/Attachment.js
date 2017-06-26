import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql';
import AttachmentType from '../auxiliaryTypes/attachment';
import AttachmentService from '../../../database/helpers/attachment';

const AttachmentQuery = {
  type: AttachmentType,

  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  resolve: async (parentValue, { id }, { user }) => {
    const attachment = await AttachmentService.getById(user, id);
    return attachment;
  }
};

export default AttachmentQuery;
