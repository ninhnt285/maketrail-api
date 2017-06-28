import loginMutation from './authentications/login';
import registerMutation from './authentications/register';
import changePasswordMutation from './authentications/changePassword';
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
import deleteLikeMutation from './activity/unlike';
import shareMutation from './activity/share';
import postMutation from './activity/post';
import commentMutation from './activity/comment';
import updateInfoMutation from './activity/updateInfo';
import uploadMutation from './attachment/upload';
import updateAttachmentMutation from './attachment/update';
import followMutation from './activity/follow';
import unfollowMutation from './activity/unfollow';

export default {
  login: loginMutation,
  register: registerMutation,
  changePassword: changePasswordMutation,


  addTrip: addTripMutation,
  updateTrip: updateTripMutation,
  deleteTrip: deleteTripMutation,
  inviteMember: inviteMemberMutation,

  addTripLocality: addTripLocalityMutation,
  updateTripLocality: updateTripLocalityMutation,
  removeTripLocality: removeTripLocalityMutation,

  addLocalityVenue: addLocalityVenueMutation,
  removeLocalityVenue: removeLocalityVenueMutation,

  addLike: likeMutation,
  deleteLike: deleteLikeMutation,
  addShare: shareMutation,
  addFeed: postMutation,
  addComment: commentMutation,
  follow: followMutation,
  unfollow: unfollowMutation,
  updateInfo: updateInfoMutation,

  addAttachment: uploadMutation,
  updateAttachment: updateAttachmentMutation
};
