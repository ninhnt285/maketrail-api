import loginMutation from './authentications/login';
import registerMutation from './authentications/register';
import changePasswordMutation from './authentications/changePassword';
import resetPasswordMutation from './authentications/resetPassword';
import forgotPasswordMutation from './authentications/forgotPassword';
import addTripMutation from './trip/add';
import updateTripMutation from './trip/update';
import deleteTripMutation from './trip/delete';
import inviteMemberMutation from './trip/invite';
import answerInviteMutation from './trip/answer';
import addTripLocalityMutation from './tripLocality/add'
import updateTripLocalityMutation from './tripLocality/update';
import removeTripLocalityMutation from './tripLocality/remove';
import addLocalityVenueMutation from './localityVenue/add';
import removeLocalityVenueMutation from './localityVenue/remove';
import likeMutation from './activity/like';
import deleteLikeMutation from './activity/unlike';
import shareMutation from './activity/share';
import postMutation from './activity/post';
import updateFeedMutation from './activity/updatePost';
import deleteFeedMutation from './activity/deleteFeed';
import updateInfoMutation from './activity/updateInfo';

import uploadMutation from './attachment/upload';
import updateAttachmentMutation from './attachment/update';
import deleteAttachmentMutation from './attachment/delete';

import followMutation from './friendship/follow';
import unfollowMutation from './friendship/unfollow';
import addFriendMutation from './friendship/addFriend';
import unfriendMutation from './friendship/unfriend';
import answerAddFriendMutation from './friendship/answerAddFriend';

import addCommentMutation from './comment/add';
import updateCommentMutation from './comment/update';
import deleteCommentMutation from './comment/delete';

export default {
  login: loginMutation,
  register: registerMutation,
  changePassword: changePasswordMutation,
  forgotPassword: forgotPasswordMutation,
  resetPassword: resetPasswordMutation,

  addTrip: addTripMutation,
  updateTrip: updateTripMutation,
  deleteTrip: deleteTripMutation,
  inviteMember: inviteMemberMutation,
  answerInvite: answerInviteMutation,

  addTripLocality: addTripLocalityMutation,
  updateTripLocality: updateTripLocalityMutation,
  removeTripLocality: removeTripLocalityMutation,

  addLocalityVenue: addLocalityVenueMutation,
  removeLocalityVenue: removeLocalityVenueMutation,

  addComment: addCommentMutation,
  updateComment: updateCommentMutation,
  deleteComment: deleteCommentMutation,

  addLike: likeMutation,
  deleteLike: deleteLikeMutation,
  addShare: shareMutation,
  addFeed: postMutation,
  updateInfo: updateInfoMutation,
  updateFeed: updateFeedMutation,
  deleteFeed: deleteFeedMutation,

  addFriend: addFriendMutation,
  unfriend: unfriendMutation,
  answerAddFriend: answerAddFriendMutation,
  follow: followMutation,
  unfollow: unfollowMutation,

  addAttachment: uploadMutation,
  updateAttachment: updateAttachmentMutation,
  deleteAttachment: deleteAttachmentMutation
};
