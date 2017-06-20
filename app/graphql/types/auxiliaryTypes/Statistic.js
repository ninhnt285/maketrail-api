import {
  GraphQLObjectType,
  GraphQLInt
} from 'graphql';

const StatisticType = new GraphQLObjectType({
  name: 'Statistic',
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

export default StatisticType;
