import mongoose, { Schema } from 'mongoose';

const { Types } = mongoose.Schema;

const categorySchema = new Schema(
  {
    foursquareId: String,
    name: String,
    pluralName: String,
    shortName: String,
    parentId: String
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

const CategoryModel = mongoose.model('Category', categorySchema);

export default CategoryModel;
