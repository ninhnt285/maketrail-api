import {
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql';

import queries from './queries';
import mutations from './mutations';
import PhotoType from './types/photo';
import VideoType from './types/video';
import AttachmentType from './types/attachment';

export default new GraphQLSchema({
  types: [AttachmentType, PhotoType, VideoType],
  query: new GraphQLObjectType({
    name: 'Query',
    fields: queries
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: mutations
  })
});
