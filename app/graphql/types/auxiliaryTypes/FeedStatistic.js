import {
  GraphQLObjectType,
  GraphQLInt
} from 'graphql';

const FeedStatisticType = new GraphQLObjectType({
  name: 'FeedStatistic',
  fields: {
    likeCount: {
      type: GraphQLInt
    },
    shareCount: {
      type: GraphQLInt
    },
    commentCount: {
      type: GraphQLInt
    }
  }
});

export default FeedStatisticType;
