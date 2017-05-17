import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql';
import UserType from '../user';
import UserService from '../../../database/helpers/user';

const UserQuery = {
  type: UserType,

  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  resolve: async (parentValue, { id }, { user }) => {
    const userTmp = await UserService.findById(id);
    return userTmp;
  }
};

export default UserQuery;
