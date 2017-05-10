import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql';
import ItemType from '../item';
import ItemService from '../../../database/helpers/item';

const ItemQuery = {
  type: ItemType,

  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  resolve: async (parentValue, { id }, { user }) => {
    const item = await ItemService.getById(user, id);
    return item;
  }
};

export default ItemQuery;
