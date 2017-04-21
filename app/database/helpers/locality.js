import request from 'request-promise';
import LocalityModel from '../models/locality';
import TripLocalityRelationModel from '../models/tripLocalityRelation';
import { GOOGLE_API_KEY } from '../../config';
import { getPhotoFromReference } from '../../lib/google/place/photo';

const LocalityService = {};

LocalityService.canAddLocality = async function (user, tripId) {
  return (user && tripId);
};

LocalityService.canRemoveLocality = async function (user, tripId) {
  return (user && tripId);
};

LocalityService.findOneOrCreate = async function (condition, doc) {
  let user = await LocalityModel.findOne(condition);
  if (!user) {
    if (doc.photo_reference) getPhotoFromReference(doc.photo_reference, doc.previewPhotoUrl);
    const res = await Promise.all([LocalityModel.create(doc), getPhotoFromReference(doc.photo_reference, doc.previewPhotoUrl)]);
    user = res[0];
  }
  return user;
};

LocalityService.add = async function (user, tripId, localityId) {
  const item = null;
  try {
    if (this.canAddLocality(user, tripId)) {
      await TripLocalityRelationModel.create({ tripId, localityId });
      return {
        item
      };
    }
    return {
      errors: ['You does not have permission to add new locality.']
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal error']
    };
  }
};

LocalityService.remove = async function (user, tripId, localityId) {
  try {
    if (this.canRemoveLocality(user, tripId)) {
      const res = await Promise.all([TripLocalityRelationModel.remove({ tripId, localityId }), LocalityModel.findById(localityId)]);
      return {
        item: res[1]
      };
    }
    return {
      errors: ['You does not have permission to remove locality.']
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal error']
    };
  }
};

LocalityService.getById = async function (id) {
  let item = null;
  try {
    item = await LocalityModel.findById(id);
  } catch (e) {
    console.log(e);
  }
  return item;
};

LocalityService.seachLocality = async function (query) {
  try {
    const options = {
      method: 'GET',
      uri: 'https://maps.googleapis.com/maps/api/place/textsearch/json',
      qs: {
        key: GOOGLE_API_KEY,
        query,
        types: 'locality|political'
      },
      encoding: 'utf8'
    };
    const res = JSON.parse(await request(options)
      .then(ggRes => ggRes));
    const localities = res.results;
    return await Promise.all(localities.map(async (locality) => {
      const tmp = {
        googlePlaceId: locality.place_id,
        types: locality.types,
        name: locality.name,
        description: locality.formatted_address,
        location: locality.geometry.location,
        photo_reference: locality.photos[0].photo_reference,
        previewPhotoUrl: `/locality/${locality.place_id}.jpg`
      };
      return await this.findOneOrCreate({ googlePlaceId: locality.place_id }, tmp);
    }));
  } catch (e) {
    console.log(e);
    return [];
  }
};


export default LocalityService;
