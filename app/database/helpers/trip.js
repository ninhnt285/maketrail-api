import TripModel from '../models/trip';
import { PREFIX } from '../../config';
import UserModel from '../models/user';
import FeedService from '../helpers/feed';
import UserService from '../helpers/user';
import NotificationService from '../helpers/notification';
import LocalityService from '../helpers/locality';
import AttachmentService from '../helpers/attachment';
import VenueService from '../helpers/venue';
import UserTripRelationModel from '../models/userTripRelation';
import TripLocalityRelationModel from '../models/tripLocalityRelation';
import { write } from '../../lib/render';
import { getFileInfo } from '../../lib/google/place/photo';

function genPhotoUrl() {
  return `/noImage/trip/${(new Date().getTime() % 10) + 1}%s.jpg`;
}

const TripService = {};

const Privacy = {
  PUBLIC: 0,
  PRIVATE: 1
};

TripService.canGetTrip = async function (user, tripId) {
  try {
    const tmp = await TripModel.findById(tripId);
    if (!tmp) return false;
    const privacy = tmp.privacy || Privacy.PUBLIC;
    if (privacy === Privacy.PUBLIC) return true;
    return await this.isMember(user.id, tripId);
  } catch (e) {
    console.log(e);
    return false;
  }
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

TripService.hasLocality = async function (tripId, localityId) {
  if (!tripId) return false;
  const tmp = await TripLocalityRelationModel.findOne({ tripId, localityId });
  return !!tmp;
};

TripService.add = async function (user, trip) {
  let item = null;
  try {
    if (await this.canAddTrip(user)) {
      item = await TripModel.create({ ...trip, privacy: Privacy.PUBLIC, isPublished: false, previewPhotoUrl: genPhotoUrl() });
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
        if (!userTmp.setting){
          userTmp = await UserModel.findByIdAndUpdate(userTmp.id, { setting: { allowTripInvite: 0 } });
        }
        if (userTmp.setting.allowTripInvite === 2 || (userTmp.setting.allowTripInvite === 1 && await UserService.isFollowed(userId, user.id) !== true)){
          return {
            errors: ['You does not have permission to invite member to this trip.']
          };
        }
        await NotificationService.notify(user.id, userTmp.id, tripId, NotificationService.Type.INVITE_TO_TRIP);
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

TripService.answerInvite = async function (user, notificationId, choice) {
  try {
    const notification = await NotificationService.remove(notificationId);
    if (choice === true) {
      await UserTripRelationModel.create({userId: user.id, tripId: notification.sourceId, roleId: 0});
      await NotificationService.interest(user.id, notification.sourceId, 2);
      await NotificationService.notify(user.id, notification.sourceId, null, NotificationService.Type.JOIN_TRIP);
    }
    return {
      success: true
    }
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
      const res = await Promise.all([TripModel.findByIdAndRemove(tripId), UserTripRelationModel.remove({ tripId }), TripLocalityRelationModel.remove({ tripId })]);
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
      if (args.exportedVideo && args.exportedVideo === true) {
        const pre = await TripModel.findById(tripId);
        if (pre.exportedVideo === true){
          return {
            errors: ['Trip is exporting video! Try late!']
          };
        }
        args.exporter = user.id;
      }
      const item = await TripModel.findByIdAndUpdate(tripId, { $set: args }, { new: true });
      if (args.exporter) {
        this.exportVideo(user, item);
      }
      if (args.isPublished && args.isPublished === true) {
        await FeedService.publishTrip(user, tripId);
      }
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

TripService.exportVideo = async function (user, trip) {
  try {
    const obj = {};
    obj.id = trip.id;
    obj.name = trip.name;
    obj.intro = await getFileInfo(trip.previewPhotoUrl.replace('%s', ''));
    obj.audio = 'music.mp3';
    obj.locations = [];
    const localities = await TripLocalityRelationModel.find({ tripId: trip.id });
    obj.time = new Date(localities[0].arrivalTime * 1000).toDateString();
    obj.direction = '';
    for (let i = 0; i < localities.length; i++) {
      const origin = await LocalityService.getById(localities[i].localityId);
      const attachments = await AttachmentService.getByPlaceId(trip.id, origin.id);
      if (attachments.length >= 5) {
        const tmp = {
          name: origin.name,
          temperature: '20°C',
          height: '70 Miles',
          lat: origin.location.lat,
          lng: origin.location.lng
        };
        if (attachments[0]) tmp.image1 = await getFileInfo(attachments[0].url.replace('%s', '_1000'));
        if (attachments[1]) tmp.image2 = await getFileInfo(attachments[1].url.replace('%s', '_1000'));
        if (attachments[2]) tmp.image3 = await getFileInfo(attachments[2].url.replace('%s', '_1000'));
        if (attachments[3]) tmp.image4 = await getFileInfo(attachments[3].url.replace('%s', '_1000'));
        if (attachments[4]) tmp.image5 = await getFileInfo(attachments[4].url.replace('%s', '_1000'));
        obj.locations.push(tmp);
      }
      const venues = await LocalityService.getLocalityVenues(localities[i].id);
      for (let j=0; j < venues.length; j++){
        const origin2 = await VenueService.getById(venues[j].venueId);
        const attachments2 = await AttachmentService.getByPlaceId(trip.id, origin2.id);
        if (attachments2.length >= 5) {
          const tmp2 = {
            name: origin2.name,
            temperature: '20°C',
            height: '70 Miles'
          };
          if (attachments2[0]) tmp2.image1 = await getFileInfo(attachments2[0].url.replace('%s', '_1000'));
          if (attachments2[1]) tmp2.image2 = await getFileInfo(attachments2[1].url.replace('%s', '_1000'));
          if (attachments2[2]) tmp2.image3 = await getFileInfo(attachments2[2].url.replace('%s', '_1000'));
          if (attachments2[3]) tmp2.image4 = await getFileInfo(attachments2[3].url.replace('%s', '_1000'));
          if (attachments2[4]) tmp2.image5 = await getFileInfo(attachments2[4].url.replace('%s', '_1000'));
          obj.locations.push(tmp2);
        }
      }
    }
    obj.direction = `${obj.locations[0].name} - ${obj.locations[obj.locations.length - 1].name}`;
    write(JSON.stringify(obj));
  } catch (e) {
    console.log(e);
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

TripService.getCategories = async function (tripId) {
  const items = new Set();
  try {
    const localities = (await TripLocalityRelationModel.find({ tripId }));
    for (let i = 0; i < localities.length; i++) {
      const venues = await LocalityService.getVenues(localities[i].id);
      for (let j = 0; j < venues.length; j++) {
        const categories = await VenueService.getCategories(venues[j]);
        for (let k = 0; k < categories.length; k++) {
          items.add(categories[k]);
        }
      }
    }
  } catch (e) {
    console.log(e);
    return [];
  }
  return [...items];
};

TripService.getAllPlaces = async function (tripId) {
  const items = new Set();
  try {
    const localities = (await TripLocalityRelationModel.find({ tripId }));
    for (let i = 0; i < localities.length; i++) {
      items.add(await LocalityService.getById(localities[i].localityId));
      const venueIds = await LocalityService.getVenues(localities[i].id);
      const venues = await Promise.all(venueIds.map(async venueId => await VenueService.getById(venueId)));
      for (let j = 0; j < venues.length; j++) {
        items.add(venues[j]);
      }
    }
  } catch (e) {
    console.log(e);
    return [];
  }
  return [...items];
};

TripService.getAllAttachments = async function (tripId) {
  try {
    return await AttachmentService.getByParentId(tripId);
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default TripService;
