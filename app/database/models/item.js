import mongoose, { Schema } from 'mongoose';
import preSave from '../preSave';

const { Types } = mongoose.Schema;

const itemSchema = new Schema(
  {
    _id: Types.ObjectId,
    userId: Types.ObjectId,
    caption: String,
    url: String,
    parentId: Types.ObjectId
  }, {
    timestamps: true,
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);

itemSchema.pre('save', preSave('ItemType'));

const ItemModel = mongoose.model('Item', itemSchema);

export default ItemModel;
