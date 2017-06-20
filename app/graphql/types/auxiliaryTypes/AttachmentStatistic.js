import {
  GraphQLObjectType,
  GraphQLInt
} from 'graphql';

const AttachmentStatisticType = new GraphQLObjectType({
  name: 'AttachmentStatistic',
  fields: {
    likeCount: {
      type: GraphQLInt
    },
    commentCount: {
      type: GraphQLInt
    }
  }
});

export default AttachmentStatisticType;
