import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay';

import UserType from '../types/user';
import UserModel from '../../database/models/user';
import FriendshipModel from '../../database/models/friendship';
import UserService from '../../database/helpers/user';
import FriendshipService from '../../database/helpers/friendship';
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

const suggestUserConnection = {
  type: new GraphQLNonNull(UserConnection),

  args: {
    ...connectionArgs,
  },

  resolve: async ({ id }, { ...args }, { user }) => {
    if (!user) {
      return connectionFromArray([], args);
    }

    try {
      const followeds = await UserService.getFolloweds(user.id);
      const friends = await UserService.getFacebookFriends(user.id);
      const suggesteds = [];
      for (let j = 0; j < friends.length; j++) {
        const friend = friends[j];
        const tmp = await UserModel.findOne({ 'facebook.id': friend.id });
        if (tmp && !followeds.includes(tmp.id)) {
          suggesteds.push(tmp);
          if (suggesteds.length === 15) break;
        }
      }
      if (suggesteds.length < 15) {
        const hotTravellers = await FriendshipService.getHotUsers();
        for (let i = 0; i < hotTravellers.length; i++) {
          if (user.id !== hotTravellers[i] && !(followeds.includes(hotTravellers[i]))) {
            suggesteds.push(await UserModel.findById(hotTravellers[i]));
            if (suggesteds.length === 15) break;
          }
        }
      }
      return connectionFromArray(suggesteds, args);
    } catch (e) {
      console.log(e);
      return connectionFromArray([], args);
    }
    return connectionFromArray([], args);
  }
};

const friendConnection = {
  type: new GraphQLNonNull(UserConnection),

  args: {
    ...connectionArgs,
    userId: {
      type: GraphQLID
    }
  },

  resolve: async ({ id }, { ...args, userId }, { user }) => {
    if (!user) {
      return connectionFromArray([], args);
    }

    try {
      try {
        if (getType(id) === Type.USER) {
          userId = id;
        }
      } catch (e) {
        console.log(e);
      }
      if (!userId) {
        userId = user.id;
      }
      const userEdges = await connectionFromModel(FriendshipModel,
        {
          user,
          ...args,
          filter: { user1: userId, isFriend: true }
        },
        async (r) => {
          const userTmp = await UserModel.findById(r.user2).exec();
          return userTmp;
        }
      );
      return userEdges;
    } catch (e) {
      console.log(e);
      return connectionFromArray([], args);
    }
  }
};

export {
  UserEdge,
  userConnection,
  memberConnection,
  suggestUserConnection,
  friendConnection
};
