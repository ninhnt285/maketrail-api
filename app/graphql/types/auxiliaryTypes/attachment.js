import {
  GraphQLUnionType
} from 'graphql';
import { Type, getType } from '../../../lib/idUtils';

const PhotoType = require('./../photo').default;
const VideoType = require('./../video').default;

const resolveType = (data) => {
  const type = getType(data.id);

  if (type === Type.PHOTO) {
    return PhotoType;
  }

  if (type === Type.VIDEO) {
    return VideoType;
  }
};

const AttachmentType = new GraphQLUnionType({
  name: 'Attachment',
  types: [PhotoType, VideoType],
  resolveType
});

export default AttachmentType;
