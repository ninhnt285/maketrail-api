import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql';
import FeedType from '../feed';
import FeedService from '../../../database/helpers/feed';

const FeedQuery = {
  type: FeedType,

  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  resolve: async (parentValue, { id }, { user }) => {
    const feed = await FeedService.getById(user, id);
    return feed;
  }
};

export default FeedQuery;
