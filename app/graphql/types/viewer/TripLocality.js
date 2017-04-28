import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql';
import TripLocalityType from '../tripLocality';
import LocalityService from '../../../database/helpers/locality';

const TripLocalityQuery = {
  type: TripLocalityType,

  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  resolve: async (parentValue, { id }, { user }) => {
    const locality = await LocalityService.findTripLocalityById(id);
    return locality;
  }
};

export default TripLocalityQuery;
