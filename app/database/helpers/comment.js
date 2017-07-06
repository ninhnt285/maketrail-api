import CommentModel from '../models/comment';
import NotificationService from '../helpers/notification';
import { getType, Type } from '../../lib/idUtils';

const CommentService = {};

CommentService.canGetComment = async function (user, userId) {
  return (user && userId);
};

CommentService.getById = async function (user, id) {
  try {
    const bcanGetComment = await this.canGetComment(user, id);
    if (bcanGetComment) {
      const result = await CommentModel.findById(id).exec();
      return result;
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};

CommentService.canDeleteComment = async function (user, commentId) {
  return (user && commentId);
};

CommentService.canUpdateComment = async function (user, commentId) {
  return (user && commentId);
};

CommentService.canAddComment = async function (user) {
  return (user);
};

CommentService.add = async function (user, parentId, text) {
  try {
    let rootId = parentId;
    if (getType(parentId) === Type.COMMENT) {
      const parentComment = await CommentModel.findById(parentId);
      rootId = parentComment.rootId;
      await NotificationService.interest(user.id, parentId, 1);
    }
    const item = await CommentModel.create({
      fromId: user.id,
      parentId,
      rootId,
      text
    });
    await NotificationService.interest(user.id, item.id, 2);
    await NotificationService.notify(user.id, parentId, item.id, NotificationService.Type.COMMENT);
    return {
      item
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal error']
    };
  }
};

CommentService.delete = async function (user, commentId) {
  try {
    if (await this.canDeleteComment(user, commentId)) {
      const res = await CommentModel.findByIdAndRemove(commentId);
      return {
        item: res
      };
    }
    return {
      errors: ['You does not have permission to delete comment.']
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal error']
    };
  }
};

CommentService.update = async function (user, commentId, args) {
  try {
    if (await this.canUpdateComment(user, commentId)) {
      const item = await CommentModel.findByIdAndUpdate(commentId, { $set: args }, { new: true });
      return {
        item
      };
    }
    return {
      errors: ['You does not have permission to update comment.']
    };
  } catch (e) {
    console.log(e);
    return {
      errors: ['Internal error']
    };
  }
};

export default CommentService;
