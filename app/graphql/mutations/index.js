import loginMutation from './authentications/login';
import registerMutation from './authentications/register';
import addTripMutation from './trip/add';
import updateTripMutation from './trip/update';
import deleteTripMutation from './trip/delete';
import inviteMemberMutation from './trip/invite';
import addTripLocalityMutation from './tripLocality/add'
import updateTripLocalityMutation from './tripLocality/update';
import removeTripLocalityMutation from './tripLocality/remove';
import addLocalityVenueMutation from './localityVenue/add';
import removeLocalityVenueMutation from './localityVenue/remove';
import likeMutation from './activity/like';
import shareMutation from './activity/share';
import postMutation from './activity/post';
import commentMutation from './activity/comment';

export default {
  login: loginMutation,
  register: registerMutation,

  addTrip: addTripMutation,
  updateTrip: updateTripMutation,
  deleteTrip: deleteTripMutation,
  inviteMember: inviteMemberMutation,

  addTripLocality: addTripLocalityMutation,
  updateTripLocality: updateTripLocalityMutation,
  removeTripLocality: removeTripLocalityMutation,

  addLocalityVenue: addLocalityVenueMutation,
  removeLocalityVenue: removeLocalityVenueMutation,

  like: likeMutation,
  share: shareMutation,
  post: postMutation,
  comment: commentMutation
};
