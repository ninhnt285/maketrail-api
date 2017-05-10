import {
  GraphQLNonNull
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay';

import ItemType from '../types/item';
import ItemModel from '../../database/models/item';
import { connectionFromArray } from '../../lib/connection';

const {
  connectionType: ItemConnection,
  edgeType: ItemEdge,
} = connectionDefinitions({
  name: 'Item',
  nodeType: ItemType,
});

const itemConnection = {
  type: new GraphQLNonNull(ItemConnection),

  args: {
    ...connectionArgs,
  },

  resolve: async ({ items }, { ...args }, { user }) => {
    if (!user) {
      return connectionFromArray([], args);
    }
    const tmps = await Promise.all(items.map(item => ItemModel.findById(item)));
    return connectionFromArray(tmps, args);
  }
};

export {
  ItemEdge,
  itemConnection
};
