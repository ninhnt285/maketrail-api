import MessageModel from '../models/message';

const MessageService = {};

MessageService.add = async function (tripId, fromId, message) {
  try {
    await MessageModel.create({tripId, fromId, message});
  } catch (e) {
    console.log(e);
  }
};

MessageService.getMessages = async function (tripId, lastMessageId) {
  try {
    let messages = [];
    if (lastMessageId) {
      const lastMessage = await MessageModel.findById(lastMessageId);
      messages = await MessageModel.find({ tripId, createdAt: {$lt: lastMessage.createdAt}}).sort('-createdAt').limit(100).exec();
    } else {
      messages = await MessageModel.find({ tripId }).sort('-createdAt').limit(100).exec();
    }
    return messages;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default MessageService;
