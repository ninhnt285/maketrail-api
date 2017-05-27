const TYPES = [
  'UserType',
  'TripType',
  'LocalityType',
  'TripLocalityType',
  'CategoryType',
  'VenueType',
  'LocalityVenueType',
  'FeedType',
  'PhotoType',
  'VideoType',
  'LikeType',
  'CommentType',
  'NotificationType'
];

export const Type = {
  USER: 'UserType',
  TRIP: 'TripType',
  LOCALITY: 'LocalityType',
  TRIP_LOCALITY: 'TripLocalityType',
  CATEGORY: 'CategoryType',
  VENUE: 'VenueType',
  LOCALITY_VENUE: 'LocalityVenueType',
  FEED: 'FeedType',
  PHOTO: 'PhotoType',
  VIDEO: 'VideoType',
  LIKE: 'LikeType',
  COMMENT: 'CommentType',
  NOTIFICATION: 'NotificationType'
};

function random() {
  return Math.floor(Math.random() * 1e9).toString(16);
}

// mongodb.ObjectID need a 24 hex character string
export function genId(type) {
  let typeIndex = TYPES.indexOf(type);

  if (typeIndex === -1) {
    throw new Error(`Invalid Type! Cannot find ${type}`);
  }

  typeIndex = typeIndex.toString(16);
  if (typeIndex.length < 2) {
    typeIndex = `0${typeIndex}`;
  }

  let randFactor = random().toString();
  while (randFactor.length < 22) {
    randFactor = `${randFactor}0`;
  }

  return randFactor + typeIndex;
}

export function getType(id) {
  if (!id) return null;
  let newId = id;
  if (typeof id !== 'string') {
    if (id.toString) {
      newId = id.toString();
    } else {
      console.log('Id must be a string!');
      return null;
    }
  }


  if (newId.length < 2) {
    console.log('Invalid Id, the id\'s length is too short!');
    return null;
  }

  if (id === 'viewer-fixed') {
    return 'ViewerType';
  }

  const typeIndex = parseInt(newId.substr(-2), 16);
  if (typeIndex < 0 || typeIndex >= TYPES.length) {
    console.log(`Invalid Id, cannot find valid typeIndex: ${newId}`);
    return null;
  }

  return TYPES[typeIndex];
}
