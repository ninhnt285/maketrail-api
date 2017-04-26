import request from 'request-promise';
import LocalityModel from '../models/locality';
import TripLocalityRelationModel from '../models/tripLocalityRelation';
import { GOOGLE_API_KEY } from '../../config';
import { getPhotoFromReference, resize } from '../../lib/google/place/photo';

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
    const photoUri = doc.previewPhotoUrl.replace('%s', '');
    if (!await getPhotoFromReference(doc.photo_reference, photoUri)) {
      // eslint-disable-next-line no-param-reassign
      delete doc.previewPhotoUrl;
    }
    user = await LocalityModel.create(doc);
    resize(photoUri);
  }
  return user;
};

LocalityService.add = async function (user, tripId, localityId) {
  try {
    if (await this.canAddLocality(user, tripId)) {
      const res = await Promise.all([LocalityModel.findById(localityId), TripLocalityRelationModel.create({ tripId, localityId })]);
      return {
        item: {
          id: res[1].id,
          originLocality: res[0]
        }
      };
    }
    return {
      errors: ['You does not have permission to add new tripLocality.']
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal error']
    };
  }
};

LocalityService.remove = async function (user, tripId, tripLocalityId) {
  try {
    if (await this.canRemoveLocality(user, tripId)) {
      const tmp = await TripLocalityRelationModel.findByIdAndRemove(tripLocalityId);
      const locality = await LocalityModel.findById(tmp.localityId);
      return {
        item: {
          id: tripLocalityId,
          originLocality: locality
        }
      };
    }
    return {
      errors: ['You does not have permission to remove this tripLocality.']
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

LocalityService.findTripLocalityById = async function (id) {
  try {
    const tmp = await TripLocalityRelationModel.findById(id);
    const originLocality = await LocalityModel.findById(tmp.localityId);
    return {
      id: tmp.id,
      originLocality
    };
  } catch (e) {
    console.log(e);
    return null;
  }
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
    const date = new Date();
    return await Promise.all(localities.map(async (locality) => {
      const tmp = {
        googlePlaceId: locality.place_id,
        types: locality.types,
        name: locality.name,
        description: locality.formatted_address,
        location: locality.geometry.location,
        previewPhotoUrl: `/locality/${date.getUTCFullYear()}/${(date.getUTCMonth() + 1)}/${locality.place_id}%s.jpg`
      };
      if (locality.photos && locality.photos.length > 0) tmp.photo_reference = locality.photos[0].photo_reference;
      return await this.findOneOrCreate({ googlePlaceId: locality.place_id }, tmp);
    }));
  } catch (e) {
    console.log(e);
    return [];
  }
};


export default LocalityService;
