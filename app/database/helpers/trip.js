import { base64 } from '../../lib/connection/utils';
import TripModel from '../models/trip'
import UserModel from '../models/user';
import UserTripRelationModel from '../models/userTripRelation';
import TripLocalityRelationModel from '../models/tripLocalityRelation';

const TripService = {};

TripService.canGetTrip = async function (user, tripId) {
  return (user && tripId);
};

TripService.canDeleteTrip = async function (user, tripId) {
  return (user && tripId);
};

TripService.canUpdateTrip = async function (user, tripId) {
  return (user && tripId);
};

TripService.canAddTrip = async function (user) {
  return (user);
};

TripService.canInviteMember = async function (user) {
  return (user);
};

TripService.isMember = async function (userId, tripId) {
  const tmp = await UserTripRelationModel.findOne({ userId, tripId });
  if (tmp) return true;
  return false;
};

TripService.add = async function (user, trip) {
  let item = null;
  try {
    if (await this.canAddTrip(user)) {
      item = await TripModel.create(trip);
      await UserTripRelationModel.create({ userId: user.id, tripId: item.id, roleId: 0 });
      return {
        item
      };
    }
    return {
      errors: ['You does not have permission to add new trip.']
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal error']
    };
  }
};

TripService.inviteMember = async function (user, tripId, userId, email) {
  let item = null;
  try {
    if (await this.canInviteMember(user)) {
      item = await TripModel.findById(tripId);
      if (item) {
        let uid = userId;
        if (!userId && email) {
          const userTmp = await UserModel.findOne({ email });
          if (userTmp) {
            uid = userTmp.id;
          } else {
            return {
              tripEncrypt: base64(tripId),
              item
            };
          }
        }
        if (await this.isMember(uid, tripId)) {
          return {
            errors: ['User is already a member of this group.']
          };
        }
        await UserTripRelationModel.create({ userId: uid, tripId: item.id, roleId: 0 });
        return {
          item
        };
      }
    }
    return {
      errors: ['You does not have permission to invite member to this trip.']
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal error']
    };
  }
};

TripService.delete = async function (user, tripId) {
  try {
    if (await this.canDeleteTrip(user, tripId)) {
      const res = await Promise.all([TripModel.findByIdAndRemove(tripId), UserTripRelationModel.remove(tripId), TripLocalityRelationModel.remove(tripId)]);
      return {
        item: res[0]
      };
    }
    return {
      errors: ['You does not have permission to delete trip.']
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal error']
    };
  }
};

TripService.update = async function (user, tripId, args) {
  try {
    if (await this.canUpdateTrip(user, tripId)) {
      const item = await TripModel.findByIdAndUpdate(tripId, { $set: args }, { new: true });
      return {
        item
      };
    }
    return {
      errors: ['You does not have permission to update trip.']
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal error']
    };
  }
};

TripService.getById = async function (user, id) {
  let item = null;
  try {
    if (await this.canGetTrip(user, id)) {
      item = await TripModel.findById(id);
    }
  } catch (e) {
    console.log(e);
  }
  return item;
};

export default TripService;
