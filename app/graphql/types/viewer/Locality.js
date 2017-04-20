import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql';
import LocalityType from '../locality';
import LocalityService from '../../../database/helpers/locality';

const LocalityQuery = {
  type: LocalityType,

  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  resolve: async (parentValue, { id }, { user }) => {
    const locality = await LocalityService.getById(id);
    return locality;
  }
};

export default LocalityQuery;
