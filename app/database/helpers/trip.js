import TripModel from '../models/trip';
import UserModel from '../models/user';
import NotificationService from '../helpers/notification';
import UserTripRelationModel from '../models/userTripRelation';
import TripLocalityRelationModel from '../models/tripLocalityRelation';

function genPhotoUrl() {
  return `/noImage/trip/${(new Date().getTime() % 10) + 1}%.jpg`;
}

const TripService = {};

const Privacy = {
  PUBLIC: 0,
  PRIVATE: 1
};

TripService.canGetTrip = async function (user, tripId) {
  const tmp = await TripModel.findById(tripId);
  const privacy = tmp.privacy || Privacy.PUBLIC;
  if (privacy === Privacy.PUBLIC) return true;
  return await this.isMember(user.id, tripId);
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
  if (!userId) return false;
  const tmp = await UserTripRelationModel.findOne({ userId, tripId });
  return !!tmp;
};

TripService.add = async function (user, trip) {
  let item = null;
  try {
    if (await this.canAddTrip(user)) {
      item = await TripModel.create({ ...trip, privacy: Privacy.PUBLIC, previewPhotoUrl: genPhotoUrl() });
      await UserTripRelationModel.create({ userId: user.id, tripId: item.id, roleId: 0 });
      await NotificationService.interest(user.id, item.id, 2);
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
        if (await this.isMember(userId, tripId)) {
          return {
            errors: ['User is already a member of this group.']
          };
        }
        let userTmp = null;
        if (userId) {
          userTmp = await UserModel.findById(userId);
        } else if (email) {
          userTmp = await UserModel.findOne({ email });
          if (!userTmp) {
            // TODO: send invite email
            return {
              errors: ['We have sent an invitation to this email.']
            };
          }
        }
        await UserTripRelationModel.create({ userId: userTmp.id, tripId: item.id, roleId: 0 });
        return {
          item: userTmp
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
