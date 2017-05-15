import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql';
import VenueType from '../venue';
import VenueService from '../../../database/helpers/venue';

const VenueQuery = {
  type: VenueType,

  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  resolve: async (parentValue, { id }, { user }) => {
    const venue = await VenueService.getById(id);
    return venue;
  }
};

export default VenueQuery;
