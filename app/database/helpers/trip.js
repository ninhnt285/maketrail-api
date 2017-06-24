const net = require('net');
import TripModel from '../models/trip';
import { PREFIX } from '../../config';
import UserModel from '../models/user';
import FeedService from '../helpers/feed';
import NotificationService from '../helpers/notification';
import LocalityService from '../helpers/locality';
import AttachmentService from '../helpers/attachment';
import VenueService from '../helpers/venue';
import UserTripRelationModel from '../models/userTripRelation';
import TripLocalityRelationModel from '../models/tripLocalityRelation';

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
        await UserTripRelationModel.create({ userId: userTmp.id, tripId: item.id, roleId: 0 });
        await NotificationService.interest(userTmp.id, item.id, 2);
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
      const item = await TripModel.findByIdAndUpdate(tripId, { $set: args }, { new: true });
      if (args.isPublished && args.isPublished === true) {
        await FeedService.publishTrip(user, tripId);
      }
      if (args.exportedVideo && args.exportedVideo === true) {
        this.exportVideo(user, item);
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
    obj.intro = PREFIX + trip.previewPhotoUrl.replace('%s', '');
    obj.audio = 'music.mp3';
    obj.locations = [];
    const localities = await TripLocalityRelationModel.find({ tripId: trip.id });
    obj.time = new Date(localities[0].arrivalTime * 1000).toDateString();
    obj.direction = '';
    for (let i = 0; i < localities.length; i++) {
      const origin = await LocalityService.getById(localities[i].localityId);
      const attachments = await AttachmentService.getByParentId(localities[i].id);
      const tmp = {
        name: origin.name,
        temperature: '20°C',
        height: '70 Miles'
      };
      if (attachments[0]) tmp.image1 = PREFIX + attachments[0].url.replace('%s', '');
      if (attachments[1]) tmp.image2 = PREFIX + attachments[1].url.replace('%s', '');
      if (attachments[2]) tmp.image3 = PREFIX + attachments[2].url.replace('%s', '');
      if (attachments[3]) tmp.image4 = PREFIX + attachments[3].url.replace('%s', '');
      if (attachments[4]) tmp.image5 = PREFIX + attachments[4].url.replace('%s', '');
      obj.locations.push(tmp);
    }
    obj.direction = `${obj.locations[0].name} - ${obj.locations[obj.locations.length - 1].name}`;
    console.log(obj);
    // const client = new net.Socket();
    // client.connect(6969, '45.32.216.6', () => {
    //   console.log('Connected');
    //   client.write(JSON.stringify(obj));
    // });
    // client.on('data', (data) => {
    //   client.destroy(); // kill client after server's response
    // });
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

export default TripService;
