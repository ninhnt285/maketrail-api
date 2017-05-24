import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay';

import UserType from '../types/user';
import UserModel from '../../database/models/user';
import UserTripRelation from '../../database/models/userTripRelation';
import { connectionFromModel } from '../../database/helpers/connection';
import { connectionFromArray } from '../../lib/connection';
import { getType, Type } from '../../lib/idUtils';

const {
  connectionType: UserConnection,
  edgeType: UserEdge,
} = connectionDefinitions({
  name: 'User',
  nodeType: UserType,
});

const userConnection = {
  type: new GraphQLNonNull(UserConnection),

  args: {
    ...connectionArgs,
    query: {
      type: GraphQLString
    }
  },

  resolve: async ({ id }, { ...args, query }, { user }) => {
    if (!user) {
      return connectionFromArray([], args);
    }

    try {
      let userEdges = [];
      if (query) {
        const q = new RegExp(`${query}`, 'i');
        userEdges = await connectionFromModel(UserModel,
          {
            user,
            ...args,
            filter: { $or: [{ username: q }, { email: q }, { fullName: q }] }
          },
          null
        );
      } else {
        userEdges = await connectionFromModel(UserModel,
          {
            user,
            ...args,
            filter: { }
          },
          null
        );
      }
      return userEdges;
    } catch (e) {
      console.log(e);
      return connectionFromArray([], args);
    }
  }
};

const memberConnection = {
  type: new GraphQLNonNull(UserConnection),

  args: {
    ...connectionArgs,
  },

  resolve: async ({ id }, { ...args }, { user }) => {
    if (!user) {
      return connectionFromArray([], args);
    }

    try {
      if (getType(id) === Type.TRIP) {
        const userEdges = await connectionFromModel(UserTripRelation,
          {
            user,
            ...args,
            filter: { tripId: id }
          },
          async (r) => {
            const tmp = await UserModel.findById(r.userId).exec();
            return tmp;
          }
        );

        return userEdges;
      }
    } catch (e) {
      console.log(e);
      return connectionFromArray([], args);
    }
    return connectionFromArray([], args);
  }
};

export {
  UserEdge,
  userConnection,
  memberConnection
};
