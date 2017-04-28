import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay';

import CategoryType from '../types/category';
import CategoryModel from '../../database/models/category';
import { connectionFromArray } from '../../lib/connection';

const {
  connectionType: CategoryConnection,
  edgeType: CategoryEdge,
} = connectionDefinitions({
  name: 'Category',
  nodeType: CategoryType,
});

const categoryConnection = {
  type: new GraphQLNonNull(CategoryConnection),

  args: {
    ...connectionArgs,
    parentId: {
      type: GraphQLString
    }
  },

  resolve: async ({ id }, { ...args, parentId }, { user }) => {
    try {
      const pid = parentId || 'rootCategory';
      const categories = await CategoryModel.find({ parentId: pid });
      if (categories) return connectionFromArray(categories, args);
    } catch (e) {
      console.log(e);
      return connectionFromArray([], args);
    }
  }
};

export {
  CategoryEdge,
  categoryConnection
};
