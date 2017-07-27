import MessageModel from '../models/message';
import UserService from '../helpers/user';

const MessageService = {};

MessageService.add = async function (tripId, fromId, message) {
  try {
    let item = await MessageModel.create({ tripId, fromId, message });
    item = item.toObject();
    const user = await UserService.findById(fromId);
    item.username = user.fullName || user.username;
    item.profilePicUrl = user.profilePicUrl;
    return item;
  } catch (e) {
    console.log(e);
    return null;
  }
};

MessageService.getMessages = async function (tripId, lastMessageId) {
  try {
    let messages = [];
    if (lastMessageId) {
      const lastMessage = await MessageModel.findById(lastMessageId);
      messages = await MessageModel.find({ tripId, createdAt: { $lt: lastMessage.createdAt } }).sort('-createdAt').limit(100).exec();
    } else {
      messages = await MessageModel.find({ tripId }).sort('-createdAt').limit(100).exec();
    }
    for (let i = 0; i < messages.length; i++) {
      const user = await UserService.findById(messages[i].fromId);
      messages[i] = messages[i].toObject();
      messages[i].username = user.fullName || user.username;
      messages[i].profilePicUrl = user.profilePicUrl;
    }
    return messages;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default MessageService;
