import { Document, model, models } from "mongoose";
import { Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
}

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const CategoryModel =
  models.CategoryModel || model<ICategory>("categories", CategorySchema);

export default CategoryModel;
