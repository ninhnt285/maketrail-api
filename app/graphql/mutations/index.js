import loginMutation from './authentications/login';
import registerMutation from './authentications/register';
import addTripMutation from './trip/add';
import updateTripMutation from './trip/update';
import deleteTripMutation from './trip/delete';
import inviteMemberMutation from './trip/invite';
import addTripLocalityMutation from './tripLocality/add';
import removeTripLocalityMutation from './tripLocality/remove';
import addLocalityVenueMutation from './localityVenue/add';
import removeLocalityVenueMutation from './localityVenue/remove';

export default {
  login: loginMutation,
  register: registerMutation,

  addTrip: addTripMutation,
  updateTrip: updateTripMutation,
  deleteTrip: deleteTripMutation,
  inviteMember: inviteMemberMutation,

  addTripLocality: addTripLocalityMutation,
  removeTripLocality: removeTripLocalityMutation,

  addLocalityVenue: addLocalityVenueMutation,
  removeLocalityVenue: removeLocalityVenueMutation
};
